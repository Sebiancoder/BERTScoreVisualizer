from flask import Flask, request
from flask_cors import CORS, cross_origin
from BERTScorer.bertscorer import BERTScorer
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/bertscore', methods=['GET'])
@cross_origin()
def bertscore():
    
    reference_text = request.args.get('reference_text')
    candidate_text = request.args.get('candidate_text')

    bert_scorer = BERTScorer()

    bert_score_results = bert_scorer.score(
        reference_text,
        candidate_text,
        return_matchings=True
    )

    response = json.dumps(bert_scorer.format_matching_results(bert_score_results))

    return response



