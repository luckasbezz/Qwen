// ===================================
// Advanced Features Module
// Text-to-Speech, Focus Mode, Code Highlight, Auto-scroll Reading
// ===================================

class AdvancedFeatures {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.focusModeActive = false;
        this.autoScrollInterval = null;
        this.autoScrollSpeed = 1; // pixels per interval
        
        this.init();
    }

    init() {
        this.setupCodeHighlight();
        this.setupTextToSpeech();
        this.setupFocusMode();
        this.setupAutoRead();
        this.setupReadingHistory();
        this.setupEstimatedReadTime();
        
        console.log('🚀 Advanced features loaded!');
    }

    // ===================================
    // Text-to-Speech (Leitor de Áudio)
    // ===================================
    setupTextToSpeech() {
        const ttsBtn = document.getElementById('ttsBtn');
        if (!ttsBtn) return;

        ttsBtn.addEventListener('click', () => this.toggleSpeech());
        
        // Carregar vozes disponíveis
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        // Preferir voz em português
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR')
        ) || this.voices[0];
    }

    toggleSpeech() {
        if (this.isSpeaking) {
            if (this.isPaused) {
                this.synth.resume();
                this.isPaused = false;
                this.updateTTSButton('⏸️', 'Pausar leitura');
            } else {
                this.synth.pause();
                this.isPaused = true;
                this.updateTTSButton('▶️', 'Continuar leitura');
            }
        } else {
            this.startSpeech();
        }
    }

    startSpeech() {
        const content = document.querySelector('.article-content');
        if (!content) return;

        const text = content.innerText;
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.voice = this.selectedVoice;
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;
        this.currentUtterance.volume = 1;

        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.isPaused = false;
            this.updateTTSButton('⏸️', 'Pausar leitura');
        };

        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.isPaused = false;
            this.updateTTSButton('🔊', 'Ler artigo em voz alta');
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isSpeaking = false;
            this.updateTTSButton('🔊', 'Ler artigo em voz alta');
        };

        this.synth.speak(this.currentUtterance);
    }

    stopSpeech() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isSpeaking = false;
        this.isPaused = false;
        this.updateTTSButton('🔊', 'Ler artigo em voz alta');
    }

    updateTTSButton(icon, title) {
        const ttsBtn = document.getElementById('ttsBtn');
        if (ttsBtn) {
            ttsBtn.innerHTML = `<span>${icon}</span><span class="tts-text">${title}</span>`;
            ttsBtn.setAttribute('aria-label', title);
        }
    }

    // ===================================
    // Focus Mode (Modo Foco Total)
    // ===================================
    setupFocusMode() {
        const focusBtn = document.getElementById('focusModeBtn');
        if (!focusBtn) return;

        focusBtn.addEventListener('click', () => this.toggleFocusMode());

        // Atalho de teclado: F
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
                this.toggleFocusMode();
            }
            // ESC para sair do focus mode
            if (e.key === 'Escape' && this.focusModeActive) {
                this.toggleFocusMode();
            }
        });
    }

    toggleFocusMode() {
        this.focusModeActive = !this.focusModeActive;
        const body = document.body;
        const focusBtn = document.getElementById('focusModeBtn');

        if (this.focusModeActive) {
            body.classList.add('focus-mode');
            
            // Esconder elementos distrativos
            document.querySelector('.header')?.classList.add('hidden');
            document.querySelector('.article-actions')?.classList.add('hidden');
            document.querySelector('.reactions')?.classList.add('hidden');
            document.querySelector('.comments-section')?.classList.add('hidden');
            document.querySelector('.related-articles')?.classList.add('hidden');
            document.querySelector('.back-to-home')?.classList.add('hidden');

            if (focusBtn) {
                focusBtn.innerHTML = '<span>👁️</span><span>Sair do foco</span>';
                focusBtn.classList.add('active');
            }

            // Scroll suave até o conteúdo
            document.querySelector('.article-content')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            body.classList.remove('focus-mode');
            
            // Mostrar elementos novamente
            document.querySelector('.header')?.classList.remove('hidden');
            document.querySelector('.article-actions')?.classList.remove('hidden');
            document.querySelector('.reactions')?.classList.remove('hidden');
            document.querySelector('.comments-section')?.classList.remove('hidden');
            document.querySelector('.related-articles')?.classList.remove('hidden');
            document.querySelector('.back-to-home')?.classList.remove('hidden');

            if (focusBtn) {
                focusBtn.innerHTML = '<span>🎯</span><span>Modo foco</span>';
                focusBtn.classList.remove('active');
            }
        }
    }

    // ===================================
    // Code Highlight with Copy Button
    // ===================================
    setupCodeHighlight() {
        // Processar todos os blocos de código
        document.querySelectorAll('pre').forEach(pre => {
            // Adicionar classe para syntax highlighting
            pre.classList.add('code-block');
            
            // Criar botão de copiar
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copiar</span>
            `;
            
            copyBtn.addEventListener('click', () => {
                const code = pre.querySelector('code') || pre;
                const textToCopy = code.innerText;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Feedback visual
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Copiado!</span>
                    `;
                    
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>Copiar</span>
                        `;
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar:', err);
                });
            });
            
            pre.appendChild(copyBtn);
            
            // Detectar linguagem e adicionar classe
            const code = pre.querySelector('code');
            if (code) {
                const className = code.className;
                const langMatch = className.match(/language-(\w+)/);
                if (langMatch) {
                    pre.setAttribute('data-language', langMatch[1]);
                }
            }
        });
    }

    // ===================================
    // Auto-Read (Rolagem Automática)
    // ===================================
    setupAutoRead() {
        const autoReadBtn = document.getElementById('autoReadBtn');
        const speedControl = document.getElementById('autoReadSpeed');
        
        if (!autoReadBtn) return;

        autoReadBtn.addEventListener('click', () => this.toggleAutoRead());
        
        if (speedControl) {
            speedControl.addEventListener('change', (e) => {
                this.autoScrollSpeed = parseInt(e.target.value);
                if (this.autoScrollInterval) {
                    clearInterval(this.autoScrollInterval);
                    this.startAutoRead();
                }
            });
        }

        // Atalho de teclado: A
        document.addEventListener('keydown', (e) => {
            if (e.key === 'a' && !e.ctrlKey && !e.metaKey) {
                this.toggleAutoRead();
            }
        });
    }

    toggleAutoRead() {
        const autoReadBtn = document.getElementById('autoReadBtn');
        
        if (this.autoScrollInterval) {
            this.stopAutoRead();
        } else {
            this.startAutoRead();
        }
    }

    startAutoRead() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        this.autoScrollInterval = setInterval(() => {
            window.scrollBy(0, this.autoScrollSpeed);
            
            // Parar no final da página
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100) {
                this.stopAutoRead();
            }
        }, 50);

        const autoReadBtn = document.getElementById('autoReadBtn');
        if (autoReadBtn) {
            autoReadBtn.innerHTML = '<span>⏹️</span><span>Parar auto-leitura</span>';
            autoReadBtn.classList.add('active');
        }
    }

    stopAutoRead() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }

        const autoReadBtn = document.getElementById('autoReadBtn');
        if (autoReadBtn) {
            autoReadBtn.innerHTML = '<span>📜</span><span>Auto-leitura</span>';
            autoReadBtn.classList.remove('active');
        }
    }

    // ===================================
    // Reading History (Histórico de Leitura)
    // ===================================
    setupReadingHistory() {
        const articleId = this.getCurrentArticleId();
        if (!articleId) return;

        const history = this.getReadingHistory();
        const now = new Date().toISOString();

        // Adicionar/atualizar histórico
        const existingIndex = history.findIndex(item => item.id === articleId);
        const articleData = {
            id: articleId,
            title: document.getElementById('articleTitle')?.innerText || 'Artigo',
            timestamp: now,
            readAt: now
        };

        if (existingIndex > -1) {
            history[existingIndex] = articleData;
        } else {
            history.unshift(articleData);
        }

        // Manter apenas últimos 50 artigos
        localStorage.setItem('readingHistory', JSON.stringify(history.slice(0, 50)));
    }

    getReadingHistory() {
        try {
            return JSON.parse(localStorage.getItem('readingHistory')) || [];
        } catch {
            return [];
        }
    }

    getCurrentArticleId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // ===================================
    // Estimated Read Time (Tempo Estimado)
    // ===================================
    setupEstimatedReadTime() {
        const content = document.querySelector('.article-content');
        const readTimeElement = document.getElementById('articleReadTime');
        
        if (!content || !readTimeElement) return;

        const words = content.innerText.split(/\s+/).length;
        const wordsPerMinute = 200;
        const readTime = Math.ceil(words / wordsPerMinute);
        
        readTimeElement.innerText = `${readTime} min`;
    }
}

// ===================================
// Initialize on DOM Ready
// ===================================
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Verificar se estamos em uma página de artigo
        if (document.querySelector('.article-content')) {
            window.advancedFeatures = new AdvancedFeatures();
        }
    });
}

// ===================================
// CSS Styles for Advanced Features
// ===================================
const advancedStyles = document.createElement('style');
advancedStyles.textContent = `
    /* Focus Mode Styles */
    .focus-mode {
        background: #0f0f0f;
    }
    
    .focus-mode .header.hidden,
    .focus-mode .article-actions.hidden,
    .focus-mode .reactions.hidden,
    .focus-mode .comments-section.hidden,
    .focus-mode .related-articles.hidden,
    .focus-mode .back-to-home.hidden {
        display: none !important;
    }
    
    .focus-mode .article-container {
        max-width: 700px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
    
    .focus-mode .article-content {
        font-size: 1.25rem;
        line-height: 1.9;
        color: #e5e5e5;
    }
    
    /* Code Block Styles */
    .code-block {
        position: relative;
        margin: 2rem 0;
    }
    
    .copy-code-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: #e2e8f0;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0;
    }
    
    .code-block:hover .copy-code-btn {
        opacity: 1;
    }
    
    .copy-code-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .copy-code-btn.copied {
        background: rgba(34, 197, 94, 0.3);
        border-color: rgba(34, 197, 94, 0.5);
        color: #4ade80;
    }
    
    /* TTS Button */
    #ttsBtn,
    #focusModeBtn,
    #autoReadBtn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #f1f5f9;
        color: #475569;
        border: 2px solid transparent;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .dark-mode #ttsBtn,
    .dark-mode #focusModeBtn,
    .dark-mode #autoReadBtn {
        background: #334155;
        color: #e2e8f0;
    }
    
    #ttsBtn:hover,
    #focusModeBtn:hover,
    #autoReadBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    #ttsBtn.active,
    #focusModeBtn.active,
    #autoReadBtn.active {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
    }
    
    .tts-text {
        font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
        .tts-text {
            display: none;
        }
    }
    
    /* Language Badge */
    .code-block::before {
        content: attr(data-language);
        position: absolute;
        top: 1rem;
        left: 1rem;
        padding: 0.25rem 0.75rem;
        background: rgba(99, 102, 241, 0.2);
        color: #818cf8;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        pointer-events: none;
    }
`;

if (typeof document !== 'undefined') {
    document.head.appendChild(advancedStyles);
}
