import requests

def test_prediction():
    # Test data
    test_data = {
        'location_lat': 37.7749,
        'location_long': -122.4194,
        'weather_temp': 75.0,
        'weather_humidity': 65.0,
        'weather_wind_speed': 10.0
    }
    
    try:
        # Make prediction request
        response = requests.post(
            'http://localhost:8000/predict',
            json=test_data
        )
        
        # Print results
        print("\nAPI Test Results:")
        print("=" * 50)
        if response.status_code == 200:
            print("✅ API is working!")
            print("\nPrediction:")
            print(response.json())
        else:
            print("❌ Error:", response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to API")
        print("Make sure the API server is running (uvicorn api:app --reload)")

if __name__ == "__main__":
    test_prediction()
