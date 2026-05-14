document.addEventListener('DOMContentLoaded', () => {
  initializeNavbar();
  initializeHamburgerMenu();
  initializeHeroParticles();
  initializeAnimatedCounters();
  initializeScrollFadeAnimations();
  initializeActiveNavigationLinks();
  initializeTestimonialDots();
  initializeAmbulanceTypeSelection();
  prefillBookingFormFromUrl();
  injectToastNotificationStyles();
  initializeBackToTopButton();
  updateNavbarWithUserAuthenticationState();

  console.log('%c Rapid Rescue Application Loaded successfully.', 'color: #ef4444; font-size: 14px; font-weight: bold;');
});

function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    const isScrolledPastThreshold = window.scrollY > 50;
    navbar.classList.toggle('scrolled', isScrolledPastThreshold);
  });
}

function initializeHamburgerMenu() {
  const hamburgerButton = document.getElementById('hamburger');
  const navigationLinksContainer = document.getElementById('navLinks');
  
  if (!hamburgerButton || !navigationLinksContainer) return;

  const closeIconHtml = '<i class="fas fa-times" style="color:white;font-size:1.2rem"></i>';
  const hamburgerIconHtml = '<span></span><span></span><span></span>';

  hamburgerButton.addEventListener('click', () => {
    navigationLinksContainer.classList.toggle('open');
    const isMenuOpen = navigationLinksContainer.classList.contains('open');
    hamburgerButton.innerHTML = isMenuOpen ? closeIconHtml : hamburgerIconHtml;
  });

  const allNavigationLinks = navigationLinksContainer.querySelectorAll('.nav-link');
  allNavigationLinks.forEach(link => {
    link.addEventListener('click', () => {
      navigationLinksContainer.classList.remove('open');
      hamburgerButton.innerHTML = hamburgerIconHtml;
    });
  });
}

function initializeHeroParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const totalParticlesToCreate = 20;

  for (let index = 0; index < totalParticlesToCreate; index++) {
    const particleElement = document.createElement('div');
    particleElement.classList.add('particle');
    
    const randomSize = Math.random() * 4 + 2;
    const randomLeftPosition = Math.random() * 100;
    const randomAnimationDuration = Math.random() * 15 + 10;
    const randomAnimationDelay = Math.random() * 10;
    const randomOpacity = Math.random() * 0.2 + 0.05;

    particleElement.style.cssText = `
      width: ${randomSize}px;
      height: ${randomSize}px;
      left: ${randomLeftPosition}%;
      animation-duration: ${randomAnimationDuration}s;
      animation-delay: ${randomAnimationDelay}s;
      opacity: ${randomOpacity};
    `;
    
    particlesContainer.appendChild(particleElement);
  }
}

function initializeAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-num');
  if (counterElements.length === 0) return;

  const intersectionObserverOptions = { threshold: 0.5 };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const isElementVisible = entry.isIntersecting;
      const isAlreadyCounted = entry.target.dataset.counted === 'true';

      if (isElementVisible && !isAlreadyCounted) {
        entry.target.dataset.counted = 'true';
        animateNumber(entry.target);
      }
    });
  }, intersectionObserverOptions);

  counterElements.forEach(counter => counterObserver.observe(counter));
}

function animateNumber(elementToAnimate) {
  const targetNumber = parseInt(elementToAnimate.dataset.target);
  const animationDurationInMilliseconds = 2000;
  const framesPerSecond = 16; 
  const totalFrames = animationDurationInMilliseconds / framesPerSecond;
  const incrementStep = targetNumber / totalFrames;
  
  let currentNumber = 0;
  
  const animationTimer = setInterval(() => {
    currentNumber = Math.min(currentNumber + incrementStep, targetNumber);
    elementToAnimate.textContent = Math.floor(currentNumber).toLocaleString('en-IN');
    
    const isAnimationComplete = currentNumber >= targetNumber;
    if (isAnimationComplete) {
      clearInterval(animationTimer);
    }
  }, framesPerSecond);
}

function initializeScrollFadeAnimations() {
  const fadeAnimationOptions = { 
    threshold: 0.12, 
    rootMargin: '0px 0px -50px 0px' 
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, fadeAnimationOptions);

  const elementsToAnimate = document.querySelectorAll(
    '.step-card, .type-card, .feature-item, .testimonial-card, .review-card'
  );

  elementsToAnimate.forEach((element, index) => {
    element.classList.add('fade-in');
    element.style.transitionDelay = `${index * 0.08}s`;
    fadeObserver.observe(element);
  });
}

function initializeActiveNavigationLinks() {
  const currentUrlPath = window.location.pathname.split('/').pop();
  const currentPageName = currentUrlPath || 'index.html';

  const navigationLinks = document.querySelectorAll('.nav-link');
  
  navigationLinks.forEach(link => {
    const linkDestination = link.getAttribute('href');
    const isLinkForCurrentPage = linkDestination === currentPageName;
    const isDefaultHomePage = currentPageName === '' && linkDestination === 'index.html';
    
    const shouldBeActive = isLinkForCurrentPage || isDefaultHomePage;
    link.classList.toggle('active', shouldBeActive);
  });
}

function initializeTestimonialDots() {
  const testimonialIndicatorDots = document.querySelectorAll('.dot');
  if (testimonialIndicatorDots.length === 0) return;

  testimonialIndicatorDots.forEach(clickedDot => {
    clickedDot.addEventListener('click', () => {
      testimonialIndicatorDots.forEach(dot => dot.classList.remove('active'));
      clickedDot.classList.add('active');
    });
  });
}

function initializeAmbulanceTypeSelection() {
  const typeSelectionCards = document.querySelectorAll('.type-mini-card');
  
  typeSelectionCards.forEach(clickedCard => {
    clickedCard.addEventListener('click', function () {
      const parentContainer = this.closest('.type-cards');
      if (parentContainer) {
        const siblingCards = parentContainer.querySelectorAll('.type-mini-card');
        siblingCards.forEach(card => card.classList.remove('active-type'));
      }
      this.classList.add('active-type');
    });
  });
}

function prefillBookingFormFromUrl() {
  const urlParameters = new URLSearchParams(window.location.search);
  const selectedAmbulanceType = urlParameters.get('type');
  
  if (selectedAmbulanceType) {
    const ambulanceTypeDropdown = document.getElementById('ambulanceType');
    if (ambulanceTypeDropdown) {
      ambulanceTypeDropdown.value = selectedAmbulanceType;
      ambulanceTypeDropdown.dispatchEvent(new Event('change'));
    }
  }
}

window.showToast = function (notificationMessage, notificationType = 'success') {
  const existingNotification = document.querySelector('.toast-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notificationContainer = document.createElement('div');
  notificationContainer.className = `toast-notification toast-${notificationType}`;
  
  const iconClass = notificationType === 'success' ? 'check-circle' : 
                    notificationType === 'error' ? 'times-circle' : 'info-circle';
                    
  notificationContainer.innerHTML = `
    <i class="fas fa-${iconClass}"></i>
    <span>${notificationMessage}</span>
  `;
  
  document.body.appendChild(notificationContainer);
  
  requestAnimationFrame(() => {
    notificationContainer.classList.add('toast-show');
  });
  
  const timeBeforeHidingInMilliseconds = 3500;
  const timeToWaitAfterHidingForRemoval = 400;

  setTimeout(() => {
    notificationContainer.classList.remove('toast-show');
    setTimeout(() => {
      notificationContainer.remove();
    }, timeToWaitAfterHidingForRemoval);
  }, timeBeforeHidingInMilliseconds);
};

function injectToastNotificationStyles() {
  const stylesAlreadyExist = document.getElementById('toastStyles');
  if (stylesAlreadyExist) return;

  const styleElement = document.createElement('style');
  styleElement.id = 'toastStyles';
  styleElement.textContent = `
    .toast-notification {
      position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
      display: flex; align-items: center; gap: 0.75rem;
      background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1);
      padding: 1rem 1.5rem; border-radius: 12px;
      color: white; font-size: 0.9rem; font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      transform: translateY(100px); opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-width: 360px;
    }
    .toast-notification.toast-show { transform: translateY(0); opacity: 1; }
    .toast-success i { color: #4ade80; }
    .toast-error i { color: #f87171; }
    .toast-info i { color: #60a5fa; }
  `;
  document.head.appendChild(styleElement);
}

function initializeBackToTopButton() {
  const backToTopButton = document.createElement('button');
  backToTopButton.id = 'backToTop';
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.setAttribute('aria-label', 'Back to top');
  
  backToTopButton.style.cssText = `
    position: fixed; bottom: 2rem; left: 2rem; z-index: 900;
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; opacity: 0; transform: scale(0);
    transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(239,68,68,0.4);
  `;
  
  document.body.appendChild(backToTopButton);
  
  window.addEventListener('scroll', () => {
    const shouldShowButton = window.scrollY > 400;
    backToTopButton.style.opacity = shouldShowButton ? '1' : '0';
    backToTopButton.style.transform = shouldShowButton ? 'scale(1)' : 'scale(0)';
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function updateNavbarWithUserAuthenticationState() {
  const navigationActionsContainer = document.querySelector('.nav-actions');
  const storedUserInformation = localStorage.getItem('rr_user');
  
  if (!navigationActionsContainer || !storedUserInformation) return;

  try {
    const userProfile = JSON.parse(storedUserInformation);
    const userFirstName = userProfile.name ? userProfile.name.split(' ')[0] : 'User';
    
    navigationActionsContainer.innerHTML = `
      <span style="color:var(--text-400);font-size:.85rem">Hi, <strong style="color:var(--text-white)">${userFirstName}</strong></span>
      <a href="booking.html" class="btn btn-emergency" style="padding:.6rem 1.2rem;font-size:.85rem">
        <i class="fas fa-ambulance"></i> Book Now
      </a>
      <button id="logoutBtn" class="btn btn-outline" style="padding:.6rem 1rem;font-size:.85rem">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    `;
    
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
      logoutButton.addEventListener('click', performUserLogout);
    }
  } catch (error) {
    console.error("Could not parse user session data", error);
  }
}

function performUserLogout() {
  localStorage.removeItem('rr_token');
  localStorage.removeItem('rr_user');
  window.location.href = 'index.html';
}
