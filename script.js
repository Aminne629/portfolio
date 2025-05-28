// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  
  // === NAVIGATION ===
  
  // Sélection des éléments de navigation
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle du menu hamburger
  if (hamburger && navbar) {
    hamburger.addEventListener('click', function() {
      navbar.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
  
  // Fermer le menu mobile lors du clic sur un lien
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navbar.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
  
  // Navigation active en fonction du scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) {
          navLink.classList.add('active');
        }
      }
    });
  }
  
  // Écouter le scroll pour la navigation active
  window.addEventListener('scroll', updateActiveNav);
  
  // === EFFET TYPEWRITER ===
  
  const typewriterElement = document.querySelector('.typewriter');
  if (typewriterElement) {
    const texts = [
      'Développeur Junior',
      'Étudiant en Informatique',
      'Amateur de jeux vidéos',
      'Shrek is life'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause à la fin
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause avant le nouveau texte
      }
      
      setTimeout(typeWriter, typeSpeed);
    }
    
    // Commencer l'animation typewriter
    typeWriter();
  }
  
  // === ANIMATIONS DES BARRES DE COMPÉTENCES ===
  
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.setProperty('--target-width', width);
        bar.style.width = width;
        bar.classList.add('animate');
      }
    });
  }
  
  // Observer pour les animations au scroll
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Animer les barres de compétences quand la section à propos est visible
        if (entry.target.id === 'about') {
          setTimeout(animateSkillBars, 500);
        }
      }
    });
  }, observerOptions);
  
  // Observer toutes les sections
  const sections = document.querySelectorAll('section, .about-card, .skills-card, .project-card');
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // === MODALES DE PROJETS ===
  
  // Fonction pour ouvrir une modale
  window.openProjectModal = function(projectId) {
    const modal = document.getElementById(`modal-${projectId}`);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Empêcher le scroll de la page
      
      // Animation d'entrée
      setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
      }, 10);
    }
  };
  
  // Fonction pour fermer une modale
  window.closeProjectModal = function(projectId) {
    const modal = document.getElementById(`modal-${projectId}`);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Rétablir le scroll
    }
  };
  
  // Fermer les modales en cliquant sur le background
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        const projectId = modal.id.replace('modal-', '');
        closeProjectModal(projectId);
      }
    });
  });
  
  // Fermer les modales avec la touche Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.style.display === 'flex') {
          const projectId = modal.id.replace('modal-', '');
          closeProjectModal(projectId);
        }
      });
    }
  });
  
  // === FORMULAIRE DE CONTACT ===
  
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Récupérer les données du formulaire
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');
      
      // Validation simple
      if (!name || !email || !message) {
        showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }
      
      if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide.', 'error');
        return;
      }
      
      // Simuler l'envoi (dans un vrai projet, vous enverriez à un serveur)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
  
  // Fonction de validation email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // === SYSTÈME DE NOTIFICATIONS ===
  
  function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Ajouter les styles CSS si pas déjà présents
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          max-width: 400px;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-lg);
          z-index: 3000;
          transform: translateX(100%);
          transition: transform 0.3s ease-out;
        }
        .notification-success {
          background-color: #10b981;
          color: white;
        }
        .notification-error {
          background-color: #ef4444;
          color: white;
        }
        .notification-info {
          background-color: var(--accent);
          color: white;
        }
        .notification-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .notification-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;
      document.head.appendChild(styles);
    }
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Fonction pour fermer la notification
    function closeNotification() {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
    
    // Fermer automatiquement après 5 secondes
    setTimeout(closeNotification, 5000);
    
    // Fermer au clic sur le bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', closeNotification);
  }
  
  // === SMOOTH SCROLL POUR LES LIENS D'ANCRAGE ===
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // === HEADER SCROLL EFFECT ===
  
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    if (header) {
      if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = 'var(--shadow-sm)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = 'none';
      }
    }
    
    lastScrollY = window.scrollY;
  });
  
  // === ANIMATION D'APPARITION PROGRESSIVE ===
  
  // Ajouter la classe fade-in aux éléments quand ils deviennent visibles
  const fadeElements = document.querySelectorAll('.about-card, .skills-card, .project-card, .contact-method');
  
  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100); // Délai progressif pour chaque élément
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Préparer les éléments pour l'animation
  fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    fadeObserver.observe(element);
  });
  
  // === GESTION DU REDIMENSIONNEMENT ===
  
  window.addEventListener('resize', function() {
    // Fermer le menu mobile si on agrandit l'écran
    if (window.innerWidth > 768) {
      navbar.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
  
  // === INITIALISATION ===
  
  // Mettre à jour la navigation active au chargement
  updateActiveNav();
  
  // Initialiser les gestionnaires de thème et de langue
  new ThemeManager();
  new LanguageManager();

  console.log('Portfolio JavaScript chargé avec succès ! 🚀');
});