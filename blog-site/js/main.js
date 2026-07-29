// ===================================
// Article Data
// ===================================
const articles = [
    {
        id: 1,
        title: "Introdução ao React Hooks",
        excerpt: "Aprenda como os Hooks do React revolucionaram a forma como escrevemos componentes funcionais e gerenciamos estado.",
        category: "React",
        date: "2024-01-15",
        readTime: "8 min",
        emoji: "⚛️",
        color: "linear-gradient(135deg, #61dafb, #6366f1)"
    },
    {
        id: 2,
        title: "TypeScript: Por que você deveria usar?",
        excerpt: "Descubra como o TypeScript pode melhorar a qualidade do seu código e prevenir erros antes mesmo da execução.",
        category: "TypeScript",
        date: "2024-01-10",
        readTime: "6 min",
        emoji: "📘",
        color: "linear-gradient(135deg, #3178c6, #0ea5e9)"
    },
    {
        id: 3,
        title: "APIs REST vs GraphQL",
        excerpt: "Uma análise comparativa entre duas das principais abordagens para construção de APIs modernas.",
        category: "Backend",
        date: "2024-01-05",
        readTime: "10 min",
        emoji: "🔌",
        color: "linear-gradient(135deg, #f59e0b, #ef4444)"
    },
    {
        id: 4,
        title: "Clean Code: Princípios Essenciais",
        excerpt: "Boas práticas para escrever código limpo, legível e fácil de manter que todo desenvolvedor deveria conhecer.",
        category: "Boas Práticas",
        date: "2024-01-01",
        readTime: "12 min",
        emoji: "✨",
        color: "linear-gradient(135deg, #10b981, #14b8a6)"
    },
    {
        id: 5,
        title: "Docker para Iniciantes",
        excerpt: "Um guia completo para começar a usar containers Docker e simplificar o deploy das suas aplicações.",
        category: "DevOps",
        date: "2023-12-28",
        readTime: "15 min",
        emoji: "🐳",
        color: "linear-gradient(135deg, #2496ed, #0ea5e9)"
    },
    {
        id: 6,
        title: "Otimização de Performance Web",
        excerpt: "Técnicas avançadas para melhorar o carregamento e a performance das suas aplicações web.",
        category: "Performance",
        date: "2023-12-20",
        readTime: "9 min",
        emoji: "🚀",
        color: "linear-gradient(135deg, #f97316, #ef4444)"
    }
];

// ===================================
// DOM Elements
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const articlesGrid = document.getElementById('articlesGrid');
const contactForm = document.getElementById('contactForm');

// ===================================
// Mobile Menu Toggle
// ===================================
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
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

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ===================================
// Load Articles
// ===================================
function loadArticles() {
    if (!articlesGrid) return;
    
    articlesGrid.innerHTML = articles.map((article, index) => `
        <article class="article-card fade-in-up" style="animation-delay: ${index * 0.1}s">
            <div class="article-image" style="background: ${article.color}">
                ${article.emoji}
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.category}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-footer">
                    <a href="pages/article.html?id=${article.id}" class="read-more">
                        Ler mais
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                    <span class="article-date">${article.readTime}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// Format date to Brazilian Portuguese
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Open article (placeholder function)
function openArticle(id) {
    const article = articles.find(a => a.id === id);
    if (article) {
        alert(`Artigo: "${article.title}"\n\nEm um site real, isso abriria a página completa do artigo!`);
    }
}

// ===================================
// Contact Form Handler
// ===================================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simulate form submission
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Entrarei em contato em breve!`);
        
        // Reset form
        contactForm.reset();
    });
}

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Header Scroll Effect
// ===================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements after they're loaded
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    
    // Observe sections for animation
    document.querySelectorAll('.section-title, .article-card, .about-content, .contact-content').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Add CSS for observed elements
const style = document.createElement('style');
style.textContent = `
    .section-title, .article-card, .about-content, .contact-content {
        opacity: 0;
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// ===================================
// Active Navigation Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
});

console.log('🚀 Blog carregado com sucesso!');

// ===================================
// Search Functionality
// ===================================
function performQuickSearch(query) {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    return articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm)
    );
}

// Export for use in other pages
if (typeof window !== 'undefined') {
    window.performQuickSearch = performQuickSearch;
}
