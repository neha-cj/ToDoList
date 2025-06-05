from flask import Flask, request, jsonify , send_from_directory
from flask_cors import CORS

#creating a flask app instance; set static folder to serve frontend files from parent dir
app = Flask(__name__,static_folder='../')
#enable cross-origin resource sharing so frontend can call backend API from diff origins
CORS(app)
#in memory list
tasks = []
#route to serve the main forntend html file
@app.route('/')
def serve_index():
    return send_from_directory('../', 'index.html')

#serve any other static files requested by the browser
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../', path)


# API endpoint to get the list of tas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    # Return the current tasks list as JSON
    return jsonify(tasks)

# API endpoint to add a new task
@app.route('/tasks', methods=['POST'])
def add_task():
     # Parse JSON data from the POST request body
    data = request.json
    # Extract the 'task' value from the data
    task = data.get('task')


    if task:
        # Add the new task as a dictionary to the tasks list
        tasks.append({'task': task})
        return jsonify({'message': 'Task added successfully'}), 201
    return jsonify({'error': 'Task is required'}), 400

if __name__ == '__main__':
    app.run(debug=True)
