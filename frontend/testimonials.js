// =======================
// Mobile Menu Toggle
// =======================
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
}

// =======================
// Testimonials Carousel
// =======================
// =======================
// Scroll Reveal for Testimonials
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.testimonial-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay based on index
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150); 
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
});

// =======================
// Footer Reveal
// =======================
document.addEventListener("DOMContentLoaded", () => {

  // Scroll Reveal Animation
  const footerElements = document.querySelectorAll('.footer-top, .footer-middle, .footer-bottom');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('visible'); }
    });
  }, { threshold: 0.2 });
  footerElements.forEach(el => revealObserver.observe(el));

  // Newsletter Form
  const form = document.getElementById('newsletter-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const email = this.querySelector('input').value;
    document.getElementById('newsletter-msg').textContent = `Thank you for subscribing, ${email}!`;
    this.reset();
  });

  // Back to Top Button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

}); 
