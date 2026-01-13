const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config();

const projects = [
  {
    title: "Digital Clock",
    description: "A personal portfolio site to showcase my skills and projects, designed with a focus on aesthetics and user experience.",
    image: "Digital clock.png",
    link: "https://alexdev-dot.github.io/Alex-digital-clock/",
    tech: ["HTML5", "CSS", "Javascript"],
    createdAt: new Date('2025-01-01') // Older date
  },
  {
    title: "Calculator App",
    description: "A fully responsive calculator performing standard arithmetic operations with a sleek dark mode UI.",
    image: "calculator.png",
    link: "https://alexdev-dot.github.io/Calculator/",
    tech: ["JavaScript", "HTML", "CSS"],
    createdAt: new Date('2025-01-02') // Older date
  },
  {
    title: "Weather Forecasting App",
    description: "Get real-time weather forecasts for any city worldwide. Check temperature, humidity, wind speed, and more.",
    image: "Weather forecast.png",
    link: "https://alexweatherforecast.lovable.app/",
    tech: ["React", "Typescript", "Node.js"],
    createdAt: new Date('2025-01-03') // Older date
  },
  {
    title: "Task Manager",
    description: "A productivity app to organize tasks, set deadlines, and track progress with a drag-and-drop interface.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "#",
    tech: ["Vue.js", "Firebase"],
    createdAt: new Date('2025-01-04') // Older date
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('--- MongoDB Connection Established ---');
    console.log('Clearing existing projects...');
    await Project.deleteMany(); 
    console.log('Inserting migration projects...');
    await Project.insertMany(projects);
    console.log('SUCCESS: All projects have been migrated to the database.');
    console.log('You can now see them in your dashboard.');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR during seeding:', err.message);
    process.exit(1);
  });
