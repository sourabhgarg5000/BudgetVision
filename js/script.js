document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    let categories = []; // Stores expense names
    let amounts = []; // Stores expense amounts

    // Handle form submission to add an expense
    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const date = document.getElementById('expense-date').value;

        // Check if inputs are valid
        if (name && amount && date) {
            // Add expense to arrays
            categories.push(name);
            amounts.push(amount);

            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${date}</td>
            `;
            expenseList.appendChild(row);

            // Clear form fields
            expenseForm.reset();

            // Update the chart
            updateChart();

            // Update total expenses and check against budget
            updateTotalExpenses();
        } else {
            alert("Please fill out all fields.");
        }
        function updateCurrentDate() {
          const dateElement = document.getElementById('expense-date');
          const now = new Date();
          const options = { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          };
          dateElement.textContent = now.toLocaleDateString('en-US', options);
        }

        // Update date immediately and then every minute
        updateCurrentDate();
        setInterval(updateCurrentDate, 60000);
    });

    function updateChart() {
        // Assuming you have the chart instance named `expenseChart`
        expenseChart.data.labels = categories; // Update chart labels with the categories array
        expenseChart.data.datasets[0].data = amounts; // Update chart data with the amounts array
        
        expenseChart.update(); // Re-render the chart
    }

    function updateTotalExpenses() {
        // Calculate the total expenses
        const totalExpenses = amounts.reduce((acc, curr) => acc + curr, 0);

        // Update the total expenses display
        const totalExpensesElement = document.getElementById('total-expenses');
        totalExpensesElement.textContent = `₹${totalExpenses.toFixed(2)}`;

        // Get the budget input value
        const budgetInput = parseFloat(document.getElementById('budget').value);

        // Compare total expenses with the budget and change color accordingly
        if (budgetInput && totalExpenses > budgetInput) {
            totalExpensesElement.style.color = 'red'; // Set color to red if over budget
        } else {
            totalExpensesElement.style.color = 'green'; // Green if within budget
        }
    }

    // Initialize the chart with empty data
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
        type: 'bar', // or 'pie' for a pie chart
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
                data: amounts,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
document.getElementById('export-btn').addEventListener('click', function () {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Amount\n"; // Headers
    // Replace with dynamically generated data
    let expenseData = [
        { category: 'Rent', amount: 1200 },
        { category: 'Groceries', amount: 300 },
        { category: 'Utilities', amount: 150 }
    ];

    expenseData.forEach(item => {
        let row = item.category + "," + item.amount;
        csvContent += row + "\n";
    });

    let encodedUri = encodeURI(csvContent);
    let downloadLink = document.createElement("a");
    downloadLink.href = encodedUri;
    downloadLink.download = "expenses.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

