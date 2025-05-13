document.addEventListener('DOMContentLoaded', function() {
    const originalUrlInput = document.getElementById('original-url');
    const shortenBtn = document.getElementById('shorten-btn');
    const resultDiv = document.getElementById('result');
    const historyList = document.getElementById('history-list');

    // Load history from localStorage
    loadHistory();

    shortenBtn.addEventListener('click', shortenUrl);
    originalUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            shortenUrl();
        }
    });

    function shortenUrl() {
        const originalUrl = originalUrlInput.value.trim();
        
        if (!originalUrl) {
            showError('Please enter a URL');
            return;
        }

        // Basic URL validation
        try {
            new URL(originalUrl);
        } catch (e) {
            showError('Please enter a valid URL (include http:// or https://)');
            return;
        }

        // In a real app, you would call your backend API here
        // For this demo, we'll mock the response
        mockShortenUrl(originalUrl);
    }

    function mockShortenUrl(originalUrl) {
        // Show loading state
        shortenBtn.disabled = true;
        shortenBtn.textContent = 'Shortening...';

        // Simulate API delay
        setTimeout(() => {
            // Generate a random short code
            const shortCode = generateRandomString(6);
            const shortUrl = `https://short.url/${shortCode}`;
            
            // Save to history
            saveToHistory(originalUrl, shortUrl);
            
            // Display result
            showResult(originalUrl, shortUrl);
            
            // Reset button
            shortenBtn.disabled = false;
            shortenBtn.textContent = 'Shorten';
            
            // Clear input
            originalUrlInput.value = '';
        }, 800);
    }

    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function showResult(originalUrl, shortUrl) {
        resultDiv.className = 'result success';
        resultDiv.innerHTML = `
            <div class="result-content">
                <div class="original-url"><strong>Original URL:</strong> ${originalUrl}</div>
                <div class="short-url-container">
                    <div class="short-url"><strong>Short URL:</strong> ${shortUrl}</div>
                    <button class="copy-btn" data-url="${shortUrl}">Copy</button>
                </div>
            </div>
        `;
        
        // Add event listener to the new copy button
        resultDiv.querySelector('.copy-btn').addEventListener('click', copyToClipboard);
    }

    function showError(message) {
        resultDiv.className = 'result error';
        resultDiv.textContent = message;
    }

    function copyToClipboard(e) {
        const url = e.target.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(() => {
            const originalText = e.target.textContent;
            e.target.textContent = 'Copied!';
            e.target.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.backgroundColor = '#4fc3f7';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    function saveToHistory(originalUrl, shortUrl) {
        // Get existing history or create empty array
        const history = JSON.parse(localStorage.getItem('urlHistory')) || [];
        
        // Add new entry
        history.unshift({
            originalUrl,
            shortUrl,
            date: new Date().toISOString()
        });
        
        // Keep only the last 10 entries
        if (history.length > 10) {
            history.pop();
        }
        
        // Save back to localStorage
        localStorage.setItem('urlHistory', JSON.stringify(history));
        
        // Update UI
        loadHistory();
    }

    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('urlHistory')) || [];
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<li class="history-item">No history yet</li>';
            return;
        }
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-original">${item.originalUrl}</div>
                <div class="history-short">${item.shortUrl}</div>
                <div class="history-date">${formatDate(item.date)}</div>
            `;
            historyList.appendChild(li);
        });
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString();
    }
});