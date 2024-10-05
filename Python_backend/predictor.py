# -*- coding: utf-8 -*-
"""
Created on Sat Aug 17 23:03:18 2024

@author: avane
"""
import numpy as np
import pickle
import cleantext
import tensorflow
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import pad_sequences

def loadEncoder():
    with open("encode_map","rb") as handle:
        dat=handle.read()
    return pickle.loads(dat)

def cleanReview(review):
    review=cleantext.clean(review, clean_all= False, extra_spaces=True , stopwords=True ,lowercase=True ,numbers=True , punct=True)
    return review

def encodeReview(review, save_map):
    review=cleanReview(review)
    encoded_review=[1,]

    for word in review.split():

        if word in save_map:
            encoded_review.append(save_map[word])
        else:
            encoded_review.append(2)

    encoded_review=np.array(encoded_review)
    encoded_review=np.reshape(encoded_review, (1,len(encoded_review)))
    encoded_review=pad_sequences(encoded_review,maxlen=2697)

    return encoded_review

def makePrediction(review, model1, model2, model3):
    rnn_pred=1 if model1.predict(review)[0][0]>0.5 else 0
    gru_pred=1 if model2.predict(review)[0][0]>0.5 else 0
    lstm_pred=1 if model3.predict(review)[0][0]>0.5 else 0
    
    return "positive" if rnn_pred+gru_pred+lstm_pred>=2 else "negative"

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