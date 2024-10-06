from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import loadEncoder, encodeReview, makePrediction, cleanReview
from scraper import start
from pre_process import make_review
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

@app.route('/comment-analysis', methods=['POST'])
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

@app.route('/dataset-analysis', methods=['POST'])
def make_analysis():
    data = request.get_json()
    if 'ImdbId' in data and 'limit' in data:
        ImdbId = data['ImdbId']
        limit = data['limit']
        #make_review(ImdbId, limit)
        df = pd.read_csv("IMDB Dataset.csv")
        #df = makePrediction(df, model1, model2, model3, len(df))
        result = df[:20].to_dict(orient='records')
        return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
