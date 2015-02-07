from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/summary', methods=['GET', 'POST'])
def summarize():
    raw_text = request.form['text']
    return str(len(raw_text))

if __name__ == '__main__':
    app.run()