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
// Hero Typing Effect (Professional)
// =======================
const dynamicText = document.querySelector(".dynamic-text");
const roles = [
  "Software Developer", 
  "Web Developer", 
  "Creative Problem Solver",
  "Tech Enthusiast"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
  const currentRole = roles[roleIndex];
  const currentChar = currentRole.substring(0, charIndex);
  
  if (dynamicText) {
    dynamicText.textContent = currentChar;
    dynamicText.classList.add("stop-blinking");
  }

  if (!isDeleting && charIndex < currentRole.length) {
    // Typing
    charIndex++;
    setTimeout(typeEffect, 100);
  } else if (isDeleting && charIndex > 0) {
    // Deleting
    charIndex--;
    setTimeout(typeEffect, 50);
  } else {
    // Pause before delete or next word
    isDeleting = !isDeleting;
    dynamicText.classList.remove("stop-blinking");
    
    if (!isDeleting) {
      roleIndex = (roleIndex + 1) % roles.length;
    }
    setTimeout(typeEffect, 1500);
  }
};

document.addEventListener("DOMContentLoaded", typeEffect);


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
// Skills Animation (Progress Cards)
// =======================
const skillCards = document.querySelectorAll('.skill-card');

if (skillCards.length > 0) {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skill = entry.target;
        skill.classList.add('visible');

        // Animate Progress Bar Width
        const progressBar = skill.querySelector('.skill-progress');
        if (progressBar) {
            const targetWidth = progressBar.getAttribute('data-width');
            progressBar.style.width = targetWidth;
        }

        // Animate Percentage Number
        const percentEl = skill.querySelector('.skill-val');
        if (percentEl) {
            const targetNum = parseInt(percentEl.getAttribute('data-target') || parseInt(percentEl.textContent));
            let currentNum = 0;
            const duration = 1500; // ms
            const stepTime = Math.abs(Math.floor(duration / targetNum));
            
            const timer = setInterval(() => {
                currentNum += 1;
                percentEl.textContent = currentNum + "%";
                if (currentNum >= targetNum) {
                    clearInterval(timer);
                }
            }, stepTime);
        }
        skillObserver.unobserve(skill);
      }
    });
  }, { threshold: 0.1 });

  skillCards.forEach(card => {
    skillObserver.observe(card);
  });
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
        renderProjects(projects.slice(0, 3)); // show first 3 on index
      } else {
        projectsGrid.innerHTML = '<p>No projects found. Add some from the dashboard!</p>';
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Fallback or error message if needed
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
      
      // Observe new card
      projectObserver.observe(card);
    });
  };

  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.3 });

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
  // Reveal Animation
  const contactSection = document.querySelector('.contact-section');
  const contactElements = document.querySelectorAll('.contact-form-container, .contact-info-container');

  const contactObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (contactSection) contactObserver.observe(contactSection);
  contactElements.forEach(el => contactObserver.observe(el));

  // Form Submission Logic
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      try {
        const res = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await res.json();

        if (res.ok) {
          alert('Message sent successfully! I will get back to you soon.');
          contactForm.reset();
        } else {
          alert('Error sending message: ' + (data.msg || 'Unknown error'));
        }

      } catch (err) {
        console.error(err);
        alert('Network error. Please try again later.');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
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

  // =======================
  // Newsletter Subscription System
  // =======================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm && newsletterEmail && newsletterFeedback) {
    
    // Email validation function
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Show feedback message
    const showFeedback = (message, type) => {
      newsletterFeedback.textContent = message;
      newsletterFeedback.className = `newsletter-feedback ${type}`;
      
      // Add show class for animation
      setTimeout(() => {
        newsletterFeedback.classList.add('show');
      }, 10);

      // Hide message after 5 seconds
      setTimeout(() => {
        newsletterFeedback.classList.remove('show');
      }, 5000);
    };

    // Handle form submission
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = newsletterEmail.value.trim();
      
      // Client-side validation
      if (!email) {
        showFeedback('Please enter your email address', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showFeedback('Please enter a valid email address', 'error');
        return;
      }

      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Subscribing...';
      submitButton.disabled = true;

      try {
        // Send subscription request to backend
        const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Success
          showFeedback(data.message || 'Successfully subscribed!', 'success');
          newsletterForm.reset();
        } else {
          // Error from server
          showFeedback(data.message || 'Subscription failed', 'error');
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        showFeedback('Network error. Please try again later.', 'error');
      } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });

    // Real-time email validation feedback
    newsletterEmail.addEventListener('input', function() {
      const email = this.value.trim();
      
      if (email && !validateEmail(email)) {
        this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
      } else {
        this.style.borderColor = '';
      }
    });

    // Clear validation styling on focus
    newsletterEmail.addEventListener('focus', function() {
      this.style.borderColor = '';
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
