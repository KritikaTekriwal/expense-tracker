// ============================================
// READ BALANCE FROM LOCALSTORAGE
// ============================================
const savedBalance = localStorage.getItem("balance");

if(savedBalance === null)
{
    window.location.href = "setup.html";
}

const balance = JSON.parse(savedBalance);

// DISPLAY BALANCE
const upiElement = document.querySelector("#upiBalance");
const cashElement = document.querySelector("#cashBalance");
const totalElement = document.querySelector("#totalBalance");

upiElement.textContent = "UPI Balance : ₹" + balance.upi;
cashElement.textContent = "Cash Balance : ₹" + balance.cash;
totalElement.textContent = "Total Balance : ₹" + balance.total;

// Show negative balance in red
if(balance.upi < 0) upiElement.style.color = "red";
if(balance.cash < 0) cashElement.style.color = "red";
if(balance.total < 0) totalElement.style.color = "red";

// EDIT BALANCE BUTTON
document.querySelector("#editBalance").addEventListener("click", function()
{
    window.location.href = "setup.html";
});