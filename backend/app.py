from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# === Load API Keys from Environment Variables ===
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BOT_KEY = os.getenv("OPENROUTER_BOT_KEY")

# === Route: Homepage ===
@app.route('/')
def home():
    return "🌱 AI Climate Backend is running!"

# === Weather Data Fetch Function ===
def get_weather(city):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    try:
        r = requests.get(url)
        if r.status_code != 200:
            print("[WEATHER ERROR] API returned status", r.status_code)
            return None
        data = r.json()
        rain = data.get("rain", {})
        rain_volume = rain.get("1h") or rain.get("3h") or 0
        return {
            "city": city.capitalize(),
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"].capitalize(),
            "rain": rain_volume
        }
    except Exception as e:
        print("[WEATHER EXCEPTION]", e)
        return None

# === Route: /weather ===
@app.route('/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City parameter is missing"}), 400
    result = get_weather(city)
    if not result:
        return jsonify({"error": "City not found or connection error"}), 404
    return jsonify(result)

# === Route: /ask-ai (Weather AI Assistant) ===
@app.route('/ask-ai', methods=['POST'])
def ask_ai():
    try:
        data = request.json
        question = data.get('question')
        city = data.get('city')

        print(f"[ASK-AI] Question: {question} | City: {city}")

        if not question or not city:
            return jsonify({"error": "Question and city are required"}), 400

        weather = get_weather(city)
        if not weather:
            return jsonify({"error": "Weather data not found"}), 404

        prompt = f"""
Location: {weather['city']}
Temperature: {weather['temperature']}°C
Humidity: {weather['humidity']}%
Condition: {weather['description']}
Rain Volume: {weather['rain']} mm

User's question: "{question}"

Use the above real-time weather data to answer the user's question.
If the question is in a specific language, reply in that language.
Else, respond in simple and helpful English.
"""

        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type': 'application/json'
        }

        body = {
            "model": "mistralai/mistral-7b-instruct:free",
            "max_tokens": 400,
            "messages": [
                {"role": "system", "content": "You are a helpful, multilingual weather assistant."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
        result = response.json()

        print("[ASK-AI RESPONSE]", result)

        if response.status_code == 200 and 'choices' in result:
            answer = result['choices'][0]['message']['content'].strip()
            return jsonify({"response": answer}), 200
        else:
            return jsonify({"response": "🤖 AI unavailable", "error": result}), 500

    except Exception as e:
        print("[ASK-AI ERROR]", e)
        return jsonify({"response": "🤖 AI is unavailable. Please try later.", "error": str(e)}), 500

# === Route: /chat (Green Bot) ===
@app.route('/chat', methods=['POST'])
def green_chatbot():
    try:
        data = request.json
        question = data.get("question")
        print(f"[GREEN-BOT] Question: {question}")

        if not question:
            return jsonify({"error": "Question is required."}), 400

        headers = {
            'Authorization': f'Bearer {OPENROUTER_BOT_KEY}',
            'Content-Type': 'application/json'
        }

        body = {
            "model": "mistralai/mistral-7b-instruct:free",
            "max_tokens": 400,
            "messages": [
                {"role": "system", "content": "You are GreenBot, an eco-friendly assistant that educates users on climate change, green practices, cleanliness, and sustainability."},
                {"role": "user", "content": question}
            ]
        }

        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
        result = response.json()

        print("[GREEN-BOT RESPONSE]", result)

        if response.status_code == 200 and 'choices' in result:
            reply = result['choices'][0]['message']['content'].strip()
            return jsonify({"response": reply}), 200
        else:
            return jsonify({"response": "Green Bot is unavailable", "error": result}), 500

    except Exception as e:
        print("[GREEN-BOT ERROR]", e)
        return jsonify({"response": "Green Bot is currently unavailable", "error": str(e)}), 500

# === Route: /contact ===
@app.route('/contact', methods=['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not all([name, email, message]):
        return jsonify({'error': 'Please fill all fields.'}), 400

    try:
        msg = EmailMessage()
        msg['Subject'] = 'New Contact Form Submission'
        msg['From'] = 'your_email@gmail.com'
        msg['To'] = 'your_email@gmail.com'
        msg.set_content(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}")

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login('your_email@gmail.com', 'your_app_password')
            smtp.send_message(msg)

        return jsonify({'message': 'Message sent successfully!'}), 200

    except Exception as e:
        print("[MAIL ERROR]", e)
        return jsonify({'error': f'Failed to send email. {str(e)}'}), 500

# === Run App ===
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
