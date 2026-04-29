document.addEventListener("DOMContentLoaded", function () {
  const maxChars = 50;

  const charInput = document.getElementById("charInput");
  const charCount = document.getElementById("charCount");
  const remainingCount = document.getElementById("remainingCount");

  function updateCharacterCounter() {
    const length = charInput.value.length;
    const remaining = maxChars - length;

    charCount.textContent = `Characters: ${length}`;
    remainingCount.textContent = `Remaining: ${remaining}`;

    if (remaining < 10) {
      charCount.classList.add("warning");
      remainingCount.classList.add("warning");
    } else {
      charCount.classList.remove("warning");
      remainingCount.classList.remove("warning");
    }
  }

  charInput.addEventListener("input", updateCharacterCounter);
  updateCharacterCounter();

  const itemInput = document.getElementById("itemInput");
  const addItemBtn = document.getElementById("addItemBtn");
  const todoList = document.getElementById("todoList");
  const itemStats = document.getElementById("itemStats");

  function updateTodoStats() {
    const items = todoList.querySelectorAll("li");
    const doneItems = todoList.querySelectorAll("li.done");
    itemStats.textContent = `Total: ${items.length} | Done: ${doneItems.length}`;
  }

  function createTodoItem(text) {
    const li = document.createElement("li");
    li.dataset.status = "pending";

    const span = document.createElement("span");
    span.textContent = text;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.className = "remove-btn";
    removeBtn.dataset.action = "remove";

    li.appendChild(span);
    li.appendChild(removeBtn);
    todoList.appendChild(li);

    updateTodoStats();
  }

  addItemBtn.addEventListener("click", function () {
    const value = itemInput.value.trim();
    if (value === "") return;
    createTodoItem(value);
    itemInput.value = "";
    itemInput.focus();
  });

  itemInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addItemBtn.click();
    }
  });

  todoList.addEventListener("click", function (e) {
    const target = e.target;
    const li = target.closest("li");
    if (!li) return;

    if (target.dataset.action === "remove") {
      li.remove();
      updateTodoStats();
      return;
    }

    if (target.tagName === "SPAN" || target.tagName === "LI") {
      li.classList.toggle("done");
      li.dataset.status = li.classList.contains("done") ? "done" : "pending";
      updateTodoStats();
    }
  });

  const counterValue = document.getElementById("counterValue");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const increaseBtn = document.getElementById("increaseBtn");
  const resetBtn = document.getElementById("resetBtn");

  let counterState = 0;

  function renderCounter() {
    counterValue.textContent = counterState;
  }

  decreaseBtn.addEventListener("click", function () {
    counterState--;
    renderCounter();
  });

  increaseBtn.addEventListener("click", function () {
    counterState++;
    renderCounter();
  });

  resetBtn.addEventListener("click", function () {
    counterState = 0;
    renderCounter();
  });

  renderCounter();

  const productList = document.getElementById("productList");
  const cartList = document.getElementById("cartList");
  const cartStats = document.getElementById("cartStats");

  const state = {
    items: [
      { id: 1, name: "Book", price: 12.99, qty: 0 },
      { id: 2, name: "Pen", price: 2.5, qty: 0 },
      { id: 3, name: "Bag", price: 25.0, qty: 0 },
    ],
  };

  function dispatch(action) {
    if (action.type === "ADD_TO_CART") {
      const item = state.items.find((x) => x.id === action.id);
      if (item) item.qty++;
    }

    if (action.type === "REMOVE_ONE") {
      const item = state.items.find((x) => x.id === action.id);
      if (item && item.qty > 0) item.qty--;
    }

    renderCart();
  }

  function renderCart() {
    productList.innerHTML = "";
    cartList.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    state.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "product";

      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>In cart: ${item.qty}</p>
      `;

      const addBtn = document.createElement("button");
      addBtn.textContent = "Add";
      addBtn.addEventListener("click", function () {
        dispatch({ type: "ADD_TO_CART", id: item.id });
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.style.marginLeft = "8px";
      removeBtn.addEventListener("click", function () {
        dispatch({ type: "REMOVE_ONE", id: item.id });
      });

      card.appendChild(addBtn);
      card.appendChild(removeBtn);
      productList.appendChild(card);

      if (item.qty > 0) {
        const li = document.createElement("li");
        li.textContent = `${item.name} x ${item.qty} = $${(item.price * item.qty).toFixed(2)}`;
        cartList.appendChild(li);
      }

      totalItems += item.qty;
      totalPrice += item.price * item.qty;
    });

    cartStats.textContent = `Items: ${totalItems} | Total: $${totalPrice.toFixed(2)}`;
  }

  renderCart();

  const noteInput = document.getElementById("noteInput");
  const saveNoteBtn = document.getElementById("saveNoteBtn");
  const loadNoteBtn = document.getElementById("loadNoteBtn");
  const clearNoteBtn = document.getElementById("clearNoteBtn");
  const noteStatus = document.getElementById("noteStatus");
  const NOTE_KEY = "myNote";

  saveNoteBtn.addEventListener("click", function () {
    const value = noteInput.value.trim();
    if (value === "") {
      noteStatus.textContent = "Please enter a note first.";
      return;
    }
    localStorage.setItem(NOTE_KEY, value);
    noteStatus.textContent = "Note saved successfully.";
  });

  loadNoteBtn.addEventListener("click", function () {
    const saved = localStorage.getItem(NOTE_KEY);
    if (!saved) {
      noteStatus.textContent = "No saved note found.";
      noteInput.value = "";
      return;
    }
    noteInput.value = saved;
    noteStatus.textContent = "Note loaded.";
  });

  clearNoteBtn.addEventListener("click", function () {
    localStorage.removeItem(NOTE_KEY);
    noteInput.value = "";
    noteStatus.textContent = "Note cleared.";
  });

  const getLocationBtn = document.getElementById("getLocationBtn");
  const locationStatus = document.getElementById("locationStatus");
  const latitude = document.getElementById("latitude");
  const longitude = document.getElementById("longitude");

  getLocationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      locationStatus.textContent =
        "Geolocation is not supported by this browser.";
      return;
    }

    locationStatus.textContent = "Getting location...";

    navigator.geolocation.getCurrentPosition(
      function (position) {
        latitude.textContent = `Latitude: ${position.coords.latitude}`;
        longitude.textContent = `Longitude: ${position.coords.longitude}`;
        locationStatus.textContent = "Location found.";
      },
      function () {
        locationStatus.textContent = "Unable to get your location.";
      },
    );
  });
});
