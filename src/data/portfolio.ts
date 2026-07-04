// Single source of truth for all personal content shown in the IDE.

export const profile = {
  name: "Ankit Rao",
  handle: "dragonuncaged",
  role: "Full Stack Developer",
  tagline: "I build things for the web — and occasionally tame dragons.",
  email: "emailforreal.ankit@gmail.com",
  location: "Gurugram, Haryana, India",
  github: "https://github.com/DragonUncaged",
  linkedin: "https://www.linkedin.com/in/ankitrao",
  codechef: "https://www.codechef.com/users/dragonuncaged",
  about: [
    "Hi! I'm Ankit, a full stack developer who enjoys turning ideas into fast, polished web applications. I work across the stack — from designing REST APIs and data models to crafting pixel-perfect, accessible UIs.",
    "Currently I'm a Full Stack Developer at Even Healthcare, building scalable applications with Next.js and Go. Before that I completed my B.Tech in Computer Science at Chandigarh University.",
    "When I'm not shipping features, you'll find me solving problems on CodeChef or experimenting with new tools (like this portfolio — a working editor + terminal that compiles C, Python and JavaScript right in your browser).",
  ],
};

export const skills = [
  { name: "JavaScript (ES6+)", logo: require("../assets/logos/JsLogo.png") },
  { name: "TypeScript", logo: require("../assets/logos/TypescriptLogo.png") },
  { name: "React", logo: require("../assets/logos/ReactLogo.png") },
  { name: "Next.js", logo: require("../assets/logos/NextLogo.png") },
  { name: "Node.js", logo: require("../assets/logos/NodeJSLogo.png") },
  { name: "Redux", logo: require("../assets/logos/ReduxLogo.png") },
  { name: "Tailwind CSS", logo: require("../assets/logos/TailwindLogo.png") },
  { name: "Python", logo: require("../assets/logos/PythonLogo.png") },
  { name: "SQL", logo: require("../assets/logos/SqlLogo.png") },
  { name: "MongoDB", logo: require("../assets/logos/MongoDBLogo.png") },
  { name: "Firebase", logo: require("../assets/logos/FirebaseLogo.png") },
  { name: "Docker", logo: require("../assets/logos/DockerLogo.png") },
  { name: "Go", logo: require("../assets/logos/GoLogo.png") },
];

export interface Project {
  name: string;
  description: string;
  tech: string[];
  live: string;
  language: "js" | "ts" | "py";
}

export const projects: Project[] = [
  {
    name: "CodeSpace",
    description:
      "A collaborative online code editor with live preview — write HTML, CSS and JS and see the result instantly.",
    tech: ["React", "JavaScript", "CSS"],
    live: "https://code-two-theta.vercel.app/",
    language: "js",
  },
  {
    name: "Draw",
    description:
      "A real-time collaborative whiteboard. Sketch, diagram and brainstorm together from any device.",
    tech: ["JavaScript", "Canvas", "WebSockets"],
    live: "https://draw-zooi.onrender.com/",
    language: "js",
  },
  {
    name: "Chat App",
    description:
      "A real-time chat application with rooms, presence and message history.",
    tech: ["TypeScript", "React", "Firebase"],
    live: "https://chat-app-ca.netlify.app/",
    language: "ts",
  },
  {
    name: "Document Chatbot",
    description:
      "A GenAI chatbot that answers questions about your documents using retrieval-augmented generation.",
    tech: ["Python", "LangChain", "Streamlit"],
    live: "https://genai-chatbot-ctk7vcbjwwvekridgy6kgg.streamlit.app/",
    language: "py",
  },
];

export const resume = {
  education: [
    {
      institution: "Chandigarh University",
      degree: "B.Tech, Computer Science & Engineering",
      period: "Aug 2020 — Jul 2024",
      location: "Mohali, Punjab",
    },
  ],
  experience: [
    {
      company: "Even Healthcare",
      role: "Full Stack Developer",
      period: "Feb 2025 — Present",
      location: "Gurugram, Haryana",
      highlights: [
        "Building scalable full-stack applications with Next.js and Go.",
        "Designing backend services and REST APIs.",
        "Collaborating with cross-functional teams in a fast-paced startup environment.",
      ],
    },
    {
      company: "Startup",
      role: "Full Stack Developer",
      period: "Nov 2024 — Jan 2025",
      location: "Remote",
      highlights: [
        "Developed backend services using Python and FastAPI.",
        "Built responsive frontend interfaces with React.",
        "Implemented RESTful APIs and database designs.",
      ],
    },
    {
      company: "Internshala",
      role: "Full Stack Developer",
      period: "Apr 2024 — Oct 2024",
      location: "Gurugram, Haryana",
      highlights: [
        "Built and shipped full-stack web applications end to end.",
        "Designed web applications ensuring optimal performance and user experience.",
        "Worked with React, Node.js and REST APIs in production.",
      ],
    },
  ],
  strengths: [
    "React, Node.js, Express.js",
    "REST API design & integration",
    "Git, VS Code & modern tooling",
    "Software development lifecycle",
  ],
};
