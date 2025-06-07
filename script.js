// ===== PORTFOLIO JAVASCRIPT MANAGER =====
// Gestionnaire principal pour toutes les fonctionnalités interactives

class PortfolioManager {
  constructor() {
    this.init();
  }

  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupComponents();
      });
    } else {
      this.setupComponents();
    }
  }

  setupComponents() {
    this.setupModals();
    this.setupNavigation();
    this.setupTypewriter();
    this.setupScrollAnimations();
    this.setupThemeEffects();
    this.setupContactHandling();
    this.setupPerformanceOptimizations();
    
    console.log('🚀 Portfolio Manager initialisé avec succès');
  }

  // ===== SYSTÈME DE MODALES =====
  setupModals() {
    this.modals = new Map();
    this.projectData = this.getProjectData();
    
    // Créer les modales pour chaque projet
    this.createProjectModals();
    
    // Event listeners pour ouvrir les modales
    document.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-card');
      if (projectCard) {
        const projectId = projectCard.dataset.project;
        if (projectId) {
          this.openModal(projectId);
        }
      }
      
      // Fermer les modales
      if (e.target.classList.contains('modal-overlay') || 
          e.target.classList.contains('modal-close') ||
          e.target.closest('.modal-close')) {
        this.closeAllModals();
      }
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  createProjectModals() {
    // Conteneur pour toutes les modales
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);

    // Créer une modale pour chaque projet
    Object.entries(this.projectData).forEach(([id, project]) => {
      const modal = this.createModalHTML(id, project);
      modalContainer.appendChild(modal);
      this.modals.set(id, modal);
    });
  }

  createModalHTML(id, project) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = `modal-${id}`;
    modal.style.display = 'none';
    
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="modal-header">
          <h2>${project.title}</h2>
          <button class="modal-close" aria-label="Fermer">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="project-detail-grid">
            <div class="detail-main">
              <h3>Description du projet</h3>
              <p>${project.description}</p>
              
              <h3>Objectifs</h3>
              <ul>
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
              
              <h3>Ma contribution</h3>
              <p>${project.challenges}</p>
            </div>
            
            <div class="detail-sidebar">
              <div class="detail-card">
                <h4>Informations</h4>
                <p><strong>Durée:</strong> ${project.duration}</p>
                <p><strong>Statut:</strong> ${project.status}</p>
                <p><strong>Type:</strong> ${project.type}</p>
              </div>
              
              <div class="detail-card">
                <h4>Technologies utilisées</h4>
                <div class="tech-stack">
                  ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
              </div>
              
              ${project.github ? `
                <div class="detail-card">
                  <a href="${project.github}" class="btn-github" target="_blank" rel="noopener">
                    <i class="fab fa-github"></i>
                    Voir sur GitHub
                  </a>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  openModal(projectId) {
    const modal = this.modals.get(projectId);
    if (!modal) return;

    // Désactiver le scroll du body
    document.body.style.overflow = 'hidden';
    
    // Afficher la modale avec animation
    modal.style.display = 'flex';
    modal.style.animation = 'modalFadeIn 0.3s ease-out';
    
    // Focus sur le bouton de fermeture pour l'accessibilité
    setTimeout(() => {
      const closeBtn = modal.querySelector('.modal-close');
      closeBtn?.focus();
    }, 100);
    
    // Trace pour analytics (optionnel)
    this.trackEvent('modal_open', { project: projectId });
  }

  closeAllModals() {
    this.modals.forEach(modal => {
      modal.style.display = 'none';
    });
    
    // Réactiver le scroll du body
    document.body.style.overflow = '';
  }

  // ===== NAVIGATION DYNAMIQUE =====
  setupNavigation() {
    this.currentSection = 'accueil';
    this.setupDynamicIsland();
    this.setupSmoothScrolling();
    this.setupScrollSpy();
  }

  setupDynamicIsland() {
    const island = document.querySelector('.dynamic-island');
    if (!island) return;

    // État initial
    let isExpanded = false;
    
    // Expansion au hover
    island.addEventListener('mouseenter', () => {
      if (!isExpanded) {
        this.expandIsland();
        isExpanded = true;
      }
    });

    // Contraction en quittant
    island.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (isExpanded) {
          this.contractIsland();
          isExpanded = false;
        }
      }, 1000);
    });

    // Navigation par clic
    island.addEventListener('click', (e) => {
      const navDot = e.target.closest('.nav-dot');
      if (navDot) {
        e.preventDefault();
        const target = navDot.getAttribute('href');
        this.scrollToSection(target);
      }
    });
  }

  expandIsland() {
    const navDots = document.querySelectorAll('.nav-dot span');
    navDots.forEach((span, index) => {
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.width = 'auto';
      }, index * 50);
    });
  }

  contractIsland() {
    const navDots = document.querySelectorAll('.nav-dot span');
    navDots.forEach(span => {
      span.style.opacity = '0';
      span.style.width = '0';
    });
  }

  setupSmoothScrolling() {
    // Améliorer le smooth scroll natif
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = anchor.getAttribute('href');
        this.scrollToSection(target);
      });
    });
  }

  scrollToSection(target) {
    const element = document.querySelector(target);
    if (!element) return;

    const offsetTop = element.offsetTop - 100; // Compensation pour la nav
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });

    // Mettre à jour l'état actif
    this.updateActiveNavigation(target.substring(1));
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNavigation(entry.target.id);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  updateActiveNavigation(sectionId) {
    if (this.currentSection === sectionId) return;
    
    this.currentSection = sectionId;
    
    // Retirer les classes actives
    document.querySelectorAll('.nav-dot').forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Ajouter la classe active
    const activeDot = document.querySelector(`[href="#${sectionId}"]`);
    if (activeDot) {
      activeDot.classList.add('active');
    }
  }

  // ===== EFFET TYPEWRITER =====
  setupTypewriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;

    const texts = [
      'étudiant'
      , 'passioné'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const type = () => {
      const fullText = texts[textIndex];
      
      if (!isDeleting) {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === fullText.length) {
          setTimeout(() => { isDeleting = true; }, pauseTime);
        }
      } else {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }
      
      element.textContent = currentText;
      
      const speed = isDeleting ? deleteSpeed : typeSpeed;
      setTimeout(type, speed);
    };

    // Démarrer l'animation après un délai
    setTimeout(type, 1000);
  }

  // ===== ANIMATIONS AU SCROLL =====
  setupScrollAnimations() {
    // Observer pour les animations d'apparition
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Éléments à animer
    const animatedElements = document.querySelectorAll(`
      .story-card, .skill-category, .formation-card, .goals-card,
      .project-card, .contact-card
    `);

    animatedElements.forEach((el, index) => {
      // État initial
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      
      animationObserver.observe(el);
    });

    // Parallax subtil pour les cartes flottantes
    this.setupParallax();
  }

  setupParallax() {
    const floatingCards = document.querySelectorAll('.info-card');
    if (floatingCards.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      floatingCards.forEach((card, index) => {
        const rate = scrolled * -0.5 * (index + 1);
        card.style.transform = `translateY(${rate}px)`;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // ===== EFFETS THÉMATIQUES =====
  setupThemeEffects() {
    this.setupCursorEffect();
    this.setupHoverEffects();
    this.setupColorTransitions();
  }

  setupCursorEffect() {
    // Créer un curseur personnalisé subtil
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: scale 0.2s ease;
      display: none;
    `;
    document.body.appendChild(cursor);

    // Suivre la souris sur desktop seulement
    if (window.matchMedia('(min-width: 1024px)').matches) {
      cursor.style.display = 'block';
      
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      // Agrandir sur les éléments interactifs
      document.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, .project-card, .contact-card')) {
          cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        }
      });

      document.addEventListener('mouseout', (e) => {
        if (e.target.matches('a, button, .project-card, .contact-card')) {
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      });
    }
  }

  setupHoverEffects() {
    // Effet de brillance sur les cartes
    document.querySelectorAll('.project-card, .story-card, .contact-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  setupColorTransitions() {
    // Transition des couleurs d'accent basée sur le scroll
    let ticking = false;
    
    const updateColors = () => {
      const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
      const hue = 260 + (scrollPercent * 60); // De violet à cyan
      
      document.documentElement.style.setProperty('--dynamic-hue', hue);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateColors);
        ticking = true;
      }
    });
  }

  // ===== GESTION DES CONTACTS =====
  setupContactHandling() {
    // Copier l'email au clic
    const emailCard = document.querySelector('[href^="mailto:"]');
    if (emailCard) {
      emailCard.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailCard.href.replace('mailto:', '');
        this.copyToClipboard(email);
        this.showToast('Email copié dans le presse-papiers !');
      });
    }

    // Tracking des clics sur les liens sociaux
    document.querySelectorAll('.contact-card, .footer-social a').forEach(link => {
      link.addEventListener('click', () => {
        const platform = this.detectPlatform(link.href);
        this.trackEvent('contact_click', { platform });
      });
    });
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--gradient-primary);
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      z-index: 10001;
      transform: translateY(100px);
      transition: transform 0.3s ease;
      box-shadow: var(--shadow-medium);
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animation d'apparition
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Animation de disparition
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  detectPlatform(href) {
    if (href.includes('linkedin')) return 'linkedin';
    if (href.includes('github')) return 'github';
    if (href.includes('mailto')) return 'email';
    if (href.includes('tel')) return 'phone';
    return 'other';
  }

  // ===== OPTIMISATIONS PERFORMANCE =====
  setupPerformanceOptimizations() {
    // Lazy loading des images
    this.setupLazyLoading();
    
    // Préchargement des ressources critiques
    this.preloadCriticalResources();
    
    // Débounce du redimensionnement
    this.setupResponsiveHandling();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback pour les navigateurs sans IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  preloadCriticalResources() {
    const criticalImages = [
      // Ajouter ici les images critiques à précharger
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  setupResponsiveHandling() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Réajuster les animations basées sur la taille d'écran
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Désactiver certaines animations sur mobile pour les performances
      document.body.classList.add('mobile-optimized');
    } else {
      document.body.classList.remove('mobile-optimized');
    }
  }

  // ===== DONNÉES DES PROJETS =====
  getProjectData() {
    return {
      'projet1': {
        title: 'Site Atos',
        description: 'Développé en équipe de 3 personnes, ce site fictif présente la société Atos aux collégiens en recherche de stage d\'observation. Le projet met l accent sur la transition écologique de lentreprise.',
        features: [
          'Présentation adaptée aux jeunes collégiens',
          'Mise en avant de la transition écologique',
          'Interface de contact simplifiée'
        ],
        challenges: 'Développement frontend, Wire framing et tests utilisateurs du site.',
        duration: '1 mois',
        status: 'Finalisé',
        type: 'Site web',
        technologies: ['HTML','CSS','JavaScript'],
        github: 'https://github.com/Ulio05/SAE-5-6'
      },
      'projet2': {
        title: 'IA de classification',
        description: 'Intelligence artificielle utilisant l\'apprentissage automatique pour classifier des dépêches par catégorie. L\'algorithme s\'entraîne sur un corpus de dépêches et identifie les mots représentatifs de chaque catégorie.',
        features: [
          'Classification automatique précise',
          'Gestion de deadlines serrées (5 jours)',
          'Développement sans indications préalables',
          'Système d\'alertes automatiques'
        ],
        challenges: 'Développement de l\'algorithme, tests et débogage, et optimisation des performances.',
        results: 'Le dashboard traite maintenant plus de 1 million de points de données par jour avec une latence moyenne de 50ms.',
        duration: '5 jours',
        status: 'Finalisé',
        type: 'Projet Java',
        technologies: ['Java'],
        github: 'https://github.com/Aminne629/sae01-02'
      },
      'projet3': {
        title: 'Calculatrice',
        description: 'Application de calculatrice simple développée en autonomie complète pendant mon temps libre. Capable d\'effectuer les quatre opérations de base : addition, soustraction, multiplication et division.',
        features: [
          'Travail en totale autonomie',
          'Approfondissement des connaissances en Java',
          'Gestion d\'un projet personnel'
        ],
        challenges: 'Tout',
        duration: '1 mois',
        status: 'Finalisé',
        type: 'Application Java',
        technologies: ['Java'],
        github: 'pas de lien GitHub pour ce projet'
      }
    };
  }

  // ===== UTILITAIRES =====
  trackEvent(eventName, properties = {}) {
    // Intégration avec Google Analytics ou autre service d'analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    console.log(`Event tracked: ${eventName}`, properties);
  }

  // Méthode pour ajouter dynamiquement des projets
  addProject(id, projectData) {
    this.projectData[id] = projectData;
    const modal = this.createModalHTML(id, projectData);
    document.getElementById('modal-container').appendChild(modal);
    this.modals.set(id, modal);
  }

  // Méthode pour mettre à jour un projet
  updateProject(id, projectData) {
    if (this.modals.has(id)) {
      this.projectData[id] = { ...this.projectData[id], ...projectData };
      const oldModal = this.modals.get(id);
      const newModal = this.createModalHTML(id, this.projectData[id]);
      oldModal.replaceWith(newModal);
      this.modals.set(id, newModal);
    }
  }
}

// ===== INITIALISATION =====
// Créer une instance unique du gestionnaire
const portfolioManager = new PortfolioManager();

// Exposer globalement pour l'accès depuis la console (utile pour le debug)
window.portfolioManager = portfolioManager;

// ===== CSS SUPPLÉMENTAIRE POUR LES EFFETS JS =====
const additionalStyles = `
  .mobile-optimized * {
    transition-duration: 0.1s !important;
    animation-duration: 0.1s !important;
  }
  
  .lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .lazy.loaded {
    opacity: 1;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .mobile-optimized * {
      animation: none !important;
      transition: none !important;
    }
  }
`;

// Injecter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('🎨 Portfolio JavaScript chargé avec succès !');