const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");


function loadTasks() {
    fetch("http://127.0.0.1:5000/tasks")
        .then(res => {
            console.log(res);
            return res.json()
        })
        .then(data => {
            listContainer.innerHTML = "";
            data.forEach(item => {
                let li = document.createElement("li");
                li.innerHTML = item.task;
                li.setAttribute("data-id", item.id);

                // task text span (editable)
                let taskSpan = document.createElement("span");
                taskSpan.textContent = item.task;
                taskSpan.classList.add("task-text");
                li.appendChild(taskSpan);

                // edit button
                let editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.classList.add("edit-btn");
                li.appendChild(editBtn);

                //delete button
                let deletespan = document.createElement("span");
                deletespan.innerHTML = "\u00d7";
                deletespan.classList.add("delete-btn");
                li.appendChild(deletespan);

                listContainer.appendChild(li);
            });
        });
}

function addTask(){
    const task =inputBox.value.trim();
    if(task === ''){
        alert("oops! you have to write something to add task");
        return;
    }
    fetch("http://127.0.0.1:5000/tasks",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({task: task})
    })
    .then(() =>{
        inputBox.value= "";
        loadTasks();
    });
    
}

// Handle clicks on Edit and Delete buttons
listContainer.addEventListener("click", function (e) {
    const li = e.target.parentElement;
    const taskId = li.getAttribute("data-id");

    if (e.target.classList.contains("edit-btn")) {
        const taskSpan = li.querySelector(".task-text");

        // replace text span with input box
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskSpan.textContent;
        input.classList.add("edit-input");

        li.replaceChild(input, taskSpan);
        e.target.textContent = "Save";

        e.target.onclick = function () {
            const updatedTask = input.value.trim();
            if (!updatedTask) {
                alert("Task cannot be empty");
                return;
            }
            // send PUT request to update task
            fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: updatedTask }),
            }).then(() => {
                loadTasks();
            });
        };
    } else if (e.target.classList.contains("delete-btn")) {
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: "DELETE",
        }).then(() => loadTasks());
    } else if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    }
});
document.addEventListener("DOMContentLoaded",loadTasks);
