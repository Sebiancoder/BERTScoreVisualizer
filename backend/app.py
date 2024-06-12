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
    pretrained_model_name = request.args.get('pretrained_model_name')

    bert_scorer = BERTScorer(pretrained_model_name=pretrained_model_name)

    bert_score_results = bert_scorer.score(
        reference_text,
        candidate_text,
        return_matchings=True
    )

    response = json.dumps(bert_scorer.format_matching_results(bert_score_results))

    return response

@app.route('/available_models', methods=['GET'])
@cross_origin()
def available_models():
    
    return json.dumps(BERTScorer.AVAILABLE_MODELS)

