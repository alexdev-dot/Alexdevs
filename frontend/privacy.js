// Mobile Menu
const menuIcon = document.querySelector('.mobile-menu-icon');
const navLinks = document.querySelector('.nav-links');

if (menuIcon && navLinks) {
  menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('mobile');
    navLinks.classList.toggle('active');
  });
}

// Footer Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Scroll Reveal Animation for Footer
  const footerElements = document.querySelectorAll('.footer-top, .footer-middle, .footer-bottom');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('visible'); }
    });
  }, { threshold: 0.2 });
  footerElements.forEach(el => revealObserver.observe(el));

  // Newsletter Form
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const email = this.querySelector('input').value;
      const msg = document.getElementById('newsletter-msg');
      if(msg) msg.textContent = `Thank you for subscribing, ${email}!`;
      this.reset();
    });
  }

  // Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
