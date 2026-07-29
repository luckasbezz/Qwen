# 🎉 Blog Portfolio Profissional - Pacote Completo
# 🚀 Blog Portfolio - Pacote Completo

Um site de blog/portfolio pessoal moderno e completo com todas as funcionalidades essenciais.

## ✨ Funcionalidades Incluídas

### 📄 Páginas Principais
- **Home (index.html)**: Página inicial com hero section, grid de artigos, sobre e contato
- **Login (login.html)**: Sistema de autenticação com toggle de senha e login social
- **Dashboard (dashboard.html)**: Painel administrativo com estatísticas e gerenciamento de artigos
- **Artigo (pages/article.html)**: Página individual de artigo com conteúdo completo

### 🔍 Busca e Organização
- **Busca Avançada (search.html)**: Pesquisa em tempo real com filtros por categoria
- **Bookmarks (bookmarks.html)**: Sistema de salvar artigos favoritos

### 📱 Recursos do Artigo
- Barra de progresso de leitura
- Reações (like, love, celebrate, insightful)
- Sistema de comentários
- Compartilhamento em redes sociais
- Bookmark para ler depois
- Artigos relacionados
- Modo de leitura focada

### 🎨 Design e UX
- Tema claro/escuro com persistência
- Totalmente responsivo (mobile-first)
- Animações suaves e transições
- Header com efeito de scroll
- Menu mobile hamburger
- Active state no menu baseado na seção

### 🔧 Funcionalidades Técnicas
- **PWA Ready**: manifest.json + Service Worker para instalação offline
- **SEO Otimizado**: Meta tags, Open Graph, descrições
- **LocalStorage**: Persistência de dados (tema, bookmarks, comentários, reações)
- **Acessibilidade**: ARIA labels, navegação por teclado
- **Performance**: Carregamento otimizado, animações CSS

## 📁 Estrutura de Arquivos

```
blog-site/
├── index.html          # Página inicial
├── login.html          # Login/Cadastro
├── dashboard.html      # Painel admin
├── search.html         # Busca avançada
├── bookmarks.html      # Artigos salvos
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── css/
│   └── style.css       # Estilos globais
├── js/
│   ├── main.js         # Lógica principal
│   ├── login.js        # Autenticação
│   └── dashboard.js    # Dashboard
├── pages/
│   └── article.html    # Página do artigo
└── assets/
    └── icons/          # Ícones PWA
```

## 🚀 Como Usar

1. **Abrir o site**: Basta abrir `index.html` no navegador
2. **Instalar como PWA**: Clique em "Adicionar à tela inicial" no navegador
3. **Navegar**: Explore artigos, use a busca, salve favoritos
4. **Admin**: Acesse `/dashboard.html` para gerenciar conteúdo
5. **Ler artigos**: Clique em qualquer artigo para ver a página completa

## 🎯 Destaques

- ✅ **Editor Rico**: Pronto para integração com TinyMCE/Quill
- ✅ **Comentários**: Sistema completo de comentários por artigo
- ✅ **Reações**: Múltiplas reações estilo LinkedIn
- ✅ **Bookmarks**: Salvar artigos para ler depois
- ✅ **Busca**: Pesquisa em tempo real com highlight
- ✅ **PWA**: Funciona offline após carregamento inicial
- ✅ **Dark Mode**: Tema escuro com persistência
- ✅ **Responsivo**: Perfeito em qualquer dispositivo

## 🛠️ Personalização

- **Cores**: Edite as variáveis CSS em `style.css`
- **Artigos**: Modifique o array `articles` em `main.js`
- **Dados Pessoais**: Atualize informações em `index.html`
- **Fontes**: Altere imports do Google Fonts

## 📊 Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, Variáveis, Animações)
- JavaScript puro (ES6+)
- Google Fonts (Inter + Playfair Display)
- LocalStorage API
- Service Worker API

---

**Criado com ❤️ para ser o melhor blog portfolio possível!**
