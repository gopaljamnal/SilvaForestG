import csv
import json
import os.path
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)


@app.route('/readjson', methods=['GET'])
def readjson():
    with open('./frontend/src/rf_json_trees.json', mode='r') as f:
        data = json.loads(f.read())
        return jsonify(data)


@app.route('/energy')
def energy_json():
    with open('./frontend/src/energy.json', mode= 'r') as f:
        data = json.loads(f.read())
        return jsonify(data)


@app.route('/sankey')
def sankey_csv():
    with open('./backend/data/test_sankey.csv', mode='r') as f:
        data =  csv.reader(f.read())

        return jsonify(data)
@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

# @app.route('/sankey_data')
# def sankey_data():
#     data =  pd.read_csv('./backend/data/test_sankey.csv')
#
#     for i in data.index:
#         return print(i)
#
# sankey_data()

if __name__ == '__main__':
    app.run(debug=True)
