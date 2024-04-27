document.getElementById('generateBtn').addEventListener('click', function() {
    fetch('/generate', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById('questionDisplay').textContent = data.question;

            const imageDisplay = document.getElementById('imageDisplay');
            imageDisplay.src = data.image;
            imageDisplay.hidden = false;

            const speechDisplay = document.getElementById('speechDisplay');
            speechDisplay.src = data.speech;
            speechDisplay.hidden = false;  // Make the audio player visible
        })
        .catch(error => console.error('Error:', error));
});
