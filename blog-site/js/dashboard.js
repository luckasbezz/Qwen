// ===================================
// Dashboard Page Functionality
// ===================================

const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const newArticleBtn = document.getElementById('newArticleBtn');
const newArticleModal = document.getElementById('newArticleModal');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const newArticleForm = document.getElementById('newArticleForm');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// ===================================
// User Dropdown Toggle
// ===================================
if (userBtn) {
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown.classList.remove('active');
    });

    // Prevent dropdown from closing when clicking inside it
    userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ===================================
// Mobile Menu Toggle
// ===================================
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ===================================
// Modal Functionality
// ===================================
if (newArticleBtn && newArticleModal) {
    newArticleBtn.addEventListener('click', () => {
        newArticleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking overlay
    newArticleModal.querySelector('.modal-overlay')?.addEventListener('click', closeModal);

    function closeModal() {
        newArticleModal.classList.remove('active');
        document.body.style.overflow = '';
        newArticleForm.reset();
    }
}

// ===================================
// New Article Form Handler
// ===================================
if (newArticleForm) {
    newArticleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('articleTitle').value;
        const category = document.getElementById('articleCategory').value;
        const content = document.getElementById('articleContent').value;
        
        console.log('New article:', { title, category, content });
        
        // Show success message
        alert(`Artigo "${title}" criado com sucesso! Em um ambiente real, ele seria salvo no banco de dados.`);
        
        // Close modal
        newArticleModal.classList.remove('active');
        document.body.style.overflow = '';
        newArticleForm.reset();
    });
}

// ===================================
// Action Buttons in Table
// ===================================
document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const title = row.querySelector('.article-title-cell').textContent;
        alert(`Editando artigo: "${title}"`);
    });
});

document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const title = row.querySelector('.article-title-cell').textContent;
        alert(`Visualizando artigo: "${title}"`);
    });
});

// ===================================
// Logout Functionality
// ===================================
document.querySelector('.dropdown-item.logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
});

// ===================================
// Check Authentication on Load
// ===================================
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Uncomment to enforce authentication
    // if (isLoggedIn !== 'true') {
    //     window.location.href = 'login.html';
    // }
    
    // Display user email if available
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        console.log('Logged in as:', userEmail);
    }
});

// ===================================
// Animate Stats on Scroll
// ===================================
const statCards = document.querySelectorAll('.stat-card');

const animateStats = () => {
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in-up');
        }, index * 100);
    });
};

// Trigger animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

console.log('📊 Dashboard carregado com sucesso!');
