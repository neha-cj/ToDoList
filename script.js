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

                let span = document.createElement("span");
                span.innerHTML = "\u00d7";
                li.appendChild(span);
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
listContainer.addEventListener("click",function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN"){
        const li = e.target.parentElement;
        const taskId =li.getAttribute("data-id");

        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: "DELETE"
        })
        .then(()=>loadTasks());
    }
});
document.addEventListener("DOMContentLoaded",loadTasks);
