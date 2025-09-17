"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingPage } from '@/components/ui/loading'
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  Phone,
  Mail,
  Star,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

// Sample job data (same as in jobs page)
const sampleJobs = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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

export default function JobDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const jobId = parseInt(params.id as string)
  
  const [job, setJob] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Find job data
  useEffect(() => {
    const foundJob = sampleJobs.find(j => j.id === jobId)
    setJob(foundJob)
  }, [jobId])

  const handleBack = () => {
    router.push('/jobs')
  }

  const handleApply = () => {
    // In a real app, this would open an application form
    setHasApplied(true)
    alert(`Application submitted for ${job?.title} at ${job?.company}`)
  }

  const handleContactCompany = () => {
    // In a real app, this would open a contact form
    alert(`Contacting ${job?.company}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <Button onClick={handleBack} className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">{job.category}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="cursor-pointer"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" className="cursor-pointer">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Job Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{job.salary}</div>
                    <div className="text-sm text-gray-600">Salary</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{job.experience}</div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-[#007a7f]" />
                    <div className="font-semibold">{formatDate(job.postedDate)}</div>
                    <div className="text-sm text-gray-600">Posted</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                {/* Responsibilities */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((responsibility: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#007a7f] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((requirement: string, index: number) => (
                      <Badge key={index} variant="outline">{requirement}</Badge>
                    ))}
                  </div>
                  <ul className="space-y-2">
                    {job.qualifications.map((qualification: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#007a7f] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Benefits & Perks</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {job.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-[#007a7f] rounded-full mr-2"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Button */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <Button 
                  onClick={handleApply}
                  disabled={hasApplied}
                  className="w-full mb-4 cursor-pointer"
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  {hasApplied ? "Application submitted successfully!" : "Click to apply for this position"}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About {job.company}</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">{job.companyInfo.size}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <span className="text-gray-700">{job.companyInfo.industry}</span>
                  </div>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-[#007a7f]" />
                    <a 
                      href={job.companyInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#007a7f] hover:underline cursor-pointer"
                    >
                      Company Website
                    </a>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{job.companyInfo.description}</p>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{job.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{formatDate(job.postedDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}