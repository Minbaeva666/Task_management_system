const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", async () => {
    getTodos();
});
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));


    let taskIdCounter = 0; 

    function addToDo(event) {
        event.preventDefault();
    
        taskIdCounter++;
    
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add('todo', `${savedTheme}-todo`);
        toDoDiv.setAttribute('data-id', taskIdCounter); 
    
        const newToDo = document.createElement('li');
        if (toDoInput.value === '') {
            alert("You must write something!");
        } else {
            newToDo.innerText = toDoInput.value;
            newToDo.classList.add('todo-item');
            toDoDiv.appendChild(newToDo);
    
            saveTask({ id: taskIdCounter, task: toDoInput.value });
    
            const checked = document.createElement('button');
            checked.innerHTML = '<i class="fas fa-check"></i>';
            checked.classList.add('check-btn', `${savedTheme}-button`);
            toDoDiv.appendChild(checked);
            

            const deleted = document.createElement('button');
            deleted.innerHTML = '<i class="fas fa-trash"></i>';
            deleted.classList.add('delete-btn', `${savedTheme}-button`);
            toDoDiv.appendChild(deleted);
    
            toDoList.appendChild(toDoDiv);
    
            toDoInput.value = '';    
        }
    }
    
    function saveTask({ id, task }) {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            console.error("User ID not found");
            return;
        }
    
        const endpoint = `https://657b53f6394ca9e4af142fbe.mockapi.io/api/v1/user/${userId}/tasks`;
    
        const data = {
            id: id,
            task: task
        };
    
        fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Task saved successfully:', data);
            })
            .catch(error => {
                console.error('Error saving task:', error);
            });
    }

    function deletecheck(event) {
        const item = event.target;
    
        if (item.classList[0] === 'delete-btn') {
            const taskId = item.parentElement.getAttribute('data-id');
            const userId = localStorage.getItem('userId');
    
            deleteTask(userId, taskId);

    
            item.parentElement.classList.add("fall");
    
            item.parentElement.addEventListener('transitionend', function () {
                item.parentElement.remove();
            });
        }
    
        if (item.classList[0] === 'check-btn') {
            item.parentElement.classList.toggle("completed");
    
            const taskId = item.parentElement.getAttribute('data-id');
    
            updateTaskStatus(taskId, true);
        }
    }

    function updateTaskStatus(taskId, isDone) {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            console.error("User ID not found");
            return;
        }
    
        const endpoint = `https://657b53f6394ca9e4af142fbe.mockapi.io/api/v1/user/${userId}/tasks/${taskId}`;
    
        const data = {
            isDone: isDone
        };
    
        fetch(endpoint, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Task status updated successfully');
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error updating task status:', error);
        });
    }


async function getTodos() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID not found");
        return;
    }

    try {
        const tasks = await fetchUserTasks(userId);

        toDoList.innerHTML = '';

        tasks.forEach(function (task) {
            const toDoDiv = document.createElement("div");
            toDoDiv.classList.add("todo", `${savedTheme}-todo`);
            toDoDiv.setAttribute('data-id', task.id);

            const newToDo = document.createElement('li');
            newToDo.innerText = task.task;
            newToDo.classList.add('todo-item');
            toDoDiv.appendChild(newToDo);

            const checked = document.createElement('button');
            checked.innerHTML = '<i class="fas fa-check"></i>';
            checked.classList.add("check-btn", `${savedTheme}-button`);
            toDoDiv.appendChild(checked);

            const deleted = document.createElement('button');
            deleted.innerHTML = '<i class="fas fa-trash"></i>';
            deleted.classList.add("delete-btn", `${savedTheme}-button`);
            toDoDiv.appendChild(deleted);

            toDoList.appendChild(toDoDiv);
        });

    } catch (error) {
        console.error('Error getting todos:', error);
    }
}

async function fetchUserTasks(userId) {
    if (!userId) {
        console.error("User ID not found");
        return Promise.reject("User ID not found");
    }

    const endpoint = `https://657b53f6394ca9e4af142fbe.mockapi.io/api/v1/user/${userId}/tasks`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data_1 = await response.json();
        console.log('Tasks retrieved successfully:', data_1);
        return data_1;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

function deleteTask(userId, taskId) {
    if (!userId) {
        console.error("User ID not found");
        return;
    }

    const endpoint = `https://657b53f6394ca9e4af142fbe.mockapi.io/api/v1/user/${userId}/tasks/${taskId}`;

    fetch(endpoint, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Task deleted successfully');
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}


function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}