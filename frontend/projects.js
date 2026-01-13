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
// Scroll Reveal (About)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const aboutContainer = document.querySelector(".about-container");

  function revealAbout() {
    if (!aboutContainer) return;
    const windowHeight = window.innerHeight;
    const elementTop = aboutContainer.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      aboutContainer.classList.add("active");
    }
  }

  window.addEventListener("scroll", revealAbout);
  revealAbout();
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
// Project Cards Reveal & Dynamic Loading
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.getElementById('projects-grid');

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      const projects = await response.json();

      if (projects.length > 0) {
        renderProjects(projects);
      } else {
        projectsGrid.innerHTML = '<p>No projects found. New projects will appear here once added!</p>';
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
  };

  const renderProjects = (projects) => {
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-image-box">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          <div class="project-overlay">
            <a href="${project.link}" class="overlay-btn" target="_blank" rel="noopener noreferrer">Live Demo</a>
          </div>
        </div>
        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tech">
            ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      `;
      projectsGrid.appendChild(card);
      projectObserver.observe(card);
    });
  };

  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  fetchProjects();
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
