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
    
    const BERTResponse = await fetch("http://localhost:5000/bertscore?" + refTextArg + "&" + candTextArg);

    

  }

  return (
    <div className="App">
      <header className="header">BERTScore Visualizer</header>
      <div className="main">
        <div className="leftpanel">
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
          <Button className="submit-button" variant="contained" color="primary" onClick={getBERTResults}>Calculate and Visualize BERTScore</Button>
        </div>
        <div className="rightpanel">
        
        </div>
      </div>
    </div>
  );
}

export default App;
