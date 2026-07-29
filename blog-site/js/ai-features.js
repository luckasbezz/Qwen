// ===================================
// AI Features - Inteligência Artificial Simulada
// ===================================

class AIFeatures {
  constructor() {
    this.translationCache = {};
  }

  // Gerar resumo automático (TL;DR)
  generateSummary(content, maxLength = 3) {
    if (!content) return [];
    
    // Extrair frases importantes
    const sentences = content
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20)
      .map(s => s.trim());

    // Selecionar frases mais relevantes (primeiras + palavras-chave)
    const importantWords = ['importante', 'essencial', 'crucial', 'principal', 
                           'benefício', 'vantagem', 'conclusão', 'resultado'];
    
    const scored = sentences.map(sentence => {
      let score = 0;
      // Primeiras frases têm maior peso
      const index = sentences.indexOf(sentence);
      if (index < 3) score += 3 - index;
      
      // Palavras-chave aumentam score
      importantWords.forEach(word => {
        if (sentence.toLowerCase().includes(word)) score += 2;
      });
      
      return { sentence, score };
    });

    // Ordenar por score e pegar top N
    const summary = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxLength)
      .map(item => item.sentence + '.');

    return summary;
  }

  // Gerar tags automáticas baseadas no conteúdo
  generateTags(title, content) {
    const tagKeywords = {
      'react': ['react', 'componente', 'hook', 'jsx', 'useState', 'useEffect'],
      'javascript': ['javascript', 'js', 'função', 'variável', 'async', 'promise'],
      'typescript': ['typescript', 'tipo', 'interface', 'genérico', 'enum'],
      'css': ['css', 'estilo', 'flexbox', 'grid', 'animação', 'responsivo'],
      'backend': ['api', 'servidor', 'banco', 'query', 'endpoint'],
      'devops': ['docker', 'kubernetes', 'ci/cd', 'deploy', 'container'],
      'performance': ['performance', 'otimização', 'cache', 'lazy loading'],
      'segurança': ['segurança', 'autenticação', 'criptografia', 'token'],
      'teste': ['teste', 'unitário', 'jest', 'mock', 'cobertura']
    };

    const text = `${title} ${content}`.toLowerCase();
    const detectedTags = [];

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      const matches = keywords.filter(keyword => text.includes(keyword));
      if (matches.length >= 2) {
        detectedTags.push(tag);
      }
    });

    return detectedTags.length > 0 ? detectedTags : ['geral'];
  }

  // Simular tradução (em produção usaria API real)
  async translate(text, targetLang = 'en') {
    const cacheKey = `${text.substring(0, 50)}-${targetLang}`;
    
    if (this.translationCache[cacheKey]) {
      return this.translationCache[cacheKey];
    }

    // Dicionário básico de traduções comuns
    const translations = {
      'pt-en': {
        'introdução': 'introduction',
        'conclusão': 'conclusion',
        'benefícios': 'benefits',
        'vantagens': 'advantages',
        'desvantagens': 'disadvantages',
        'exemplo': 'example',
        'prática': 'practice',
        'código': 'code',
        'desenvolvimento': 'development',
        'aplicação': 'application'
      },
      'pt-es': {
        'introdução': 'introducción',
        'conclusão': 'conclusión',
        'benefícios': 'beneficios',
        'vantagens': 'ventajas',
        'desvantagens': 'desventajas',
        'exemplo': 'ejemplo',
        'prática': 'práctica',
        'código': 'código',
        'desenvolvimento': 'desarrollo',
        'aplicação': 'aplicación'
      }
    };

    const langPair = `pt-${targetLang}`;
    let translated = text;

    if (translations[langPair]) {
      Object.entries(translations[langPair]).forEach(([pt, foreign]) => {
        const regex = new RegExp(pt, 'gi');
        translated = translated.replace(regex, foreign);
      });
    }

    this.translationCache[cacheKey] = translated;
    return translated;
  }

  // Detectar idioma do texto
  detectLanguage(text) {
    const ptPatterns = ['ção', 'ões', 'nh', 'lh', 'çã', 'õ'];
    const esPatterns = ['ción', 'sión', 'ñ', 'll'];
    const enPatterns = ['tion', 'sion', 'ing', 'ed'];

    const textLower = text.toLowerCase();
    
    let ptScore = ptPatterns.filter(p => textLower.includes(p)).length;
    let esScore = esPatterns.filter(p => textLower.includes(p)).length;
    let enScore = enPatterns.filter(p => textLower.includes(p)).length;

    const max = Math.max(ptScore, esScore, enScore);
    
    if (max === ptScore) return 'pt';
    if (max === esScore) return 'es';
    return 'en';
  }

  // Recomendar próximo artigo baseado no histórico
  recommendNextArticle(currentArticle, history, allArticles) {
    if (!currentArticle || !allArticles) return null;

    // Filtrar artigos já lidos
    const unread = allArticles.filter(a => 
      a.id !== currentArticle.id && 
      !history.some(h => h.id === a.id)
    );

    if (unread.length === 0) return null;

    // Score baseado em categoria e tags
    const scored = unread.map(article => {
      let score = 0;
      
      // Mesma categoria
      if (article.category === currentArticle.category) score += 10;
      
      // Tags em comum
      const commonTags = article.tags?.filter(t => 
        currentArticle.tags?.includes(t)
      ) || [];
      score += commonTags.length * 5;
      
      // Artigo recente
      const daysOld = (new Date() - new Date(article.date)) / (1000 * 60 * 60 * 24);
      if (daysOld < 30) score += 3;
      
      // Popularidade
      score += (article.views || 0) / 100;

      return { article, score };
    });

    // Retornar artigo com maior score
    return scored.sort((a, b) => b.score - a.score)[0]?.article;
  }

  // Analisar sentimento dos comentários
  analyzeSentiment(comments) {
    const positiveWords = ['bom', 'ótimo', 'excelente', 'útil', 'ajudou', 
                          'parabéns', 'top', 'demais', 'incrível'];
    const negativeWords = ['ruim', 'péssimo', 'inútil', 'erro', 'bug', 
                          'confuso', 'difícil', 'problema'];

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    comments.forEach(comment => {
      const text = comment.content.toLowerCase();
      const posCount = positiveWords.filter(w => text.includes(w)).length;
      const negCount = negativeWords.filter(w => text.includes(w)).length;

      if (posCount > negCount) positive++;
      else if (negCount > posCount) negative++;
      else neutral++;
    });

    const total = comments.length || 1;
    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      overall: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral'
    };
  }

  // Calcular tempo de leitura preciso
  calculateReadTime(content) {
    if (!content) return 1;
    
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const imagesCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    
    // Adicionar tempo para imagens (10 segundos cada)
    const totalTime = (wordCount / wordsPerMinute) + (imagesCount * 0.17);
    
    return Math.ceil(totalTime);
  }

  // Gerar meta description automática
  generateMetaDescription(excerpt, maxLength = 160) {
    if (!excerpt) return '';
    
    const cleaned = excerpt.replace(/[#*`]/g, '').trim();
    
    if (cleaned.length <= maxLength) return cleaned;
    
    // Cortar na última palavra completa
    const truncated = cleaned.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return truncated.substring(0, lastSpace) + '...';
  }

  // Detectar tópicos principais
  detectTopics(content) {
    const topicPatterns = {
      'Tutorial': ['passo a passo', 'como fazer', 'guia', 'tutorial'],
      'Análise': ['análise', 'comparação', 'vs', 'versus', 'review'],
      'Opinião': ['opinião', 'minha visão', 'acho que', 'penso que'],
      'Notícia': ['lançamento', 'anunciado', 'nova versão', 'atualização'],
      'Dicas': ['dica', 'dicas', 'macete', 'truque', 'atalho']
    };

    const text = content.toLowerCase();
    const detected = [];

    Object.entries(topicPatterns).forEach(([topic, patterns]) => {
      if (patterns.some(p => text.includes(p))) {
        detected.push(topic);
      }
    });

    return detected.length > 0 ? detected : ['Artigo'];
  }
}

// Instância global
const aiFeatures = new AIFeatures();
