import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from BERTScoreVisualizer.bertscorer import BERTScorer
import numpy as np
import math

def test_bertscorer_calculations():

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

    print("Recall: ", bert_score_results['recall'])
    print("Precision: ", bert_score_results['precision'])
    print("F1 Score: ", bert_score_results['f1_score'])

    assert math.isclose(bert_score_results['recall'], 0.8, abs_tol=1e-5)
    assert math.isclose(bert_score_results['precision'], 0.8, abs_tol=1e-5)
    assert math.isclose(bert_score_results['f1_score'], 0.8, abs_tol=1e-5)

    print("BertScorer tests passed")

def test_bertscorer_core():

    bert_scorer = BERTScorer()

    reference = "The quick brown fox jumps over the lazy dog"
    candidate = "The quick brown fox jumps over the lazy dog"

    bert_score_results = bert_scorer.score(reference, candidate)

    print("Recall: ", bert_score_results['recall'])
    print("Precision: ", bert_score_results['precision'])
    print("F1 Score: ", bert_score_results['f1_score'])

    assert math.isclose(bert_score_results['recall'], 1.0, abs_tol=1e-5)
    assert math.isclose(bert_score_results['precision'], 1.0, abs_tol=1e-5)
    assert math.isclose(bert_score_results['f1_score'], 1.0, abs_tol=1e-5)

    print("BertScorer core tests passed")

if __name__ == "__main__":
    
    test_bertscorer_calculations()
    test_bertscorer_core()
    