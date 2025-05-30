from flask import Flask, request, jsonify
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Model ve tokenizer
model_path = "./model"
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()  # JSON verisi geliyor
    question = data.get("question", "")
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Model tahmini
    inputs = tokenizer(question, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=150, # cevap token sınırı
        num_beams=5,        # 5 alternatif cevap
        early_stopping=True # gereksiz uzun cevaplar engelleniyor
    )
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"question": question, "answer": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
