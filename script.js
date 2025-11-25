// ===== PORTFOLIO JAVASCRIPT MANAGER =====
// Gestionnaire principal pour toutes les fonctionnalités interactives

class PortfolioManager {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupComponents());
    } else {
      this.setupComponents();
    }
  }

  setupComponents() {
    this.setupModals();
    this.setupNavigation();
    // this.setupTypewriter(); // Typewriter effect removed
    this.setupThemeEffects();
    this.setupContactHandling();
    this.setupPerformanceOptimizations();
  }

  // ===== SYSTÈME DE MODALES =====
  setupModals() {
    this.modals = new Map();
    this.projectData = this.getProjectData();

    // Créer un conteneur unique pour toutes les modales
    this.createProjectModals();
    // Créer les détails mobiles pour chaque projet
    this.createMobileProjectDetails();

    // Gérer l'ouverture/fermeture selon la taille de l'écran
    // Gérer l'ouverture/fermeture des modales
    document.addEventListener('click', (e) => {
      // 👉 n'ouvre que si on clique sur le bouton "Voir plus"
      const button = e.target.closest('.buttonplus');
      if (button) {
        const projectCard = button.closest('.project-card');
        if (projectCard && projectCard.dataset.project) {
          e.preventDefault();
          const pid = projectCard.dataset.project;
          // Sur mobile : affiche le détail intégré, sinon ouvre la modale
          if (document.body.classList.contains('mobile-optimized')) {
            this.toggleMobileDetail(pid);
          } else {
            this.openModal(pid);
          }
        }
      }
    
      // Fermer les modales (overlay ou bouton close)
      if (
        e.target.classList.contains('modal-overlay') ||
        e.target.classList.contains('modal-close') ||
        e.target.closest?.('.modal-close')
      ) {
        this.closeAllModals();
      }
    });
    

    // Fermer les modales avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllModals();
    });
  }

  /**
   * Génère des blocs de détails pour chaque projet afin de les afficher sur mobile.
   */
  createMobileProjectDetails() {
    const projects = this.projectData;
    Object.entries(projects).forEach(([id, project]) => {
      const card = document.querySelector(`.project-card[data-project="${id}"]`);
      if (!card) return;
      // Éviter de dupliquer les détails si déjà créés
      const existing = document.querySelector(`.project-mobile-detail[data-project="${id}"]`);
      if (existing) return;
      const detail = document.createElement('div');
      detail.className = 'project-mobile-detail';
      detail.setAttribute('data-project', id);
      detail.style.display = 'none';
      // Construire le contenu des détails (similaire à la modale, mais plus compact)
      detail.innerHTML = `
        <div class="mobile-detail-content">
          <h4 class="mobile-detail-title">${project.title}</h4>
          <p class="mobile-detail-description">${project.description}</p>
          <h5>Objectifs</h5>
          <ul class="mobile-detail-features">
            ${project.features.map((f) => `<li>${f}</li>`).join('')}
          </ul>
          <h5>Ma contribution</h5>
          <p class="mobile-detail-contribution">${project.contribution}</p>
          <div class="mobile-detail-info">
            <p><strong>Durée :</strong> ${project.duration}</p>
            <p><strong>Statut :</strong> ${project.status}</p>
            <p><strong>Type :</strong> ${project.type}</p>
          </div>
          <div class="mobile-detail-technologies">
            ${project.technologies.map((t) => `<span>${t}</span>`).join('')}
          </div>
          ${project.github ? `<a href="${project.github}" class="btn-github" target="_blank" rel="noopener"><i class="fab fa-github"></i> Code</a>` : ''}
        </div>
      `;
      // Insérer le détail juste après la carte
      card.insertAdjacentElement('afterend', detail);
    });
  }

  /**
   * Affiche ou masque le détail mobile du projet spécifié. Masque les autres détails si besoin.
   */
  toggleMobileDetail(projectId) {
    // Masquer toutes les autres fiches ouvertes
    document.querySelectorAll('.project-mobile-detail').forEach((el) => {
      if (el.getAttribute('data-project') !== projectId) {
        el.style.display = 'none';
      }
    });
    const target = document.querySelector(`.project-mobile-detail[data-project="${projectId}"]`);
    if (!target) return;
    // Bascule l'affichage
    target.style.display = target.style.display === 'none' || target.style.display === '' ? 'block' : 'none';
  }

  createProjectModals() {
    const containerId = 'modal-container';
    let modalContainer = document.getElementById(containerId);
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = containerId;
      document.body.appendChild(modalContainer);
    }

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
      <div class="modal-overlay" role="button" aria-label="Fermer la fenêtre modale"></div>
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title-${id}">
        <div class="modal-header">
          <h2 id="modal-title-${id}">${project.title}</h2>
          <button class="modal-close" aria-label="Fermer">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="project-detail-grid">
            <div class="detail-main">
              <h3>Description</h3>
              <p>${project.description}</p>

              <h3>Objectifs</h3>
              <ul>
                ${project.features.map((f) => `<li>${f}</li>`).join('')}
              </ul>

              <h3>Ma contribution</h3>
              <p>${project.contribution}</p>
            </div>

            <aside class="detail-sidebar">
              <div class="detail-card">
                <h4>Informations</h4>
                <p><strong>Durée :</strong> ${project.duration}</p>
                <p><strong>Statut :</strong> ${project.status}</p>
                <p><strong>Type :</strong> ${project.type}</p>
              </div>

              <div class="detail-card">
                <h4>Technologies</h4>
                <div class="tech-stack">
                  ${project.technologies.map((t) => `<span>${t}</span>`).join('')}
                </div>
              </div>

              ${
                project.github
                  ? `
                <div class="detail-card">
                  <a href="${project.github}" class="btn-github" target="_blank" rel="noopener">
                    <i class="fab fa-github"></i>
                    Voir le code
                  </a>
                </div>`
                  : ''
              }
            </aside>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  openModal(projectId) {
    const modal = this.modals.get(projectId);
    if (!modal) return;
  
    this.lockScroll();
  
    modal.style.display = 'flex';
    modal.style.animation = 'modalFadeIn 0.25s ease-out';
    setTimeout(() => modal.querySelector('.modal-close')?.focus(), 100);
  }
  
  closeAllModals() {
    this.modals.forEach((modal) => (modal.style.display = 'none'));
    this.unlockScroll();
  }

  lockScroll() {
    if (this._scrollLockCount == null) this._scrollLockCount = 0;
    if (this._scrollY == null) this._scrollY = 0;
  
    if (this._scrollLockCount === 0) {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      this._scrollY = y;
  
      document.body.style.position = 'fixed';
      document.body.style.top = `-${y}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
  
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    }
    this._scrollLockCount++;
  }
  
  unlockScroll() {
    if (this._scrollLockCount == null) return;
    if (this._scrollLockCount > 0) this._scrollLockCount--;
  
    if (this._scrollLockCount === 0) {
      const y = this._scrollY || 0;
  
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
  
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
  
      // Neutralise temporairement le smooth-scroll pour la restauration
      const root = document.documentElement;
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
  
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        requestAnimationFrame(() => {
          root.style.scrollBehavior = prev || '';
        });
      });
    }
  }
  
  
  
  
  

  // ===== NAVIGATION DYNAMIQUE =====
  setupNavigation() {
    this.currentSection = 'hero';
    this.setupDynamicIsland();
    this.setupSmoothScrolling();
    this.setupScrollSpy();
  }

  setupDynamicIsland() {
    const island = document.querySelector('.dynamic-island');
    if (!island) return;
    // Les actions d’extension et de contraction sont supprimées pour conserver uniquement les icônes

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
    document.querySelectorAll('.nav-dot span').forEach((span, index) => {
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.width = 'auto';
      }, index * 40);
    });
  }

  contractIsland() {
    document.querySelectorAll('.nav-dot span').forEach((span) => {
      span.style.opacity = '0';
      span.style.width = '0';
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.updateActiveNavigation(target.substring(1));
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.updateActiveNavigation(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }

  updateActiveNavigation(sectionId) {
    if (this.currentSection === sectionId) return;
    this.currentSection = sectionId;
    document.querySelectorAll('.nav-dot').forEach((d) => d.classList.remove('active'));
    const activeDot = document.querySelector(`[href="#${sectionId}"]`);
    if (activeDot) activeDot.classList.add('active');
  }

  // ===== EFFET TYPEWRITER =====
  setupTypewriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;

    const texts = ['développeur', 'étudiant', 'passionné'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 90;
    const deleteSpeed = 45;
    const pauseTime = 1400;

    const type = () => {
      const fullText = texts[textIndex];

      if (!isDeleting) {
        charIndex++;
        if (charIndex === fullText.length) setTimeout(() => (isDeleting = true), pauseTime);
      } else {
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }

      element.textContent = fullText.substring(0, charIndex);
      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    };

    setTimeout(type, 600);
  }

  // ===== EFFETS THÉMATIQUES =====
  setupThemeEffects() {
    this.setupCursorEffect();
    this.setupHoverEffects();
    this.setupColorTransitions();
  }

  setupCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed; width: 20px; height: 20px;
      background: radial-gradient(circle, rgba(124,58,237,.3), transparent);
      border-radius: 50%; pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%); transition: scale .2s ease; display: none;
    `;
    document.body.appendChild(cursor);

    if (window.matchMedia('(min-width: 1024px)').matches) {
      cursor.style.display = 'block';
      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
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
    document.querySelectorAll('.project-card, .story-card, .contact-card, .stack-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  setupColorTransitions() {
    let ticking = false;
    const updateColors = () => {
      const pct = window.pageYOffset / (document.body.scrollHeight - window.innerHeight || 1);
      const hue = 260 + pct * 60; // de violet à cyan
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
    const emailCard = document.querySelector('[href^="mailto:"]');
    if (emailCard) {
      emailCard.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailCard.href.replace('mailto:', '');
        this.copyToClipboard(email);
        this.showToast('Email copié dans le presse-papiers !');
      });
    }

    document.querySelectorAll('.contact-card, .footer-social a').forEach((link) => {
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
      position: fixed; bottom: 2rem; right: 2rem;
      background: var(--gradient-primary); color: #fff;
      padding: 1rem 1.5rem; border-radius: 50px; font-weight: 600;
      z-index: 10001; transform: translateY(100px); transition: transform .3s ease;
      box-shadow: var(--shadow-medium);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => (toast.style.transform = 'translateY(0)'), 60);
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2600);
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
    this.setupLazyLoading();
    this.preloadCriticalResources();
    this.setupResponsiveHandling();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      images.forEach((img) => imageObserver.observe(img));
    } else {
      images.forEach((img) => (img.src = img.dataset.src));
    }
  }

  preloadCriticalResources() {
    // Ajoute ici les images critiques si besoin, ex:
    // ['img/profile.png'].forEach(src => { ... })
  }

  setupResponsiveHandling() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.handleResize(), 200);
    });
    this.handleResize();
  }

  handleResize() {
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile-optimized', isMobile);
  }

  // ===== DONNÉES DES PROJETS =====
  getProjectData() {
    return {
      projet1: {
        title: 'Site ESN',
        description:
          "Développé en équipe de 3 personnes, ce site fictif présente une ESN aux collégiens en recherche de stage d'observation. Le projet met l'accent sur la transition écologique de l'entreprise.",
        features: [
          'Présentation adaptée aux collégiens',
          'Mise en avant de la transition écologique',
          'Interface de contact simplifiée'
        ],
        contribution: 'Développement frontend, wireframing et tests utilisateurs.',
        duration: '6 semaines',
        status: 'Finalisé',
        type: 'Site web',
        technologies: ['HTML, ', 'CSS, ', 'JavaScript'],
        github: null
      },
      projet2: {
        title: 'IA de classification',
        description:
          "Developpé en équipe de 2, cet algorithme d'apprentissage automatique a pour but classifier des dépêches par catégorie. L'entraînement se faisait sur un corpus par l'extraction de mots représentatifs.",
        features: [
          'Classification automatique précise',
          'Respect de deadlines serrées (5 jours)',
          'Développement sans indications préalables'
        ],
        contribution: "Développement de l'algorithme, tests, débogage et optimisation.",
        duration: '5 jours',
        status: 'Finalisé',
        type: 'Projet Java',
        technologies: ['Java, ', 'GitHub'],
        github: null
      },
      projet3: {
        title: 'Portfolio',
        description:
          "Ce portfolio que vous voyez est un projet à part entière. Il a pour but de présenter mes compétences, expériences et projets de manière professionnelle et attrayante. Il est conçu pour être responsive, accessible et agréable à naviguer.",
        features: [
          'Travail en totale autonomie',
          'Approfondissement de Java',
          'Gestion de projet personnel'
        ],
        contribution: 'Développement complet (UI, logique, tests).',
        duration: '2 semaines',
        status: 'Finalisé',
        type: 'Site web',
        technologies: ['HTML, ', 'CSS, ', 'JavaScript'],
        github: null
      },
      projet4:{
        title: 'Data cleansing',
        description:
          "En équipe de 2, nous avons pris en main une énorme base de données sur les accidents de la route en France qui était extrêmement mal organisé, avec des tables inutiles et beaucoup de données redondantes par exemple. Le projet vise à analyser, nettoyer et valider les données pour en améliorer la qualité et la fiabilité.",
        features: [
          'Analyse approfondie des données',
          'Utilisation de requêtes SQL avancées',
          'Amélioration significative de la qualité des données'
        ],
        contribution: "Analyse, nettoyage et validation des données.",
        duration: '1 semaine',
        status: 'Finalisé',
        type: 'Projet SQL',
        technologies: ['SQL'],
        github: null
      },
      projet5: {
        title: "Fest'Event",
        description:
          "Développée en équipe de 5. Cette application a pour but d'aider les particuliers à gerer les évènements qu'ils organisent. Elle permet la création, modification et suppression d'évènements avec une interface utilisateur intuitive. Elle regroupe aussi la vente de billets, l'ajout d'artistes/intervenants et un calendrier interne.",
        features: [
          "Interface utilisateur avec JavaFX",
          'Visualisation des évènements dans un calendrier interne à l\'application',
          'Gestion complète des évènements',
          'Utilisation de GitHub pour le versioning'
        ],
        contribution: 'Reponsable UML, développement frontend et backend, gestion de versions.',
        duration: '3 semaines',
        status: 'Finalisé',
        type: 'Application Java',
        technologies: ['Java, ', 'JavaFX, ','UML, ', 'GitHub'],
        github: null
      }
      
      
    };
  }

  // ===== UTILITAIRES =====
  trackEvent(eventName, properties = {}) {
    if (typeof gtag !== 'undefined') gtag('event', eventName, properties);
    // console.debug(`Event: ${eventName}`, properties);
  }

  addProject(id, projectData) {
    this.projectData[id] = projectData;
    const modal = this.createModalHTML(id, projectData);
    document.getElementById('modal-container').appendChild(modal);
    this.modals.set(id, modal);
  }

  updateProject(id, projectData) {
    if (!this.modals.has(id)) return;
    this.projectData[id] = { ...this.projectData[id], ...projectData };
    const oldModal = this.modals.get(id);
    const newModal = this.createModalHTML(id, this.projectData[id]);
    oldModal.replaceWith(newModal);
    this.modals.set(id, newModal);
  }
}

// ===== INITIALISATION =====
const portfolioManager = new PortfolioManager();
window.portfolioManager = portfolioManager;

// ===== CSS SUPPLÉMENTAIRE (JS) =====
const additionalStyles = `
  .mobile-optimized * {
    transition-duration: 0.1s !important;
    animation-duration: 0.1s !important;
  }
  .lazy { opacity: 0; transition: opacity 0.3s; }
  .lazy.loaded { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .mobile-optimized * { animation: none !important; transition: none !important; }
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
