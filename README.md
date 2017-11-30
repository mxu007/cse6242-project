# CSE6242-project

CSE 6242 course project on helping data scientists better analyse and visualize the impacts of world terrorism

By Cooper Colglazier, Minghan Xu, Huaiwei Sun, Eugene Kang, James Lee and Vineet Vinayak Pasupulety

## Required Dependencies

- Please download the Flask library in order to use our application. In Ubuntu you can do this by running the below line in terminal:

```
pip install flask 
```
## Installation

- You can choose to download the entire zip file for this repository to your system or use terminal:

```
git clone https://github.com/ccolg/cse6242-project.git
```

- Download the GTD dataset from [this website](https://www.kaggle.com/START-UMD/gtd/data). We also recommend downloading the [GTD codebook](https://www.start.umd.edu/gtd/downloads/Codebook.pdf) that helps understand the various columns/attributes of the data - this would help you in picking the most relevant characteristics for your analysis.

- Store the dataset in the main directory of the repository's folder (i.e. inside the folder cse6242-project). If the csv downloaded has a name other than *globalterrorismdb_0617dist.csv*, please change the file name to the same to avoid errors while running our implementation.

- Open terminal inside the cse6242-project folder. Run the program *app.py* in python:
```
python app.py
```
- If flask has been installed as stated above and there are no other errors (hopefully!), then you should see something like this in your terminal:
```
* Running on http://localhost:8000/ (Press CTRL+C to quit)
* Restarting with stat
* Debugger is active!
* Debugger PIN: xxx-xxx-xxx
```
- Now open a browser of your choice (we like Firefox and Chrome), and type in http://localhost:8000/ to your search bar. You should have reached the landing page of the project. Congratulations!

## Experimenting

- To analyse the data in the way you want, we have setup 2 panes. 1 pane is at the top of the page and is a year slider. You can move the edges of the slider, and the slider as a whole over the range of years you want to analyse. 

- The second pane is at the bottom left that allows you to select multiple parameters(column values) from the dataset to analyse and the Machine Learning technique to analyse (we plan on allowing users to create their models, that is for future work!). 

- When you are done with your selections, press the submit button. You should now have some interesting visualizations of correlations between parameters you have chosen. Also the map gets altered based on the year chosen. We plan to incorporate country choice and allow users to mouseover-click particular dots on the map to see a summary of the event at that particular location (all future work!)

Happy Analysing!

If you find errors with our implementation, please submit a pull request on our Github page. If you want to build-upon our work, fork us (and star us if you appreciate our work!).

## Potential Errors
```
AttributeError: 'dict' does not have function iteritems()
```
- This is due to the server being written in Python 2.7 (we will offer support for Python 3+ in the future). If you must correct it, then change iteritems() to items() (make other changes as necessary to convert from Python 2 to 3) 
