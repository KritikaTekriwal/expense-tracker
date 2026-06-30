// ============================================
// PRE-FILL IF BALANCE ALREADY EXISTS
// ============================================
const existingBalance = localStorage.getItem("balance");

if(existingBalance !== null)
{
    const balance = JSON.parse(existingBalance);
    document.querySelector("#UPI").value = balance.upi;
    document.querySelector("#Cash").value = balance.cash;
}

const existingSalary = localStorage.getItem("salary");

if(existingSalary !== null)
{
    document.querySelector("#salary").value = existingSalary;
}


// ============================================
// SAVE BUTTON
// ============================================
const saveButton = document.querySelector("#saveSetup");

saveButton.addEventListener("click", function()
{
    const upiBalance = Number(document.querySelector("#UPI").value);
    const cashBalance = Number(document.querySelector("#Cash").value);
    const salary = Number(document.querySelector("#salary").value);

    // VALIDATION
    if(upiBalance === 0 && cashBalance === 0)
    {
        alert("Please enter at least one balance to continue!");
        return;
    }

    // SAVE BALANCE
    const balance =
    {
        upi: upiBalance,
        cash: cashBalance,
        total: upiBalance + cashBalance
    };

    localStorage.setItem("balance", JSON.stringify(balance));

    // SAVE SALARY (only if entered)
    if(salary > 0)
    {
        localStorage.setItem("salary", salary);
    }

    // MARK AS VISITED
    localStorage.setItem("visited", "true");

    // GO TO HOME
    window.location.href = "home.html";
});