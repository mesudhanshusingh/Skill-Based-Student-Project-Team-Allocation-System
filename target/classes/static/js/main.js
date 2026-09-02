// Common Main JavaScript - API Helper & Theme Toggle

const API_BASE_URL = '/api';

// Initialize Theme on Page Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Auto-inject theme toggle button into navbar if not present
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.getElementById('themeToggleBtn')) {
        const toggleLi = document.createElement('li');
        toggleLi.innerHTML = `
            <button id="themeToggleBtn" class="theme-toggle-btn" onclick="toggleTheme()">
                ${document.body.classList.contains('dark-theme') ? '☀️ Light' : '🌙 Dark'}
            </button>
        `;
        navLinks.appendChild(toggleLi);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
    }
}

// Generic API Request Helper
async function apiRequest(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        let data = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            const errorMessage = (data && data.message) ? data.message : `Error: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// Generic Alert Helper
function showAlert(containerId, message, type = 'danger') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (container.firstChild) {
            container.innerHTML = '';
        }
    }, 5000);
}

function clearAlert(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}
