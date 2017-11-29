import csv
import json
import ast
from flask import Flask, Response, render_template, request, redirect, url_for, jsonify

app = Flask(__name__) 
#setting up an application whose name is app with Flask

# data = []
# with open('globalterrorismdb_0617dist.csv') as file:
# 	for row in csv.DictReader(file):
# 		data.append(row)

# GTD = json.dumps(data)

# GTD_attributes = [column_key for column_key in GTD[0].iteritems()]

GTD_attributes = [1, 2, 3]
ML_techniques = ['SVM', 'PCA', 'LR', 'sum']

@app.route('/')   
@app.route('/index.html')   
#both connect to explore page
def main():
	return render_template('index.html', attributes = GTD_attributes, techniques = ML_techniques)

@app.route('/explore', methods = ['GET', 'POST'])
def drop_down_box_options():
	selections = []
	ML_techniques = None
	if request.method == "POST":
		selections = request.json['GTD_attributes']
		ML_techniques = request.json['ML_techniques']
	print selections, ML_techniques
	#gives list of selected attributes in unicode

	# use them for determing the columns to extract (done below but commented out for testing). DON'T DO ANALYTICS HERE. Check the next app.route Flask call

	# GTD_temp_analysis = []
	# for j in selections:
	# 	temp = []
	# 	for i in GTD:
	# 		temp.append(i[j])
	# 	GTD_temp_analysis.append({j:temp}) 
	#creating database by collecting all row values for the selected attribute/column. Store the final dictionary/array in result

	result = {'a':[1,2], 'b':[3,4], 'c':[5,6]}

	return redirect(url_for('Analytics',data = result, technique = ML_techniques)) #going back to explore page

@app.route('/Analytics', methods = ['GET', 'POST'])
def Analytics():
	selected_data = request.args.get('data')
	selected_technique = request.args.get('technique')
	print selected_data, selected_technique
	GTD_final = technique(selected_data, selected_technique)
	print GTD_final

	# call the functions needed to do the necessary analysis and store the functional values in the array/dictionary GTD_final, which will be JSONified and passed to d3

	# print GTD_final

	result = jsonify(GTD_final)
	# print type(GTD_final)    #GTD_final is dict
	# print type(result)     #result is <class 'flask.wrappers.Response'>
	return Response(json.dumps(GTD_final), mimetype = 'application/json')

def sum(data):  #dummy function just for execution check
	sum = 0
	result = {}
	# print type(data)   data is unicode
	clean_data = json.loads(str(data).replace("\'", '"')) #converting from unicode to string/number/dict
	# print type(clean_data)    #clean_data is dict
	# print clean_data  
	for i, values in clean_data.iteritems():
		# print values
		for j in values:
			sum = sum + j
		result[i] = sum
	# print type(result)    #result is dict
	# print result
	return result

def technique(data, technique):
	options = {
				'sum': sum(data)
				# ,
				# 'SVM': SVM(data),
				# 'LR':  LR(data),
				# 'PCA': PCA(data)
	}
	# uncomment to test other techniques
	# can consider using if else if ladder if implementation gets slow

	return options[technique]

# def SVM(data):
# 	return

# def LR(data):
# 	return

@app.route('/analysis.html')
def Analysis():
	return render_template('analysis.html')

@app.route('/dataset.html')
def Dataset():
	return render_template('dataset.html')

@app.route('/about.html')
def About():
	return render_template('about.html')

if __name__ == '__main__':
	app.run(host = 'localhost', port = 8000, debug = True)
