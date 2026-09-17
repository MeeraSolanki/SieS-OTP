/**
 * SieS OTP Generator - Offline Progressive Web App
 * Bit-for-bit identical to C# OtpService implementation
 */

// DOM Elements
const txtUserId = document.getElementById('txtUserId');
const dtpDate = document.getElementById('dtpDate');
const lblOtp = document.getElementById('lblOtp');
const btnGenerate = document.getElementById('btnGenerate');
const btnCopy = document.getElementById('btnCopy');
const errorBanner = document.getElementById('errorBanner');
const lblErrorMessage = document.getElementById('lblErrorMessage');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Set default date to today (Local YYYY-MM-DD)
function initDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  dtpDate.value = `${year}-${month}-${day}`;
}

// Format input date into yyyyMMdd for hash computation
function getFormattedDate(dateString) {
  if (!dateString) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }
  // dateString is YYYY-MM-DD from HTML date input
  return dateString.replace(/-/g, '');
}

/**
 * Generates OTP matching C# BitConverter.ToInt32(hash, 0)
 * string s = $"{userId}:{date:yyyyMMdd}";
 * SHA256 hash -> Little Endian 32-bit int -> (Math.abs(val) % 1000000).ToString("D6")
 */
async function generateOtp(userId, dateFormatted) {
  const payload = `${userId}:${dateFormatted}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);

  // Compute SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const dataView = new DataView(hashBuffer);

  // C# BitConverter.ToInt32 is little-endian on x86/ARM
  const int32Value = dataView.getInt32(0, true);
  const otpNumber = Math.abs(int32Value) % 1000000;
  return otpNumber.toString().padStart(6, '0');
}

// Error handling
function showError(message) {
  lblErrorMessage.textContent = message;
  errorBanner.classList.add('show');
}

function hideError() {
  lblErrorMessage.textContent = '';
  errorBanner.classList.remove('show');
}

// Toast notification
let toastTimer = null;
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Generate OTP Click Handler
btnGenerate.addEventListener('click', async () => {
  const userId = txtUserId.value.trim();
  const dateStr = getFormattedDate(dtpDate.value);

  if (!userId) {
    showError('Please enter a User ID.');
    lblOtp.textContent = '------';
    lblOtp.classList.add('otp-placeholder');
    btnCopy.classList.remove('active');
    return;
  }

  if (userId.toLowerCase() !== 'admin') {
    showError('User ID is invalid. Enter a valid User ID.');
    lblOtp.textContent = '------';
    lblOtp.classList.add('otp-placeholder');
    btnCopy.classList.remove('active');
    return;
  }

  hideError();

  try {
    const otp = await generateOtp(userId, dateStr);
    lblOtp.textContent = otp;
    lblOtp.classList.remove('otp-placeholder');
    btnCopy.classList.add('active');

    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  } catch (err) {
    showError('Error generating OTP. Please try again.');
    console.error(err);
  }
});

// Copy OTP Handler
btnCopy.addEventListener('click', async () => {
  const currentOtp = lblOtp.textContent.trim();
  if (!currentOtp || currentOtp === '------') return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(currentOtp);
    } else {
      // Fallback for older web views
      const textarea = document.createElement('textarea');
      textarea.value = currentOtp;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    showToast('OTP copied to clipboard!');
    if ('vibrate' in navigator) {
      navigator.vibrate([15, 30, 15]);
    }
  } catch (err) {
    showToast('Failed to copy OTP');
    console.error(err);
  }
});

// Input change listeners to reset state
txtUserId.addEventListener('input', () => {
  hideError();
  lblOtp.textContent = '------';
  lblOtp.classList.add('otp-placeholder');
  btnCopy.classList.remove('active');
});

dtpDate.addEventListener('change', () => {
  hideError();
  lblOtp.textContent = '------';
  lblOtp.classList.add('otp-placeholder');
  btnCopy.classList.remove('active');
});

// Keyboard support (Enter key in User ID field triggers Generate)
txtUserId.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    btnGenerate.click();
  }
});

// Service Worker Registration for 100% offline usage
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('SieS OTP Service Worker active:', reg.scope);
      })
      .catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
  });
}

// Initialize on page load
initDate();
