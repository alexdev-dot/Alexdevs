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
// Rotating Text
// =======================
const texts = document.querySelectorAll('.text-rotate');
let rotateIndex = 0;

if (texts.length > 0) {
  setInterval(() => {
    texts[rotateIndex].classList.remove('active');
    rotateIndex = (rotateIndex + 1) % texts.length;
    texts[rotateIndex].classList.add('active');
  }, 3000);
}


// =======================
// ABOUT SECTION
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector(".about-container");

  if (!aboutSection) return;

  function reveal() {
    const windowHeight = window.innerHeight;
    const elementTop = aboutSection.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      aboutSection.classList.add("active");
    }
  }

  // Smooth scroll reveal with requestAnimationFrame
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        reveal();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Reveal on initial load
  reveal();

  // Reveal on resize
  window.addEventListener("resize", reveal);
});


// =======================
// Skills Animation
// =======================
const skills = document.querySelectorAll('.skill');

if (skills.length > 0) {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        skill.classList.add('visible');

        const percentEl = skill.querySelector('.percent');
        const target = parseInt(percentEl.textContent);
        let count = 0;

        const interval = setInterval(() => {
          if (count >= target) clearInterval(interval);
          else percentEl.textContent = count + '%';
          count++;
        }, 15);
      }
    });
  }, { threshold: 0.5 });

  skills.forEach(skill => skillObserver.observe(skill));
}

// =======================
// Project Cards Reveal
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll('.project-card');

  if (projectCards.length > 0) {
    const projectObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.3 });

    projectCards.forEach(card => projectObserver.observe(card));
  }
});

// =======================
// Pricing Section Animation
// =======================
const pricingCards = document.querySelectorAll('.pricing-card');

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function animatePricing() {
  pricingCards.forEach(card => {
    if (isInViewport(card) && !card.classList.contains('visible')) {
      card.classList.add('visible');
      card.style.opacity = 1;
      card.style.transform = 'translateY(0)';

      const bullets = card.querySelectorAll('ul li');
      bullets.forEach((li, index) => {
        setTimeout(() => {
          li.classList.add('slide-in');
        }, index * 150);
      });
    }
  });
}

window.addEventListener('scroll', animatePricing);
window.addEventListener('load', animatePricing);

// =======================
// Mission Section Animation
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const mission = document.querySelector('.mission-container');
  const missionCards = document.querySelectorAll('.mission-card');

  const missionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.5 });

  if (mission) missionObserver.observe(mission);
  missionCards.forEach(card => missionObserver.observe(card));
});

// =======================
// Blog Post Reveal
// =======================
const blogPosts = document.querySelectorAll('.blog-post');

function revealBlogPosts() {
  const triggerBottom = window.innerHeight * 0.8;

  blogPosts.forEach(post => {
    const postTop = post.getBoundingClientRect().top;

    if (postTop < triggerBottom) {
      post.style.opacity = '1';
      post.style.transform = 'translateY(0)';
      post.style.transition = 'all 0.6s ease';
    } else {
      post.style.opacity = '0';
      post.style.transform = 'translateY(40px)';
    }
  });
}

window.addEventListener('scroll', revealBlogPosts);
window.addEventListener('load', revealBlogPosts);

// =======================
// Contact Section
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const contact = document.querySelector('.contact-container');
  const contactElements = document.querySelectorAll('.contact-form, .contact-availability-card');

  const contactObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (contact) contactObserver.observe(contact);
  contactElements.forEach(el => contactObserver.observe(el));
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
