import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, TextField, Divider } from '@mui/material';
import { ArcherContainer, ArcherElement, ArcherArrow } from 'react-archer';

function App() {

  //states for text field input
  const [referenceText, setReferenceText] = useState("");
  const [candidateText, setCandidateText] = useState("");

  //bertscore results state
  const [bertScoreResults, setBERTScoreResults] = useState({});

  //bertscore data present
  const [bertScoreDataPresent, setBERTScoreDataPresent] = useState(false);

  //hover states
  const [hoveredToken, setHoveredToken] = useState(null);

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
              label="Reference Text" 
              variant="outlined" 
              margin='normal' 
              fullWidth='true' 
              value={referenceText}
              onChange={handleReferenceTextChange}
            />
            <TextField 
              className="sentence-entry" 
              id="outlined-basic" 
              label="Candidate Text" 
              variant="outlined" 
              margin='normal' 
              fullWidth='true'
              value={candidateText}
              onChange={handleCandidateTextChange}
            />
          </div>
          <div className='buttonpanel'>
            <Button 
              className="submit-button" 
              variant="contained" 
              color="primary"
              onClick={getBERTResults}>Calculate and Visualize BERTScore</Button>
          </div>
        </div>
        <div className="bottompanel">
          {bertScoreDataPresent ?
            <div className='bottomsubpanel'>
              <ArcherContainer className='matchingdisplay'>
                <div className='matching-display-child'>
                  <div className='referencetokens'>
                    <div className="token-span-desc">
                      <h3>Reference Text Tokens</h3>
                    </div>
                    <div className="tokens">
                      {
                        bertScoreResults['reference_tokens'].map((token, index) => {
                          return (
                            <ArcherElement 
                              id={"reftoken_" + String(index)} 
                              relations={[{
                                targetId: "candtoken_" + String(bertScoreResults["recall_matchings"][index]),
                                targetAnchor: "top",
                                sourceAnchor: "bottom",
                                style: {
                                    strokeDasharray: '5,5', 
                                    strokeColor: (hoveredToken === null || hoveredToken === "reftoken_" + String(index)) ? 'rgba(30,176,11,1)' : 'rgba(30,176,11,0.1)'
                                }
                              }]}
                              >
                              <div 
                                key={index} 
                                className='token' 
                                onMouseOver={() => setHoveredToken("reftoken_" + String(index))} 
                                onMouseOut={() => setHoveredToken(null)}>
                                  <p className='token-text'>{token}</p>
                              </div>
                            </ArcherElement>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className='candidatetokens'>
                    <div className="token-span-desc">
                      <h3>Candidate Text Tokens</h3>
                    </div>
                    <div className="tokens">
                      {
                        bertScoreResults['candidate_tokens'].map((token, index) => {
                          return (
                            <ArcherElement
                              id={"candtoken_" + String(index)} 
                              relations={[{
                                targetId: "reftoken_" + String(bertScoreResults["precision_matchings"][index]),
                                targetAnchor: "bottom",
                                sourceAnchor: "top",
                                style: {strokeDasharray: '5,5', strokeColor: 
                                  (hoveredToken === null || hoveredToken === "candtoken_" + String([index])) ? 'rgba(176,19,11,1)' : 'rgba(176,19,11,0.1)'
                                }
                              }]}
                            >
                              <div 
                                key={index} 
                                className='token'
                                onMouseOver={() => setHoveredToken("candtoken_" + String(index))} 
                                onMouseOut={() => setHoveredToken(null)}>
                                  <p className='token-text'>{token}</p>
                              </div>
                            </ArcherElement>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className='more-info-div'>
                    {hoveredToken 
                      ? <div className='more-info-text'>
                          The {hoveredToken.split('_')[0] === "reftoken" ? "reference" : "candidate"} token 
                          <div className='token'>
                            <p className='token-text'>{
                              hoveredToken.split('_')[0] === "reftoken" 
                                ? bertScoreResults["reference_tokens"][parseInt(hoveredToken.split('_')[1])]
                                : bertScoreResults["candidate_tokens"][parseInt(hoveredToken.split('_')[1])]
                              }
                            </p>
                          </div>
                          {hoveredToken.split('_')[0] === "reftoken" ? "is recalled by "  : "recalls "}
                          the {hoveredToken.split('_')[0] === "reftoken" ? "candidate" : "reference"} token
                          <div className='token'>
                            <p className='token-text'>{
                              hoveredToken.split('_')[0] === "reftoken" 
                                ? bertScoreResults["candidate_tokens"][bertScoreResults["recall_matchings"][parseInt(hoveredToken.split('_')[1])]]
                                : bertScoreResults["reference_tokens"][bertScoreResults["precision_matchings"][parseInt(hoveredToken.split('_')[1])]]
                              }
                            </p>
                          </div>
                          with {hoveredToken.split('_')[0] === "reftoken" ? "recall" : "precision"} of 
                          <div className="more-info-score">{" " + String((hoveredToken.split('_')[0] === "reftoken" 
                            ? bertScoreResults["recall_matching_values"][parseInt(hoveredToken.split('_')[1])]
                            : bertScoreResults["precision_matching_values"][parseInt(hoveredToken.split('_')[1])]
                          ).toFixed(4))}
                          </div> 
                        </div> 
                      : <p className='more-info-ph'>Hover over a token to see more information.</p> }
                  </div>
                </div>
              </ArcherContainer>
              <Divider orientation='vertical' sx={{ borderRightWidth: 5 }}  variant='middle' flexItem />
              <div className='scoredisplay'>
                <h2>Scoring</h2>
                <div className='metricvalues'>
                  <h3 className='metric'>Recall: {bertScoreResults['recall']}</h3>
                  <h3 className='metric'>Precision: {bertScoreResults['precision']}</h3>
                  <h3 className='metric'>F1: {bertScoreResults['f1_score']}</h3>
                </div>
              </div>
            </div>
            : <div className='no-data-placeholder'><h3>Enter some text to see how BertScore works!</h3></div>}
          </div>
      </div>
    </div>
  );
}

export default App;
