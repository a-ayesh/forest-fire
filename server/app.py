from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/auth')
def authorize():
    import ee
    ee.Authenticate()
    return 'Authenticated!'

if __name__ == '__main__':
    app.run()