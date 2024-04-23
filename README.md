# Forest Fire Prediction Website
---
## Project Setup
1. Setup GEE project
2. Create a GEE service account
3. Create a new service account JSON private key 
4. Setup a Conda venv
```shell
conda create -n forest-fire python=3.8
conda activate forest-fire
```
5. Install the following packages:
```shell
conda install -c conda-forge earthengine-api
conda install -c conda-forge flask
conda install -c conda-forge flask-cors
```
6. Add JSON key to `./secrets` directory
7. Update `service_account` under:
```shell
@app.before_request
def before():
    service_account = 'example@example-project.iam.gserviceaccount.com'
    service_account_key = "./secrets/private_key.json"
    credentials = ee.ServiceAccountCredentials(service_account, service_account_key)
    ee.Initialize(credentials)
```
8. Run the Flask app and the client file in browser:
```shell
flask run
```
