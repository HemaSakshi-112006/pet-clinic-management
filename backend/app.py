from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["pet_clinic"]
appointments = db["appointments"]

@app.route("/api/appointments", methods=["POST"])
def book_appointment():
    data = request.json

    appointments.insert_one(data)

    return jsonify({"message": "Appointment booked successfully!"})

if __name__ == "__main__":
    app.run(debug=True)