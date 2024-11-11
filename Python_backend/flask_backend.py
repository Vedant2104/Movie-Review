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

        client = MongoClient('mongodb://localhost:27017/')
        db = client['reviews']
        collection_name = f'reviews_{ImdbId}'
        collection = db[collection_name]
        if collection_name in db.list_collection_names():
            
            count = collection.count_documents({})
            if count>=limit:
                data = list(collection.find({}, {'_id': 1, 'reviews': 1, 'sentiment': 1}).limit(limit))
            else:
                df = make_review(ImdbId, limit)
                df = df[count:]
                df = predictOnDataFrame(df, "reviews", model1, model2, model3, dictionary)
                pred = df.to_dict(orient='records')
                if pred:
                    collection.insert_many(pred)
                data = list(collection.find({}, {'_id': 1, 'reviews': 1, 'sentiment': 1}))
        
        else:
            df = make_review(ImdbId, limit)
            df = predictOnDataFrame(df, "reviews", model1, model2, model3, dictionary)
            collection.insert_many(df.to_dict(orient='records'))
            data = list(collection.find({}, {'_id': 1, 'reviews': 1, 'sentiment': 1}))

        for record in data:
            record['_id'] = str(record['_id'])
        return jsonify(data)
    return jsonify({'error': 'Invalid input data'}), 400

if __name__ == '__main__':
    app.run(debug=True)
