from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)
CORS(app)  # This allows your React frontend to connect

# 1. Load the model and the word index
# (Make sure these files are in the same folder as app.py)
model = tf.keras.models.load_model('sentiment_lstm.h5')
with open('word_index.pkl', 'rb') as f:
    word_index = pickle.load(f)

def decode_and_pad(text):
    # Convert text to the format the model expects
    vocab_size = 20000
    maxlen = 200
    
    # Simple preprocessing: lowercase and split
    words = text.lower().split()
    
    # Map words to IDs based on the IMDb word index
    # We add 3 because the IMDb index is offset by 3 (0=pad, 1=start, 2=unknown)
    tokens = [word_index.get(w, 2) + 3 for w in words]
    
    # Filter out IDs that are above our vocab size
    tokens = [t if t < vocab_size else 2 for t in tokens]
    
    # Pad to maxlen
    return pad_sequences([tokens], maxlen=maxlen)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        user_text = data.get('text', '')
        
        if not user_text:
            return jsonify({"error": "No text provided"}), 400

        # Preprocess and Predict
        processed_text = decode_and_pad(user_text)
        prediction = model.predict(processed_text)[0][0]
        
        # Determine label
        sentiment = "Positive" if prediction > 0.5 else "Negative"
        confidence = float(prediction) if sentiment == "Positive" else float(1 - prediction)

        return jsonify({
            "sentiment": sentiment,
            "confidence": round(confidence * 100, 2)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    # Render provides a 'PORT' environment variable. 
    # This code tells Flask to listen on that port, or 5000 if running locally.
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)