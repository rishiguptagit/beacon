import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import pandas as pd
from typing import Tuple, Dict, List
import logging
from torch.cuda.amp import autocast, GradScaler
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmergencyDataset(Dataset):
    """Custom Dataset for emergency prediction"""
    def __init__(self, features: np.ndarray, labels: np.ndarray, sequence_length: int = 30):
        self.features = torch.FloatTensor(features)
        self.labels = torch.FloatTensor(labels)
        self.sequence_length = sequence_length

    def __len__(self) -> int:
        return len(self.features) - self.sequence_length

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        return (
            self.features[idx:idx + self.sequence_length],
            self.labels[idx + self.sequence_length]
        )

class EmergencyPredictor(nn.Module):
    """PyTorch-based Emergency Prediction Model with performance optimizations"""
    def __init__(
        self,
        input_dim: int,
        hidden_dim: int,
        num_layers: int,
        output_dim: int,
        dropout: float = 0.2
    ):
        super().__init__()
        
        # Architecture
        self.lstm = nn.LSTM(
            input_dim,
            hidden_dim,
            num_layers,
            batch_first=True,
            dropout=dropout,
            bidirectional=True  # Bidirectional LSTM for better context understanding
        )
        
        # Attention mechanism
        self.attention = nn.MultiheadAttention(
            hidden_dim * 2,  # *2 for bidirectional
            num_heads=4,
            dropout=dropout
        )
        
        # Feature extraction layers with residual connections
        self.feature_layers = nn.ModuleList([
            nn.Sequential(
                nn.Linear(hidden_dim * 2, hidden_dim * 2),
                nn.LayerNorm(hidden_dim * 2),
                nn.ReLU(),
                nn.Dropout(dropout)
            ) for _ in range(2)
        ])
        
        # Output layers
        self.output_layer = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, output_dim),
            nn.Sigmoid()  # For probability outputs
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # LSTM layer
        lstm_out, _ = self.lstm(x)
        
        # Self-attention mechanism
        attention_out, _ = self.attention(
            lstm_out.transpose(0, 1),
            lstm_out.transpose(0, 1),
            lstm_out.transpose(0, 1)
        )
        attention_out = attention_out.transpose(0, 1)
        
        # Residual feature extraction
        features = attention_out[:, -1, :]  # Take last sequence output
        for layer in self.feature_layers:
            features = features + layer(features)  # Residual connection
            
        # Final prediction
        return self.output_layer(features)
    
    def save_checkpoint(self, epoch: int, optimizer: torch.optim.Optimizer, loss: float) -> str:
        """Save model checkpoint with timestamp"""
        # Create models directory if it doesn't exist
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        # Create filename with timestamp
        timestamp = pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')
        filename = f'emergency_model_{timestamp}.pth'
        filepath = os.path.join(models_dir, filename)
        
        # Save model state
        checkpoint = {
            'epoch': epoch,
            'model_state_dict': self.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'loss': loss,
            'timestamp': timestamp
        }
        
        torch.save(checkpoint, filepath)
        
        # Also save as latest.pth for easy loading
        latest_path = os.path.join(models_dir, 'latest.pth')
        torch.save(checkpoint, latest_path)
        
        logger.info(f'Model saved: {filepath}')
        return filepath
    
    def load_checkpoint(self, filename: str = 'latest.pth') -> Dict:
        """Load model checkpoint"""
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        filepath = os.path.join(models_dir, filename)
        
        if not os.path.exists(filepath):
            logger.warning(f'No checkpoint found at {filepath}')
            return None
        
        checkpoint = torch.load(filepath)
        self.load_state_dict(checkpoint['model_state_dict'])
        
        logger.info(f'Model loaded: {filepath}')
        return checkpoint
    
    def list_checkpoints(self) -> List[str]:
        """List all available model checkpoints"""
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        checkpoints = [f for f in os.listdir(models_dir) if f.endswith('.pth')]
        return sorted(checkpoints, reverse=True)  # Most recent first

class EmergencyPredictionSystem:
    """High-performance Emergency Prediction System"""
    def __init__(
        self,
        input_dim: int,
        hidden_dim: int = 128,
        num_layers: int = 2,
        output_dim: int = 5,  # 4 emergency types + severity
        learning_rate: float = 0.001,
        device: str = None
    ):
        # Automatic device selection
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        logger.info(f"Using device: {self.device}")
        
        # Initialize model
        self.model = EmergencyPredictor(
            input_dim=input_dim,
            hidden_dim=hidden_dim,
            num_layers=num_layers,
            output_dim=output_dim
        ).to(self.device)
        
        # Mixed precision training
        self.scaler = GradScaler()
        
        # Optimizer with weight decay
        self.optimizer = optim.AdamW(
            self.model.parameters(),
            lr=learning_rate,
            weight_decay=0.01  # L2 regularization
        )
        
        # Learning rate scheduler
        self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer,
            mode='min',
            factor=0.5,
            patience=5,
            verbose=True
        )
        
        # Loss functions
        self.loss_fn = nn.BCELoss()

    def train(
        self,
        train_loader: DataLoader,
        val_loader: DataLoader,
        epochs: int = 50,
        early_stopping_patience: int = 10
    ) -> Dict[str, List[float]]:
        """Train the model with performance optimizations"""
        history = {'train_loss': [], 'val_loss': []}
        best_val_loss = float('inf')
        patience_counter = 0
        
        for epoch in range(epochs):
            # Training phase
            self.model.train()
            train_loss = 0.0
            
            for batch_features, batch_labels in train_loader:
                batch_features = batch_features.to(self.device)
                batch_labels = batch_labels.to(self.device)
                
                # Mixed precision training
                with autocast():
                    predictions = self.model(batch_features)
                    loss = self.loss_fn(predictions, batch_labels)
                
                # Backpropagation with gradient scaling
                self.optimizer.zero_grad()
                self.scaler.scale(loss).backward()
                self.scaler.step(self.optimizer)
                self.scaler.update()
                
                train_loss += loss.item()
            
            train_loss /= len(train_loader)
            history['train_loss'].append(train_loss)
            
            # Validation phase
            val_loss = self.evaluate(val_loader)
            history['val_loss'].append(val_loss)
            
            # Learning rate scheduling
            self.scheduler.step(val_loss)
            
            # Early stopping
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                self.save_checkpoint('best_model.pth')
                patience_counter = 0
            else:
                patience_counter += 1
                
            if patience_counter >= early_stopping_patience:
                logger.info("Early stopping triggered")
                break
            
            logger.info(
                f"Epoch {epoch+1}/{epochs} - "
                f"Train Loss: {train_loss:.4f} - "
                f"Val Loss: {val_loss:.4f}"
            )
        
        return history

    def evaluate(self, data_loader: DataLoader) -> float:
        """Evaluate the model"""
        self.model.eval()
        total_loss = 0.0
        
        with torch.no_grad():
            for batch_features, batch_labels in data_loader:
                batch_features = batch_features.to(self.device)
                batch_labels = batch_labels.to(self.device)
                
                with autocast():
                    predictions = self.model(batch_features)
                    loss = self.loss_fn(predictions, batch_labels)
                
                total_loss += loss.item()
        
        return total_loss / len(data_loader)

    def predict(self, features: np.ndarray) -> np.ndarray:
        """Make predictions"""
        self.model.eval()
        with torch.no_grad():
            features_tensor = torch.FloatTensor(features).to(self.device)
            with autocast():
                predictions = self.model(features_tensor)
            return predictions.cpu().numpy()

    def save_checkpoint(self, filename: str):
        """Save model checkpoint"""
        checkpoint = {
            'model_state_dict': self.model.state_dict(),
            'optimizer_state_dict': self.optimizer.state_dict(),
            'scheduler_state_dict': self.scheduler.state_dict(),
        }
        torch.save(checkpoint, filename)

    def load_checkpoint(self, filename: str):
        """Load model checkpoint"""
        checkpoint = torch.load(filename, map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        self.scheduler.load_state_dict(checkpoint['scheduler_state_dict'])

    @staticmethod
    def prepare_data(
        data: pd.DataFrame,
        sequence_length: int = 30,
        batch_size: int = 32,
        num_workers: int = 4
    ) -> Tuple[DataLoader, DataLoader]:
        """Prepare data for training"""
        # Data preprocessing code here...
        # Returns train_loader, val_loader
        pass
