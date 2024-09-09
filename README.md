# BERTScoreVisualizer

![alt text](docs/img1.png)

BERTScoreVisualizer is a React Web App that allows you to visualize how the BERTScore metric is scoring your generated text. It provides a visualization of the matching between tokens in the generated text to tokens in the reference text.

For a more thorough explanation of how the software works and its use cases, please [see our paper on Arxiv]().

[Click here to see a video demo of BERTScoreVisualizer](https://drive.google.com/file/d/1X0SjDpe928YHPZhadwaPLFO55gVIlWeP/view)

Finally, our application is live at the following link: [sebiancoder.github.io/BERTScoreVisualizer](https://sebiancoder.github.io/BERTScoreVisualizer)

## Local Setup

If you wish to run BERTScoreVisualizer locally, you can follow the following steps.

BERTSoreVisualizer consists of a flask backend and a React frontend.

To initialize the backend, navigate to the `backend` folder and install all required dependencies with:

`pip install -r requirements.txt`

Then you can launch the backend with:

`flask run`

To get the frontend working, navigate to the `frontend` folder and run:

`npm install`

to install all the required frontend dependencies. Finally, to start the frontend, run:

`npm start`

## Citation

If you find our repository useful, please cite our work.

```c
@article{jaskowski2024BERTScoreVisualizer,
  title={BERTScoreVisualizer: A Web Tool for Understanding Simplified Text
Evaluation with BERTScore},
  author={Sebastian Jaskowski and Sahasra Chava and Agam Shah},
  journal={},
  year={2024}
}
```

## Contact

If you have any questions or concerns regarding this work, please contact Sebastian Jaskowski (sjaskowski3[at]gatech[dot]edu)

## Acknowledgements

This project provides a visualization for the BERTScore Automatic Evaluation Metric, building on the work of the original BERTScore paper. You can check out the original BERTScore paper [here](https://arxiv.org/abs/1904.09675), as well as their [GitHub Repository](https://github.com/Tiiiger/bert_score?tab=readme-ov-file) for the official python package.
