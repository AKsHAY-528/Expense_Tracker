// DOM Elements
const userForm = document.getElementById('userForm');
const userModal = document.getElementById('userModal');
const greeting = document.getElementById('greeting');
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const incomeList = document.getElementById('income-list');
const expenseList = document.getElementById('expense-list');

const incomeForm = document.getElementById('income-form');
const incomeText = document.getElementById('income-text');
const incomeAmount = document.getElementById('income-amount');

const expenseForm = document.getElementById('expense-form');
const expenseText = document.getElementById('expense-text');
const expenseAmount = document.getElementById('expense-amount');

// App Data
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};

function updateLocalStorage() {
  localStorage.setItem('users', JSON.stringify(users));
}

function showTracker() {
  document.getElementById('tracker').style.display = 'block';
}

function renderGreeting() {
  greeting.innerText = `💰 Expense Tracker for ${currentUser}`;
}

function renderTransactions() {
  const { transactions } = users[currentUser];
  const incomes = transactions.filter(t => t.amount > 0);
  const expenses = transactions.filter(t => t.amount < 0);

  // Clear current display
  incomeList.innerHTML = '';
  expenseList.innerHTML = '';

  incomes.forEach(t => {
    const li = document.createElement('li');
    li.classList.add('plus');
    li.innerHTML = `${t.text} <span>+₹${t.amount}</span>`;
    incomeList.appendChild(li);
  });

  expenses.forEach(t => {
    const li = document.createElement('li');
    li.classList.add('minus');
    li.innerHTML = `${t.text} <span>-₹${Math.abs(t.amount)}</span>`;
    expenseList.appendChild(li);
  });

  const total = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

  balance.innerText = `₹${total.toFixed(2)}`;
  money_plus.innerText = `+₹${totalIncome.toFixed(2)}`;
  money_minus.innerText = `-₹${totalExpense.toFixed(2)}`;
}

function initUser(name, income) {
  currentUser = name;
  if (!users[name]) {
    users[name] = {
      income: parseFloat(income),
      transactions: []
    };
    updateLocalStorage();
  }
  renderGreeting();
  renderTransactions();
  showTracker();
}

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const income = document.getElementById('userIncome').value.trim();

  if (name && income && !isNaN(income)) {
    userModal.style.display = 'none';
    initUser(name, income);
  } else {
    alert("Please fill in both name and income correctly.");
  }
});

incomeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = incomeText.value;
  const amount = parseFloat(incomeAmount.value);

  if (!text || isNaN(amount)) return;

  users[currentUser].transactions.push({ text, amount });
  updateLocalStorage();
  renderTransactions();

  incomeText.selectedIndex = 0;
  incomeAmount.value = '';
});

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = expenseText.value;
  const amount = parseFloat(expenseAmount.value);

  if (!text || isNaN(amount)) return;

  users[currentUser].transactions.push({ text, amount: -Math.abs(amount) });
  updateLocalStorage();
  renderTransactions();

  expenseText.selectedIndex = 0;
  expenseAmount.value = '';
});

// Launch modal on start
window.onload = () => {
  document.getElementById('tracker').style.display = 'none';
  userModal.style.display = 'block';
};
