from flask import Flask, render_template, request
import json
import random
import datetime

app = Flask(__name__)


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


start_time = datetime.datetime.now()


@app.route('/')
def index():
    global start_time
    start_time = datetime.datetime.now()
    return render_template('index.html')


@app.route('/kill')
def kill():
    shutdown_server()
    return "Shutdown Successful", 418


@app.route('/get_data')
def get_data():
    global start_time
    speed = random.randint(100, 200)
    return json.dumps([(datetime.datetime.now() - start_time).seconds, speed])


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080, passthrough_errors=True)
