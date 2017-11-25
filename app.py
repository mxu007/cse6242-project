import redis
from flask import Flask, render_template

app = Flask(__name__) 
#setting up an application whose name is app with Flask

db = redis.StrictRedis('localhost', 8000, 0)
# creating a Redis database to be accessed at www.localhost:8000 
# using the first available database (0)

@app.route('/')   #main route
def main():
	return render_template('index.html')
