from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
from utils import *

app = Flask(__name__)
CORS(app)

@app.before_request
def before():
    service_account = 'forest-fire-0d696deccda7c59d01@forest-fire-seecs.iam.gserviceaccount.com'
    service_account_key = "./secrets/forest-fire-seecs-3b1c9e5d460c.json"
    credentials = ee.ServiceAccountCredentials(service_account, service_account_key)
    ee.Initialize(credentials)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/test', methods=['GET', 'POST'])
def test():
    image_name = 'JAXA/ALOS/AW3D30/V2_2'

    # Define the visualization parameters.
    vis_params = {
        'bands': ['AVE_DSM', 'AVE_STK', 'AVE_MSK'],
        'min': 0,
        'max': 0.5,
        'gamma': [0.95, 1.1, 1]
    }

    url = image_to_map_id(image_name, vis_params)
    return jsonify(url), 200

if __name__ == '__main__':
    app.run()