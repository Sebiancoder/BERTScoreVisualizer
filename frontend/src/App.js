import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, TextField, Divider, Select, FormControl, InputLabel, MenuItem, Alert, Popper, Dialog } from '@mui/material';
import { ArcherContainer, ArcherElement, ArcherArrow } from 'react-archer';

function App() {

  const BACKEND_URL = "https://bsv-backend--2xbnc8y.victoriousplant-d0803d1d.westus2.azurecontainerapps.io/";
  
  //available bert models
  const [availableModels, setAvailableModels] = useState();

  useEffect(() => {
    try {
      fetch(BACKEND_URL + "/available_models").then(
        response => {return response.json()}
      ).then(data => {
        console.log(data)
        setAvailableModels(data);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  //states for text field input
  const [referenceText, setReferenceText] = useState("");
  const [candidateText, setCandidateText] = useState("");
  const [selectedBertModel, setSelectedBertModel] = useState("bert-base-uncased");

  //is error message active state
  const [alertActive, setAlertActive] = useState("hidden");

  //bertscore results state
  const [bertScoreResults, setBERTScoreResults] = useState({});

  //bertscore data present
  const [bertScoreDataPresent, setBERTScoreDataPresent] = useState(false);

  //hover states
  const [hoveredToken, setHoveredToken] = useState(null);

  //state for credits dialog
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);

  const handleReferenceTextChange = (event) => {
    setReferenceText(event.target.value);
    setAlertActive("hidden");
  };

  const handleCandidateTextChange = (event) => {
    setCandidateText(event.target.value);
    setAlertActive("hidden");
  };

  const handleModelChange = (event) => {
    setSelectedBertModel(event.target.value);
  };
  
  async function getBERTResults() {
    
    //input validaation
    if (referenceText === "" || candidateText === "") {
      setAlertActive("visible");
      return;
    }
    
    const refTextArg = "reference_text=" + encodeURIComponent(referenceText);
    const candTextArg = "candidate_text=" + encodeURIComponent(candidateText);
    const bertModelArg = "pretrained_model_name=" + encodeURI(selectedBertModel)
    
    const BERTResponse = fetch(BACKEND_URL + "/bertscore?" + refTextArg + "&" + candTextArg + "&" + bertModelArg).then(
      response => {return response.json()}
    ).then(data => {
      console.log(data)
      setBERTScoreResults(data);
      setBERTScoreDataPresent(true);
    });
  }

  const getCurrentMoreInfoScore = () => {
    if (hoveredToken === null) {
      return null;
    }
    if (hoveredToken.split('_')[0] === "reftoken") {
      var currMoreInfoScore = bertScoreResults["recall_matching_values"][parseInt(hoveredToken.split('_')[1])];
    } else {
      var currMoreInfoScore = bertScoreResults["precision_matching_values"][parseInt(hoveredToken.split('_')[1])];
    }

    return currMoreInfoScore;
  }

  return (
    <div className="App">
      <div className='headerDiv'>
        <header className="header">BERTScore Visualizer</header>
        <Button className='creditsButton' variant='contained' color='secondary' onClick={() => {setCreditsDialogOpen(true)}}>About</Button>
      </div>
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
            <div className='entry-bottom'>
              <FormControl sx={{ m: 1, width: 240 }} size='small'>
              <InputLabel id="demo-simple-select-label">Model</InputLabel>
                <Select label="Model" onChange={handleModelChange} defaultValue={"bert-base-uncased"}>
                {availableModels ? 
                  availableModels.map((model, index) => {
                    return (
                      <MenuItem key={index} value={model}>{model}</MenuItem>
                    )
                  })
                  : <option value="bert-base-uncased">bert-base-uncased</option>
                }
              </Select>
              </FormControl>
              <Alert severity='warning' style={{visibility: alertActive}}>
                Please enter both Reference and Candidate Text.
              </Alert>
            </div>
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
                            <div>
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
                                id={'reftoken' + String(index)}
                                onMouseOver={() => setHoveredToken("reftoken_" + String(index))} 
                                onMouseOut={() => setHoveredToken(null)}
                                style={(bertScoreResults["unmatched_reference_tokens"].includes(index)) ? {border: "solid", "border-color": "#d12626"} : {}}>
                                  <p className='token-text'>{token}</p>
                              </div>
                            </ArcherElement>
                            <Popper open={(hoveredToken === "reftoken_" + String(index)) && bertScoreResults["unmatched_reference_tokens"].includes(index)} 
                            anchorEl={document.getElementById("reftoken" + String(index))} placement='top'>
                            <div className='verbosePopperDivUpsideDown'>
                              <p className='popper-text'> This reference token is unmatched.</p>
                            </div>
                            </Popper>
                            </div>
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
                            <div>
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
                                id={'candtoken' + String(index)}
                                onMouseOver={() => setHoveredToken("candtoken_" + String(index))} 
                                onMouseOut={() => setHoveredToken(null)}
                                style={(bertScoreResults["unmatched_candidate_tokens"].includes(index)) ? {border: "solid", "border-color": "#d12626"} : {}}>
                                  <p className='token-text'>{token}</p>
                              </div>
                            </ArcherElement>
                            <Popper open={(hoveredToken === "candtoken_" + String(index)) && bertScoreResults["unmatched_candidate_tokens"].includes(index)} 
                              anchorEl={document.getElementById("candtoken" + String(index))} placement='bottom'>
                              <div className='verbosePopperDiv'>
                                <p className='popper-text'> This candidate token is unmatched.</p>
                              </div>
                            </Popper>
                          </div>
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
                          <div className="more-info-score" style={{"backgroundColor": ["hsl(",((getCurrentMoreInfoScore() * 120) - 30).toString(10),",100%,50%)"].join("")}}>
                            {getCurrentMoreInfoScore().toFixed(4)}
                          </div> 
                        </div> 
                      : <p className='more-info-ph'>Hover over a token to see more information.</p> }
                  </div>
                </div>
              </ArcherContainer>
              <Divider orientation='vertical' sx={{ borderRightWidth: 5 }}  variant='middle' flexItem />
              <div className='scoredisplay'>
                <h2>Overall Scoring</h2>
                <div className='metricvalues'>
                  <div className='metricdiv'><h3 className='metric'>Recall: {bertScoreResults['recall']}</h3></div>
                  <div className='metricdiv'><h3 className='metric'>Precision: {bertScoreResults['precision']}</h3></div>
                  <div className='metricdiv'><h3 className='metric'>F1: {bertScoreResults['f1_score']}</h3></div>
                </div>
              </div>
            </div>
            : <div className='no-data-placeholder'><h3>Enter some text to see how BertScore works!</h3></div>}
          </div>
      </div>
      <Dialog open={creditsDialogOpen} onClose={() => setCreditsDialogOpen(false)}>
        <div className='creditsDialog'>
        <p>BERTScoreVisualizer is a tool to visualize the inner workings of the BERTScore automatic evaluation metric. For the original BERTScore paper, click <a href="https://arxiv.org/abs/1904.09675">here.</a></p>
        <p>Originally Developed by Sebastian Jaskowski.</p> 
        <p>Credit for Favicon: <a href="https://www.flaticon.com/free-icons/matching" title="matching icons">Matching icons created by Three musketeers - Flaticon</a></p>
        <p>BERTScoreVisualizer is powered by:</p>
        <img className='shield' src='https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white'/>
        <img className='shield' src='https://img.shields.io/badge/-HuggingFace-FDEE21?style=for-the-badge&logo=HuggingFace&logoColor=black'/>
        <img className='shield' src='https://img.shields.io/badge/microsoft%20azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white'/>
        <img className='shield' src='https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white'/>
        <img className='shield' src='https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB'/>
        </div> 
      </Dialog>
    </div>
  );
}

export default App;
