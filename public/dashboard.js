document.getElementById('conceptualizeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect form data
    const eventPurpose = document.getElementById('eventPurpose').value;
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const budget = document.getElementById('budget').value;
    const theme = document.getElementById('theme').value;
    const venue = document.getElementById('venue').value;
    const foodBeverage = document.getElementById('foodBeverage').value;
    const decorations = document.getElementById('decorations').value;

    const entertainment = [];
    document.querySelectorAll('input[name="entertainment"]:checked').forEach(el => {
        entertainment.push(el.value);
    });

    // Simple validation
    if (!eventPurpose || !guests || !date || !budget || !theme || !venue || !foodBeverage || !decorations || entertainment.length === 0) {
        alert("Please fill out all fields and select at least one entertainment option.");
        return;
    }

    const eventData = {
        eventPurpose,
        guests,
        date,
        budget,
        theme,
        venue,
        foodBeverage,
        entertainment,
        decorations
    };

    try {
        const response = await fetch('/dashboard-submit', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
        });

        const result = await response.text();
        alert(result);
        document.getElementById('formData').innerHTML = `
          <h3>Event Saved Successfully!</h3>
          <p><strong>Purpose:</strong> ${eventPurpose}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Theme:</strong> ${theme}</p>
          <p><strong>Venue:</strong> ${venue}</p>
          <p><strong>Food:</strong> ${foodBeverage}</p>
          <p><strong>Entertainment:</strong> ${entertainment.join(', ')}</p>
          <p><strong>Decorations:</strong> ${decorations}</p>
        `;
    } catch (err) {
        console.error("Error:", err);
        alert("Failed to save event!");
    }
});
