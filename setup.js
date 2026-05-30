const saveButton = document.querySelector(".Savebutton");


// ============================================
// PRE-FILL FIELDS IF BALANCE ALREADY EXISTS
// ============================================
const existingBalance = localStorage.getItem("balance");

if(existingBalance !== null)
{
    const balance = JSON.parse(existingBalance);

    // Fill the input fields with current values
    document.querySelector("#UPI").value = balance.upi;
    document.querySelector("#Cash").value = balance.cash;
}


// ============================================
// SAVE BUTTON
// ============================================
saveButton.addEventListener("click", function(event)
{
    event.preventDefault();

    const upiBalance = Number(document.querySelector("#UPI").value);
    const cashBalance = Number(document.querySelector("#Cash").value);

    // VALIDATION
    if(upiBalance === 0 && cashBalance === 0)
    {
        alert("Please enter your UPI and Cash balance to continue!");
        return;
    }

    // PACK INTO OBJECT
    const balance =
    {
        upi: upiBalance,
        cash: cashBalance,
        total: upiBalance + cashBalance
    };

    // SAVE TO LOCALSTORAGE
    localStorage.setItem("balance", JSON.stringify(balance));

    // GO TO DASHBOARD
    window.location.href = "dashboad.html";
});