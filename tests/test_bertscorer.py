import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bertscorer import BERTScorer
import numpy as np

def test_bertscorer():

    sample_similarity_matrix = np.array([
        [0.9, 0.1, 0.2], 
        [0.3, 0.8, 0.4], 
        [0.5, 0.6, 0.7]
    ])

    bert_scorer = BERTScorer()

    #basic tests
    assert bert_scorer.bert_tokenizer is not None
    assert bert_scorer.bert_model is not None

    #test metric construction
    bert_score_results = bert_scorer.score(
        'test', 
        'test', 
        similarity_matrix=sample_similarity_matrix
    )

    assert bert_score_results['recall'] == 0.9
    assert bert_score_results['precision'] == 0.8
    