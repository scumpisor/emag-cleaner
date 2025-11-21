// popup.js
const emagSoldCheckbox = document.getElementById('emagSold');
const promotedCheckbox = document.getElementById('promoted');

// Load settings from storage
chrome.storage.sync.get(['emagSold', 'promoted'], (result) => {
  emagSoldCheckbox.checked = result.emagSold || false;
  promotedCheckbox.checked = result.promoted || false;
});

// Save settings on change
emagSoldCheckbox.addEventListener('change', () => {
  chrome.storage.sync.set({ emagSold: emagSoldCheckbox.checked });
});

promotedCheckbox.addEventListener('change', () => {
  chrome.storage.sync.set({ promoted: promotedCheckbox.checked });
});