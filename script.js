const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('form');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (description.value.trim() === '' || amount.value.trim() === '' || category.value === '') {
    alert('Please fill all fields');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: description.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
});

function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateSummary();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} (${transaction.category}) 
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})">❌</button>
  `;

  transactionList.appendChild(item);
}

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const incomeTotal = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expenseTotal = amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balance.innerText = total;
  income.innerText = `$${incomeTotal}`;
  expense.innerText = `$${Math.abs(expenseTotal)}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initial render
renderTransactions();
