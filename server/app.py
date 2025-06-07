from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://cjneha:AwjxIEw0NIzKOeJn@cluster0.5tixr5t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["todo_db"]
tasks_collection = db["tasks"]

# Set up Flask app
app = Flask(__name__, static_folder='../')
CORS(app)

# Serve frontend
@app.route('/')
def serve_index():
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../', path)

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = []
    for task in tasks_collection.find():
        tasks.append({
            "id": str(task["_id"]),
            "task": task["task"],
            "done": task.get("done",False)
        })
    return jsonify(tasks)

# Add new task
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task = data.get("task")
    if task:
        result = tasks_collection.insert_one({
            "task": task, 
            "done":False
            })
        return jsonify({
            "id": str(result.inserted_id),
            "task": task,
            "done": False
        }), 201
    return jsonify({"error": "Task is required"}), 400

# Delete task by MongoDB _id
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count:
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"error": "Task not found"}), 404

# Update task by MongoDB _id
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    update_fields ={}

    if 'task' in data:
        update_fields['task']= data['task']
    if 'done' in data:
        update_fields['done'] =data['done']

    if not update_fields:
        return jsonify({"error": "Task content required"}), 400

    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_fields}
    )

    if result.matched_count:
        return jsonify({"message": "Task updated"}), 200
    else:
        return jsonify({"error": "Task not found"}), 404



if __name__ == '__main__':
    app.run(debug=True)
