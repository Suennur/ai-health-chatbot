from flask import Flask, render_template, request, jsonify, url_for
import requests

app = Flask(__name__, static_folder="static", template_folder="templates")

# Model sunucusunun adresi
MODEL_API_URL = "http://model-server:5000/predict"

# Geri bildirimleri saklamak için basit bir liste (kalıcı depolama için veritabanı kullanılabilir)
feedback_data = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    try:
        # Kullanıcıdan gelen JSON verisini al
        data = request.get_json()
        question = data.get("question", "")
        if not question:
            return jsonify({"error": "Lütfen bir soru yazın."}), 400

        # Model sunucusuna istek gönder
        response = requests.post(MODEL_API_URL, json={"question": question})

        # Model sunucusundan gelen yanıtı işleme
        if response.status_code == 200:
            answer = response.json().get("answer", "Cevap alınamadı.")
        else:
            answer = f"Model sunucusunda bir hata oluştu: {response.status_code}"

        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}), 500

@app.route("/feedback", methods=["POST"])
def feedback():
    try:
        # Geri bildirim verilerini al
        data = request.get_json()
        question = data.get("question", "")
        answer = data.get("answer", "")
        feedback_type = data.get("feedback", "")

        if not question or not answer or not feedback_type:
            return jsonify({"error": "Eksik bilgi"}), 400

        # Geri bildirimi listeye ekle
        feedback_data.append({
            "question": question,
            "answer": answer,
            "feedback": feedback_type
        })

        return jsonify({"message": "Geri bildirim kaydedildi."}), 200
    except Exception as e:
        return jsonify({"error": f"Beklenmeyen bir hata oluştu: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
