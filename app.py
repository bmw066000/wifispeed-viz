from flask import Flask, render_template, request
from subprocess import Popen, PIPE
import json
import datetime
import csv
import sys
import time
import copy
import os

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
    ON_POSIX = 'posix' in sys.builtin_module_names

    log_path = "./speed_log.csv"
    if not os.path.isfile(log_path):
        with open(log_path, 'w') as log_file:
            writer = csv.writer(log_file)
            writer.writerow(['time', 'ping', 'download', 'upload'])

    p = Popen(['/anaconda/bin/speedtest-cli', '--simple'], stdout=PIPE, bufsize=1, close_fds=ON_POSIX)
    output, error = p.communicate()
    retval = [0, 0, 0]
    if p.returncode == 0:
        data_entry = [float(line.strip().split()[1]) for line in output.splitlines()]
        data_entry.insert(0, (datetime.datetime.now() - start_time).seconds)
        retval = copy.deepcopy(data_entry)
        print(data_entry)
        data_entry[0] = time.time()
        with open(log_path, 'a') as log_file:
            writer = csv.writer(log_file)
            writer.writerow(data_entry)
    return json.dumps(retval)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080, passthrough_errors=True)
