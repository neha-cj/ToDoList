from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

# Connect to MongoDB Atlas
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["todo_db"]
tasks_collection = db["tasks"]

# Set up Flask app
app = Flask(__name__)
CORS(app)
tasks_collection.delete_many({ "date": { "$exists": False } })

# Render HTML with proper CSS/JS from /static/
@app.route('/')
def serve_index():
    return render_template('index.html')

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    selected_date= request.args.get("date")
    
    if not selected_date:
        return jsonify({"error":"Date id required"}),400
    tasks = []
    for task in tasks_collection.find({"date":selected_date}):
        tasks.append({
            "id": str(task["_id"]),
            "task": task["task"],
            "done": task.get("done", False),
            "date":task["date"]
        })
    return jsonify(tasks)

# Add new task
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task = data.get("task")
    date=data.get("date")

    if task and date:
        result = tasks_collection.insert_one({
            "task": task,
            "done": False,
            "date":date
        })
        return jsonify({
            "id": str(result.inserted_id),
            "task": task,
            "done": False,
            "date":date
        }), 201
    return jsonify({"error": "Task and date are required"}), 400

# Update task
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    update_fields = {}
    if 'task' in data:
        update_fields['task'] = data['task']
    if 'done' in data:
        update_fields['done'] = data['done']
    if not update_fields:
        return jsonify({"error": "Nothing to update"}), 400

    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_fields}
    )
    if result.matched_count:
        return jsonify({"message": "Task updated"}), 200
    return jsonify({"error": "Task not found"}), 404

# Delete task
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count:
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"error": "Task not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
