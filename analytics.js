// ============================================
// CHECK BALANCE
// ============================================
const savedBalance = localStorage.getItem("balance");
if(savedBalance === null)
{
    window.location.href = "setup.html";
}


// ============================================
// QUICK STATS
// ============================================
const saved = localStorage.getItem("transactions");
const transactions = saved ? JSON.parse(saved) : [];

const now = new Date();
let todayTotal = 0;
let monthTotal = 0;
let yearTotal = 0;

transactions.forEach(function(t)
{
    if(t.type !== "expense") return;

    const date = new Date(t.rawDate);

    if(date.getFullYear() === now.getFullYear())
    {
        yearTotal += t.amount;

        if(date.getMonth() === now.getMonth())
        {
            monthTotal += t.amount;

            if(date.getDate() === now.getDate())
            {
                todayTotal += t.amount;
            }
        }
    }
});

document.querySelector("#todaySpending").textContent = "Money Spent Today : ₹" + todayTotal;
document.querySelector("#monthlySpending").textContent = "Money Spent This Month : ₹" + monthTotal;
document.querySelector("#yearlySpending").textContent = "Money Spent This Year : ₹" + yearTotal;


// ============================================
// MONTHLY SUMMARY WITH DAY BREAKDOWN
// ============================================
const expenses = transactions.filter(function(t)
{
    return t.type === "expense";
});

if(expenses.length === 0)
{
    document.querySelector("#summaryEmpty").style.display = "block";
}
else
{
    document.querySelector("#summaryEmpty").style.display = "none";

    // GROUP BY MONTH
    const byMonth = {};

    expenses.forEach(function(t)
    {
        const date = new Date(t.rawDate);
        const monthKey = date.toLocaleString("default", { month: "long" }) + " " + date.getFullYear();
        const dayKey = date.getDate() + " " + date.toLocaleString("default", { month: "long" }) + " " + date.getFullYear();

        if(!byMonth[monthKey]) byMonth[monthKey] = {};
        if(!byMonth[monthKey][dayKey]) byMonth[monthKey][dayKey] = [];

        byMonth[monthKey][dayKey].push(t);
    });

    const container = document.querySelector("#monthlySummaryContainer");

    // BUILD EACH MONTH BLOCK
    Object.keys(byMonth).forEach(function(month)
    {
        const monthBlock = document.createElement("div");
        monthBlock.classList.add("monthBlock");

        const monthHeading = document.createElement("div");
        monthHeading.classList.add("monthHeading");
        monthHeading.textContent = month;
        monthBlock.appendChild(monthHeading);

        const days = byMonth[month];

        // BUILD EACH DAY ROW
        Object.keys(days).forEach(function(day)
        {
            const dayTransactions = days[day];
            const dayTotal = dayTransactions.reduce(function(sum, t) { return sum + t.amount; }, 0);

            const dayRow = document.createElement("div");
            dayRow.classList.add("dayRow");

            const dayInfo = document.createElement("div");
            dayInfo.classList.add("dayInfo");
            dayInfo.innerHTML = "<span class='dayDate'>" + day + "</span><span class='dayTotal'>₹" + dayTotal + "</span>";

            const arrow = document.createElement("span");
            arrow.classList.add("arrow");
            arrow.textContent = "▶";

            dayInfo.appendChild(arrow);
            dayRow.appendChild(dayInfo);

            // BREAKDOWN (hidden by default)
            const breakdown = document.createElement("div");
            breakdown.classList.add("breakdown");
            breakdown.style.display = "none";

            dayTransactions.forEach(function(t)
            {
                const item = document.createElement("div");
                item.classList.add("breakdownItem");
                item.innerHTML = "<span>" + t.category + "</span><span>₹" + t.amount + "</span>";
                breakdown.appendChild(item);
            });

            dayRow.appendChild(breakdown);

            // TOGGLE ON ARROW CLICK
            arrow.addEventListener("click", function()
            {
                if(breakdown.style.display === "none")
                {
                    breakdown.style.display = "block";
                    arrow.textContent = "▼";
                }
                else
                {
                    breakdown.style.display = "none";
                    arrow.textContent = "▶";
                }
            });

            monthBlock.appendChild(dayRow);
        });

        container.appendChild(monthBlock);
    });
}