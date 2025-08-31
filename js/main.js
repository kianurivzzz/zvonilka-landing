document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initScrollAnimations();
  initSmoothScroll();
  initHeaderScroll();
  initAnalytics();
});

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.feature, .step, .privacy-feature');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = 'none';
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  }
  
  header.style.transition = 'all 0.3s ease';
  
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateHeader);
  });
}

function initAnalytics() {
  const ctaButtons = document.querySelectorAll('.btn-primary');
  
  ctaButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'CTA',
          'event_label': `CTA Button ${index + 1}`,
          'value': 1
        });
      }
    });
  });

  const features = document.querySelectorAll('.feature');
  features.forEach((feature, index) => {
    feature.addEventListener('mouseenter', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'hover', {
          'event_category': 'Feature',
          'event_label': feature.querySelector('.feature-title').textContent,
          'value': 1
        });
      }
    });
  });
}

function addPageLoadAnimation() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroButtons = document.querySelector('.hero-buttons');
  
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }
  
  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(30px)';
    heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
      heroSubtitle.style.opacity = '1';
      heroSubtitle.style.transform = 'translateY(0)';
    }, 400);
  }
  
  if (heroButtons) {
    heroButtons.style.opacity = '0';
    heroButtons.style.transform = 'translateY(30px)';
    heroButtons.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
      heroButtons.style.opacity = '1';
      heroButtons.style.transform = 'translateY(0)';
    }, 600);
  }
}

window.addEventListener('load', addPageLoadAnimation);

const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    if (entry.entryType === 'navigation') {
      const loadTime = entry.loadEventEnd - entry.loadEventStart;
      if (typeof gtag !== 'undefined' && loadTime > 0) {
        gtag('event', 'timing_complete', {
          'name': 'page_load',
          'value': Math.round(loadTime)
        });
      }
    }
  });
});

if ('PerformanceObserver' in window) {
  performanceObserver.observe({ entryTypes: ['navigation'] });
}

window.addEventListener('beforeunload', function() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view_duration', {
      'event_category': 'Engagement',
      'event_label': 'Time on page',
      'value': Math.round((Date.now() - performance.timing.navigationStart) / 1000)
    });
  }
});