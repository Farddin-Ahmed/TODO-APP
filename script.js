let input = document.getElementById("input");
let add = document.getElementById("add");
let all = document.getElementById("all");
let active = document.getElementById("active");
let complited = document.getElementById("complited");
let display = document.getElementById("display");

document.addEventListener("DOMContentLoaded", loadtask);

function loadtask() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  display.innerHTML = "";

  if (cheackemptystate()) {
    return;
  }

  tasks.forEach((task) => {
    let btn;
    if (task.status === "active") {
      btn = "Done";
    } else {
      btn = "Undo";
    }
    display.innerHTML += `<li>
    <div class="tittle">${task.text}</div>
    <button class="status" data-task="${task.status}">${btn}</button>
        <button class="delete">Delete</button>
        </li>`;
  });
}

add.addEventListener("click", addtask);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addtask();
  }
});
function addtask() {
  if (input.value != "") {
    let tasktext = input.value.trimEnd();

    all.classList.add("focused");
    active.classList.remove("focused");
    complited.classList.remove("focused");

    if (display.querySelector(".empty-message")) {
      display.innerHTML = "";
    }
    display.innerHTML += `<li>
        <div class="tittle">${input.value}</div>
        <button class="status" data-task="active">Done</button>
        <button class="delete">Delete</button>
        </li>`;
    savetask(tasktext, "active");
    input.value = "";
  } else {
    return;
  }
}

// Error Handling
function resetTasks() {
  localStorage.removeItem("tasks");
  console.log("Tasks reset");
}
// resetTasks();

function savetask(tasktext, taskstatus) {
  //   Error Handling
  tasks = [];
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    try {
      tasks = JSON.parse(storedTasks);
    } catch (error) {
      console.error("Error parsing tasks from localStorage:", error);
      // If there's an error parsing, we'll use an empty array
    }
  }

  tasks.push({
    text: tasktext,
    status: taskstatus,
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

display.addEventListener("click", (e) => {
  if (e.target.classList == "status") {
    let li = e.target.closest("li");
    let tasktext = li.querySelector(".tittle").innerText;
    if (e.target.dataset.task === "active") {
      e.target.dataset.task = "complited";
      e.target.innerText = "Undo";
      updatetask(tasktext, "complited");

      if (all.classList != "focused") {
        li.remove();
      }
    } else {
      e.target.dataset.task = "active";
      e.target.innerText = "Done";
      updatetask(tasktext, "active");

      if (all.classList != "focused") {
        li.remove();
      }
    }
  } else if (e.target.classList == "delete") {
    let li = e.target.closest("li");
    let tasktext = li.querySelector(".tittle").innerText;
    li.remove();
    deletetask(tasktext);

    let remainingitems = display.querySelectorAll("li");
    if (remainingitems.length === 0 && active.classList.contains("focused")) {
      display.innerHTML = `
      <div class="empty-message">
        <p>No active tasks found. All tasks are completed!</p>
      </div>`;
      return;
    } else if (
      remainingitems.length === 0 &&
      complited.classList.contains("focused")
    ) {
      display.innerHTML = `
      <div class="empty-message">
        <p>No completed tasks yet. Complete some tasks to see them here!</p>
        </div>`;
      return;
    }
  }
});

function updatetask(tasktext, newstatus) {
  // cheack for empty message
  let activecount = 0;
  let complitedcount = 0;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (tasktext === task.text) {
      task.status = newstatus;
    }

    // cheack for empty message
    if (task.status === "active") {
      activecount = activecount + 1;
    } else {
      complitedcount = complitedcount + 1;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // cheack for empty message
  if (activecount === 0 && active.classList.contains("focused")) {
    display.innerHTML = `
      <div class="empty-message">
        <p>No active tasks found. All tasks are completed!</p>
      </div>`;
    return;
  } else if (complitedcount === 0 && complited.classList.contains("focused")) {
    display.innerHTML = `
      <div class="empty-message">
        <p>No completed tasks yet. Complete some tasks to see them here!</p>
        </div>`;
    return;
  }
}

function deletetask(tasktext) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== tasktext);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  if (tasks.length === 0) {
    cheackemptystate();
  }
}

active.addEventListener("click", () => {
  active.classList.add("focused");
  all.classList.remove("focused");
  complited.classList.remove("focused");
  display.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const activetasks = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "active") {
      activetasks.push(tasks[i]);
    }
  }
  if (activetasks.length === 0) {
    display.innerHTML = `
      <div class="empty-message">
        <p>No active tasks found. All tasks are completed!</p>
      </div>`;
    return;
  }
  activetasks.forEach((task) => {
    let btn;
    if (task.status === "active") {
      btn = "Done";
    } else {
      btn = "Undo";
    }
    display.innerHTML += `<li>
    <div class="tittle">${task.text}</div>
            <button class="status" data-task="${task.status}">${btn}</button>
            <button class="delete">Delete</button>
            </li>`;
  });
});

complited.addEventListener("click", () => {
  complited.classList.add("focused");
  all.classList.remove("focused");
  active.classList.remove("focused");
  display.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const complitedtasks = [];
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "complited") {
      complitedtasks.push(tasks[i]);
    }
  }
  if (complitedtasks.length === 0) {
    display.innerHTML = `
      <div class="empty-message">
        <p>No completed tasks yet. Complete some tasks to see them here!</p>
        </div>`;
    return;
  }
  complitedtasks.forEach((task) => {
    let btn;
    if (task.status === "active") {
      btn = "Done";
    } else {
      btn = "Undo";
    }
    display.innerHTML += `<li>
    <div class="tittle">${task.text}</div>
    <button class="status" data-task="${task.status}">${btn}</button>
    <button class="delete">Delete</button>
            </li>`;
  });
});

all.addEventListener("click", () => {
  all.classList.add("focused");
  complited.classList.remove("focused");
  active.classList.remove("focused");

  loadtask();
});

function cheackemptystate() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (tasks.length === 0) {
    display.innerHTML = `
      <div class="empty-message">
        <p>No tasks found. Add a new task to get started!</p>
      </div>`;
    return true;
  }
  return false;
}
