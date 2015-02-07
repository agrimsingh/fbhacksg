import nltk

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
	
	return reverseFreqs(freqs)

def reverseFreqs(freqs):
	length = 0
	for key in freqs:
		val = freqs[key]
		length = max(val, length)

	rev = [0]*(length+1)
	for i in range(0, length+1):
		rev[i] = []

	print(len(rev))
	for key in freqs:
		rev[freqs[key]].append(key)

	return rev


def main():
	f = open('sample.txt')
	s = f.read()
	tokens = tokenize(s)
	freqs = getFreqs(tokens)
	#print(freqs)
	for i in range(1, len(freqs)):
		print str(i) + "\n : " + str(freqs[i]) + '\n'


main()