from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

import nltk
from textblob import TextBlob
import re

def tokenize(s):
	tokens = s.split(" ")
	for i in range(0,len(tokens)):
		tokens[i] = tokens[i].lower()
	return tokens

def getFreqs(tokens):
	freqs = {}
	for token in tokens:
		if token in freqs:
			freqs[token] += 1
		else:
			freqs[token] = 1
	return freqs

def getRevFreqs(tokens):
	freqs = getFreqs(tokens)
	return reverseFreqs(freqs)

def reverseFreqs(freqs):
	length = 0
	for key in freqs:
		val = freqs[key]
		length = max(val, length)

	rev = [0]*(length+1)
	for i in range(0, length+1):
		rev[i] = []

	for key in freqs:
		rev[freqs[key]].append(key)

	return rev


def freqAnalyse(s):
	tokens = tokenize(s)
	freqs = getFreqs(tokens)
	#print(freqs)
	for i in range(1, len(freqs)):
		print(str(i) + "\n : " + str(freqs[i]) + '\n')

def getString():
	f = open('sample3.txt')
	s = f.read()
	f.close()
	return s

def tokenizer(s):
	tokenizer = colouredtext.SentenceTokenizer()
	sentences = (tokenizer.segment_text(s))
	for sentence in sentences:
		print(sentence)
		print('\n')

def printSafe(s):
	#return s
	s = str(s).encode('ascii', 'ignore')
	s = s.decode('ascii')
	print(s)

def niceify(s):
	s = re.sub("[^\w\s.,\-]", '', s)
	return s


def getSentences(s):
	LANGUAGE = "english"
	SENTENCES_COUNT = 10

	parser = PlaintextParser.from_string(s, Tokenizer(LANGUAGE))
    #parser = PlaintextParser.from_file("sample3.txt", Tokenizer(LANGUAGE))
	stemmer = Stemmer(LANGUAGE)

	summarizer = Summarizer(stemmer)
	summarizer.stop_words = get_stop_words(LANGUAGE)

	sentences = summarizer(parser.document, SENTENCES_COUNT)
	return sentences



def getKeywords(s):
	#s = getString()
	#printSafe(s)

	blob = TextBlob(s)
	#printSafe(blob.tags)
	#print('\n')
	nounList = blob.noun_phrases
	freqs = getFreqs(nounList)
	return freqs.keys()
	#for i in range(1, len(freqs)):
	#	printSafe(str(i) + "\n : " + str(freqs[i]) + '\n')


	#for noun in nounList:
	#	printSafe(noun)



def getResults(s):
	results = []

	sentences = getSentences(s)
	for sentence in sentences:
		strSentence = sentence._text
		sentenceResult = [strSentence]
		keywords = getKeywords(strSentence)
		for keyword in keywords:
			sentenceResult.append(keyword)
		results.append(sentenceResult)
	return results

"""
results = getResults(getString())

for result in results:
	print(result)
	print('\n')
"""