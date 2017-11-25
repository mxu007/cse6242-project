import csv
import json
from flask import Flask, render_template

app = Flask(__name__) 
#setting up an application whose name is app with Flask

# data = []
# with open('globalterrorismdb_0617dist.csv') as file:
# 	for row in csv.DictReader(file):
# 		data.append(row)

# GTD = json.dumps(data)

# GTD_attributes = [column_key for column_key in GTD[0].iteritems()]

GTD_attributes = [1, 2, 3]

# def SVM(data):
# 	return

# def regression(data):
# 	return

@app.route('/')   #main route
def index():
	return render_template('index.html', attribute = GTD_attributes)

@app.route('/drop_down_box')
def drop_down_box_options(selections):
	GTD_temp_analysis = []
	for j in selections:
		temp = []
		for i in GTD:
			temp.append(i[j])
		GTD_temp_analysis.append({j:temp}) #creating database by collecting all row values for the selected attribute/column

	result = ['a', 'b', 'c']

	# call the functions needed to the necessary analysis and store the final values in the array/dictionary result

	return render_template("index.html", analysis = result)



if __name__ == '__main__':
	app.run(host = 'localhost', port = 8000, debug = True)
