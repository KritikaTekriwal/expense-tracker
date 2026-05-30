// ============================================
// DATE
// ============================================
const dateElement = document.querySelector("#currentDate");
const today = new Date();
dateElement.textContent = "Today's Date : " + today.toDateString();


// ============================================
// READ BALANCE FROM LOCALSTORAGE
// ============================================
const savedBalance = localStorage.getItem("balance");

if(savedBalance === null)
{
    window.location.href = "setup.html";
}

const balance = JSON.parse(savedBalance);


// ============================================
// DISPLAY BALANCE ON SCREEN
// ============================================
function displayBalance()
{
    const upiElement = document.querySelector("#upiBalance");
    const cashElement = document.querySelector("#cashBalance");
    const totalElement = document.querySelector("#totalBalance");

    upiElement.textContent = "UPI Balance : ₹" + balance.upi;
    cashElement.textContent = "Cash Balance : ₹" + balance.cash;
    totalElement.textContent = "Total Balance : ₹" + balance.total;

    // Show negative balance in red
    if(balance.upi < 0)
    {
        upiElement.style.color = "red";
    }
    else
    {
        upiElement.style.color = "";
    }

    if(balance.cash < 0)
    {
        cashElement.style.color = "red";
    }
    else
    {
        cashElement.style.color = "";
    }

    if(balance.total < 0)
    {
        totalElement.style.color = "red";
    }
    else
    {
        totalElement.style.color = "";
    }
}

displayBalance();


// ============================================
// DISPLAY TRANSACTION HISTORY ON SCREEN
// ============================================
function displayTransactions()
{
    // Read all saved transactions from localStorage
    const saved = localStorage.getItem("transactions");
    const transactions = saved ? JSON.parse(saved) : [];

    const container = document.querySelector("#transactionContainer");
    const emptyMessage = document.querySelector("#emptyMessage");

    if(transactions.length === 0)
    {
        emptyMessage.style.display = "block";
        return;
    }

    // Hide empty message
    emptyMessage.style.display = "none";

    // Clear container first to avoid duplicates
    container.innerHTML = "";

    // Show newest transactions at the top
    const reversed = transactions.slice().reverse();

    reversed.forEach(function(transaction)
    {
        const item = document.createElement("div");

        item.style.backgroundColor =
        transaction.type === "expense" ? "#ff000033" : "#00ff0033";

        item.style.padding = "10px";
        item.style.borderRadius = "8px";
        item.style.marginBottom = "8px";

        item.innerHTML =
        "<strong>" + transaction.type.toUpperCase() + "</strong>" +
        " | ₹" + transaction.amount +
        " | " + transaction.mode +
        " | " + transaction.category +
        "<br>" +
        "<small>" + transaction.date + "</small>" +
        (transaction.note ? "<br><em>Note: " + transaction.note + "</em>" : "");

        container.appendChild(item);
    });
}

displayTransactions();


// ============================================
// UPDATE ANALYTICS ON SCREEN
// ============================================
function displayAnalytics()
{
    const saved = localStorage.getItem("transactions");
    const transactions = saved ? JSON.parse(saved) : [];

    const now = new Date();

    let todayTotal = 0;
    let monthTotal = 0;
    let yearTotal = 0;

    transactions.forEach(function(transaction)
    {
        // Only count expenses, not income
        if(transaction.type !== "expense")
        {
            return;
        }

        const t = new Date(transaction.rawDate);

        // Check same year first
        if(t.getFullYear() === now.getFullYear())
        {
            yearTotal += transaction.amount;

            // Check same month inside same year
            if(t.getMonth() === now.getMonth())
            {
                monthTotal += transaction.amount;

                // Check same day inside same month
                // This resets automatically at midnight because
                // new Date() always reflects the real current time
                if(t.getDate() === now.getDate())
                {
                    todayTotal += transaction.amount;
                }
            }
        }
    });

    document.querySelector("#todaySpending").textContent =
    "Money Spent Today : ₹" + todayTotal;

    document.querySelector("#monthlySpending").textContent =
    "Money Spent This Month : ₹" + monthTotal;

    document.querySelector("#yearlySpending").textContent =
    "Money Spent This Year : ₹" + yearTotal;
}

displayAnalytics();


// ============================================
// AUTO REFRESH ANALYTICS AT MIDNIGHT
// Calculates ms remaining until 12:00:00 AM
// and schedules a refresh at that exact moment
// ============================================
function scheduleMidnightReset()
{
    const now = new Date();

    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0, 0         // at 12:00:00.000 AM
    );

    const msUntilMidnight = midnight - now;

    setTimeout(function()
    {
        // Update the date display
        const newDay = new Date();
        document.querySelector("#currentDate").textContent =
        "Today's Date : " + newDay.toDateString();

        // Refresh analytics so today's total resets to 0
        displayAnalytics();

        // Schedule again for the next midnight
        scheduleMidnightReset();

    }, msUntilMidnight);
}

scheduleMidnightReset();


// ============================================
// MONTHLY SUMMARY
// ============================================
function displayMonthlySummary()
{
    const saved = localStorage.getItem("transactions");
    const transactions = saved ? JSON.parse(saved) : [];

    const container = document.querySelector("#monthlySummaryContainer");
    const emptyMessage = document.querySelector("#monthlySummaryEmpty");

    // Only count expenses
    const expenses = transactions.filter(function(transaction)
    {
        return transaction.type === "expense";
    });

    if(expenses.length === 0)
    {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    // GROUP BY MONTH
    // Object acting as dictionary - key is "Month Year", value is total
    const monthlyTotals = {};

    expenses.forEach(function(transaction)
    {
        const date = new Date(transaction.rawDate);

        // Create a key like "May 2026"
        const monthName = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        const key = monthName + " " + year;

        if(monthlyTotals[key] === undefined)
        {
            monthlyTotals[key] = 0;
        }

        monthlyTotals[key] = monthlyTotals[key] + transaction.amount;
    });

    // DISPLAY EACH MONTH
    container.innerHTML = "";

    Object.keys(monthlyTotals).forEach(function(month)
    {
        const item = document.createElement("div");

        item.style.padding = "10px";
        item.style.borderRadius = "8px";
        item.style.marginBottom = "8px";
        item.style.backgroundColor = "#1b4332";
        item.style.color = "white";

        item.innerHTML =
        "<strong>" + month + "</strong>" +
        " : ₹" + monthlyTotals[month];

        container.appendChild(item);
    });
}

displayMonthlySummary();


// ============================================
// SAVE TRANSACTION - MAIN BUTTON LOGIC
// ============================================
const saveButton = document.querySelector("#saveTransaction");

saveButton.addEventListener("click", function(event)
{
    event.preventDefault();

    // Read form values
    const amount = Number(document.querySelector("#transactionAmount").value);
    const type = document.querySelector("#transactionType").value;
    const mode = document.querySelector("#paymentMode").value;
    const category = document.querySelector("#category").value;
    const note = document.querySelector("#note").value;


    // VALIDATION
    if(isNaN(amount) || amount <= 0)
    {
        alert("Please enter a valid amount!");
        return;
    }

    if(type === "")
    {
        alert("Please select transaction type!");
        return;
    }

    if(mode === "")
    {
        alert("Please select payment mode!");
        return;
    }

    if(category === "")
    {
        alert("Please select a category!");
        return;
    }


    // UPDATE BALANCE
    if(type === "expense")
    {
        if(mode === "UPI")
        {
            balance.upi = balance.upi - amount;
        }
        else
        {
            balance.cash = balance.cash - amount;
        }
    }
    else
    {
        // Income
        if(mode === "UPI")
        {
            balance.upi = balance.upi + amount;
        }
        else
        {
            balance.cash = balance.cash + amount;
        }
    }

    // Recalculate total
    balance.total = balance.upi + balance.cash;

    // Save updated balance to localStorage
    localStorage.setItem("balance", JSON.stringify(balance));


    // SAVE TRANSACTION TO HISTORY
    const now = new Date();

    const transaction =
    {
        amount: amount,
        type: type,
        mode: mode,
        category: category,
        note: note,
        date: now.toDateString(),
        rawDate: now.toISOString()
    };

    // Read existing transactions
    const saved = localStorage.getItem("transactions");
    const transactions = saved ? JSON.parse(saved) : [];

    // Add new one to the list
    transactions.push(transaction);

    // Save back to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));


    // UPDATE SCREEN
    displayBalance();
    displayTransactions();
    displayAnalytics();
    displayMonthlySummary();


    // CLEAR FORM
    document.querySelector("#transactionAmount").value = "";
    document.querySelector("#transactionType").value = "";
    document.querySelector("#paymentMode").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#note").value = "";
});


// ============================================
// EDIT BALANCE BUTTON
// ============================================
const editButton = document.querySelector("#editBalance");

editButton.addEventListener("click", function()
{
    window.location.href = "setup.html";
});


// ============================================
// RESET BUTTON
// ============================================
const resetButton = document.querySelector("#resetButton");

resetButton.addEventListener("click", function()
{
    const confirmed = window.confirm(
        "Are you sure? This will delete ALL your transactions and balance. This cannot be undone!"
    );

    if(confirmed === true)
    {
        // Clear everything from localStorage
        localStorage.removeItem("balance");
        localStorage.removeItem("transactions");
        localStorage.removeItem("visited");

        // Go back to setup page
        window.location.href = "setup.html";
    }
});