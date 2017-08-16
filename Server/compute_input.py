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
    fields = ['text', 'category']
    # get data here
    test_data = pd.read_csv('stanford_test_data2.csv', usecols=fields)

    pipeline = Pipeline(steps=[
        ('bow', CountVectorizer(analyzer=clean_space)),
        ('tfidf', TfidfTransformer()),
        ('classifer', MultinomialNB())
    ])

    pipeline.fit(test_data['text'],test_data['category'])
    # Fit
    lines_sum = pipeline.predict([line])

    #return the sum to the output stream
    print(lines_sum[0])

#start process
if __name__ == '__main__':
    main()
