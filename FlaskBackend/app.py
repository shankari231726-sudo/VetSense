from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
import datetime
import os
import requests
import boto3
import math
import numpy as np
from dotenv import load_dotenv
from tensorflow import keras
from PIL import Image
import io

# Load skin disease model
SKIN_MODEL = keras.models.load_model('/home/ubuntu/my-react-app/src/vetsense_best_model.keras')
SKIN_CLASSES = sorted(['Dermatitis', 'Fungal_infections', 'Healthy', 'Hypersensitivity', 'demodicosis', 'ringworm'])

SKIN_TREATMENTS = {
    'Dermatitis': {'treatment': ['Clean affected area daily', 'Avoid allergens', 'Use medicated shampoo'], 'prescription': 'Hydrocortisone cream 1% twice daily', 'emergency': False},
    'Fungal_infections': {'treatment': ['Antifungal shampoo twice a week', 'Keep area dry', 'Isolate from other pets'], 'prescription': 'Ketoconazole 2% shampoo + Fluconazole 5mg/kg daily', 'emergency': False},
    'Healthy': {'treatment': ['Regular grooming', 'Balanced diet', 'Monthly flea prevention'], 'prescription': 'No medication needed', 'emergency': False},
    'Hypersensitivity': {'treatment': ['Remove allergen', 'Cool water bath', 'Vet consultation'], 'prescription': 'Diphenhydramine 1mg/kg twice daily', 'emergency': False},
    'demodicosis': {'treatment': ['Weekly medicated dip', 'Skin scraping test', 'Vet visit required'], 'prescription': 'Ivermectin 0.3mg/kg weekly', 'emergency': True},
    'ringworm': {'treatment': ['Antifungal treatment', 'Clip hair around lesion', 'Disinfect environment'], 'prescription': 'Terbinafine 30mg/kg daily for 4 weeks', 'emergency': False},
}

load_dotenv()

app = Flask(__name__)
CORS(app)

SECRET_KEY = "vetsense_secret_key_2024"
DB_CONFIG = {"host": "localhost", "user": "vetsense", "password": "vetsense123", "database": "vetsense_db"}

# AWS SNS
sns = boto3.client('sns', region_name='eu-north-1')

def send_sms(phone, message):
    try:
        if not phone.startswith('+'):
            phone = '+91' + phone
        sns.publish(PhoneNumber=phone, Message=message)
        return True
    except Exception as e:
        print(f"SMS error: {e}")
        return False

def get_db():
    return mysql.connector.connect(**DB_CONFIG)

def generate_token(user_id, email):
    payload = {"user_id": user_id, "email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@app.route("/")
def home():
    return jsonify({"message": "VetSense Backend Running", "status": "ok"})

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone", "")
        if not name or not email or not password:
            return jsonify({"error": "All fields required"}), 400
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already registered"}), 409
        cur.execute("INSERT INTO users (name, email, password, phone) VALUES (%s, %s, %s, %s)",
                    (name, email, hashed.decode("utf-8"), phone))
        db.commit()
        user_id = cur.lastrowid
        cur.close()
        db.close()
        token = generate_token(user_id, email)
        # Send welcome SMS
        if phone:
            send_sms(phone, f"Welcome to VetSense {name}! Your account has been created successfully. Keep your dog healthy!")
        return jsonify({"message": "Registration successful", "token": token, "name": name, "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        db = get_db()
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        db.close()
        if not user:
            return jsonify({"error": "User not found"}), 404
        if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return jsonify({"error": "Incorrect password"}), 401
        token = generate_token(user["id"], email)
        return jsonify({"message": "Login successful", "token": token, "name": user["name"], "user_id": user["id"], "phone": user["phone"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health-checkup", methods=["POST"])
def health_checkup():
    try:
        data = request.json
        dog_name = data.get("dog_name")
        age = float(data.get("age", 0))
        weight = float(data.get("weight", 0))
        activity = data.get("activity_level", "moderate")
        user_id = data.get("user_id")
        activity_map = {"low": 0, "moderate": 1, "high": 2}
        activity_num = activity_map.get(activity.lower(), 1)
        if weight < 2:
            health_status = "Underweight"
        elif activity_num == 0 and age > 5:
            health_status = "Needs Attention"
        else:
            health_status = "Healthy"
        care_map = {
            "Healthy": ["Regular exercise daily", "Balanced diet", "Annual vaccination checkup"],
            "Needs Attention": ["Visit vet within a week", "Monitor food intake"],
            "Underweight": ["Increase meal frequency", "High-protein diet", "Vet consultation needed"],
        }
        care = care_map.get(health_status, ["Consult your veterinarian"])
        if user_id:
            db = get_db()
            cur = db.cursor()
            cur.execute("INSERT INTO health_records (user_id, dog_name, age, weight, activity_level, health_status, recommendations) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (user_id, dog_name, age, weight, activity, health_status, ", ".join(care)))
            db.commit()
            cur.close()
            db.close()
        return jsonify({"dog_name": dog_name, "health_status": health_status, "recommendations": care, "emergency": False}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/diagnose", methods=["POST"])
def diagnose():
    try:
        data = request.json
        dog_name = data.get("dog_name")
        symptoms = data.get("symptoms", "")
        category = data.get("category", "")
        user_id = data.get("user_id")
        phone = data.get("phone", "")
        sdb = {
            "leg_injury": {"diagnosis": "Possible fracture or ligament injury", "treatment": ["Rest leg", "Cold compress", "X-ray recommended"], "prescription": "Meloxicam 0.1mg/kg once daily", "emergency": False},
            "vomiting": {"diagnosis": "Gastritis or dietary issue", "treatment": ["Withhold food 12hrs", "Fresh water", "Bland diet"], "prescription": "Metoclopramide 0.5mg/kg twice daily", "emergency": False},
            "skin_rash": {"diagnosis": "Allergic dermatitis", "treatment": ["Clean area", "Avoid allergens", "Antifungal shampoo"], "prescription": "Diphenhydramine 1mg/kg twice daily", "emergency": False},
            "tick": {"diagnosis": "Tick infestation - Lyme disease risk", "treatment": ["Remove ticks", "Antiseptic", "Blood test"], "prescription": "Doxycycline 5mg/kg twice daily 4 weeks", "emergency": True},
            "eye_discharge": {"diagnosis": "Conjunctivitis or eye infection", "treatment": ["Clean eye with saline", "Avoid bright light", "Vet checkup needed"], "prescription": "Tobramycin eye drops 3x daily", "emergency": False},
            "lethargy": {"diagnosis": "Possible infection or anemia", "treatment": ["Rest", "Monitor temperature", "Vet visit recommended"], "prescription": "Blood test required before medication", "emergency": False},
            "diarrhea": {"diagnosis": "Intestinal upset or infection", "treatment": ["Bland diet", "Keep hydrated", "Monitor for blood in stool"], "prescription": "Metronidazole 15mg/kg twice daily", "emergency": False},
            "loss_of_appetite": {"diagnosis": "Stress, infection or dental pain", "treatment": ["Offer favourite food", "Check teeth and gums", "Vet visit if persists 2 days"], "prescription": "Appetite stimulant: Mirtazapine 1.88mg every 3 days", "emergency": False},
            "seizure": {"diagnosis": "Epilepsy or neurological disorder", "treatment": ["Do not restrain dog", "Remove hazards nearby", "Emergency vet visit NOW"], "prescription": "Phenobarbital - vet prescription required", "emergency": True},
            "breathing_difficulty": {"diagnosis": "Respiratory infection or heart issue", "treatment": ["Keep calm and still", "Fresh air", "Emergency vet immediately"], "prescription": "Emergency vet required", "emergency": True},
        }
        result = sdb.get(category, {"diagnosis": "Consult a vet", "treatment": ["Visit veterinarian"], "prescription": "N/A", "emergency": True})
        if user_id:
            db = get_db()
            cur = db.cursor()
            cur.execute("INSERT INTO diagnosis_records (user_id, dog_name, symptoms, category, diagnosis, prescription) VALUES (%s, %s, %s, %s, %s, %s)",
                        (user_id, dog_name, symptoms, category, result["diagnosis"], result["prescription"]))
            db.commit()
            cur.close()
            db.close()
        # Send emergency SMS
        if result["emergency"] and phone:
            send_sms(phone, f"VETSENSE EMERGENCY ALERT! Your dog {dog_name} needs immediate vet attention! Diagnosis: {result['diagnosis']}. Please visit nearest vet NOW!")
        return jsonify({"dog_name": dog_name, "diagnosis": result["diagnosis"], "treatment": result["treatment"], "prescription": result["prescription"], "emergency": result["emergency"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/vaccination-schedule", methods=["POST"])
def vaccination_schedule():
    try:
        data = request.json
        dog_name = data.get("dog_name")
        breed = data.get("breed", "general").lower()
        age_months = float(data.get("age_months", 0))
        user_id = data.get("user_id")
        phone = data.get("phone", "")
        schedule = []
        if age_months <= 2:
            schedule = [
                {"vaccine": "Distemper + Parvovirus (DHPPi)", "due": "Now (6-8 weeks)", "priority": "High"},
                {"vaccine": "Deworming", "due": "Now", "priority": "High"},
            ]
        elif age_months <= 3:
            schedule = [
                {"vaccine": "DHPPi 2nd dose", "due": "Now (10-12 weeks)", "priority": "High"},
                {"vaccine": "Leptospirosis", "due": "Now", "priority": "High"},
                {"vaccine": "Deworming", "due": "Every 2 weeks", "priority": "Medium"},
            ]
        elif age_months <= 4:
            schedule = [
                {"vaccine": "DHPPi 3rd dose + Rabies", "due": "Now (14-16 weeks)", "priority": "High"},
                {"vaccine": "Leptospirosis 2nd dose", "due": "Now", "priority": "High"},
            ]
        elif age_months <= 12:
            schedule = [
                {"vaccine": "Rabies booster", "due": "At 1 year", "priority": "High"},
                {"vaccine": "DHPPi Annual booster", "due": "At 1 year", "priority": "High"},
                {"vaccine": "Deworming", "due": "Every 3 months", "priority": "Medium"},
                {"vaccine": "Tick & Flea prevention", "due": "Monthly", "priority": "Medium"},
            ]
        else:
            schedule = [
                {"vaccine": "DHPPi Annual booster", "due": "Every year", "priority": "High"},
                {"vaccine": "Rabies booster", "due": "Every 1-3 years", "priority": "High"},
                {"vaccine": "Leptospirosis booster", "due": "Every year", "priority": "High"},
                {"vaccine": "Deworming", "due": "Every 3 months", "priority": "Medium"},
                {"vaccine": "Tick & Flea prevention", "due": "Monthly", "priority": "Medium"},
                {"vaccine": "Dental checkup", "due": "Every 6 months", "priority": "Low"},
            ]
        breed_extras = {
            "labrador": {"vaccine": "Hip dysplasia screening", "due": "At 1 year", "priority": "Medium"},
            "german shepherd": {"vaccine": "Degenerative myelopathy test", "due": "At 2 years", "priority": "Medium"},
            "poodle": {"vaccine": "Eye screening (PRA)", "due": "Annual", "priority": "Medium"},
            "bulldog": {"vaccine": "Cardiac screening", "due": "Annual", "priority": "High"},
            "beagle": {"vaccine": "MLS screening", "due": "At 1 year", "priority": "Low"},
        }
        if breed in breed_extras:
            schedule.append(breed_extras[breed])
        if user_id:
            import json
            db = get_db()
            cur = db.cursor()
            cur.execute("INSERT INTO vaccination_records (user_id, dog_name, breed, age_months, schedule) VALUES (%s, %s, %s, %s, %s)",
                        (user_id, dog_name, breed, age_months, json.dumps(schedule)))
            db.commit()
            cur.close()
            db.close()
        # Send vaccination reminder SMS
        print(f"DEBUG: phone received = '{phone}'")
        print(f"DEBUG: schedule = {schedule}")
        if phone:
            high_priority = [s["vaccine"] for s in schedule if s["priority"] == "High"]
            print(f"DEBUG: high_priority = {high_priority}")
            if high_priority:
                print(f"DEBUG: calling send_sms now...")
                sms_result = send_sms(phone, f"VetSense Vaccination Reminder for {dog_name}: {', '.join(high_priority[:2])} due soon! Please visit your vet.")
                print(f"DEBUG: send_sms returned {sms_result}")
            else:
                print("DEBUG: no high priority vaccines, skipping SMS")
        else:
            print("DEBUG: phone is empty, skipping SMS")
        return jsonify({"dog_name": dog_name, "breed": breed, "age_months": age_months, "vaccination_schedule": schedule, "total_vaccines": len(schedule)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/history/<int:user_id>", methods=["GET"])
def history(user_id):
    try:
        db = get_db()
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM health_records WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        health = cur.fetchall()
        cur.execute("SELECT * FROM diagnosis_records WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        diagnosis = cur.fetchall()
        cur.close()
        db.close()
        for row in health + diagnosis:
            if "created_at" in row and row["created_at"]:
                row["created_at"] = str(row["created_at"])
        return jsonify({"health_records": health, "diagnosis_records": diagnosis}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/nearby-vets", methods=["GET"])
def nearby_vets():
    try:
        lat = float(request.args.get("lat", 9.9252))
        lng = float(request.args.get("lng", 78.1198))
        def distance(lat1, lon1, lat2, lon2):
            R = 6371
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
            return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)), 2)
        all_vets = [
            {"name": "Anbu Veterinary Clinic", "address": "Anna Nagar, Madurai", "phone": "0452-2345678", "lat": 9.9312, "lng": 78.1234},
            {"name": "Pet Care Animal Hospital", "address": "KK Nagar, Madurai", "phone": "0452-2456789", "lat": 9.9198, "lng": 78.1098},
            {"name": "Sri Veterinary Clinic", "address": "Bypass Road, Madurai", "phone": "0452-2567890", "lat": 9.9401, "lng": 78.1312},
            {"name": "Animal Care Centre", "address": "Mattuthavani, Madurai", "phone": "0452-2678901", "lat": 9.9089, "lng": 78.1189},
            {"name": "Government Veterinary Hospital", "address": "Tallakulam, Madurai", "phone": "0452-2345000", "lat": 9.9345, "lng": 78.1156},
            {"name": "Madurai Pet Clinic", "address": "Narimedu, Madurai", "phone": "0452-2789012", "lat": 9.9267, "lng": 78.1289},
            {"name": "VetLine Animal Hospital", "address": "Vilangudi, Madurai", "phone": "0452-2890123", "lat": 9.9423, "lng": 78.1067},
            {"name": "Paws & Claws Vet Clinic", "address": "Thirunagar, Madurai", "phone": "0452-2901234", "lat": 9.9156, "lng": 78.1345},
            {"name": "Happy Tails Vet Hospital", "address": "Iyer Bungalow, Madurai", "phone": "0452-3012345", "lat": 9.9378, "lng": 78.1223},
            {"name": "Care Vet Hospital", "address": "Melur Road, Madurai", "phone": "0452-3123456", "lat": 9.9478, "lng": 78.1412},
        ]
        for vet in all_vets:
            vet["distance_km"] = distance(lat, lng, vet["lat"], vet["lng"])
        sorted_vets = sorted(all_vets, key=lambda x: x["distance_km"])
        return jsonify({"vets": sorted_vets, "total": len(sorted_vets), "user_location": {"lat": lat, "lng": lng}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/skin-diagnosis", methods=["POST"])
def skin_diagnosis():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        file = request.files['image']
        user_id = request.form.get('user_id')
        dog_name = request.form.get('dog_name', 'Unknown')
        img = Image.open(io.BytesIO(file.read())).convert("RGB").resize((224, 224))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        prediction = SKIN_MODEL.predict(img_array, verbose=0)
        predicted_class = SKIN_CLASSES[np.argmax(prediction)]
        confidence = round(float(np.max(prediction)) * 100, 2)
        result = SKIN_TREATMENTS[predicted_class]
        if user_id:
            db = get_db()
            cur = db.cursor()
            cur.execute("INSERT INTO diagnosis_records (user_id, dog_name, symptoms, category, diagnosis, prescription) VALUES (%s, %s, %s, %s, %s, %s)",
                (user_id, dog_name, 'image upload', predicted_class, predicted_class, result['prescription']))
            db.commit()
            cur.close()
            db.close()
        return jsonify({"dog_name": dog_name, "predicted_disease": predicted_class, "confidence": confidence, "treatment": result['treatment'], "prescription": result['prescription'], "emergency": result['emergency']}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/feedback", methods=["POST"])
def submit_feedback():
    try:
        data = request.json
        name = data.get("name")
        message = data.get("message")
        rating = int(data.get("rating", 5))
        if not name or not message:
            return jsonify({"error": "Name and message required"}), 400
        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be 1-5"}), 400
        db = get_db()
        cur = db.cursor()
        cur.execute("INSERT INTO feedback (name, message, rating) VALUES (%s, %s, %s)",
                    (name, message, rating))
        db.commit()
        cur.close()
        db.close()
        return jsonify({"message": "Feedback submitted successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/feedback", methods=["GET"])
def get_feedback():
    try:
        db = get_db()
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM feedback ORDER BY created_at DESC LIMIT 10")
        feedbacks = cur.fetchall()
        cur.execute("SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM feedback")
        stats = cur.fetchone()
        cur.close()
        db.close()
        for f in feedbacks:
            if "created_at" in f and f["created_at"]:
                f["created_at"] = str(f["created_at"])
        return jsonify({
            "feedbacks": feedbacks,
            "avg_rating": round(float(stats["avg_rating"] or 0), 1),
            "total_reviews": stats["total"]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)