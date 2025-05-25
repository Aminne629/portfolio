// JavaScript pour gérer le menu horizontal et les modales

// Menu hamburger
const hamburgerBtn = document.getElementById('hamburger-btn');
const sideMenu = document.getElementById('side-menu');
const closeMenuBtn = document.getElementById('close-menu');

hamburgerBtn.addEventListener('click', () => {
  sideMenu.classList.add('active');
});

if (closeMenuBtn) {
  closeMenuBtn.addEventListener('click', () => {
    sideMenu.classList.remove('active');
  });
}

// Modales
const presentationCard = document.getElementById('presentation-card');
const projetsCard = document.getElementById('projets-card');
const modalPresentation = document.getElementById('modal-presentation');
const modalProjets = document.getElementById('modal-projets');

presentationCard.addEventListener('click', () => {
  modalPresentation.style.display = 'flex';
});

projetsCard.addEventListener('click', () => {
  modalProjets.style.display = 'flex';
});

// Fermeture des modales
const closeButtons = document.querySelectorAll('.close');

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-close');
    document.getElementById(modalId).style.display = 'none';
  });
});

// Fermer les modales en cliquant en dehors du contenu
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});