// Settings that we want to fetch
const settings = ['username', 'chatId', 'telegramBotToken'];

// Fetch and populate the settings
chrome.storage.sync.get(settings, function (items) {
    if (!Object.keys(items).length) {
        console.error('Error getting username', settings);
        return;
    }
    console.log('Successfully fetched settings', items);
    // Assign the stored values to the input field
    if (items.username) {
        document.getElementById('username').value = items.username;
    }
    if (items.chatId) {
        document.getElementById('chatId').value = items.chatId;
    }
    if (items.telegramBotToken) {
        document.getElementById('telegramBotToken').value = items.telegramBotToken;
    }
});

// Save settings
document
    .getElementById('settings')
    .addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting
        chrome.storage.sync.set({
            username: document.getElementById('username').value,
            chatId: document.getElementById('chatId').value,
            telegramBotToken: document.getElementById('telegramBotToken').value,
        }, function () {
            console.log('Successfully saved settings');
        });
    });
