# AlexDevs Portfolio Frontend

This directory contains the frontend code for the AlexDevs Portfolio website. The project is built using HTML, CSS, and modern JavaScript.

## Project Structure

The project is organized into HTML files for structure, CSS files for styling, and separate JavaScript files for logic.

### Pages & Logic

*   **Home (`index.html` / `index.js`)**: The main landing page featuring the Hero section, About summary, Skills, and Projects.
*   **About (`about.html` / `about.js`)**: Detailed information about the developer's journey, tech stack, and experience.
*   **Projects (`projects.html` / `projects.js`)**: A showcase of web development projects and experiments.
*   **Testimonials (`Testimonials.html` / `testimonials.js`)**: Client feedback and reviews.
*   **Contact**: Integrated into the main page and footer.
*   **Dashboard (`dashboard.html` / `dashboard.js`)**: An internal user dashboard area (requires login).

### Authentication

The authentication system supports both traditional email/password and Google Sign-In.

*   **Login (`login.html` / `login.js`)**: 
    *   Standard email/password login.
    *   **Google Sign-In**: Integrated using the Google Identity Services JavaScript API.
    *   Includes a toggle to switch to the registration form.
*   **Register (`register.html` / `register.js`)**: 
    *   New user registration form.
    *   **Google Sign-Up**: Also supported via the JS API.
*   **Forgot Password (`forgot.html` / `forgot.js`)**: Functionality to request a password reset link.

### Legal Pages

*   **Privacy Policy (`privacy.html` / `privacy.js`)**
*   **Terms of Service (`terms.html` / `terms.js`)**

### Styling

*   **`style.css`**: Main stylesheet containing global variables, layout, animations, and component styles.
*   **`login.css` / `register.css` / `forgot.css`**: Specific styles for authentication forms to ensure a clean, focused user experience.

## Features

*   **Responsive Design**: Fully mobile-responsive layout with a custom mobile menu.
*   **Animations**: Scroll-reveal animations for sections and dynamic typing text effects.
*   **Google Identity Integration**: Secure and modern Google Login/Signup implementation.
*   **Component Logic**: JavaScript logic has been modularized into separate files for better maintainability.

## Setup

1.  Open `index.html` in your browser to view the portfolio.
2.  For full authentication functionality, ensure the backend API is running at `http://localhost:5000`.
