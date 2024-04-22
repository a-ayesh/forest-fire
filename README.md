# Forest Fire Prediction Website
---
## Project Setup
1. Setup a Conda venv
```shell
conda create -n forest-fire python=3.8
conda activate forest-fire
```
2. Install the following packages:
```shell
conda install -c conda-forge earthengine-api
conda install -c conda-forge flask
conda install -c conda-forge flask-cors
```
3. Run the Flask app and the client file in browser:
```shell
flask run
```
4. Authorize self at http://localhost:5000/auth
