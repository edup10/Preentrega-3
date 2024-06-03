document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskClick);

function addTask(event) {
    event.preventDefault();  
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    if (isDuplicateTask(taskText)) {
        alert('La Tarea Ya Existe.');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    taskInput.value = '';
    addTaskToDOM(task);
    saveTaskToStorage(task);
}

function isDuplicateTask(taskText) {
    const tasks = getTasksFromStorage();
    return tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase());
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
        ${task.text}
        <button>Borrar</button>
    `;
    taskList.appendChild(li);
}

function handleTaskClick(event) {
    const item = event.target;
    if (item.tagName === 'BUTTON') {
        deleteTask(item.parentElement);
    } else {
        toggleTaskComplete(item);
    }
}

function deleteTask(taskElement) {
    const taskId = taskElement.dataset.id;
    taskElement.remove();
    removeTaskFromStorage(taskId);
}

function toggleTaskComplete(taskElement) {
    const taskId = taskElement.dataset.id;
    taskElement.classList.toggle('completed');
    updateTaskInStorage(taskId, taskElement.classList.contains('completed'));
}

function saveTaskToStorage(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(addTaskToDOM);
}

function removeTaskFromStorage(taskId) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(taskId, completed) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.id == taskId);
    if (task) {
        task.completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}