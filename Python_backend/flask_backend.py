from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import loadEncoder, encodeReview, makePrediction, cleanReview
from keras.models import load_model
import pandas as pd
import pickle

def load_models():
    model1 = load_model("models/RNN.h5")
    model2 = load_model("models/GRU.h5")
    model3 = load_model("models/LSTM.h5")
    return model1, model2, model3

dictionary = loadEncoder()
model1, model2, model3 = load_models()

app = Flask(__name__)
CORS(app)

@app.route('/api/store-string', methods=['POST'])
def store_string():
    data = request.get_json()
    if 'input_string' in data:
        review = data['input_string']
        string = review
        review = encodeReview(review, dictionary)
        result = makePrediction(review, model1, model2, model3)
        result = "The comment is " + result
        return jsonify({"message": result, "given_review": string}), 200
    return jsonify({"error": "No string provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
