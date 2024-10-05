import pandas as pd
from scraper import start

def make_review(ImdbId, limit):

    start(ImdbId=ImdbId, limit=limit)
    df = pd.read_json(f"./reviews/reviews_{ImdbId}.json")

    for i in range(len(df)):
        df.loc[i, "reviews"] = str(df['reviews'][i]['short_review'] + df['reviews'][i]['full_review'])

    df.rename(columns={"reviews":"review"}, inplace=True)
    df.drop('ImdbId', axis=1, inplace=True)

    df.to_csv(f"tester_{ImdbId}.csv")
