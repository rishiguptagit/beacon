import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from sklearn.metrics import mean_squared_error
import joblib

class EmergencyPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        
    def preprocess_data(self, data):
        """
        Preprocess the emergency data for training
        Expected columns: date, type, severity, location_lat, location_long, 
                        weather_temp, weather_humidity, weather_wind_speed
        """
        # Convert date to numerical features
        data['date'] = pd.to_datetime(data['date'])
        data['day_of_year'] = data['date'].dt.dayofyear
        data['month'] = data['date'].dt.month
        data['year'] = data['date'].dt.year
        
        # Create feature matrix
        features = ['day_of_year', 'month', 'year', 'location_lat', 'location_long',
                   'weather_temp', 'weather_humidity', 'weather_wind_speed']
        X = data[features].values
        
        # Create target variables (one-hot encoded emergency types and severity)
        y_type = pd.get_dummies(data['type']).values
        y_severity = data['severity'].values.reshape(-1, 1)
        
        return X, y_type, y_severity
    
    def build_model(self, input_shape, num_emergency_types):
        """Build and compile the LSTM model"""
        model = Sequential([
            LSTM(64, input_shape=input_shape, return_sequences=True),
            Dropout(0.2),
            LSTM(32),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(num_emergency_types + 1, activation='softmax')  # +1 for severity
        ])
        
        model.compile(optimizer='adam',
                     loss='categorical_crossentropy',
                     metrics=['accuracy'])
        
        return model
    
    def train(self, data, sequence_length=30, epochs=50, batch_size=32):
        """Train the model on historical emergency data"""
        # Preprocess data
        X, y_type, y_severity = self.preprocess_data(data)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Create sequences for LSTM
        X_seq = []
        y_seq_type = []
        y_seq_severity = []
        
        for i in range(len(X_scaled) - sequence_length):
            X_seq.append(X_scaled[i:i + sequence_length])
            y_seq_type.append(y_type[i + sequence_length])
            y_seq_severity.append(y_severity[i + sequence_length])
        
        X_seq = np.array(X_seq)
        y_seq_type = np.array(y_seq_type)
        y_seq_severity = np.array(y_seq_severity)
        
        # Combine type and severity predictions
        y_combined = np.concatenate([y_seq_type, y_seq_severity], axis=1)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_seq, y_combined, test_size=0.2, random_state=42
        )
        
        # Build and train model
        self.model = self.build_model(
            input_shape=(sequence_length, X.shape[1]),
            num_emergency_types=y_type.shape[1]
        )
        
        self.model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=epochs,
            batch_size=batch_size
        )
        
        # Save scaler
        joblib.dump(self.scaler, 'emergency_scaler.joblib')
        
        # Save model
        self.model.save('emergency_model.h5')
        
        # Calculate and return metrics
        y_pred = self.model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        
        return {
            'mse': mse,
            'test_accuracy': self.model.evaluate(X_test, y_test)[1]
        }
    
    def predict(self, input_data, sequence_length=30):
        """
        Make predictions for future emergencies
        input_data should be a DataFrame with recent emergency data
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
            
        # Preprocess input data
        X, _, _ = self.preprocess_data(input_data)
        X_scaled = self.scaler.transform(X)
        
        # Create sequence
        X_seq = X_scaled[-sequence_length:].reshape(1, sequence_length, X.shape[1])
        
        # Make prediction
        prediction = self.model.predict(X_seq)
        
        # Split prediction into type and severity
        num_types = prediction.shape[1] - 1
        predicted_type = prediction[0, :num_types]
        predicted_severity = prediction[0, -1]
        
        return {
            'emergency_type_probabilities': predicted_type.tolist(),
            'severity': float(predicted_severity)
        }
