// Register Handler
const registerForm = document.getElementById('registerForm');
// Ensure element exists before adding event listener to avoid errors if script reused
if (registerForm) {
    // Password Visibility Toggle
    const toggleRegPasswordBtn = document.getElementById('toggleRegPasswordBtn');
    const regPasswordInput = document.getElementById('reg_password');

    if (toggleRegPasswordBtn && regPasswordInput) {
        toggleRegPasswordBtn.addEventListener('click', () => {
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);
            toggleRegPasswordBtn.classList.toggle('fa-eye');
            toggleRegPasswordBtn.classList.toggle('fa-eye-slash');
        });
    }

    registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullname = document.getElementById('reg_fullname').value;
    const email = document.getElementById('reg_email').value;
    const password = document.getElementById('reg_password').value;
    try {
        const response = await fetch(getApiUrl('api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password })
        });
        const data = await response.json();
        if (data.token || response.ok) {
        alert(data.msg || 'Registered successfully! Please login.');
        window.location.href = 'dashboard.html';
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
    fetch(getApiUrl('google-login'), {
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
    });
};

// Initialize Google Sign-In
function initGoogleRegister() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: "1019512196971-fpvp8ae7de9pni2q8lk314t4a7qbct55.apps.googleusercontent.com",
            callback: window.handleCredentialResponse
        });

        const regBtnContainer = document.querySelector('.g_id_signin');
        if (regBtnContainer) {
            google.accounts.id.renderButton(
                regBtnContainer,
                { theme: "outline", size: "large", width: 350 }
            );
        }
    }
}

// Ensure Google script is loaded
window.addEventListener('load', initGoogleRegister);

