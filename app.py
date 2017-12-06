import csv
import json
import ast
from flask import Flask, Response, render_template, request, redirect, url_for, jsonify, make_response
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

app = Flask(__name__)
#setting up an application whose name is app with Flask

data = []
with open('gtd_regression2.csv') as file:
	for row in csv.DictReader(file):
		data.append(row)

file.close()

GTD = ast.literal_eval(json.dumps(data))

GTD_attributes = [column_key for column_key in GTD[0].keys()]
countries = []
for row in GTD:
	countries.append(row['country'])

#GTD_attributes = [1, 2, 3]
ML_techniques = ['Regression']
country = sorted(list(set(countries)))

@app.route('/')
@app.route('/index.html')
#both connect to explore page
def main():
	return render_template('index.html', attributes = GTD_attributes, techniques = ML_techniques, countries = country)

@app.route('/explore', methods = ['GET', 'POST'])
def drop_down_box_options():
	selections = []
	ML_techniques = None
	country = None
	if request.method == "POST":
		selections = request.json['GTD_attributes']
		ML_techniques = request.json['ML_techniques']
		country = request.json['country']
	print (selections, ML_techniques, country)
	#gives list of selected attributes in unicode

	# use them for determing the columns to extract (done below but commented out for testing). DON'T DO ANALYTICS HERE. Check the next app.route Flask call

	#GTD_temp_analysis = []
	#for j in selections:
	#	temp = []
	#	for i in GTD:
	#		temp.append(i[j])
	#	GTD_temp_analysis.append(temp)
	#creating database by collecting all row values for the selected attribute/column. Store the final dictionary/array in result
	#df = pd.DataFrame(GTD_temp_analysis, columns=GTD_attributes)
	result = selections
	#for j in selections:
	#	values = []
	#	for k in GTD:
	#		values.append(k[j])
	#	result.append(values)

	return redirect(url_for('Analytics',data = result, technique = ML_techniques, country = country)) #going back to explore page

@app.route('/Analytics', methods = ['GET', 'POST'])
def Analytics():
	selected_data = request.args.get('data')
	selected_technique = request.args.get('technique')
	selected_country = request.args.get('country')
	print (selected_data, selected_technique, country)
	GTD_final = technique(selected_data, selected_technique, selected_country)
	print (GTD_final)

	# call the functions needed to do the necessary analysis and store the functional values in the array/dictionary GTD_final, which will be JSONified and passed to d3

	# print GTD_final

	result = jsonify(GTD_final)
	# print type(GTD_final)    #GTD_final is dict
	# print type(result)     #result is <class 'flask.wrappers.Response'>
	return Response(json.dumps(GTD_final), mimetype = 'application/json')

def list(data):  #dummy function just for execution check
	clean_data = json.loads(str(data).replace("\'", '"')) #converting from unicode to string/number/dict
	# print type(clean_data)    #clean_data is dict
	# print clean_data
	array = []
	header = []
	for i, values in clean_data.items():
		print(header.append(i))
		array.append(values)
	# print type(result)    #result is dict
	# print result
	#result = {"key": "........""}
	return [header, array]

def Regression(data, country):
	table = []
	for row in GTD:
		entry = []
		for key, value in row.items():
			if (key == 'latitude') or (key == 'longitude') or (key == 'nkill') or (key == 'nwound'):
				entry.append(float(value))
			else:
				entry.append(value)
		table.append(entry)
	df = pd.DataFrame(table, columns = GTD[0].keys())
	df = df[df['country'] == country]
	df['casualty'] = df['nkill'] + df['nwound']
	X = df[data]
	y = df['casualty']
	Xy = pd.concat([X,y], axis = 1).dropna(how = 'any')

	# Note the difference in argument order
	model = smf.ols('casualty ~ {}'.format(data), data = Xy).fit()

	# Print out the statistics
	output = '{}'.format(model.params)
	return {'key': output}

def technique(data, technique, country):
	options = {
				#'sum': sum(data)
				 'Regression': Regression(data, country)
				# 'SVM': SVM(data),
				# 'LR':  LR(data),
				# 'PCA': PCA(data)
	}
	# uncomment to test other techniques
	# can consider using if else if ladder if implementation gets slow

	return options[technique]

# def SVM(data):
# 	return

@app.route('/data')
def get_data():
# 	data_file = open('gtd_regression2.csv')
# 	print data_file
# 	csv_file = csv.reader(data_file)
# 	print csv_file
# 	response = make_response(csv_file)
# 	response.headers["Content-Disposition"] = "attachment; filename=result.csv"
# 	return response
	with open('globalterrorismdb_0617dist.csv') as file:
		csv = file.read()
    	return Response(csv,mimetype="text/csv")





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
