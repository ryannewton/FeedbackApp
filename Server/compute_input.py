import sys, json, string
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfTransformer, CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

def clean_space(sentence):
    nopunc = [char for char in sentence if char not in string.punctuation]
    nopunc = ''.join(nopunc)
    return [word.lower() for word in nopunc.split() if word.lower() not in stopwords.words('english')]

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    line = read_in()
    # Parse data
    fields = ['text', 'category']
    test_data = pd.read_csv('stanford_training_data.csv', usecols=fields)

    # Create model
    pipeline = Pipeline(steps=[
        ('bow', CountVectorizer(analyzer=clean_space)),
        ('tfidf', TfidfTransformer()),
        ('classifer', MultinomialNB())
    ])
    # Train model
    pipeline.fit(test_data['text'],test_data['category'])

    # Predict
    predicted_category_array = pipeline.predict([line])

    print(predicted_category_array[0])

#start process
if __name__ == '__main__':
    main()
