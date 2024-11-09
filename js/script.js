flatpickr("#expense-date", {
    dateFormat: "d-m-Y",  // dd-mm-yyyy format
    placeholder: "dd-mm-yyyy"  // Set placeholder
});


document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');

    // Arrays to store user input dynamically
    let categories = []; // Stores expense names
    let amounts = []; // Stores expense amounts

    // Handle form submission to add an expense
    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent form from refreshing the page

        // Get form values
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const date = document.getElementById('expense-date').value;

        // Check if inputs are valid (line 18-24)
        if (name && amount && date) {
            // Add expense to arrays (line 26-27)
            categories.push(name); // Add the name to the categories array
            amounts.push(amount); // Add the amount to the amounts array

            // Create table row dynamically to display on the page (line 29-34)
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${date}</td>
            `;
            expenseList.appendChild(row);

            // Clear form fields (line 36)
            expenseForm.reset();

            // Update the chart with the new data (line 39)
            updateChart();

            // Update total expenses and check against budget (line 42)
            updateTotalExpenses();
        } else {
            // Alert if any field is empty (line 45)
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

    // Function to update the chart with new data (line 48-55)
    function updateChart() {
        // Assuming you have the chart instance named `expenseChart`
        expenseChart.data.labels = categories; // Update chart labels with the categories array
        expenseChart.data.datasets[0].data = amounts; // Update chart data with the amounts array
        
        expenseChart.update(); // Re-render the chart
    }

    // Function to update total expenses and compare with the budget (line 57-74)
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

    // Initialize the chart with empty data (line 76-101)
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

    // Function to export the data as a CSV file (line 103-121)
    document.getElementById('export-btn').addEventListener('click', function () {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Category,Amount,Date\n"; // Headers for CSV file
        
        // Loop through the categories and amounts arrays to create CSV rows (line 108-112)
        categories.forEach((category, index) => {
            const amount = amounts[index];
            const date = document.getElementById('expense-date').value; // Get the date of expense entry
            let row = `${category},${amount.toFixed(2)},${date}`;
            csvContent += row + "\n"; // Add the row to CSV content
        });

        // Create download link for the CSV file (line 114-121)
        let encodedUri = encodeURI(csvContent);
        let downloadLink = document.createElement("a");
        downloadLink.href = encodedUri;
        downloadLink.download = "expenses.csv"; // Filename for the CSV file
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});
