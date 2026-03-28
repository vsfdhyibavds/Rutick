// Global notification utility
function showNotification(title, message, type = 'success') {
    const box = document.getElementById('notificationBox');
    if (!box) return;

    const notification = document.createElement('div');
    notification.className = 'notification';

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3';

    notification.style.cssText = `
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease;
        border-left: 4px solid ${bgColor};
    `;

    notification.innerHTML = `
        <div style="font-size: 24px;">${icon}</div>
        <div style="flex: 1;">
            <h4 style="margin: 0 0 5px 0; color: #333;">${title}</h4>
            <p style="margin: 0; font-size: 13px; color: #666;">${message}</p>
        </div>
    `;

    box.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Loading states
function showLoading(show = true) {
    let loader = document.getElementById('loadingIndicator');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingIndicator';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            text-align: center;
        `;
        document.body.appendChild(loader);
    }

    if (show) {
        loader.style.display = 'block';
        loader.innerHTML = `
            <div style="font-size: 48px;">⏳</div>
            <p>Loading...</p>
        `;
    } else {
        loader.style.display = 'none';
    }
}

// Format date helper
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time helper
function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Safe DOM operations
function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = text; // Use textContent to prevent XSS
    }
}

function setHTML(elementId, html) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = html; // Only use when necessary
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@riarauniversity\.ac\.ke$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password);
}

// Local storage with encryption-like behavior
const SafeStorage = {
    set: (key, value) => {
        try {
            // Only store non-sensitive data
            if (key.includes('password') || key.includes('secret')) {
                return false;
            }
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    get: (key) => {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    },

    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    clear: () => {
        try {
            sessionStorage.clear();
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Security utilities
function checkSecurityHeaders() {
    // This would be called after backend API is set up
    // In production environment, verify:
    // - Content-Security-Policy header
    // - X-XSS-Protection header
    // - X-Frame-Options header
    // - X-Content-Type-Options header
    // - Strict-Transport-Security header
    console.log('🔒 Security headers check would run in production');
}

// Get CSRF token (mock for development)
function getCsrfToken() {
    // In production: retrieve from secure server response
    // Token should be httpOnly cookie, never in localStorage
    return 'csrf_token_' + Date.now();
}

// Set up form submission handlers for security
function setupFormHandlers() {
    const loginPassword = document.getElementById('loginPassword');
    const registerPassword = document.getElementById('regPassword');

    const submitOnEnter = (event) => {
        if (event.key === 'Enter') {
            const active = document.activeElement;
            if (active === loginPassword) {
                event.preventDefault();
                login();
            }
            if (active === registerPassword) {
                event.preventDefault();
                register();
            }
        }
    };

    if (loginPassword) {
        loginPassword.addEventListener('keydown', submitOnEnter);
    }

    if (registerPassword) {
        registerPassword.addEventListener('keydown', submitOnEnter);
    }
}

// Export utilities
window.showNotification = showNotification;
window.showLoading = showLoading;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.SafeStorage = SafeStorage;
window.checkSecurityHeaders = checkSecurityHeaders;
window.getCsrfToken = getCsrfToken;
window.setupFormHandlers = setupFormHandlers;
