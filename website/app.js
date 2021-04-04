// API Key used to fetch weather data
const apikey = "e504a7859e3caf2a5e9374e2950522e6";
// Add listener to be executed on finishing loading DOM
window.addEventListener("DOMContentLoaded", function() {
    // Reference to the popup message
    const msg = document.querySelector("div#msg");
    // Reference to the ZIP code field
    const zipField = document.querySelector("input#zip");
    // Reference to the feelings field
    const feelingsField = document.querySelector("textarea#feelings");
    // Reference to the submit button
    const submitBtn = document.querySelector("input#generate");
    // Reference to the get recent button
    const getRecentBtn = document.querySelector("input#getRecent");
    // Function hiding the popup message
    const hideMsg = function () {
        // Hide the message
        msg.style.opacity = 0;
    }
    // Function showing the popup message
    const showMsg = function (msgTitle, msgTxt, type = "success") {
        // Set the type of the message
        msg.className = type;
        // Set the title of the message
        msg.querySelector("strong").innerText = msgTitle;
        // Set the text of the message
        msg.querySelector("p").innerText = msgTxt;
        // Show the message
        msg.style.opacity = 1;
        // Hide the message after 3s
        setTimeout(hideMsg, 3000);
    }
    // Function posting entered data to the server
    const postData = async () => {
        // Entered ZIP code
        const zipCode = zipField.value;
        // Entered user's feelings
        const feelings = feelingsField.value;
        try {
            // Fetch weather raw data
            const currWeatherRaw =
                await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=metric&appid=${apikey}`);
            // parse raw data as JSON
            const currWeather = await currWeatherRaw.json();
            // Initalize a new Date object
            const rawDate = new Date();
            // Fomrat Date
            const currDate = `${rawDate.getMonth()}/${rawDate.getDate()}/${rawDate.getFullYear()}`;
            // Extract temperature
            const currTemp = currWeather.main.temp;
            // Post entered data to the server
            const entryAddReq = await fetch("/addEntry", {
                method: "POST",
                credentials : "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date: currDate,
                    temp: currTemp,
                    content: feelings
                })
            });
            // Get the response from the server
            const entryAddRes = await entryAddReq.text();
            // Check if data posted successfully
            if (entryAddRes === "OK") {
                // Cancel any pending message hiding if any
                clearTimeout(hideMsg);
                // Hide the current message if any
                hideMsg();
                // Show a success popup message
                showMsg("Success", "Data Entered Successfully!");
            };
            // Set the text of submit button back
            submitBtn.value = "Submit";
            // Activate submit button
            submitBtn.disabled = false;
            // Activate get recent button
            getRecentBtn.disabled = false;
        } catch (err) {
            // Cancel any pending message hiding if any
            clearTimeout(hideMsg);
            // Hide the current message if any
            hideMsg();
            // Show a popup message holding the error
            showMsg("Error", err, "err");
            // Set the text of submit button back
            submitBtn.value = "Submit";
            // Activate submit button
            submitBtn.disabled = false;
            // Activate get recent button
            getRecentBtn.disabled = false;
        };
    };
    // Add listener to be executed on clicking submit button
    submitBtn.addEventListener("click", function(e) {
        // Stop event propagation
        e.stopPropagation();
        // Prevent the default submit behaviour
        e.preventDefault();
        // Cancel any pending message hiding if any
        clearTimeout(hideMsg);
        // Hide the current message if any
        hideMsg();
        // Check if both input fields are filled
        if (zipField.value && feelingsField.value) {
            // Disable submit button
            e.target.disabled = true;
            // Change the text of submit button to Please Wait
            e.target.value = "Please Wait…";
            // Disable get recent button
            getRecentBtn.disabled = true;
            // Trigger data posting
            postData();
        } else {
            // Show a popup message to aware user of filling both fields
            showMsg("Error" ,"Missing required data!", "err");
        }
    });
    // Add listener to be executed on clicking get recent button
    getRecentBtn.addEventListener("click", function(e) {
        // Stop event propagation
        e.stopPropagation();
        // Prevent the default submit behaviour
        e.preventDefault();
        // Cancel any pending message hiding if any
        clearTimeout(hideMsg);
        // Hide the current message if any
        hideMsg();
        // Disable get recent button
        e.target.disabled = true;
        // Change the text of get recent button to Please Wait
        e.target.value = "Please Wait…";
        // Disable submit button
        submitBtn.disabled = true;
        // Trigger fetching recent entry
        fetch("/getRecent")
            .then(response => response.json())
            .then(data => {
                if (!data.date) {
                    showMsg("Error" ,"No recent entries!", "err");
                } else {
                    const formattedResult = `Date: ${data.date}\nTemp: ${data.temp}°C\nFeeling: ${data.content}`;
                    showMsg("Most Recent Entry", formattedResult);
                }
                // Set the text of get recent button back
                e.target.value = "Get Recent Entry";
                // Activate get recent button
                e.target.disabled = false;
                // Activate submit button
                submitBtn.disabled = false;
            }).catch(err => {
                // Cancel any pending message hiding if any
                clearTimeout(hideMsg);
                // Hide the current message if any
                hideMsg();
                // Show a popup message holding the error
                showMsg("Error", err, "err");
                // Set the text of get recent button back
                e.target.value = "Get Recent Entry";
                // Activate get recent button
                e.target.disabled = false;
                // Activate submit button
                submitBtn.disabled = false;
            })
    });
});