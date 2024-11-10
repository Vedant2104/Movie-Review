import requests
from bs4 import BeautifulSoup
import json, os
import pandas as pd

def scrapeReviews(soup, ImdbId):
    try:
        reviews = soup.find_all('div', {'class': 'imdb-user-review'})
    except:
        reviews = []
    
    data = {}
    data['ImdbId'] = ImdbId
    reviews_text = []
    
    for review in reviews:
        review_imdb = {}
        
        try:
            short_review = review.find('a', {'class': 'title'})
            review_imdb['short_review'] = short_review.string.strip()
        except:
            review_imdb['short_review'] = ""
        
        try:
            full_review = review.find('div', {'class': 'show-more__control'})
            review_imdb['full_review'] = full_review.string.strip()
        except:
            review_imdb['full_review'] = ""
        
        reviews_text.append(review_imdb)
    
    data['reviews'] = reviews_text
    return data

def scrap(movie_url, ImdbId, all_data, limit):
    if len(all_data) >= limit:
        return all_data
    
    print(movie_url)
    r = requests.get(headers={'User-Agent': 'Mozilla/5.0'}, url=movie_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    data = scrapeReviews(soup, ImdbId)
    all_data.extend(data['reviews'])
    
    if len(all_data) >= limit:
        return all_data[:limit]
    
    try:
        pagination_key = soup.find('div', {'class': 'load-more-data'})['data-key']
        next_url = f"https://www.imdb.com/title/{ImdbId}/reviews/_ajax?&paginationKey={pagination_key}"
        return scrap(next_url, ImdbId, all_data, limit)
    
    except Exception as e:
        print(e, "scraping done successfully")
        return all_data

def start_scraping(ImdbId, limit):
    movie_url = f"https://www.imdb.com/title/{ImdbId}/reviews/_ajax?"
    all_data = []
    reviews = scrap(movie_url, ImdbId, all_data, limit)
    
    return {
        'ImdbId': ImdbId,
        'reviews': reviews
    }



def make_review(ImdbId, limit):
    data = start_scraping(ImdbId, limit)
    #print(data)
    df = pd.DataFrame(data['reviews'])
    #print(df.head())
    
    df["reviews"] = df['short_review'] + df['full_review']
    df.drop(['short_review', 'full_review'], axis=1, inplace=True)
    return df

if __name__ == "__main__":
    df = make_review("tt0468569", 10)
    #print(df)