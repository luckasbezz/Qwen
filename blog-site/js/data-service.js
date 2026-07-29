// ===================================
// Data Service - Gerenciamento de Dados
// ===================================

class DataService {
  constructor() {
    this.articles = [];
    this.users = [];
    this.categories = [];
    this.comments = [];
    this.reactions = {};
    this.newsletter = [];
    this.loadFromStorage();
  }

  // Carregar dados do localStorage ou JSON
  async loadFromStorage() {
    const storedArticles = localStorage.getItem('blog_articles');
    
    if (storedArticles) {
      const data = JSON.parse(storedArticles);
      this.articles = data.articles || [];
      this.users = data.users || [];
      this.categories = data.categories || [];
      this.newsletter = data.newsletter || { subscribers: 0 };
    } else {
      // Carregar do JSON file se não existir no localStorage
      try {
        const response = await fetch('data/articles.json');
        const data = await response.json();
        this.articles = data.articles || [];
        this.users = data.users || [];
        this.categories = data.categories || [];
        this.newsletter = data.newsletter || { subscribers: 0 };
        this.saveToStorage();
      } catch (error) {
        console.log('Usando dados mockados');
        this.initializeMockData();
      }
    }

    // Carregar comentários e reações
    this.comments = JSON.parse(localStorage.getItem('blog_comments') || '[]');
    this.reactions = JSON.parse(localStorage.getItem('blog_reactions') || '{}');
  }

  // Salvar dados no localStorage
  saveToStorage() {
    localStorage.setItem('blog_articles', JSON.stringify({
      articles: this.articles,
      users: this.users,
      categories: this.categories,
      newsletter: this.newsletter
    }));
  }

  // Inicializar dados mockados
  initializeMockData() {
    this.articles = [
      {
        id: 1,
        title: "Introdução ao React Hooks",
        slug: "introducao-react-hooks",
        excerpt: "Aprenda como os Hooks do React revolucionaram a forma como escrevemos componentes funcionais.",
        category: "React",
        tags: ["react", "javascript", "frontend"],
        author: "João Silva",
        authorAvatar: "👨‍💻",
        date: "2024-01-15",
        readTime: 8,
        views: 1250,
        likes: 89,
        isPremium: false,
        featured: true,
        emoji: "⚛️"
      }
    ];
  }

  // Obter todos os artigos
  getAllArticles() {
    return this.articles;
  }

  // Obter artigo por ID
  getArticleById(id) {
    return this.articles.find(article => article.id === parseInt(id));
  }

  // Obter artigo por slug
  getArticleBySlug(slug) {
    return this.articles.find(article => article.slug === slug);
  }

  // Obter artigos em destaque
  getFeaturedArticles(limit = 3) {
    return this.articles.filter(article => article.featured).slice(0, limit);
  }

  // Obter artigos premium
  getPremiumArticles() {
    return this.articles.filter(article => article.isPremium);
  }

  // Filtrar artigos por categoria
  getArticlesByCategory(category) {
    return this.articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filtrar artigos por tag
  getArticlesByTag(tag) {
    return this.articles.filter(article => 
      article.tags && article.tags.includes(tag.toLowerCase())
    );
  }

  // Buscar artigos
  searchArticles(query) {
    const searchTerm = query.toLowerCase();
    return this.articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content?.toLowerCase().includes(searchTerm) ||
      article.tags?.some(tag => tag.includes(searchTerm))
    );
  }

  // Incrementar visualizações
  incrementViews(id) {
    const article = this.getArticleById(id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.saveToStorage();
    }
  }

  // Adicionar comentário
  addComment(articleId, comment) {
    const newComment = {
      id: Date.now(),
      articleId: parseInt(articleId),
      ...comment,
      date: new Date().toISOString(),
      replies: []
    };
    this.comments.push(newComment);
    localStorage.setItem('blog_comments', JSON.stringify(this.comments));
    return newComment;
  }

  // Adicionar resposta a comentário
  addReply(articleId, commentId, reply) {
    const comment = this.comments.find(c => c.id === parseInt(commentId));
    if (comment) {
      const newReply = {
        id: Date.now(),
        ...reply,
        date: new Date().toISOString()
      };
      comment.replies.push(newReply);
      localStorage.setItem('blog_comments', JSON.stringify(this.comments));
      return newReply;
    }
    return null;
  }

  // Obter comentários de um artigo
  getCommentsByArticle(articleId) {
    return this.comments.filter(c => c.articleId === parseInt(articleId));
  }

  // Adicionar reação
  addReaction(articleId, userId, reactionType) {
    const key = `${articleId}-${userId}`;
    this.reactions[key] = reactionType;
    localStorage.setItem('blog_reactions', JSON.stringify(this.reactions));
    
    // Atualizar contagem
    const article = this.getArticleById(articleId);
    if (article) {
      article.likes = (article.likes || 0) + 1;
      this.saveToStorage();
    }
  }

  // Obter reação do usuário
  getUserReaction(articleId, userId) {
    return this.reactions[`${articleId}-${userId}`];
  }

  // Assinar newsletter
  subscribeNewsletter(email) {
    if (!this.newsletter.subscribers) {
      this.newsletter.subscribers = 0;
    }
    this.newsletter.subscribers++;
    this.newsletter.lastSent = new Date().toISOString();
    this.saveToStorage();
    return true;
  }

  // Obter estatísticas
  getStats() {
    return {
      totalArticles: this.articles.length,
      totalViews: this.articles.reduce((sum, a) => sum + (a.views || 0), 0),
      totalComments: this.comments.length,
      categories: this.categories.length,
      premiumArticles: this.articles.filter(a => a.isPremium).length
    };
  }

  // Obter artigos relacionados
  getRelatedArticles(articleId, limit = 3) {
    const currentArticle = this.getArticleById(articleId);
    if (!currentArticle) return [];

    const related = this.articles
      .filter(article => 
        article.id !== articleId &&
        (article.category === currentArticle.category ||
         article.tags?.some(tag => currentArticle.tags?.includes(tag)))
      )
      .slice(0, limit);

    return related;
  }

  // Criar novo artigo (admin)
  createArticle(articleData) {
    const newArticle = {
      id: Date.now(),
      slug: this.generateSlug(articleData.title),
      date: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      bookmarks: 0,
      featured: false,
      isPremium: false,
      ...articleData
    };
    this.articles.unshift(newArticle);
    this.saveToStorage();
    return newArticle;
  }

  // Atualizar artigo
  updateArticle(id, updates) {
    const index = this.articles.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      this.articles[index] = { ...this.articles[index], ...updates };
      this.saveToStorage();
      return this.articles[index];
    }
    return null;
  }

  // Deletar artigo
  deleteArticle(id) {
    const index = this.articles.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      this.articles.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Gerar slug a partir do título
  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Obter todas as categorias únicas
  getAllCategories() {
    const categories = new Set(this.articles.map(a => a.category));
    return Array.from(categories).map(name => ({
      name,
      count: this.articles.filter(a => a.category === name).length
    }));
  }

  // Obter todas as tags únicas
  getAllTags() {
    const tags = new Set();
    this.articles.forEach(article => {
      if (article.tags) {
        article.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }
}

// Instância global
const dataService = new DataService();
