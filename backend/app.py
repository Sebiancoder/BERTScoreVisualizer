from flask import Flask, request
from BERTScorer.bertscorer import BERTScorer

app = Flask(__name__)

@app.route('/bertscore', methods=['GET'])
def bertscore():
    
    print("endpoint hit")
    
    reference_text = request.args.get('reference_text')
    candidate_text = request.args.get('candidate_text')

    bert_scorer = BERTScorer()

    bert_score_results = bert_scorer.score(
        reference_text,
        candidate_text,
        return_matchings=True
    )

    return bert_score_results

