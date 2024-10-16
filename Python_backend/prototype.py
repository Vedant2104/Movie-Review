import streamlit as st
import pandas as pd
import pickle
from predictor import loadEncoder, encodeReview, makePrediction, cleanReview
from scraper import start
from pre_process import make_review
from keras.models import load_model

def create_container_with_color(id, color="#E4F2EC"):

    plh = st.container()
    html_code = """<div id = 'my_div_outer'></div>"""
    st.markdown(html_code, unsafe_allow_html=True)

    with plh:
        inner_html_code = """<div id = 'my_div_inner_%s'></div>""" % id
        plh.markdown(inner_html_code, unsafe_allow_html=True)

    chat_plh_style = """
        <style>
            div[data-testid='stVerticalBlock']:has(div#my_div_inner_%s):not(:has(div#my_div_outer)) {
                background: %s;
                
                border-radius: 10px;
                padding: 4px;
            };
        </style>
        """
    chat_plh_style = chat_plh_style % (id, color)

    st.markdown(chat_plh_style, unsafe_allow_html=True)
    return plh

@st.cache_resource
def load_models():
    model1 = load_model("models/RNN.h5")
    model2 = load_model("models/GRU.h5")
    model3 = load_model("models/LSTM.h5")
    return model1, model2, model3

@st.cache_resource
def load_dictionary():
    return loadEncoder()

@st.cache_resource
def read_csv(path):
    df = pd.read_csv(path)
    if "sentiment" not in df:
        df.insert(1, "sentiment", value=None)
    return df

if 'df' not in st.session_state:
    df = read_csv("tester.csv")
    st.session_state['df']=df
if 'movie_id' not in st.session_state:
    st.session_state['movie_id']=''

dictionary = load_dictionary()
model1, model2, model3 = load_models()

st.sidebar.header("Options")
option = st.sidebar.radio("Choose", ["Dataset Sentiment Analysis", "Comment Sentiment Analysis", "Download"])

if option == "Comment Sentiment Analysis":
    review = st.text_input("Enter a Comment")
    if st.button("Analyse"):
        if review=='':
            st.write("Enter a string to analyse")
        else:
            review = encodeReview(review, dictionary)
            result = makePrediction(review, model1, model2, model3)
            result = "The comment is " + result
            st.write(result)

elif option == "Dataset Sentiment Analysis":
    st.header("Sentiment of comments of Movie X")
    movie = st.text_input("Enter the IMDB ID for the movie")
    num_review = st.slider("Number of reviews", 10, 50, 10, 1)
    if st.button("Give analysis"):
        make_review(movie, num_review)
        df = read_csv(f"tester_{movie}.csv")
        st.session_state['df']=df

    df=st.session_state['df']

    for row in range(num_review):
        if df['sentiment'][row]==None:
            review = df['review'][row]
            review = encodeReview(review, dictionary)
            result = makePrediction(review, model1, model2, model3)
            df.loc[row, "sentiment"]=result
            st.session_state['df'] = df

        if df['sentiment'][row]=="positive":
            container = create_container_with_color(row, color="rgba(0, 200, 0, 0.5)")
            container.write(cleanReview(df['review'][row]))
        else:
            container = create_container_with_color(row, color="rgba(200,0, 0, 0.5)")
            container.write(cleanReview(df['review'][row]))

        if container.button("Positive", key=row):
            df.loc[row, "sentiment"]="positive"
            st.session_state['df']=df

        if container.button("Negative", key=500-row):
            df.loc[row, "sentiment"]="negative"
            st.session_state['df']=df

elif option == "Download":
    df = st.session_state['df']
    st.write(df)
