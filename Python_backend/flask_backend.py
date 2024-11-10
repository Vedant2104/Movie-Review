from flask import Flask, request, jsonify
from flask_cors import CORS
from predictor import loadEncoder, predictOnDataFrame
from scraper import make_review
from keras.models import load_model
import pandas as pd
from pymongo import MongoClient


def load_models():
    model1 = load_model("models/RNN.h5")
    model2 = load_model("models/GRU.h5")
    model3 = load_model("models/LSTM.h5")
    return model1, model2, model3

dictionary = loadEncoder()
model1, model2, model3 = load_models()

app = Flask(__name__)
CORS(app)

@app.route('/dataset-analysis', methods=['POST'])
def make_analysis():
    data = request.get_json()
    if 'ImdbId' in data and 'limit' in data:
        ImdbId = data['ImdbId']
        limit = data['limit']
        df = make_review(ImdbId, limit)
        df = predictOnDataFrame(df, "reviews", model1, model2, model3, dictionary)
        result = df.to_dict(orient='records')

        client = MongoClient('mongodb://localhost:27017/')
        db = client['reviews']
        collection = db[f'reviews_{ImdbId}']
        collection.insert_many(df.to_dict(orient='records'))

        return jsonify(result)
if __name__ == '__main__':
    app.run(debug=True)
