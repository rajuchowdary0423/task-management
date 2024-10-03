document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  displayUserName();
  updateProgressBar();
});

function addTask() {
  const nameInput = document.getElementById("new-task-name");
  const descriptionInput = document.getElementById("new-task-description");
  const name = nameInput.value.trim();
  const taskText = descriptionInput.value.trim();

  if (name === "" || taskText === "") return;

  const task = {
    id: new Date().getTime(),
    name: name,
    text: taskText,
    completed: false,
  };

  saveTask(task);
  displayTask(task);

  nameInput.value = "";
  descriptionInput.value = "";
  updateProgressBar();
}

function displayTask(task) {
  const tasksContainer = document.getElementById("tasks-container");

  const taskElement = document.createElement("div");
  taskElement.className = "task";
  taskElement.id = `task-${task.id}`;
  if (task.completed) {
    taskElement.classList.add("completed");
  }

  taskElement.innerHTML = `
    <h3 class="task-name">${task.name}</h3> 
    <p class="task-text">${task.text}</p>
    <button onclick="toggleTaskCompletion(${task.id})">
      ${task.completed ? "Mark Pending" : "Mark Completed"}
    </button>
    <button onclick="startEditTask(${task.id})">Edit</button>
    <button onclick="deleteTask(${task.id})">Delete</button>
  `;

  tasksContainer.appendChild(taskElement);
}

function toggleTaskCompletion(id) {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    saveTasks(tasks);
    updateUI();
    updateProgressBar();
  }
}

function startEditTask(id) {
  const taskElement = document.getElementById(`task-${id}`);
  const task = getTasks().find((task) => task.id === id);

  if (!task) return;

  taskElement.innerHTML = `
    <input type="text" id="edit-name-${id}" value="${task.name}" />
    <input type="text" id="edit-text-${id}" value="${task.text}" />
    <button onclick="saveTaskEdit(${id})">Save</button>
    <button onclick="cancelEditTask(${id})">Cancel</button>
  `;
}

function saveTaskEdit(id) {
  const nameInput = document.getElementById(`edit-name-${id}`);
  const textInput = document.getElementById(`edit-text-${id}`);
  const newName = nameInput.value.trim();
  const newText = textInput.value.trim();
  if (newName === "" || newText === "") return;

  const tasks = getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return;
  tasks[taskIndex].name = newName;
  tasks[taskIndex].text = newText;
  saveTasks(tasks);
  updateUI();
}

function cancelEditTask(id) {
  updateUI();
}

function deleteTask(id) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  updateUI();
  updateProgressBar();
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach((task) => displayTask(task));
}

function updateUI() {
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = "";
  loadTasks();
}

function filterTasks(status) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) =>
    status === "completed" ? task.completed : !task.completed
  );
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = "";
  filteredTasks.forEach((task) => displayTask(task));
}

function updateProgressBar() {
  const tasks = getTasks();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  document.getElementById("progress-bar").value = progress;
}

function saveUserName() {
  const userName = document.getElementById("user-name").value.trim();
  if (userName !== "") {
    localStorage.setItem("userName", userName);
    displayUserName();
  }
}

function displayUserName() {
  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("user-display").textContent = `Hello, ${userName}`;
}

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}
