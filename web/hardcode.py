from flask import Flask, request
app = Flask(__name__)

hardcode = """
[{"keywords": ["divide-and-conquer method", "solves problems", "dynamic"], "sentence": "Dynamic programming, like the divide-and-conquer method, solves problems by combining the solutions to subproblems."}, {"keywords": ["computer code", "context refers", "programming", "tabular method"], "sentence": "Programming in this context refers to a tabular method, not to writing computer code."}, {"keywords": ["chapters", "divide-and-conquer algorithms partition", "original problem", "disjoint subproblems"], "sentence": "As we saw in Chapters 2 and 4, divide-and-conquer algorithms partition the problem into disjoint subproblems, solve the subproblems recursively, and then combine their solutions to solve the original problem."}, {"keywords": ["subproblems overlap"], "sentence": "In contrast, dynamic programming applies when the subproblems overlap."}, {"keywords": ["divide-and-conquer algorithm", "common subsubproblems"], "sentence": "In this context, a divide-and-conquer algorithm does more work than necessary, repeatedly solving the common subsubproblems."}, {"keywords": ["optimization problems"], "sentence": "We typically apply dynamic programming to optimization problems."}, {"keywords": ["optimization problems"], "sentence": "The sections that follow use the dynamic-programming method to solve some optimization problems."}, {"keywords": ["fewest total scalar multiplications"], "sentence": "Section 15.2 asks how we can multiply a chain of matrices while performing the fewest total scalar multiplications."}, {"keywords": ["common subsequence"], "sentence": "Section 15.4 then shows how to find the longest common subsequence of two sequences via dynamic programming."}, {"keywords": ["construct binary search trees"], "sentence": "Finally, Section 15.5 uses dynamic programming to construct binary search trees that are optimal, given a known distribution of keys to be looked up."}]
"""

@app.route('/')
def hello_world():
	return 'Hello World!'

@app.route('/summary', methods=['GET', 'POST'])
def summarize():
	return hardcode

if __name__ == '__main__':
	app.run()
