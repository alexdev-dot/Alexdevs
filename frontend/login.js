// Toggle Logic
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

if (showRegister && loginForm && registerForm) {
    showRegister.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
}

if (showLogin && registerForm && loginForm) {
    showLogin.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
}

// Password Visibility Toggle
const setupPasswordToggle = (toggleBtnId, passwordInputId) => {
    const toggleBtn = document.getElementById(toggleBtnId);
    const passwordInput = document.getElementById(passwordInputId);

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            toggleBtn.classList.toggle('fa-eye');
            toggleBtn.classList.toggle('fa-eye-slash');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggle('togglePasswordBtn', 'password');
    setupPasswordToggle('toggleRegPasswordBtn', 'reg_password');
});

// Login Handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput || !passwordInput) return;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert(`Welcome ${data.user.fullname}`);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.msg || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        }
    });
}

// Register Handler
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('reg_fullname');
        const emailInput = document.getElementById('reg_email');
        const passwordInput = document.getElementById('reg_password');

        if (!nameInput || !emailInput || !passwordInput) return;

        const fullname = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password })
            });
            const data = await response.json();
            if (data.token || response.ok) {
                alert(data.msg || 'Registered successfully! Please login.');
                // Switch to login view
                registerForm.classList.add('hidden');
                if (loginForm) loginForm.classList.remove('hidden');
            } else {
                alert(data.msg || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        }
    });
}

// Google Handler (Shared)
window.handleCredentialResponse = function(response) {
    fetch('http://localhost:5000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert(`Welcome ${data.user.name}`);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.msg || 'Google login/signup failed');
        }
    })
    .catch(err => {
        console.error('Google login error:', err);
    });
};

// Initialize Google Sign-In
function initGoogle() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: "1019512196971-fpvp8ae7de9pni2q8lk314t4a7qbct55.apps.googleusercontent.com",
            callback: window.handleCredentialResponse
        });

        // Login Page Google Button
        const loginBtnContainer = document.querySelector('#loginForm .g_id_signin');
        if (loginBtnContainer) {
            google.accounts.id.renderButton(
                loginBtnContainer,
                { theme: "outline", size: "large", width: 400 } // Width 400 to ensure it covers our 100% width custom button
            );
        }

        // Register Page (inside Login HTML toggle) Google Button
        const regBtnContainer = document.querySelector('#registerForm .g_id_signin');
        if (regBtnContainer) {
            google.accounts.id.renderButton(
                regBtnContainer,
                { theme: "outline", size: "large", width: 400 }
            );
        }
    }
}

// Ensure Google script is loaded
window.addEventListener('load', initGoogle);

