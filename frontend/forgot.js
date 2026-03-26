const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const sendOTPBtn = document.getElementById('sendOTPBtn');
const forgotForm = document.getElementById('forgotForm');
const statusMsg = document.getElementById('statusMsg');

const API_URL = getApiUrl('api/auth');

// Step 1: Request OTP
sendOTPBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  if (!email) {
    showStatus('Please enter your email', 'red');
    return;
  }

  showStatus('Sending OTP...', 'cyan');
  sendOTPBtn.disabled = true;

  try {
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      showStatus('OTP sent to your email!', 'lime');
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    } else {
      showStatus(data.msg || 'Error sending OTP', 'red');
      sendOTPBtn.disabled = false;
    }
  } catch (err) {
    showStatus('Server error. Is the backend running?', 'red');
    sendOTPBtn.disabled = false;
  }
});

// Step 2: Reset Password
forgotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const otp = document.getElementById('otp').value;
  const newPassword = document.getElementById('newPassword').value;

  if (!otp || !newPassword) {
    showStatus('Please fill all fields', 'red');
    return;
  }

  showStatus('Resetting password...', 'cyan');

  try {
    const res = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      showStatus('Password reset successful! Redirecting to login...', 'lime');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 3000);
    } else {
      showStatus(data.msg || 'Error resetting password', 'red');
    }
  } catch (err) {
    showStatus('Server error', 'red');
  }
});

function showStatus(msg, color) {
  statusMsg.textContent = msg;
  statusMsg.style.color = color;
}
