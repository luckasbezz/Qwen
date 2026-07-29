// ===================================
// Monetização & Premium Features
// ===================================

class MonetizationService {
  constructor() {
    this.currentUser = null;
    this.loadUser();
  }

  // Carregar usuário do localStorage
  loadUser() {
    const user = localStorage.getItem('blog_user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  // Verificar se usuário é premium
  isPremium() {
    return this.currentUser?.isPremium || false;
  }

  // Verificar se pode acessar conteúdo premium
  canAccessPremium(article) {
    if (!article.isPremium) return true;
    return this.isPremium();
  }

  // Blur de conteúdo premium para não-assinantes
  applyPaywall(content, isPreview = true) {
    if (!content) return content;

    if (this.isPremium()) {
      return content;
    }

    // Mostrar apenas preview (primeiros 30%)
    const paragraphs = content.split('\n\n');
    const previewLength = Math.max(3, Math.floor(paragraphs.length * 0.3));
    const preview = paragraphs.slice(0, previewLength).join('\n\n');

    return {
      preview: preview,
      locked: true,
      message: 'Conteúdo Premium - Assine para ler mais'
    };
  }

  // Renderizar bloqueio premium
  renderPaywallModal() {
    const modal = document.createElement('div');
    modal.className = 'paywall-modal';
    modal.innerHTML = `
      <div class="paywall-content">
        <div class="paywall-icon">🔒</div>
        <h2>Conteúdo Premium</h2>
        <p>Este artigo é exclusivo para assinantes premium.</p>
        <ul class="premium-benefits">
          <li>✅ Acesso a todos os artigos</li>
          <li>✅ Conteúdo exclusivo semanal</li>
          <li>✅ E-books e materiais extras</li>
          <li>✅ Comunidade VIP</li>
          <li>✅ Suporte prioritário</li>
        </ul>
        <div class="paywall-pricing">
          <div class="price-card">
            <span class="price">R$ 19,90</span>
            <span class="period">/mês</span>
          </div>
          <div class="price-card annual">
            <span class="price">R$ 199</span>
            <span class="period">/ano (2 meses grátis)</span>
          </div>
        </div>
        <button class="btn-premium" onclick="monetizationService.upgradeToPremium()">
          Assinar Agora
        </button>
        <button class="btn-cancel" onclick="this.closest('.paywall-modal').remove()">
          Talvez depois
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
  }

  // Simular upgrade para premium
  async upgradeToPremium(plan = 'monthly') {
    // Em produção, integraria com Stripe/PayPal
    const confirmUpgrade = confirm(
      `Deseja assinar o plano ${plan === 'annual' ? 'anual (R$ 199)' : 'mensal (R$ 19,90)'}?`
    );

    if (confirmUpgrade) {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Atualizar usuário
      if (this.currentUser) {
        this.currentUser.isPremium = true;
        this.currentUser.plan = plan;
        this.currentUser.planStarted = new Date().toISOString();
        localStorage.setItem('blog_user', JSON.stringify(this.currentUser));
      } else {
        this.currentUser = {
          id: Date.now(),
          isPremium: true,
          plan: plan,
          planStarted: new Date().toISOString()
        };
        localStorage.setItem('blog_user', JSON.stringify(this.currentUser));
      }

      alert('🎉 Parabéns! Você agora é premium.');
      location.reload();
    }
  }

  // Renderizar botão de doação
  renderDonationButton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="donation-section">
        <p>Gostou do conteúdo? Apoie o blog!</p>
        <div class="donation-options">
          <button class="donate-btn" onclick="monetizationService.donate(5)">
            ☕ R$ 5
          </button>
          <button class="donate-btn" onclick="monetizationService.donate(10)">
            🍵 R$ 10
          </button>
          <button class="donate-btn" onclick="monetizationService.donate(20)">
            🍕 R$ 20
          </button>
          <button class="donate-btn custom" onclick="monetizationService.showCustomDonation()">
            💰 Outro valor
          </button>
        </div>
        <p class="donation-note">Pagamento seguro via PIX</p>
      </div>
    `;
  }

  // Processar doação
  async donate(amount) {
    const pixKey = 'joao@devblog.com';
    
    const confirmed = confirm(
      `Deseja doar R$ ${amount},00?\n\nChave PIX: ${pixKey}\n\n(Clique em OK para copiar a chave)`
    );

    if (confirmed) {
      await navigator.clipboard.writeText(pixKey);
      alert('Chave PIX copiada! Obrigado pelo apoio! 🙏');
      
      // Salvar doação no localStorage
      const donations = JSON.parse(localStorage.getItem('blog_donations') || '[]');
      donations.push({
        id: Date.now(),
        amount: amount,
        date: new Date().toISOString()
      });
      localStorage.setItem('blog_donations', JSON.stringify(donations));
    }
  }

  // Mostrar input para valor personalizado
  showCustomDonation() {
    const amount = prompt('Digite o valor da doação (R$):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      this.donate(parseFloat(amount));
    }
  }

  // Obter total de doações
  getTotalDonations() {
    const donations = JSON.parse(localStorage.getItem('blog_donations') || '[]');
    return donations.reduce((sum, d) => sum + d.amount, 0);
  }

  // Área de membros premium
  renderMembersArea(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!this.isPremium()) {
      container.innerHTML = `
        <div class="members-lock">
          <div class="lock-icon">🔐</div>
          <h3>Área de Membros</h3>
          <p>Conteúdo exclusivo para assinantes premium</p>
          <button class="btn-premium" onclick="monetizationService.upgradeToPremium()">
            Assinar Agora
          </button>
        </div>
      `;
      return;
    }

    // Conteúdo premium
    const exclusiveContent = [
      { title: 'E-book: Dominando React', type: 'ebook', progress: 100 },
      { title: 'Vídeo: Arquitetura Limpa', type: 'video', duration: '45min' },
      { title: 'Template: Dashboard Admin', type: 'template', downloads: 234 },
      { title: 'Comunidade Discord', type: 'community', members: 156 }
    ];

    container.innerHTML = `
      <div class="members-area">
        <div class="members-header">
          <h2>🌟 Área de Membros Premium</h2>
          <p>Bem-vindo, ${this.currentUser.name || 'Membro'}!</p>
        </div>
        
        <div class="exclusive-content-grid">
          ${exclusiveContent.map(item => `
            <div class="content-card">
              <div class="content-icon">${item.type === 'ebook' ? '📚' : item.type === 'video' ? '🎥' : item.type === 'template' ? '📦' : '💬'}</div>
              <h4>${item.title}</h4>
              <div class="content-meta">
                ${item.progress ? `<span>Progresso: ${item.progress}%</span>` : ''}
                ${item.duration ? `<span>Duração: ${item.duration}</span>` : ''}
                ${item.downloads ? `<span>Downloads: ${item.downloads}</span>` : ''}
                ${item.members ? `<span>Membros: ${item.members}</span>` : ''}
              </div>
              <button class="btn-access">Acessar</button>
            </div>
          `).join('')}
        </div>

        <div class="members-stats">
          <h3>Sua Assinatura</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">${this.currentUser.plan === 'annual' ? 'Anual' : 'Mensal'}</span>
              <span class="stat-label">Plano</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">Ativo</span>
              <span class="stat-label">Status</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${new Date(this.currentUser.planStarted).toLocaleDateString('pt-BR')}</span>
              <span class="stat-label">Início</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Newsletter com segmentação
  renderNewsletterForm(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="newsletter-form">
        <h3>📧 Newsletter Semanal</h3>
        <p>Receba os melhores artigos diretamente no seu e-mail</p>
        <form onsubmit="monetizationService.subscribeNewsletter(event)">
          <input 
            type="email" 
            placeholder="Seu melhor e-mail" 
            required 
            class="newsletter-input"
          />
          <button type="submit" class="btn-subscribe">Inscrever-se</button>
        </form>
        <p class="newsletter-note">Já somos ${dataService.newsletter?.subscribers || 0} inscritos! 🎉</p>
      </div>
    `;
  }

  // Assinar newsletter
  subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    
    if (email) {
      dataService.subscribeNewsletter(email);
      alert('🎉 Obrigado por se inscrever! Verifique seu e-mail.');
      event.target.reset();
    }
  }

  // Estatísticas de monetização (admin)
  getMonetizationStats() {
    const donations = this.getTotalDonations();
    const premiumUsers = 450; // Mock - viria do backend
    const monthlyRevenue = (premiumUsers * 19.90) + donations;
    
    return {
      premiumUsers,
      monthlyRevenue: monthlyRevenue.toFixed(2),
      totalDonations: donations.toFixed(2),
      conversionRate: '3.6%'
    };
  }
}

// Instância global
const monetizationService = new MonetizationService();
