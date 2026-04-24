from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

appointments = []   # temporary storage

@app.route("/api/appointments", methods=["POST"])
def book_appointment():
    data = request.json

    appointments.append(data)

    return jsonify({"message": "Appointment booked successfully!"})

@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    return jsonify(appointments)

if __name__ == "__main__":
    app.run(debug=True)