// api-interceptor.js - Runs in MAIN world to intercept API calls
(function () {
    'use strict';

    // Store the original fetch function
    const originalFetch = window.fetch;

    // Override fetch to intercept API calls
    window.fetch = function (...args) {
        const url = args[0];

        // Check if this is the search-by-url API call
        if (typeof url === 'string' && url.includes('/search-by-url')) {
            // Call the original fetch
            return originalFetch.apply(this, args)
                .then(response => {
                    // Clone the response so we can read it without consuming it
                    const clonedResponse = response.clone();

                    // Read the JSON data
                    clonedResponse.json().then(data => {
                        // Send the data to the content script
                        window.postMessage({
                            type: 'EMAG_API_DATA',
                            url: url,
                            data: data
                        }, window.location.origin);
                    }).catch(err => {
                        console.error('Error parsing API response:', err);
                    });

                    // Return the original response
                    return response;
                });
        }

        // For all other requests, just call the original fetch
        return originalFetch.apply(this, args);
    };
})();
