// ===== MOCK DATABASE =====
const DB = {
  startups: [
    {
      id: 1, name: "EduAI", tagline: "AI-powered personalized learning for K-12",
      description: "We use machine learning to adapt curriculum in real-time based on student performance, learning style, and pace. Our platform has shown 40% improvement in test scores.",
      category: "EdTech", stage: "Seed", fundingGoal: 500000, raised: 320000,
      founder: "Arjun Mehta", founderAvatar: "AM", university: "IIT Delhi",
      skills: ["Machine Learning", "React", "Node.js", "Python"],
      teamSize: 4, lookingFor: ["ML Engineer", "Product Designer", "Marketing Lead"],
      tags: ["AI", "Education", "B2C"], verified: true, featured: true,
      upvotes: 142, views: 1840, createdAt: "2024-01-15",
      pitch: "https://pitch.com/eduai", website: "https://eduai.in",
      keywords: ["ai learning", "education technology", "personalized", "k12", "adaptive learning"]
    },
    {
      id: 2, name: "GreenRoute", tagline: "Carbon-neutral last-mile delivery network",
      description: "Electric vehicle fleet management and route optimization for sustainable urban logistics. Partnered with 50+ local businesses.",
      category: "CleanTech", stage: "Pre-Seed", fundingGoal: 200000, raised: 80000,
      founder: "Priya Sharma", founderAvatar: "PS", university: "BITS Pilani",
      skills: ["Flutter", "Firebase", "Route Optimization", "IoT"],
      teamSize: 3, lookingFor: ["Backend Developer", "Operations Manager"],
      tags: ["Sustainability", "Logistics", "EV"], verified: true, featured: false,
      upvotes: 89, views: 1120, createdAt: "2024-02-20",
      pitch: "", website: "",
      keywords: ["green delivery", "electric vehicle", "carbon neutral", "logistics", "sustainability", "ev delivery"]
    },
    {
      id: 3, name: "MedConnect", tagline: "Telemedicine platform for rural India",
      description: "Connecting rural patients with specialist doctors via AI-assisted diagnosis and video consultation. Works on 2G networks.",
      category: "HealthTech", stage: "Series A", fundingGoal: 2000000, raised: 1500000,
      founder: "Dr. Rahul Gupta", founderAvatar: "RG", university: "AIIMS Delhi",
      skills: ["React Native", "WebRTC", "AI/ML", "Healthcare"],
      teamSize: 12, lookingFor: ["iOS Developer", "Data Scientist"],
      tags: ["Healthcare", "Rural", "Telemedicine"], verified: true, featured: true,
      upvotes: 234, views: 3200, createdAt: "2023-11-10",
      pitch: "", website: "https://medconnect.in",
      keywords: ["telemedicine", "rural health", "doctor consultation", "medical", "healthcare", "remote diagnosis"]
    },
    {
      id: 4, name: "FinLit", tagline: "Gamified financial literacy for Gen Z",
      description: "Making personal finance fun through interactive simulations, challenges, and peer learning. 100K+ active users.",
      category: "FinTech", stage: "Seed", fundingGoal: 750000, raised: 400000,
      founder: "Sneha Patel", founderAvatar: "SP", university: "IIM Ahmedabad",
      skills: ["React", "Node.js", "Gamification", "Finance"],
      teamSize: 6, lookingFor: ["Game Designer", "Content Creator", "Growth Hacker"],
      tags: ["Finance", "Gaming", "Education"], verified: false, featured: false,
      upvotes: 67, views: 890, createdAt: "2024-03-05",
      pitch: "", website: "",
      keywords: ["financial literacy", "gamification", "personal finance", "gen z", "money management"]
    },
    {
      id: 5, name: "AgriSense", tagline: "IoT-based precision farming for smallholders",
      description: "Affordable soil sensors and AI crop advisory for small farmers. Increased yield by 35% in pilot.",
      category: "AgriTech", stage: "Pre-Seed", fundingGoal: 300000, raised: 120000,
      founder: "Vikram Singh", founderAvatar: "VS", university: "IIT Kharagpur",
      skills: ["IoT", "Python", "Data Analytics", "Agriculture"],
      teamSize: 5, lookingFor: ["Hardware Engineer", "Field Sales"],
      tags: ["Agriculture", "IoT", "AI"], verified: true, featured: false,
      upvotes: 103, views: 1450, createdAt: "2024-01-28",
      pitch: "", website: "",
      keywords: ["precision farming", "iot agriculture", "crop advisory", "soil sensor", "smart farming", "agritech"]
    },
    {
      id: 6, name: "SkillBridge", tagline: "Peer-to-peer skill exchange marketplace",
      description: "Students teach what they know and learn what they need. Time-banking model with verified skill assessments.",
      category: "EdTech", stage: "Idea", fundingGoal: 100000, raised: 0,
      founder: "Ananya Roy", founderAvatar: "AR", university: "Jadavpur University",
      skills: ["Vue.js", "Django", "PostgreSQL"],
      teamSize: 2, lookingFor: ["Co-founder", "Full Stack Developer", "UI Designer"],
      tags: ["Education", "Marketplace", "Community"], verified: false, featured: false,
      upvotes: 45, views: 560, createdAt: "2024-04-01",
      pitch: "", website: "",
      keywords: ["skill exchange", "peer learning", "marketplace", "time banking", "student skills"]
    }
  ],

  resumes: [
    {
      id: 1, name: "Rohan Verma", avatar: "RV", university: "IIT Bombay",
      degree: "B.Tech Computer Science", year: "3rd Year",
      skills: ["React", "Node.js", "Python", "Machine Learning", "AWS"],
      experience: ["SDE Intern @ Google", "Research Intern @ IISc"],
      projects: ["Built ML model for sentiment analysis", "Open source contributor - 500+ stars"],
      gpa: 9.2, lookingFor: "Full-time / Internship",
      preferredRoles: ["Software Engineer", "ML Engineer", "Full Stack Developer"],
      availability: "Immediate", aiScore: 94,
      tags: ["AI/ML", "Full Stack", "Cloud"],
      bio: "Passionate about building scalable AI systems. Love open source.",
      linkedin: "linkedin.com/in/rohanverma", github: "github.com/rohanv",
      uploadedAt: "2024-04-10", status: "active"
    },
    {
      id: 2, name: "Kavya Nair", avatar: "KN", university: "NIT Trichy",
      degree: "B.Tech Electronics", year: "4th Year",
      skills: ["Flutter", "Firebase", "UI/UX Design", "Figma", "React Native"],
      experience: ["Product Design Intern @ Swiggy", "UI/UX Intern @ Startup"],
      projects: ["Designed app used by 10K+ users", "Won national design hackathon"],
      gpa: 8.8, lookingFor: "Full-time",
      preferredRoles: ["Product Designer", "Mobile Developer", "UX Researcher"],
      availability: "June 2024", aiScore: 88,
      tags: ["Design", "Mobile", "Product"],
      bio: "Design-first developer who bridges the gap between aesthetics and functionality.",
      linkedin: "linkedin.com/in/kavyanair", github: "github.com/kavyan",
      uploadedAt: "2024-04-08", status: "active"
    },
    {
      id: 3, name: "Aditya Kumar", avatar: "AK", university: "BITS Goa",
      degree: "B.E. Computer Science", year: "Final Year",
      skills: ["Blockchain", "Solidity", "Web3.js", "React", "Node.js"],
      experience: ["Blockchain Dev @ Polygon", "Smart Contract Auditor"],
      projects: ["DeFi protocol with $2M TVL", "NFT marketplace"],
      gpa: 8.5, lookingFor: "Full-time / Co-founder",
      preferredRoles: ["Blockchain Developer", "Smart Contract Engineer"],
      availability: "Immediate", aiScore: 91,
      tags: ["Blockchain", "Web3", "DeFi"],
      bio: "Web3 native building the decentralized future.",
      linkedin: "", github: "github.com/adityak",
      uploadedAt: "2024-04-12", status: "active"
    },
    {
      id: 4, name: "Meera Iyer", avatar: "MI", university: "IIT Madras",
      degree: "M.Tech Data Science", year: "2nd Year",
      skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "SQL"],
      experience: ["Research Assistant @ IIT Madras AI Lab", "Data Science Intern @ Flipkart"],
      projects: ["Published paper on NLP at ACL", "Kaggle Grandmaster"],
      gpa: 9.5, lookingFor: "Research / Industry",
      preferredRoles: ["Data Scientist", "ML Research Engineer", "AI Engineer"],
      availability: "July 2024", aiScore: 97,
      tags: ["AI/ML", "Research", "NLP"],
      bio: "AI researcher passionate about making ML accessible and interpretable.",
      linkedin: "linkedin.com/in/meeraiyer", github: "github.com/meerai",
      uploadedAt: "2024-04-05", status: "active"
    }
  ],

  hackathons: [
    {
      id: 1, name: "HackIndia 2024", organizer: "Google Developer Groups",
      description: "India's largest student hackathon. Build solutions for real-world problems using Google Cloud, AI/ML, and Web3.",
      theme: "AI for Social Good", prize: "₹10,00,000", participants: 5000,
      teamSize: "2-4", mode: "Hybrid", location: "Bangalore + Online",
      deadline: "2024-05-30", eventDate: "2024-06-15",
      tags: ["AI", "Cloud", "Social Impact"], status: "open",
      logo: "🏆", registered: 2840, featured: true,
      skills: ["Machine Learning", "Cloud", "Web Development"]
    },
    {
      id: 2, name: "FinHack 2024", organizer: "NASSCOM",
      description: "Build the future of financial services. Open banking, DeFi, and financial inclusion challenges.",
      theme: "Future of Finance", prize: "₹5,00,000", participants: 2000,
      teamSize: "1-3", mode: "Online", location: "Virtual",
      deadline: "2024-06-10", eventDate: "2024-06-25",
      tags: ["FinTech", "Blockchain", "Open Banking"], status: "open",
      logo: "💰", registered: 1200, featured: false,
      skills: ["Blockchain", "React", "Finance APIs"]
    },
    {
      id: 3, name: "ClimateHack", organizer: "UN Youth India",
      description: "48-hour hackathon to build climate tech solutions. Focus on carbon tracking, renewable energy, and sustainable agriculture.",
      theme: "Climate Action", prize: "₹3,00,000", participants: 1500,
      teamSize: "2-5", mode: "In-Person", location: "Mumbai",
      deadline: "2024-05-20", eventDate: "2024-06-01",
      tags: ["CleanTech", "Sustainability", "IoT"], status: "closing-soon",
      logo: "🌱", registered: 890, featured: true,
      skills: ["IoT", "Data Analytics", "Mobile Dev"]
    },
    {
      id: 4, name: "HealthTech Sprint", organizer: "Apollo Hospitals",
      description: "Build digital health solutions for India. Telemedicine, diagnostics, mental health, and preventive care.",
      theme: "Digital Health", prize: "₹8,00,000", participants: 3000,
      teamSize: "2-4", mode: "Hybrid", location: "Hyderabad + Online",
      deadline: "2024-07-01", eventDate: "2024-07-20",
      tags: ["HealthTech", "AI", "Mobile"], status: "upcoming",
      logo: "🏥", registered: 450, featured: false,
      skills: ["React Native", "AI/ML", "Healthcare APIs"]
    }
  ],

  users: [
    {
      id: 1, name: "Demo User", email: "demo@innoverse.in", role: "maker",
      avatar: "DU", university: "IIT Delhi", bio: "Building the future",
      skills: ["React", "Node.js", "Python"], connections: 24,
      startups: [1], resumes: [1], hackathons: [1]
    }
  ],

  investors: [
    {
      id: 1, name: "Ravi Kapoor", firm: "Nexus Ventures", avatar: "RK",
      focus: ["EdTech", "FinTech", "AI"], stage: ["Seed", "Series A"],
      portfolio: 12, checkSize: "₹50L - ₹2Cr",
      bio: "Former founder, now backing the next generation of Indian startups.",
      verified: true, activelyInvesting: true
    },
    {
      id: 2, name: "Sunita Rao", firm: "Blume Ventures", avatar: "SR",
      focus: ["HealthTech", "CleanTech", "AgriTech"], stage: ["Pre-Seed", "Seed"],
      portfolio: 8, checkSize: "₹20L - ₹1Cr",
      bio: "Impact investor focused on tech for Bharat.",
      verified: true, activelyInvesting: true
    },
    {
      id: 3, name: "Amit Shah", firm: "Angel Network", avatar: "AS",
      focus: ["SaaS", "B2B", "Enterprise"], stage: ["Pre-Seed"],
      portfolio: 20, checkSize: "₹10L - ₹50L",
      bio: "Serial entrepreneur turned angel investor.",
      verified: true, activelyInvesting: false
    }
  ],

  recruiters: [
    {
      id: 1, name: "TechCorp Hiring", company: "TechCorp India", avatar: "TC",
      requirements: {
        roles: ["Software Engineer", "ML Engineer", "Full Stack Developer"],
        skills: ["React", "Node.js", "Python", "Machine Learning", "AWS"],
        minGPA: 8.0, experience: "0-2 years", universities: ["IIT", "NIT", "BITS"]
      },
      openings: 5, verified: true
    },
    {
      id: 2, name: "DesignStudio", company: "DesignStudio Co.", avatar: "DS",
      requirements: {
        roles: ["Product Designer", "UX Researcher", "Mobile Developer"],
        skills: ["Figma", "Flutter", "React Native", "UI/UX Design"],
        minGPA: 7.5, experience: "0-1 years", universities: []
      },
      openings: 3, verified: true
    }
  ]
};

// Existing startup keywords for similarity check
const EXISTING_STARTUP_KEYWORDS = DB.startups.flatMap(s => s.keywords || []);
