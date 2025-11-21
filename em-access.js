// em-access.js - Runs in MAIN world to access page globals
if (typeof EM !== 'undefined' && EM.listingGlobals && EM.listingGlobals.items) {
  // Send data to ISOLATED world content script
  window.postMessage({ type: 'EM_DATA', data: EM.listingGlobals.items }, window.location.origin);
}