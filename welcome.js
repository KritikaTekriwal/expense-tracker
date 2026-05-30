// STEP 1 - Check if user has visited before
const hasVisited = localStorage.getItem("visited");

if(hasVisited)
{
    // User has visited before - skip welcome, go to dashboard
    window.location.href = "dashboad.html";
}


// STEP 2 - If they are seeing welcome page, 
// clicking button saves visited and goes to setup
const startButton = document.querySelector(".startButton");

startButton.addEventListener("click", function()
{
    // Save in localStorage that user has visited
    localStorage.setItem("visited", "true");

    // Go to setup page
    window.location.href = "setup.html";
});