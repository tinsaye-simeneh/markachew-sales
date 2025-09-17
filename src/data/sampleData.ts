// Sample house data
export const sampleHouses = [
  {
    id: "1",
    title: "Modern Villa in Bole",
    price: 25000000,
    location: "Bole, Addis Ababa",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: "/images/house/house-6.png",
    description: "Beautiful modern villa with garden and parking space. This stunning property offers the perfect blend of contemporary design and comfortable living. Located in the prestigious Bole area, this villa provides easy access to shopping centers, restaurants, and business districts.",
    features: ["Garden", "Parking", "Security", "Furnished"],
    type: "villa" as const,
    yearBuilt: 2020,
    status: "for-sale" as const,
    images: [
      "/images/house/house-6.png",
      "/images/house/house-6.png",
      "/images/house/house-6.png",
      "/images/house/house-6.png"
    ],
    amenities: [
      "Swimming Pool",
      "Garden",
      "Parking Space",
      "Security System",
      "Air Conditioning",
      "High-Speed Internet",
      "Modern Kitchen",
      "Walk-in Closet"
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "+251 91 123 4567",
      email: "sarah@realestate.com",
      rating: 4.8,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: "2",
    title: "Cozy Apartment in Kazanchis",
    price: 8500000,
    location: "Kazanchis, Addis Ababa",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: "/images/house/house-5.png",
    description: "Well-maintained apartment in the heart of the city. This cozy apartment offers modern amenities and is perfect for young professionals or small families.",
    features: ["Balcony", "Elevator", "Security"],
    type: "apartment" as const,
    yearBuilt: 2018,
    status: "for-sale" as const,
    images: [
      "/images/house/house-5.png",
      "/images/house/house-5.png",
      "/images/house/house-5.png"
    ],
    amenities: [
      "Balcony",
      "Elevator",
      "Security",
      "Air Conditioning",
      "Internet Ready"
    ],
    agent: {
      name: "Michael Chen",
      phone: "+251 92 234 5678",
      email: "michael@realestate.com",
      rating: 4.6,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: "3",
    title: "Luxury Penthouse in Cazanchis",
    price: 45000000,
    location: "Cazanchis, Addis Ababa",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    image: "/images/house/house-4.png",
    description: "Exclusive penthouse with panoramic city views. This luxury penthouse offers the ultimate in urban living with breathtaking views of the city skyline. Features include a private rooftop terrace, premium finishes, and state-of-the-art amenities.",
    features: ["City View", "Rooftop", "Gym", "Pool"],
    type: "penthouse" as const,
    yearBuilt: 2022,
    status: "for-sale" as const,
    images: [
        "/images/house/house-4.png",
      "/images/house/house-4.png",
      "/images/house/house-4.png"
    ],
    amenities: [
      "Private Rooftop",
      "City Views",
      "Gym",
      "Swimming Pool",
      "Concierge Service",
      "Premium Finishes",
      "Smart Home System",
      "Private Elevator"
    ],
    agent: {
      name: "David Wilson",
      phone: "+251 93 345 6789",
      email: "david@realestate.com",
      rating: 4.9,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: "4",
    title: "Family House in Gerji",
    price: 18000000,
    location: "Gerji, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: "/images/house/house-3.png",
    description: "Perfect family home with large backyard. This charming family house offers spacious living areas, a beautiful garden, and a quiet neighborhood perfect for raising children. The property features modern amenities while maintaining a cozy, homey feel.",
    features: ["Garden", "Parking", "Quiet Area"],
    type: "house" as const,
    yearBuilt: 2015,
    status: "for-sale" as const,
    images: [
      "/images/house/house-3.png",
      "/images/house/house-3.png",
      "/images/house/house3.png"
    ],
    amenities: [
      "Large Garden",
      "Parking Space",
      "Quiet Neighborhood",
      "Family-Friendly",
      "Modern Kitchen",
      "Spacious Living Areas",
      "Storage Space",
      "Security"
    ],
    agent: {
      name: "Emily Rodriguez",
      phone: "+251 94 456 7890",
      email: "emily@realestate.com",
      rating: 4.7,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: "5",
    title: "Studio Apartment in Piassa",
    price: 3500000,
    location: "Piassa, Addis Ababa",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    image: "/images/house/house-2.png",
    description: "Compact studio perfect for young professionals. This modern studio apartment is ideal for young professionals who want to live in the heart of the city. Despite its compact size, it offers all the essential amenities and a great location.",
    features: ["Furnished", "Central Location"],
    type: "studio" as const,
    yearBuilt: 2019,
    status: "for-sale" as const,
    images: [
      "/images/house/house-2.png",
      "/images/house/house-2.png"
    ],
    amenities: [
      "Fully Furnished",
      "Central Location",
      "Modern Appliances",
      "High-Speed Internet",
      "Security",
      "Elevator",
      "Laundry Facilities",
      "Near Public Transport"
    ],
    agent: {
      name: "James Kim",
      phone: "+251 95 567 8901",
      email: "james@realestate.com",
      rating: 4.5,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: "6",
    title: "Townhouse in CMC",
    price: 12000000,
    location: "CMC, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: "/images/house/house-1.png",
    description: "Modern townhouse with contemporary design. This stylish townhouse features contemporary architecture and modern amenities. Perfect for families who want a modern living space with easy access to the city center.",
    features: ["Modern Design", "Parking", "Security"],
    type: "townhouse" as const,
    yearBuilt: 2021,
    status: "for-sale" as const,
    images: [
      "/images/house/house-1.png",
      "/images/house/house-1.png",
      "/images/house/house1.png"
    ],
    amenities: [
      "Modern Design",
      "Parking Space",
      "Security System",
      "Contemporary Finishes",
      "Open Plan Living",
      "Private Garden",
      "Energy Efficient",
      "Near Amenities"
    ],
    agent: {
      name: "Lisa Thompson",
      phone: "+251 96 678 9012",
      email: "lisa@realestate.com",
      rating: 4.6,
      image: "/api/placeholder/100/100"
    }
  },
  {
    id: "7",
    title: "Luxury Apartment in Bole",
    price: 15000000,
    location: "Bole, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: "/images/house/house-7.png", 
    description: "Luxury apartment with panoramic city views. This stunning apartment offers the ultimate in urban living with breathtaking views of the city skyline. Features include a private rooftop terrace, premium finishes, and state-of-the-art amenities.",
    features: ["City View", "Rooftop", "Gym", "Pool"],
    type: "apartment" as const,
    yearBuilt: 2022,
    status: "for-sale" as const,
    images: [
      "/images/house/house-7.png",
      "/images/house/house-7.png",
      "/images/house/house-7.png"
    ],
    amenities: [
      "Private Rooftop",
      "City Views",
      "Gym",
      "Swimming Pool",
      "Concierge Service",
      "Premium Finishes",
      "Smart Home System",
      "Private Elevator"
    ],
    agent: {
      name: "David Wilson",
      phone: "+251 93 345 6789",
      email: "david@realestate.com",
      rating: 4.9,
      image: "/api/placeholder/100/100"
    }
  }
]

// Sample job data
export const sampleJobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Tech Solutions Ethiopia",
    location: "Addis Ababa, Ethiopia",
    salary: "80,000 - 120,000 ETB",
    type: "Full-time",
    experience: "3-5 years",
    description: "We are looking for a senior software engineer to join our growing team. You will be responsible for developing and maintaining high-quality software solutions, collaborating with cross-functional teams, and contributing to our technical architecture decisions.",
    requirements: ["React", "Node.js", "TypeScript", "AWS", "MongoDB", "Git"],
    benefits: ["Health Insurance", "Remote Work", "Learning Budget", "Flexible Hours"],
    postedDate: "2024-01-15",
    category: "Technology",
    companyInfo: {
      size: "50-100 employees",
      industry: "Technology",
      website: "https://techsolutions.et",
      description: "Tech Solutions Ethiopia is a leading software development company specializing in innovative solutions for businesses across Africa."
    },
    responsibilities: [
      "Develop and maintain web applications using React and Node.js",
      "Collaborate with product managers and designers to define requirements",
      "Write clean, maintainable, and well-tested code",
      "Participate in code reviews and technical discussions",
      "Mentor junior developers and contribute to team growth"
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      "3-5 years of experience in software development",
      "Strong proficiency in JavaScript, React, and Node.js",
      "Experience with cloud platforms (AWS preferred)",
      "Excellent problem-solving and communication skills"
    ]
  },
  {
    id: "2",
    title: "Marketing Manager",
    company: "Digital Marketing Pro",
    location: "Addis Ababa, Ethiopia",
    salary: "60,000 - 90,000 ETB",
    type: "Full-time",
    experience: "2-4 years",
    description: "Lead our marketing initiatives and drive brand awareness. You will be responsible for developing and executing comprehensive marketing strategies to grow our business and reach new customers.",
    requirements: ["Digital Marketing", "Social Media", "Analytics", "Content Creation"],
    benefits: ["Flexible Hours", "Performance Bonus", "Career Growth"],
    postedDate: "2024-01-14",
    category: "Marketing",
    companyInfo: {
      size: "20-50 employees",
      industry: "Marketing",
      website: "https://digitalmarketingpro.et",
      description: "Digital Marketing Pro is a full-service marketing agency helping businesses grow their online presence."
    },
    responsibilities: [
      "Develop and execute comprehensive marketing strategies",
      "Manage social media campaigns and content creation",
      "Analyze marketing metrics and optimize campaigns",
      "Collaborate with sales team to generate leads",
      "Manage marketing budget and ROI tracking"
    ],
    qualifications: [
      "Bachelor's degree in Marketing or related field",
      "2-4 years of experience in digital marketing",
      "Proficiency in marketing tools and platforms",
      "Strong analytical and creative skills",
      "Experience with social media management"
    ]
  },
  {
    id: "3",
    title: "Financial Analyst",
    company: "Ethiopian Investment Group",
    location: "Addis Ababa, Ethiopia",
    salary: "70,000 - 100,000 ETB",
    type: "Full-time",
    experience: "2-3 years",
    description: "Analyze financial data and provide insights for business decisions. You will be responsible for financial modeling, forecasting, and providing strategic recommendations to support business growth.",
    requirements: ["Excel", "Financial Modeling", "Data Analysis", "CPA Preferred"],
    benefits: ["Health Insurance", "Retirement Plan", "Professional Development"],
    postedDate: "2024-01-13",
    category: "Finance",
    companyInfo: {
      size: "100-500 employees",
      industry: "Finance",
      website: "https://ethiopianinvestment.et",
      description: "Ethiopian Investment Group is a leading financial services company providing investment solutions and financial advisory services."
    },
    responsibilities: [
      "Analyze financial data and create reports",
      "Develop financial models and forecasts",
      "Support budgeting and planning processes",
      "Provide investment recommendations",
      "Monitor market trends and economic indicators"
    ],
    qualifications: [
      "Bachelor's degree in Finance, Economics, or related field",
      "2-3 years of experience in financial analysis",
      "Strong analytical and quantitative skills",
      "Proficiency in Excel and financial modeling",
      "CPA or CFA certification preferred"
    ]
  },
  {
    id: "4",
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "Addis Ababa, Ethiopia",
    salary: "50,000 - 80,000 ETB",
    type: "Full-time",
    experience: "1-3 years",
    description: "Create beautiful and intuitive user experiences for our products. You will work closely with product managers and developers to design user-centered solutions that delight our customers.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    benefits: ["Creative Freedom", "Remote Work", "Design Tools"],
    postedDate: "2024-01-12",
    category: "Design",
    companyInfo: {
      size: "10-20 employees",
      industry: "Design",
      website: "https://creativestudio.et",
      description: "Creative Studio is a boutique design agency specializing in digital product design and brand identity."
    },
    responsibilities: [
      "Design user interfaces and user experiences",
      "Conduct user research and usability testing",
      "Create wireframes, prototypes, and mockups",
      "Collaborate with development teams",
      "Maintain design systems and style guides"
    ],
    qualifications: [
      "Bachelor's degree in Design or related field",
      "1-3 years of experience in UX/UI design",
      "Proficiency in Figma, Adobe Creative Suite",
      "Strong portfolio demonstrating design skills",
      "Understanding of user-centered design principles"
    ]
  },
  {
    id: "5",
    title: "Sales Representative",
    company: "Ethiopian Trading Company",
    location: "Addis Ababa, Ethiopia",
    salary: "40,000 - 70,000 ETB + Commission",
    type: "Full-time",
    experience: "1-2 years",
    description: "Build relationships with clients and drive sales growth. You will be responsible for identifying new business opportunities, maintaining client relationships, and achieving sales targets.",
    requirements: ["Sales Experience", "Communication Skills", "CRM Software"],
    benefits: ["Commission", "Company Car", "Sales Training"],
    postedDate: "2024-01-11",
    category: "Sales",
    companyInfo: {
      size: "50-100 employees",
      industry: "Trading",
      website: "https://ethiopiantrading.et",
      description: "Ethiopian Trading Company is a leading import/export company specializing in agricultural and industrial products."
    },
    responsibilities: [
      "Identify and pursue new business opportunities",
      "Build and maintain client relationships",
      "Present products and services to potential clients",
      "Negotiate contracts and pricing",
      "Achieve monthly and quarterly sales targets"
    ],
    qualifications: [
      "Bachelor's degree in Business or related field",
      "1-2 years of sales experience",
      "Excellent communication and negotiation skills",
      "Proficiency in CRM software",
      "Self-motivated and results-oriented"
    ]
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "AI Innovation Hub",
    location: "Addis Ababa, Ethiopia",
    salary: "90,000 - 130,000 ETB",
    type: "Full-time",
    experience: "3-5 years",
    description: "Extract insights from data to drive business intelligence. You will work with large datasets to develop machine learning models and provide actionable insights for business decisions.",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    benefits: ["Research Opportunities", "Conference Attendance", "Stock Options"],
    postedDate: "2024-01-10",
    category: "Technology",
    companyInfo: {
      size: "20-50 employees",
      industry: "Technology",
      website: "https://aiinnovation.et",
      description: "AI Innovation Hub is a cutting-edge technology company focused on artificial intelligence and machine learning solutions."
    },
    responsibilities: [
      "Develop machine learning models and algorithms",
      "Analyze large datasets to extract insights",
      "Create data visualizations and reports",
      "Collaborate with engineering teams",
      "Stay updated with latest AI/ML technologies"
    ],
    qualifications: [
      "Master's degree in Data Science, Statistics, or related field",
      "3-5 years of experience in data science",
      "Proficiency in Python, R, SQL",
      "Experience with machine learning frameworks",
      "Strong statistical and analytical skills"
    ]
  },
  {
    id: "7",
    title: "Human Resources Specialist",
    company: "People First Consulting",
    location: "Addis Ababa, Ethiopia",
    salary: "45,000 - 65,000 ETB",
    type: "Full-time",
    experience: "2-3 years",
    description: "Manage recruitment, employee relations, and HR processes. You will be responsible for supporting all aspects of human resources including recruitment, onboarding, and employee development.",
    requirements: ["HR Experience", "Recruitment", "Employee Relations", "HRIS"],
    benefits: ["Health Insurance", "Professional Development", "Work-Life Balance"],
    postedDate: "2024-01-09",
    category: "Human Resources",
    companyInfo: {
      size: "20-50 employees",
      industry: "Consulting",
      website: "https://peoplefirst.et",
      description: "People First Consulting provides comprehensive HR solutions and organizational development services."
    },
    responsibilities: [
      "Manage recruitment and selection processes",
      "Handle employee relations and conflict resolution",
      "Support performance management processes",
      "Maintain HR records and systems",
      "Develop and implement HR policies"
    ],
    qualifications: [
      "Bachelor's degree in Human Resources or related field",
      "2-3 years of HR experience",
      "Knowledge of employment laws and regulations",
      "Proficiency in HRIS systems",
      "Strong interpersonal and communication skills"
    ]
  },
  {
    id: "8",
    title: "Content Writer",
    company: "Digital Content Agency",
    location: "Remote",
    salary: "30,000 - 50,000 ETB",
    type: "Part-time",
    experience: "1-2 years",
    description: "Create engaging content for various digital platforms. You will be responsible for writing blog posts, social media content, and marketing materials that engage our target audience.",
    requirements: ["Writing Skills", "SEO Knowledge", "Content Management", "Research"],
    benefits: ["Remote Work", "Flexible Schedule", "Creative Projects"],
    postedDate: "2024-01-08",
    category: "Content",
    companyInfo: {
      size: "10-20 employees",
      industry: "Marketing",
      website: "https://digitalcontent.et",
      description: "Digital Content Agency specializes in creating compelling content for digital marketing campaigns and brand storytelling."
    },
    responsibilities: [
      "Write engaging blog posts and articles",
      "Create social media content and captions",
      "Develop marketing copy and materials",
      "Research industry trends and topics",
      "Optimize content for SEO"
    ],
    qualifications: [
      "Bachelor's degree in English, Journalism, or related field",
      "1-2 years of content writing experience",
      "Strong writing and editing skills",
      "Knowledge of SEO best practices",
      "Experience with content management systems"
    ]
  }
]

// Helper functions to get data by ID
export const getHouseById = (id: string) => {
  return sampleHouses.find(house => house.id === id)
}

export const getJobById = (id: string) => {
  return sampleJobs.find(job => job.id === id)
}

// Type definitions
export type House = typeof sampleHouses[0]
export type Job = typeof sampleJobs[0]