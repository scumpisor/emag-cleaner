// content.js
let emItems = null; // Store EM data
let emMap = null; // Map for quick lookup by id


// Function to apply filtering
function applyFilters() {
    chrome.storage.sync.get(['emagSold', 'promoted'], (result) => {
        const hideThirdParty = result.emagSold; // Hide items not sold by eMAG (third-party)
        const hidePromoted = result.promoted;

        // Assuming product cards are in elements with class 'card-item' or similar
        const products = document.querySelectorAll('.card-item, .product-card');

        products.forEach((product, index) => {
            let hide = false;
            const productId = product.getAttribute('data-product-id');

            // Retrieve vendor info from EM data
            let vendor = emMap?.get(parseInt(productId))?.offer?.vendor?.name?.default;

            // Hide third-party items based on EM data
            if (hideThirdParty && vendor && vendor !== 'eMAG') {
                hide = true;
            }

            // Hide promoted items (using DOM selector or data)
            if (hidePromoted && (product.querySelector('span.badge.bg-light.bg-opacity-90'))) {
                hide = true;
            }

            product.style.display = hide ? 'none' : '';
        });
    });
}

// Apply filters on page loads
applyFilters();

// Listen for storage changes to reapply filters
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && (changes.emagSold || changes.promoted)) {
        applyFilters();
    }
});

// Observe for dynamic content loading (e.g., infinite scroll)
const observer = new MutationObserver((mutations) => {
    let hasNewProducts = false;
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE && (node.matches('.card-item, .product-card') || node.querySelector('.card-item, .product-card'))) {
                hasNewProducts = true;
            }
        });
    });
    if (hasNewProducts) {
        applyFilters();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for EM data from MAIN world
window.addEventListener('message', (event) => {
    // Validate origin to prevent malicious sites from injecting data
    if (event.origin !== window.location.origin) {
        return;
    }
    // Validate source is the same window
    if (event.source !== window) {
        return;
    }
    if (event.data.type === 'EM_DATA') {
        emItems = event.data.data;
        emMap = new Map(emItems.map(item => [item.id, item]));
        applyFilters();
    }
});