// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function() {
    // Add an event listener to the form submission
    document.getElementById("ajaxMessageForm").addEventListener("submit", (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the values from the form inputs
        const username = document.getElementById("username").value;
        const country = document.getElementById("country").value;
        const message = document.getElementById("message").value;

        // Check if all fields are filled out
        if (username && country && message) {
            // Send a POST request to the server with the form data
            fetch("/ajaxmessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, country, message }), // Convert data to JSON format
            })
            .then((response) => {
                // Check if the response is OK
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                // Parse the response as JSON
                return response.json();
            })
            .then((messages) => {
                // Get the container where messages will be displayed
                const messagesContainer = document.getElementById("messagesContainer");
                // Clear any existing messages
                messagesContainer.innerHTML = "";

                // Iterate over each message received from the server
                messages.forEach((message) => {
                    // Create a new message card element
                    const messageDiv = document.createElement("div");
                    // Add Bootstrap classes to style the card
                    messageDiv.classList.add("card", "mb-3");
                    // Populate the card with message details
                    messageDiv.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${message.username} - ${message.country}</h5>
                            <p class="card-text">${message.message}</p>
                        </div>
                    `;
                    // Append the message card to the messages container
                    messagesContainer.appendChild(messageDiv);
                });
            })
            .catch((error) => {
                // Log any errors that occur during the fetch operation
                console.error("Error:", error);
            });
        } else {
            // Display an alert if any of the form fields are empty
            alert("All fields are required.");
        }
    });
});
