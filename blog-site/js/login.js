// ===================================
// Login Page Functionality
// ===================================

const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const themeToggle = document.getElementById('themeToggle');
const loginSuccess = document.getElementById('loginSuccess');
const loginCard = document.querySelector('.login-card');

// ===================================
// Password Visibility Toggle
// ===================================
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        togglePassword.innerHTML = type === 'password' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
               </svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
               </svg>`;
    });
}

// ===================================
// Theme Toggle (Dark/Light Mode)
// ===================================
if (themeToggle) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-mode');
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        
        document.body.classList.remove(isDark ? 'dark-mode' : 'light-mode');
        document.body.classList.add(newTheme + '-mode');
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

// ===================================
// Login Form Handler
// ===================================
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        const remember = formData.get('remember');
        
        // Get button elements
        const btnText = loginForm.querySelector('.btn-text');
        const btnLoader = loginForm.querySelector('.btn-loader');
        const submitBtn = loginForm.querySelector('.login-btn');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        
        // Simulate API call
        await simulateLogin(email, password);
        
        // Show success message
        loginForm.style.display = 'none';
        loginSuccess.style.display = 'flex';
        loginSuccess.classList.add('fade-in-up');
        
        // Save auth state if "remember me" is checked
        if (remember) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
        }
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// ===================================
// Simulate Login API Call
// ===================================
async function simulateLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simple validation (in real app, this would be an API call)
            if (email && password.length >= 6) {
                console.log('Login successful:', email);
                resolve({ success: true, email });
            } else {
                alert('Email ou senha inválidos. A senha deve ter pelo menos 6 caracteres.');
                resolve({ success: false });
                
                // Reset button state
                const submitBtn = loginForm.querySelector('.login-btn');
                const btnText = loginForm.querySelector('.btn-text');
                const btnLoader = loginForm.querySelector('.btn-loader');
                
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        }, 1500);
    });
}

// ===================================
// Social Login Buttons
// ===================================
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.classList.contains('google') ? 'Google' : 'GitHub';
        alert(`Login com ${provider} seria implementado com OAuth em um ambiente de produção.`);
    });
});

// ===================================
// Sign Up Link
// ===================================
document.querySelector('.signup-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Página de cadastro seria criada em um site real!');
});

// ===================================
// Forgot Password Link
// ===================================
document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Digite seu email para recuperar a senha:');
    if (email) {
        alert(`Um link de recuperação foi enviado para ${email}`);
    }
});

// ===================================
// Check if already logged in
// ===================================
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // User is already logged in, redirect to dashboard
        // Uncomment the line below to enable auto-redirect
        // window.location.href = 'dashboard.html';
    }
});

console.log('🔐 Página de login carregada!');
