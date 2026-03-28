/**
 * Authentication Module
 * Handles user login, registration, logout, and authentication state
 */

let currentUser = null;

async function loadCurrentUserFromStorage() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return false;

    const userString = sessionStorage.getItem('currentUser');
    if (userString) {
        try {
            currentUser = JSON.parse(userString);
            return true;
        } catch (error) {
            console.warn('Failed to restore user from storage:', error);
            currentUser = null;
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('authToken');
            return false;
        }
    }

    try {
        const result = await authAPI.getMe();
        if (result.success && result.data.user) {
            currentUser = result.data.user;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        }
    } catch (error) {
        console.warn('Failed to refresh current user from API:', error);
    }

    sessionStorage.removeItem('authToken');
    return false;
}

// Validate login form inputs
function validateLoginForm() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errors = {};

    if (!email) {
        errors.email = 'Email is required';
    } else if (!email.endsWith('@riarauniversity.ac.ke')) {
        errors.email = 'Please use your university email';
    }

    if (!password) {
        errors.password = 'Password is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
}

// Secure login with API structure (ready for backend)
async function login() {
    const validation = validateLoginForm();

    if (!validation.isValid) {
        Object.values(validation.errors).forEach(error => {
            showNotification('Validation Error', error, 'error');
        });
        return;
    }

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        console.log('🔐 Attempting login for:', email);
        const result = await authAPI.login(email, password);
        console.log('🔐 Login result:', result);

        if (result.success) {
            currentUser = result.data.user;
            sessionStorage.setItem('authToken', result.data.token);
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
            showNotification('Login Successful', `Welcome back, ${currentUser.firstName}!`);
        } else {
            showNotification('Login Failed', result.error || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Error', 'Login failed. Please try again.', 'error');
    }
}

// Validate registration form inputs
function validateRegistrationForm() {
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const id = document.getElementById('regId').value.trim();
    const department = document.getElementById('regDepartment').value;
    const password = document.getElementById('regPassword').value;
    const errors = {};

    if (!firstName || firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
    }

    if (!lastName || lastName.length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!email || !email.endsWith('@riarauniversity.ac.ke')) {
        errors.email = 'Please use a valid university email (name@riarauniversity.ac.ke)';
    }

    if (!id || id.length < 5) {
        errors.id = 'Invalid student/staff ID';
    }

    if (!department) {
        errors.department = 'Please select a department';
    }

    if (!password || password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }

    if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter';
    }

    if (!/[0-9]/.test(password)) {
        errors.password = 'Password must contain at least one number';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
}

// Secure registration with API structure
async function register() {
    const validation = validateRegistrationForm();

    if (!validation.isValid) {
        Object.values(validation.errors).forEach(error => {
            showNotification('Validation Error', error, 'error');
        });
        return;
    }

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const id = document.getElementById('regId').value.trim();
    const department = document.getElementById('regDepartment').value;
    const password = document.getElementById('regPassword').value;

    try {
        console.log('📝 Attempting registration for:', email);
        const result = await authAPI.register(firstName, lastName, email, id, department, password);
        console.log('📝 Registration result:', result);

        if (result.success) {
            currentUser = result.data.user;
            sessionStorage.setItem('authToken', result.data.token);
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
            showNotification('Registration Successful', `Welcome to Tanga Tunga, ${firstName}!`);
        } else {
            showNotification('Registration Failed', result.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Error', 'Registration failed. Please try again.', 'error');
    }
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');

    // In production: Call backend logout endpoint
    // fetch(`${API_BASE}/api/auth/logout`, {
    //     method: 'POST',
    //     credentials: 'include'
    // }).catch(error => console.error('Logout error:', error));

    goToHome();
    showNotification('Logged Out', 'You have been successfully logged out');
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null && sessionStorage.getItem('authToken') !== null;
}

// Switch between login and registration tabs
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

    if (tab === 'login') {
        document.querySelector('.tab:first-child').classList.add('active');
        document.getElementById('loginTab').classList.add('active');
    } else {
        document.querySelector('.tab:last-child').classList.add('active');
        document.getElementById('registerTab').classList.add('active');
    }
}
