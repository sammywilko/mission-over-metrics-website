/* ============================================================
   MISSION OVER METRICS — Global Script
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     NAV: Active page highlight
  ────────────────────────────────────────────── */
  function setActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ──────────────────────────────────────────────
     NAV: Scroll blur effect
  ────────────────────────────────────────────── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ──────────────────────────────────────────────
     NAV: Hamburger / Mobile menu
  ────────────────────────────────────────────── */
  function initMobileNav() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ──────────────────────────────────────────────
     SCROLL REVEAL: Intersection Observer
  ────────────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────
     SMOOTH SCROLL: Anchor links
  ────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ──────────────────────────────────────────────
     CONTACT FORM: Validation
  ────────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const success = document.getElementById('form-success');

    function validateGroup(group) {
      const input = group.querySelector('input, textarea, select');
      if (!input) return true;
      const isRequired = input.hasAttribute('required');
      if (!isRequired) return true;

      let valid = true;
      const val = input.value.trim();

      if (!val) {
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        valid = false;
      }

      group.classList.toggle('invalid', !valid);
      return valid;
    }

    // Live validation on blur
    form.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input, textarea, select');
      if (input) {
        input.addEventListener('blur', () => validateGroup(group));
        input.addEventListener('input', () => {
          if (group.classList.contains('invalid')) validateGroup(group);
        });
        // Handle select colour
        if (input.tagName === 'SELECT') {
          input.addEventListener('change', () => {
            input.classList.toggle('has-value', input.value !== '');
          });
        }
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      form.querySelectorAll('.form-group').forEach(group => {
        if (!validateGroup(group)) allValid = false;
      });

      if (!allValid) return;

      // Simulate submission (no backend)
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (success) success.classList.add('visible');
      }, 900);
    });
  }

  /* ──────────────────────────────────────────────
     NEWSLETTER FORM: Stub
  ────────────────────────────────────────────── */
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value.trim()) return;

      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      input.disabled = true;
    });
  }

  /* ──────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initNavScroll();
    initMobileNav();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initNewsletterForm();
  });

})();
