// ============================================
// SIDEBAR OPEN / CLOSE LOGIC
// ============================================

const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");

// Open sidebar
menuButton.addEventListener("click", function()
{
    sidebar.classList.add("open");
    overlay.classList.add("active");
});

// Close sidebar when overlay is clicked
overlay.addEventListener("click", function()
{
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
});