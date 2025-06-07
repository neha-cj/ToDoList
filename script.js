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
                const taskDiv = document.createElement("div");
                taskDiv.className="task";

                const taskText=document.createElement("span");
                //taskText.contentEditable="true";
                taskText.className="task-text";
                taskText.textContent = item.task;

                const buttonDiv =document.createElement("div");
                buttonDiv.className="task-buttons";

                const editbtn =document.createElement("button");
                editbtn.innerHTML='<i class="fa fa-pencil"></i>'
                editbtn.className="editbtn";
                
                const deleteBtn = document.createElement("button");
                deleteBtn.innerHTML='<i class="fa fa-trash"></i>'
                deleteBtn.className="deletebtn";

                buttonDiv.appendChild(editbtn);
                buttonDiv.appendChild(deleteBtn);

                taskDiv.appendChild(taskText);
                taskDiv.appendChild(buttonDiv);

                taskDiv.setAttribute("data-id", item.id);

                listContainer.appendChild(taskDiv);
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
    const buttondiv = e.target.parentElement;
    const div=buttondiv.parentElement;
    const taskId = div.getAttribute("data-id");

    if (e.target.classList.contains("editbtn")) {
        const taskSpan = div.querySelector(".task-text");

        // replace text span with input box
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskSpan.textContent;
        input.classList.add("edit-input");

        div.replaceChild(input, taskSpan);
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
    } else if (e.target.classList.contains("deletebtn")) {
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: "DELETE",
        }).then(() => loadTasks());
    } else if (e.target.classList.contains("task-text")) {
        e.target.classList.toggle("checked");
    }
});
document.addEventListener("DOMContentLoaded",loadTasks);
