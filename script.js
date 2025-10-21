// Select elements
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Load from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display tasks on load
renderTasks();

// Add new task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const dateTime = taskDate.value;

  if (taskText === "" || dateTime === "") {
    alert("Please enter both task and date/time!");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    date: dateTime,
    completed: false,
  };

  tasks.push(task);
  saveAndRender();

  taskInput.value = "";
  taskDate.value = "";
});

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";
  const now = new Date();

  // Sort tasks by date/time
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task");
    if (task.completed) li.classList.add("completed");

    const taskDateTime = new Date(task.date);
    if (!task.completed) {
      if (taskDateTime < now) li.classList.add("overdue");
      else li.classList.add("upcoming");
    }

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong><br>
        <small>${taskDateTime.toLocaleString()}</small>
      </div>
      <div>
        <button class="complete-btn">✔</button>
        <button class="edit-btn">✎</button>
        <button class="delete-btn">🗑</button>
      </div>
    `;

    // Mark complete
    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completed = !task.completed;
      saveAndRender();
    });

    // Edit task
    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newText = prompt("Edit your task:", task.text);
      if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveAndRender();
      }
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveAndRender();
    });

    taskList.appendChild(li);
  });
}

// Save to localStorage and re-render
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
