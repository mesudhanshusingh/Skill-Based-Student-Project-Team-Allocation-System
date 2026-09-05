const API_BASE_URL = 'https://skill-based-student-project-team.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbarControls();
    renderFooter();
});

function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
    }
}

function initNavbarControls() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let navControls = navbar.querySelector('.nav-controls');
    if (!navControls) {
        navControls = document.createElement('div');
        navControls.className = 'nav-controls';
        navbar.appendChild(navControls);
    }

    // 1. Theme Toggle Button (ALWAYS OUTSIDE hamburger menu)
    if (!document.getElementById('themeToggleBtn')) {
        const isDark = document.body.classList.contains('dark-theme');
        const themeBtn = document.createElement('button');
        themeBtn.id = 'themeToggleBtn';
        themeBtn.className = 'theme-toggle-btn';
        themeBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
        themeBtn.setAttribute('onclick', 'toggleTheme()');
        themeBtn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
        navControls.appendChild(themeBtn);
    }

    // 2. Hamburger Menu Button (OUTSIDE hamburger menu beside Theme Toggle)
    if (!document.getElementById('hamburgerBtn')) {
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.id = 'hamburgerBtn';
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
        hamburgerBtn.setAttribute('onclick', 'toggleMobileMenu()');
        hamburgerBtn.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
        navControls.appendChild(hamburgerBtn);
    }

    // Close mobile dropdown when a nav link is clicked
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (navLinks) navLinks.classList.toggle('mobile-active');
    if (hamburgerBtn) hamburgerBtn.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (navLinks) navLinks.classList.remove('mobile-active');
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
}

// Close mobile dropdown if user clicks anywhere outside navbar
document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (navbar && navLinks && navLinks.classList.contains('mobile-active')) {
        if (!navbar.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

function toggleTheme() {
    document.documentElement.classList.toggle('dark-theme');
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
}

function renderFooter() {
    const footer = document.querySelector('footer');
    if (footer && !footer.children.length) {
        footer.innerHTML = `<div class="footer-container"><span class="footer-credit">Designed by Sudhanshu Singh</span><div class="footer-social-logos"><a href="https://www.instagram.com/mesudhanshusingh?igsi=emliZ3JkZTE5cDY5" target="_blank" rel="noopener" class="social-logo-link" title="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a><a href="https://www.linkedin.com/in/sudhanshu-singh-777525276/" target="_blank" rel="noopener" class="social-logo-link" title="LinkedIn"><svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a><a href="https://github.com/mesudhanshusingh" target="_blank" rel="noopener" class="social-logo-link" title="GitHub"><svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a><a href="https://x.com/mesudhansingh" target="_blank" rel="noopener" class="social-logo-link" title="X (Twitter)"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a></div></div>`;
    }
}

async function apiRequest(endpoint, options = {}) {
    const config = { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } };
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
        let data = null;
        const ct = res.headers.get('content-type');
        if (ct && ct.includes('application/json')) data = await res.json();
        if (!res.ok) throw new Error((data && data.message) ? data.message : `Error: ${res.statusText}`);
        return data;
    } catch (err) {
        console.error(`API Error (${endpoint}):`, err);
        throw err;
    }
}

function showAlert(containerId, message, type = 'danger') {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => { if (c.firstChild) c.innerHTML = ''; }, 5000);
}

function clearAlert(containerId) {
    const c = document.getElementById(containerId);
    if (c) c.innerHTML = '';
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}
