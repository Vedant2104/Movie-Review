# -*- coding: utf-8 -*-
"""
Created on Sat Aug 17 23:03:18 2024

@author: avane
"""
import numpy as np
import pickle
import cleantext
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import pad_sequences

def loadEncoder():
    with open("encode_map","rb") as handle:
        dat=handle.read()
    return pickle.loads(dat)

def cleanReview(review):
    review=cleantext.clean(review, clean_all= False, extra_spaces=True , stopwords=True ,lowercase=True ,numbers=True , punct=True)
    return review

def encodeReview(reviews, save_map):
    encoded_reviews = []
    for review in reviews:
        review=cleanReview(review)
        encoded_review=[1,]
        for word in review.split():
            if word in save_map:
                encoded_review.append(save_map[word])
            else:
                encoded_review.append(2)
        encoded_reviews.append(encoded_review)
        
    encoded_reviews=pad_sequences(encoded_reviews,maxlen=2697)
    return tf.convert_to_tensor(encoded_reviews, dtype=tf.int32)


def makePrediction(reviews, model1, model2, model3):
    rnn_pred = (model1.predict(reviews) > 0.5).astype(int)
    gru_pred = (model2.predict(reviews) > 0.5).astype(int)
    lstm_pred = (model3.predict(reviews) > 0.5).astype(int)
    final_pred = rnn_pred + gru_pred + lstm_pred
    return np.where(final_pred >= 2, "positive", "negative")

def predictOnDataFrame(df, review_column, model1, model2, model3, save_map):
    
    reviews = df[review_column].tolist()
    reviews = encodeReview(reviews, save_map)

    df['sentiment'] = makePrediction(reviews, model1, model2, model3)
    return df

if __name__=="__main__":
    save_map=loadEncoder()
    model1=load_model("models/RNN.h5")
    model2=load_model("models/GRU.h5")
    model3=load_model("models/LSTM.h5")
    while True:
        s=input()
        if s=='-1':
            break
        example=encodeReview(s)
        print("positive" if makePrediction(example) else "negative")