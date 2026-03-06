// Access DOM elements
let inputText = document.getElementById("todo-text");
let addButtton = document.getElementById("add-todo");
let todoList = document.querySelector(".todo-items");
let filterBtns = document.querySelectorAll(".filter-btn");
let clearCompleted = document.querySelector(".clear-completed");

let todoArr = JSON.parse(localStorage.getItem("todos")) || [];

const addTodo = () => {
  let text = inputText.value.trim();
  if (text === "") return;

  const todoObj = {
    id: Date.now(),
    text,
    completed: false,
  };

  todoArr.push(todoObj);
  localStorage.setItem("todos", JSON.stringify(todoArr));

  let div = document.createElement("div");
  div.className = "todoList";
  div.dataset.id = todoObj.id;

  div.innerHTML = `
    <div class="todo">
      <input type="checkbox" class="todo-checkbox" />
      <li class="todo-list">${text}</li>
    </div>
    <div>
    <button class="edit-todo"><i class="fa-solid fa-pen-to-square"></i></button>
    <button class="remove-todo">
      <i class="fa-solid fa-x"></i>
    </button>
    </div>
  `;

  const checkbox = div.querySelector(".todo-checkbox");

  checkbox.addEventListener("change", () => {
    div.classList.toggle("completed", checkbox.checked);

    const todo = todoArr.find((t) => t.id === todoObj.id);
    todo.completed = checkbox.checked;

    localStorage.setItem("todos", JSON.stringify(todoArr));
  });

  div.querySelector(".remove-todo").addEventListener("click", () => {
    div.remove();
    todoArr = todoArr.filter((t) => t.id !== todoObj.id);
    localStorage.setItem("todos", JSON.stringify(todoArr));
  });

  let edit = div.querySelector(".edit-todo");
  let textValue = div.querySelector(".todo-list");

  // Edit todo on clicking button
  edit.addEventListener("click", () => {
    textValue.contentEditable = true;
    textValue.focus();
  });

  // Save edit on Enter
  textValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textValue.blur();
    }
  });

  textValue.addEventListener("blur", () => {
    textValue.contentEditable = false;

    const newText = textValue.textContent.trim();

    if (newText === "") {
      textValue.textContent = "New Todo";
    }

    const todo = todoArr.find((t) => t.id === todoObj.id);
    if (todo) {
      todo.text = textValue.textContent;
      localStorage.setItem("todos", JSON.stringify(todoArr));
    }
  });
  
  todoList.appendChild(div);
  inputText.value = "";
  inputText.focus();
};

inputText.focus();
addButtton.addEventListener("click", addTodo);

// Add a todo on Enter
inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTodo();
  }
});

// Filter Buttons (All, Active, Completed)
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".todo-items .todoList").forEach((todo) => {
      if (filter === "all") {
        todo.style.display = "flex";
      } else if (filter === "active") {
        todo.style.display = todo.classList.contains("completed")
          ? "none"
          : "flex";
      } else {
        todo.style.display = todo.classList.contains("completed")
          ? "flex"
          : "none";
      }
    });
  });
});
