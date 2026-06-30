// ============================================
// CHECK BALANCE
// ============================================
const savedBalance = localStorage.getItem("balance");
if(savedBalance === null)
{
    window.location.href = "setup.html";
}


// ============================================
// PRE-FILL SALARY IF EXISTS
// ============================================
const existingSalary = localStorage.getItem("salary");
if(existingSalary !== null)
{
    document.querySelector("#salary").value = existingSalary;
}


// ============================================
// SAVE SALARY
// ============================================
document.querySelector("#saveSalary").addEventListener("click", function()
{
    const salary = Number(document.querySelector("#salary").value);

    if(salary <= 0)
    {
        alert("Please enter a valid amount!");
        return;
    }

    localStorage.setItem("salary", salary);
    alert("Salary saved!");
});


// ============================================
// EDIT BALANCE
// ============================================
document.querySelector("#editBalance").addEventListener("click", function()
{
    window.location.href = "setup.html";
});


// ============================================
// RESET EVERYTHING
// ============================================
document.querySelector("#resetButton").addEventListener("click", function()
{
    const confirmed = window.confirm(
        "Are you sure? This will delete ALL your transactions and balance. Cannot be undone!"
    );

    if(confirmed === true)
    {
        localStorage.removeItem("balance");
        localStorage.removeItem("transactions");
        localStorage.removeItem("salary");
        localStorage.removeItem("visited");

        window.location.href = "Welcome.html";
    }
});