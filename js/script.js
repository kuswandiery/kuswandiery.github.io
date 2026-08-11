/* =====================================================================
   PORTFOLIO ERI KUSWANDI — SCRIPT
   Deskripsi : Semua interaksi (sticky, typing, reveal, progress, filter,
               form, dark mode, back to top)
   File      : js/script.js
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------
     1. NAVBAR STICKY + BERUBAH SETELAH SCROLL
     ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');

  const toggleNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', toggleNavbar);
  toggleNavbar();

  /* ------------------------------------------------------------------
     2. MENU MOBILE TOGGLE
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    // Ganti ikon hamburger / close
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });

  // Tutup menu setelah klik link (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = navToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    });
  });

  /* ------------------------------------------------------------------
     3. TYPING ANIMATION DI HERO
     ------------------------------------------------------------------ */
  const roles = [
    'IT Support & Helpdesk',
    'Network Administrator',
    'Web Developer',
    'Digital Marketer'
  ];
  const typedEl = document.getElementById('typed');
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800); // jeda sebelum menghapus
        return;
      }
      setTimeout(type, 90);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  };
  type();

  /* ------------------------------------------------------------------
     4. SCROLL REVEAL ANIMATION
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     5. SKILL PROGRESS BAR (jalan saat terlihat)
     ------------------------------------------------------------------ */
  const progressBars = document.querySelectorAll('.progress-bar');
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-progress');
          entry.target.style.width = width + '%';
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ------------------------------------------------------------------
     6. NAVLINK ACTIVE PADA SCROLL (scrollspy)
     ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spy = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + currentId
      );
    });
  };
  window.addEventListener('scroll', spy);
  spy();

  /* ------------------------------------------------------------------
     7. PORTFOLIO FILTER
     ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktifkan tombol
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ------------------------------------------------------------------
     8. CONTACT FORM VALIDASI
     ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');

  // Validator per field
  const validators = {
    name: (v) => v.trim().length >= 3 || 'Nama minimal 3 karakter.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Format email tidak valid.',
    subject: (v) => v.trim().length >= 3 || 'Subjek minimal 3 karakter.',
    message: (v) => v.trim().length >= 10 || 'Pesan minimal 10 karakter.'
  };

  // Validasi satu field
  const validateField = (input) => {
    const group = input.closest('.form-group');
    const errorEl = group.querySelector('.error-msg');
    const validator = validators[input.id];
    const result = validator(input.value);

    if (result === true) {
      group.classList.remove('error');
      errorEl.textContent = '';
      return true;
    }
    group.classList.add('error');
    errorEl.textContent = result;
    return false;
  };

  // Validasi saat mengetik (hilangkan error)
  [name, email, subject, message].forEach(input => {
    input.addEventListener('input', () => {
      if (input.closest('.form-group').classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validasi semua field
    const results = [name, email, subject, message].map(validateField);
    if (results.includes(false)) {
      return;
    }

    // Simulasi pengiriman (tidak ada database)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

    setTimeout(() => {
      // Tampilkan notifikasi sukses
      const success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan';
      form.reset();

      // Sembunyikan notifikasi setelah beberapa detik
      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1200);
  });

  /* ------------------------------------------------------------------
     9. DARK MODE TOGGLE
     ------------------------------------------------------------------ */
  const darkToggle = document.getElementById('dark-toggle');
  const root = document.documentElement;

  // Muat preferensi tersimpan
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateDarkIcon(savedTheme);

  darkToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateDarkIcon(next);
  });

  function updateDarkIcon(theme) {
    const icon = darkToggle.querySelector('i');
    icon.className = theme === 'dark'
      ? 'fa-solid fa-sun'
      : 'fa-solid fa-moon';
  }

  /* ------------------------------------------------------------------
     10. BACK TO TOP
     ------------------------------------------------------------------ */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
