let budget = document.getElementById("budget");
let balance = document.getElementById("balanceVal");
let desc = document.getElementById("description");
let expense = document.getElementById("expense");
let date = document.getElementById("date");
let expenseVal = document.getElementById("expenseVal");
let total = document.getElementById("total");
let expenseList = document.getElementById("expenseList");

let amount;
let totalExpense = 0;
let budAmount;
let exp = [desc, expenseVal, date];

expenseList.addEventListener("click", removeExpense);

// Update Budget
let addBudget = () => {
    amount = Number(budget.value);
    if (isNaN(amount) || amount <= 0 || budget.value.trim() === "") {
        budget.classList.add("error");
    } else {
        total.innerText = "₹ " + amount;
        balance.innerText = "₹ " + amount;
        budget.classList.remove("error");
        budget.value = "";
    }
};

// Add Expense
let addExpense = () => {
    if (isNaN(Number(expenseVal.value)) || Number(expenseVal.value) <= 0 || expenseVal.value === '' || date.value === '' || desc.value === "") {
        exp.forEach((e) => e.classList.add("error"));
    } else {
        amount = Number(amount) - Number(expenseVal.value);
        totalExpense += Number(expenseVal.value);
        budAmount = totalExpense;

        expense.innerText = "₹ " + String(totalExpense);
        balance.innerText = "₹ " + String(amount);

        let tr = document.createElement("tr");
        tr.id = expenseVal.value;
        expenseList.appendChild(tr);

        exp.forEach((e, i) => {
            let td = document.createElement("td");
            td.innerText = e.value;
            tr.appendChild(td);

            if (i === 2) {
                let td2 = document.createElement("td");
                let btn = document.createElement("div");
                btn.className = "removebtn";
                btn.innerText = "X";
                td2.appendChild(btn);
                tr.appendChild(td2);
            }
        });

        exp.forEach((e) => {
            e.classList.remove("error");
            e.value = "";
        });
    }
};

// Remove Expense
function removeExpense(event) {
    if (event.target.classList.contains("removebtn")) {
        let row = event.target.parentNode.parentNode;
        let expVal = Number(row.id);
        row.remove();

        amount += expVal;
        balance.innerText = "₹ " + String(amount);
        budAmount -= expVal;
        totalExpense -= expVal;
        expense.innerText = "₹ " + String(budAmount);
    }
}
