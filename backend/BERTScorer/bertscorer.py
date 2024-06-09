from transformers import BertTokenizer, BertModel
import torch
import numpy as np

class BERTScorer:

    def __init__(self, pretrained_model_name: str = 'bert-base-uncased'):

        self.bert_tokenizer = BertTokenizer.from_pretrained(pretrained_model_name)
        self.bert_model = BertModel.from_pretrained(pretrained_model_name)

    def get_bert_contextual_embeddings(self, sentence: str, return_tokens: bool = False) -> (np.ndarray, list):

        tokens = self.bert_tokenizer.tokenize(sentence)
        
        tokenized_sentence = self.bert_tokenizer(sentence, return_tensors="pt", padding=True, truncation=True)

        tokenized_sentence = {key: value.to(self.bert_model.device) for key, value in tokenized_sentence.items()}

        with torch.no_grad():

            bert_output = self.bert_model(**tokenized_sentence)

        contextual_token_embeddings = bert_output.last_hidden_state.squeeze(0)[1:-1, :]

        if return_tokens:

            return contextual_token_embeddings.detach().cpu().numpy(), tokens

        else:
        
            return contextual_token_embeddings.detach().cpu().numpy()

    def build_similarity_matrix(self, reference_embeddings: np.ndarray, candidate_embeddings: np.ndarray) -> np.ndarray:

        #normalize embeddings to simplify similarity matrix calculation
        norm_reference_embeddings = reference_embeddings / np.linalg.norm(reference_embeddings, axis=1, keepdims=True)
        norm_candidate_embeddings = candidate_embeddings / np.linalg.norm(candidate_embeddings, axis=1, keepdims=True)

        similarity_matrix = np.dot(norm_reference_embeddings, norm_candidate_embeddings.T)
    
    def score(self, reference: str, candidate: str, return_matchings: bool = False, similarity_matrix: np.ndarray = None) -> dict:

        reference_embeddings, reference_tokens = self.get_bert_contextual_embeddings(reference, return_tokens=True)
        candidate_embeddings, candidate_tokens = self.get_bert_contextual_embeddings(candidate, return_tokens=True)

        if similarity_matrix is None:

            similarity_matrix = self.build_similarity_matrix(reference_embeddings, candidate_embeddings)

        recall_matchings = np.argmax(similarity_matrix, axis=1)
        recall_matching_values = np.max(similarity_matrix, axis=1)

        precision_matchings = np.argmax(similarity_matrix, axis=0)
        precision_matching_values = np.max(similarity_matrix, axis=0)
        
        recall = np.sum(recall_matching_values) / recall_matching_values.shape[0]
        precision = np.sum(precision_matching_values) / precision_matching_values.shape[0]

        f1_score = 2 * (precision * recall) / (precision + recall)

        return_dict = {'precision': precision, 'recall': recall, 'f1_score': f1_score}

        if return_matchings:

            return_dict['recall_matchings'] = recall_matchings
            return_dict['recall_matching_values'] = recall_matching_values
            return_dict['precision_matchings'] = precision_matchings
            return_dict['precision_matching_values'] = precision_matching_values

        return return_dict