// Fonctions pour la gestion des menus mobiles
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('show');
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.classList.toggle('show');
    }
}

function toggleMobileDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const icon = document.getElementById(dropdownId + '-icon');
    
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
    
    if (icon) {
        icon.classList.toggle('rotate-180');
    }
}

// Fermer les menus quand on clique en dehors
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const userMenu = document.getElementById('user-menu');
    const mobileMenuButton = event.target.closest('[onclick*="toggleMobileMenu"]');
    const userMenuButton = event.target.closest('[onclick*="toggleUserMenu"]');
    
    // Fermer le menu mobile si on clique en dehors
    if (mobileMenu && !mobileMenuButton && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.remove('show');
    }
    
    // Fermer le menu utilisateur si on clique en dehors
    if (userMenu && !userMenuButton && !userMenu.contains(event.target)) {
        userMenu.classList.remove('show');
    }
});

// Fermer les menus sur redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const userMenu = document.getElementById('user-menu');
    
    if (window.innerWidth >= 1280) { // xl breakpoint
        if (mobileMenu) mobileMenu.classList.remove('show');
        if (userMenu) userMenu.classList.remove('show');
    }
});

// Gestion du scroll pour masquer/afficher le header
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    if (!header) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas - masquer le header
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scroll vers le haut - afficher le header
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Animation des notifications
function animateNotification() {
    const notifications = document.querySelectorAll('.notification-pulse');
    notifications.forEach(notification => {
        notification.style.animation = 'pulse 2s infinite';
    });
}

// Initialiser les animations au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    animateNotification();
    
    // Ajouter les transitions CSS si elles ne sont pas déjà présentes
    if (!document.querySelector('#mobile-menu-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-menu-styles';
        style.textContent = `
            .mobile-menu-slide {
                transition: max-height 0.3s ease-in-out;
                overflow: hidden;
            }
            .mobile-menu-slide:not(.show) {
                max-height: 0;
            }
            .mobile-menu-slide.show {
                max-height: 500px;
            }
            header {
                transition: transform 0.3s ease-in-out;
            }
            .rotate-180 {
                transform: rotate(180deg);
            }
        `;
        document.head.appendChild(style);
    }
});
