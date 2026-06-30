// ============================================
// HOME PAGE - ADD TRANSACTION LOGIC
// ============================================

// Check if balance exists, if not send to setup
const savedBalance = localStorage.getItem("balance");

if(savedBalance === null)
{
    window.location.href = "setup.html";
}

const balance = JSON.parse(savedBalance);


// ============================================
// SAVE TRANSACTION
// ============================================
const saveButton = document.querySelector("#saveTransaction");

saveButton.addEventListener("click", function()
{
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
        // Reimbursement = money coming back in
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

    // Save updated balance
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

    const saved = localStorage.getItem("transactions");
    const transactions = saved ? JSON.parse(saved) : [];

    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    // CLEAR FORM
    document.querySelector("#transactionAmount").value = "";
    document.querySelector("#transactionType").value = "";
    document.querySelector("#paymentMode").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#note").value = "";

    alert("Transaction saved!");
});