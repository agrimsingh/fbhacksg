from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

import json
import nltk
from textblob import TextBlob
import re


ignoreWords = ['such', 'of', 'and', 'the', 'a', 'is', 'for', 'but', 'by', 'thus', 'hence', 'therefore', 'an']


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
	sumsum = 0
	for c in s:
		if c == '.':
			sumsum += 1
	SENTENCES_COUNT = max(sumsum/3, 1)
	#print(str(SENTENCES_COUNT) + ' / ' + str(sumsum))

	parser = PlaintextParser.from_string(s, Tokenizer(LANGUAGE))
    #parser = PlaintextParser.from_file("sample3.txt", Tokenizer(LANGUAGE))
	stemmer = Stemmer(LANGUAGE)

	summarizer = Summarizer(stemmer)
	summarizer.stop_words = get_stop_words(LANGUAGE)

	sentences = summarizer(parser.document, SENTENCES_COUNT)
	return sentences

def splitSentence(s):
	printSafe(nltk.pos_tag(s))

def getKeywords(s):
	#s = getString()
	#printSafe(s)

	blob = TextBlob(s)
	#printSafe(blob.tags)
	#print('\n')
	nounList = blob.noun_phrases
	freqs = getFreqs(nounList)
	keys = list(freqs.keys())
	newKeys = []
	for i in range(0, len(keys)):
		res = removeUseless(keys[i])
		if res != None:
			newKeys.append(res)
	return newKeys
	#for i in range(1, len(freqs)):
	#	printSafe(str(i) + "\n : " + str(freqs[i]) + '\n')


	#for noun in nounList:
	#	printSafe(noun)

def removeUseless(key):
	global ignoreWords
	tokens = key.split(' ')
	start = 0
	end = len(tokens)-1
	while (start <= end and tokens[start] in ignoreWords):
		start += 1
	while (start <= end and tokens[end] in ignoreWords):
		end -= 1
	if (start <= end):
		tokens = tokens[start:end+1]
		return ' '.join(tokens)
	else:
		return None


def hello():
	print ('hello world')

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


def jsonFormat(results):
	arr = []
	for result in results:
		obj = {}
		obj['sentence'] = result[0]
		obj['keywords'] = result[1:]
		arr.append(obj)
	return json.dumps(arr)




if __name__ == '__main__':
	results = getResults(getString())
	print(jsonFormat(results))
	#for result in results:
	#	print(result)
	#	print('\n')
