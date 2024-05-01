from flask import Flask, request, jsonify
from flask_cors import CORS
from new_gpt import recommend
import pandas as pd
import serial
import time
app = Flask(__name__)

# Enable CORS for the entire app
CORS(app, resources={r"/recommend": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/locatebook": {"origins": "http://localhost:3000"}})

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    query = data.get('query')
    recommendations = recommend(query)  # Call your recommendation function

    # Convert the DataFrame to a JSON-serializable format
    recommendations_json = recommendations.to_dict(orient='records')
    print(recommendations_json)

    return jsonify(recommendations_json)


@app.route('/locatebook', methods=['POST'])
def get_locatebook():
    number = data.get('number')
    ser = serial.Serial('/dev/ttyACM0', 9600)
    data = str(number) 
    # Sending signal for 10 seconds continuously
    start_time = time.time()
    while (time.time() - start_time) < 10:
        ser.write(data.encode())
        time.sleep(0.1)  # Adjust delay as needed
    ser.close()
    return {"status": 200, "message": "Sucessful response", "number": data}

if __name__ == '__main__':
    app.run(debug=True)
