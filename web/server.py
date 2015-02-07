from flask import Flask, request
import speechparser
import json
app = Flask(__name__)


def jsonFormat(results):
	arr = []
	for result in results:
		obj = {}
		obj['sentence'] = result[0]
		obj['keywords'] = result[1:]
		arr.append(obj)
	return json.dumps(arr)



def testFormat(results):
	sb = []
	for result in results:
		sb.append(result[0])
		sb.append('\n')
		for i in range(1, len(result)):
			sb.append(result[i])
			sb.append(', ')
		sb.append('\n\n')
	
	return ''.join(sb)


@app.route('/')
def hello_world():
	return 'Hello World!'

@app.route('/summary', methods=['GET', 'POST'])
def summarize():
	raw_text = request.form['text']
	results = speechparser.getResults(raw_text)
	message = jsonFormat(results)
	print(results)
	return message


	#return str(len(raw_text))

if __name__ == '__main__':
	app.run()
