/**
 * App Initialization Module
 * Handles window.onload and app startup
 */

console.log('Script modules loading...');

// Initialize app with security checks
window.onload = function() {
    console.log('Window.onload executing...');

    // Verify security environment
    checkSecurityHeaders();

    // Restore authentication state from storage
    if (typeof loadCurrentUserFromStorage === 'function') {
        loadCurrentUserFromStorage();
    }

    // Set up form handlers
    setupFormHandlers();

    // Add event listeners to Get Started buttons
    const getStartedButtons = document.querySelectorAll('.get-started-btn');
    console.log('Found', getStartedButtons.length, 'Get Started buttons');

    getStartedButtons.forEach((btn, index) => {
        console.log(`Setting up event listener for button ${index + 1}`);
        // Note: onclick is already set in HTML, so we don't add another listener
        // btn.addEventListener('click', function(e) {
        //     console.log(`Get Started button ${index + 1} clicked!`);
        //     goToAuth();
        // }, false);

        // Make sure buttons are enabled and visible
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
        btn.style.pointerEvents = 'auto';
    });

    // Clear any sensitive data from URL
    window.history.replaceState({}, document.title, window.location.pathname);

    // Navigate to home
    goToHome();

    console.log('Window.onload complete!');
};

console.log('App initialization module loaded successfully!');
