// Simple Calculator - HTML, CSS & JavaScript
const currentEl = document.getElementById("current");
const historyEl = document.getElementById("history");

let currentValue = "0";   // what the user is typing
let previousValue = null; // first operand
let operator = null;      // + - * /
let justEvaluated = false;

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateDisplay() {
  currentEl.textContent = currentValue;
  historyEl.textContent =
    previousValue !== null && operator
      ? `${previousValue} ${symbols[operator]}`
      : "";
}

function inputNumber(num) {
  if (justEvaluated) {
    currentValue = "0";
    justEvaluated = false;
  }
  currentValue = currentValue === "0" ? num : currentValue + num;
  updateDisplay();
}

function inputDecimal() {
  if (justEvaluated) {
    currentValue = "0";
    justEvaluated = false;
  }
  if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay();
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    default: return b;
  }
}

function format(result) {
  if (result === "Error") return result;
  return String(parseFloat(result.toFixed(10)));
}

function chooseOperator(op) {
  if (currentValue === "Error") return;
  if (previousValue !== null && operator && !justEvaluated) {
    const result = format(calculate(previousValue, currentValue, operator));
    if (result === "Error") {
      clearAll();
      currentValue = "Error";
      updateDisplay();
      return;
    }
    previousValue = result;
  } else {
    previousValue = currentValue;
  }
  operator = op;
  currentValue = "0";
  justEvaluated = false;
  updateDisplay();
}

function equals() {
  if (previousValue === null || !operator) return;
  const expression = `${previousValue} ${symbols[operator]} ${currentValue} =`;
  const result = format(calculate(previousValue, currentValue, operator));
  historyEl.textContent = expression;
  currentValue = result;
  previousValue = null;
  operator = null;
  justEvaluated = true;
  currentEl.textContent = currentValue;
}

function clearAll() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (justEvaluated || currentValue === "Error") {
    clearAll();
    return;
  }
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  if (currentValue === "Error") return;
  currentValue = format(parseFloat(currentValue) / 100);
  updateDisplay();
}

// Button clicks
document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.number !== undefined) return inputNumber(btn.dataset.number);
  if (btn.dataset.operator) return chooseOperator(btn.dataset.operator);

  switch (btn.dataset.action) {
    case "decimal": return inputDecimal();
    case "equals": return equals();
    case "clear": return clearAll();
    case "delete": return deleteLast();
    case "percent": return percent();
  }
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
  else if (e.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "%") percent();
});

updateDisplay();
