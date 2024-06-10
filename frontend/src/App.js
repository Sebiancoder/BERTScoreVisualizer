import './App.css';
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

function App() {

  //states for text field input
  const [referenceText, setReferenceText] = useState("");
  const [candidateText, setCandidateText] = useState("");

  //bertscore results state
  const [bertScoreResults, setBERTScoreResults] = useState({});

  //bertscore data present
  const [bertScoreDataPresent, setBERTScoreDataPresent] = useState(false);

  const handleReferenceTextChange = (event) => {
    setReferenceText(event.target.value);
  };

  const handleCandidateTextChange = (event) => {
    setCandidateText(event.target.value);
  };
  
  async function getBERTResults() {

    const refTextArg = "reference_text=" + encodeURIComponent(referenceText);
    const candTextArg = "candidate_text=" + encodeURIComponent(candidateText);
    
    const BERTResponse = fetch("http://localhost:5000/bertscore?" + refTextArg + "&" + candTextArg).then(
      response => {return response.json()}
    ).then(data => {
      console.log(data)
      setBERTScoreResults(data);
      setBERTScoreDataPresent(true);
    });

  }

  return (
    <div className="App">
      <header className="header">BERTScore Visualizer</header>
      <div className="main">
        <div className="toppanel">
          <div className='entrypanel'>
            <TextField 
              className="sentence-entry" 
              id="outlined-basic" 
              label="Enter Reference Text" 
              variant="outlined" 
              margin='normal' 
              fullWidth='true' 
              value={referenceText}
              onChange={handleReferenceTextChange}
            />
            <TextField 
              className="sentence-entry" 
              id="outlined-basic" 
              label="Enter Candidate Text" 
              variant="outlined" 
              margin='normal' 
              fullWidth='true'
              value={candidateText}
              onChange={handleCandidateTextChange}
            />
          </div>
          <div className='buttonpanel'>
            <Button className="submit-button" variant="contained" color="primary" onClick={getBERTResults}>Calculate and Visualize BERTScore</Button>
          </div>
        </div>
        <div className="bottompanel">
          {bertScoreDataPresent ?
            <div className='bottomsubpanel'>
              <div className='matchingdisplay'>
                <div className='referencetokens'>
                  <h3>Reference Text Tokens</h3>
                  {
                    bertScoreResults['reference_tokens'].map((token, index) => {
                      return <span key={index} className='token'>{token}</span>
                    })
                  }
                </div>
                <div className='candidatetokens'>
                  <h3>Candidate Text Tokens</h3>
                  {
                    bertScoreResults['candidate_tokens'].map((token, index) => {
                      return <span key={index} className='token'>{token}</span>
                    })
                  }
                </div>
              </div>
              <div className='scoredisplay'>
                <h2>Scoring</h2>
                <div>
                  <h3>Recall: {bertScoreResults['recall']}</h3>
                  <h3>Precision: {bertScoreResults['precision']}</h3>
                  <h3>F1: {bertScoreResults['f1_score']}</h3>
                </div>
              </div>
            </div>
            : <div className='no-data-placeholder'><h3>Enter some test to see results!</h3></div>}
          </div>
      </div>
    </div>
  );
}

export default App;
