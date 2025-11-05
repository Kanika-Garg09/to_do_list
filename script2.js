let allTasks = [];
let innerTasks = [];
let count = 1;

const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = mainForm.children[0];
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

eventListeners();
loadLS();
loadInnerTasks();

// Event Listeners
function eventListeners() {
  mainForm.addEventListener("submit", addNewItem);
  mainList.addEventListener("click", taskActions);
  delAll.addEventListener("click", deleteAll);
}

// Create New Task
function createNewTask(text, check) {
  const newLi = upperLi.cloneNode(true);
  newLi.classList.remove("d-none");
  newLi.removeAttribute("id");
  newLi.children[0].setAttribute("href", `#collapse${count}`);
  newLi.children[0].innerText = text;
  newLi.children[0].classList.toggle("line-throught", check);
  newLi.children[2].setAttribute("id", `collapse${count}`);
  mainList.children[0].appendChild(newLi);
  count++;
  mainInput.value = "";
}

// Add New Task
function addNewItem(e) {
  e.preventDefault();
  const taskText = mainInput.value.trim();
  if (!taskText) return;
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  if (allTasks.find((t) => t.text === taskText)) {
    alert("Task Already Added");
    return;
  }
  createNewTask(taskText, false);
  allTasks.push({ text: taskText, check: false });
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

// Handle Task Actions
function taskActions(e) {
  e.preventDefault();

  const isDelete = e.target.classList.contains("delete-item");
  const isCheck = e.target.classList.contains("check");
  const isInnerDelete = e.target.classList.contains("delete-inner-item");
  const isInnerCheck = e.target.classList.contains("inner-check");
  const isAddInner = e.target.classList.contains("btn-add-inner-task") || e.target.classList.contains("i-add-inner-task");

  if (isDelete) {
    const text = e.target.closest("li").children[0].innerText;
    removeTask(text);
    e.target.closest("li").remove();
  }

  if (isCheck) {
    const li = e.target.closest("li");
    const text = li.children[0].innerText;
    li.children[0].classList.toggle("line-throught");
    updateTaskStatus(text, li.children[0].classList.contains("line-throught"));
  }

  if (isInnerDelete) {
    const upperText = e.target.closest(".collapse").parentElement.children[0].innerText;
    const text = e.target.parentElement.children[0].innerText;
    removeInnerTask(upperText, text);
    e.target.parentElement.remove();
  }

  if (isInnerCheck) {
    const upperText = e.target.closest(".collapse").parentElement.children[0].innerText;
    const text = e.target.parentElement.children[0].innerText;
    const line = e.target.parentElement.children[0];
    line.classList.toggle("line-throught");
    toggleInnerCheck(upperText, text, line.classList.contains("line-throught"));
  }

  if (isAddInner) {
    const input = e.target.closest("form").querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    const upperText = e.target.closest(".collapse").parentElement.children[0].innerText;
    addInnerTask(upperText, text);
    input.value = "";
  }

  checkAllCompleted();
}

// Helpers
function removeTask(text) {
  let tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  tasks = tasks.filter((t) => t.text !== text);
  localStorage.setItem("allTasks", JSON.stringify(tasks));
}

function updateTaskStatus(text, check) {
  let tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  const task = tasks.find((t) => t.text === text);
  if (task) task.check = check;
  localStorage.setItem("allTasks", JSON.stringify(tasks));
}

function removeInnerTask(upperText, text) {
  let subtasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  subtasks = subtasks.filter((s) => !(s.upperTaskText === upperText && s.mainText === text));
  localStorage.setItem("innerTasks", JSON.stringify(subtasks));
}

function toggleInnerCheck(upperText, text, check) {
  let subtasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  const task = subtasks.find((s) => s.upperTaskText === upperText && s.mainText === text);
  if (task) task.check = check;
  localStorage.setItem("innerTasks", JSON.stringify(subtasks));
}

// Delete All
function deleteAll(e) {
  e.preventDefault();
  localStorage.removeItem("allTasks");
  localStorage.removeItem("innerTasks");
  mainList.querySelectorAll("li:not(#upperLi)").forEach((li) => li.remove());
}

// Load Tasks
function loadLS() {
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  allTasks.forEach((item) => createNewTask(item.text, item.check));
}

function loadInnerTasks() {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
}

// Add Inner Task
function addInnerTask(upperText, mainText) {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  innerTasks.push({ upperTaskText: upperText, mainText, check: false });
  localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
}

// 🎉 Check if all completed
function checkAllCompleted() {
  const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  if (tasks.length && tasks.every((t) => t.check)) {
    showCongrats();
  }
}

// 🎊 Popup + confetti
function showCongrats() {
  Swal.fire({
    title: "🎉 Congratulations!",
    text: " all your tasks are completed!",
    icon: "success",
    confirmButtonText: "Yay!",
    background: "#fff",
    color: "#604bff",
  });
  confetti({
    particleCount: 200,
    spread: 80,
    origin: { y: 0.6 },
  });
}
