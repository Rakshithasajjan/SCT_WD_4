const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressFill = document.getElementById('progress-fill');
const tomorrowInput = document.getElementById('tomorrowInput');
const tomorrowList = document.getElementById('tomorrowList');
const tomorrowSection = document.getElementById('tomorrowSection');
const themeToggle = document.getElementById('themeToggle');
const historyList = document.getElementById('historyList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const tomorrowKey = new Date(Date.now() + 86400000).toLocaleDateString('en-CA');
let tomorrowTasks = JSON.parse(localStorage.getItem(tomorrowKey)) || [];
let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.setAttribute('draggable', true);
    li.dataset.index = index;
    if (task.done) li.classList.add('done');
    li.onclick = () => toggleTask(index);

    li.ondragstart = (e) => e.dataTransfer.setData('text/plain', index);
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = (e) => {
      e.preventDefault();
      const draggedIndex = e.dataTransfer.getData('text');
      const droppedIndex = index;
      const temp = tasks[draggedIndex];
      tasks.splice(draggedIndex, 1);
      tasks.splice(droppedIndex, 0, temp);
      saveTasks();
      renderTasks();
    };

    taskList.appendChild(li);
  });
  updateProgress();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text !== '') {
    tasks.push({ text, done: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  progressFill.style.width = percent + '%';
}

function finishDay() {
  const btn = document.querySelector('.finish-btn');
  btn.classList.add('animate');
  setTimeout(() => btn.classList.remove('animate'), 400);

  alert('Good job! Day completed.');

  const completedTasks = tasks.filter(t => t.done);
  if (completedTasks.length > 0) {
    taskHistory = [...completedTasks, ...taskHistory];
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
    renderHistory();
  }

  tasks = [];
  saveTasks();
  renderTasks();
}

function renderTomorrowTasks() {
  tomorrowList.innerHTML = '';
  tomorrowTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.done) li.classList.add('done');
    li.onclick = () => toggleTomorrowTask(index);
    tomorrowList.appendChild(li);
  });
  tomorrowSection.style.display = tomorrowTasks.length > 0 ? 'block' : 'none';
}

function addTomorrowTask() {
  const text = tomorrowInput.value.trim();
  if (text !== '') {
    tomorrowTasks.push({ text, done: false });
    tomorrowInput.value = '';
    saveTomorrowTasks();
    renderTomorrowTasks();
  }
}

function toggleTomorrowTask(index) {
  tomorrowTasks[index].done = !tomorrowTasks[index].done;
  saveTomorrowTasks();
  renderTomorrowTasks();
}

function saveTomorrowTasks() {
  localStorage.setItem(tomorrowKey, JSON.stringify(tomorrowTasks));
}

function renderHistory() {
  historyList.innerHTML = '';
  taskHistory.slice(0, 10).forEach((task) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.classList.add('done');
    historyList.appendChild(li);
  });
}

themeToggle.checked = localStorage.getItem('theme') === 'dark';
if (themeToggle.checked) document.body.classList.add('dark');

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

const today = new Date();
document.getElementById('day').textContent = today.toLocaleDateString('en-US', { weekday: 'long' });
document.getElementById('date').textContent = today.getDate();
document.getElementById('month').textContent = today.toLocaleDateString('en-US', { month: 'long' });

renderTasks();
renderTomorrowTasks();
renderHistory();
