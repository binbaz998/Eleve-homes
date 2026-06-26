/* ============================================
   ELEVÉ HOMES — script.js
   Nav scroll, mobile menu, reveal animations
   ============================================ */

(function () {
  'use strict';

  /* ---- ELEMENTS ---- */
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.querySelector('.nav-toggle');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const reveals     = document.querySelectorAll('.reveal');
  const navLinks    = document.querySelectorAll('.nav-links a');

  /* ============================================
     NAVBAR — scroll behaviour
     ============================================ */
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;

    // Add scrolled class for frosted glass effect
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ============================================
     ACTIVE NAV LINK — highlight current section
     ============================================ */
  const sectionIds = ['hero', 'bedroom', 'kitchen', 'living', 'contact'];

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    let current = sectionIds[0];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.offsetTop <= scrollMid) {
        current = id;
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--gold)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ============================================
     MOBILE MENU toggle
     ============================================ */
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', menuOpen);

    // Animate hamburger to ✕
    const spans = navToggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  }

  navToggle.addEventListener('click', toggleMenu);

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // Close on backdrop click (outside menu list)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggleMenu();
  });

  /* ============================================
     SCROLL REVEAL — Intersection Observer
     ============================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing for performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  reveals.forEach(el => revealObserver.observe(el));

  /* ============================================
     SMOOTH ANCHOR SCROLL — override default for
     sections hidden behind fixed nav
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 80;

      // For cinematic sections, align to top (they are 100vh)
      // For other targets, offset by navbar
      const isCinematic = target.classList.contains('cinematic-section');
      const offset = isCinematic ? 0 : navHeight;

      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ============================================
     VIDEO LAZY LOAD — pause off-screen videos
     for memory efficiency on mobile
     ============================================ */
  const videos = document.querySelectorAll('.section-video');

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (video.paused) {
              video.play().catch(() => {
                // Autoplay blocked — silent fallback
              });
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    videos.forEach(v => videoObserver.observe(v));
  }

  /* ============================================
     CONTACT FORM — simple submit feedback
     ============================================ */
  const submitBtn = document.querySelector('.btn-submit');

  if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();

      const inputs = document.querySelectorAll('.contact-panel input, .contact-panel textarea');
      let allFilled = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          allFilled = false;
          input.style.borderColor = 'rgba(201,100,80,0.5)';
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
      });

      if (!allFilled) return;

      const original = submitBtn.textContent;
      submitBtn.textContent = 'Enquiry Sent ✓';
      submitBtn.style.background = 'rgba(100, 180, 120, 0.85)';
      submitBtn.style.color = '#fff';
      submitBtn.disabled = true;

      inputs.forEach(input => { input.value = ''; });

      setTimeout(() => {
        submitBtn.textContent = original;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 4000);
    });
  }

  /* ============================================
     NAV TOGGLE — spans need explicit transition
     ============================================ */
  document.querySelectorAll('.nav-toggle span').forEach(span => {
    span.style.transition = 'transform 0.35s ease, opacity 0.25s ease';
  });

})();
