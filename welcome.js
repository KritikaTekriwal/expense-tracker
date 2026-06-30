const hasVisited = localStorage.getItem("visited");
const hasBalance = localStorage.getItem("balance");

if(hasVisited && hasBalance)
{
    window.location.href = "home.html";
}

const startButton = document.querySelector("#startButton");

startButton.addEventListener("click", function()
{
    window.location.href = "setup.html";
});