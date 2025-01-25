async function search() {
    const input = document.getElementById("search-input").value;
    const resultsDiv = document.getElementById("results");
    const loader = document.getElementById("loader");

    if (input.trim() === "") {
        alert("Please enter a search term.");
        return;
    }

    loader.style.display = "block";
    resultsDiv.style.display = "none";

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAPEvicBP3RdncOFdmRl7Q081a5Cs7ubGY', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: input }
                        ]
                    }
                ]
            }),
        });

        const data = await response.json();
        resultsDiv.innerHTML = "";

        // Initialize markdown-it
        const md = window.markdownit(); // Ensure this works after markdown-it is loaded

        if (data.candidates && data.candidates.length > 0) {
            data.candidates.forEach(candidate => {
                const resultElement = document.createElement("div");
                resultElement.classList.add("result-item");

                const generatedText = candidate.content.parts[0].text;
                const htmlContent = md.render(generatedText.trim()); // Convert MD to HTML
                resultElement.innerHTML = htmlContent;

                const copyButton = document.createElement("button");
                copyButton.classList.add("copy-btn");
                copyButton.innerText = "Copy";

                const copiedMessage = document.createElement("span");
                copiedMessage.classList.add("copy-message");
                copiedMessage.style.display = "none";
                copiedMessage.innerText = "Copied!";

                // Handle the copy action
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(generatedText.trim()).then(() => {
                        copiedMessage.style.display = "inline";  // Show "Copied!" message
                        setTimeout(() => {
                            copiedMessage.style.display = "none";  // Hide after a short time
                        }, 2000);
                    }).catch(err => {
                        copiedMessage.style.display = "inline";
                        copiedMessage.innerText = "Failed to copy!";
                    });
                };

                resultElement.appendChild(copyButton);
                resultElement.appendChild(copiedMessage);
                resultsDiv.appendChild(resultElement);
            });
        } else {
            resultsDiv.innerHTML = "No results found.";
        }

        loader.style.display = "none";
        resultsDiv.style.display = "block";
        resultsDiv.style.opacity = "0";
        setTimeout(() => {
            resultsDiv.style.transition = "opacity 1s";
            resultsDiv.style.opacity = "1";
        }, 100);

    } catch (error) {
        console.error('Error fetching generated content:', error);
        alert('An error occurred while fetching content.');
        loader.style.display = "none";
    }
}

async function asyncSearch() {
    await search();  // Call the search function asynchronously
}
