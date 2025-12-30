import {
  Shield,
  Award,
  Clock,
  Zap,
  Users,
  CheckCircle2,
  Briefcase,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Handshake,
} from "lucide-react"

export const stats = [
  { icon: Briefcase, value: 5000, label: "Successful Placements" },
  { icon: CheckCircle, value: 3500, label: "Loans Approved" },
  { icon: Award, value: 98, label: "Client Satisfaction", suffix: "%" },
  { icon: Users, value: 10, label: "Years of Excellence" },
]

export const features = [
  {
    icon: Shield,
    title: "Verified Expertise",
    description: "Team of seasoned professionals with 10+ years in recruitment, finance, and career development.",
  },
  {
    icon: Award,
    title: "Proven Success",
    description: "5000+ successful placements and 3500+ loans facilitated with a 98% satisfaction rate.",
  },
  {
    icon: Clock,
    title: "Personalized Support",
    description: "Tailored guidance for each client with ongoing support throughout your entire journey.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "Streamlined processes designed to save you time without compromising on quality.",
  },
  {
    icon: Users,
    title: "Dedicated Team",
    description: "Genuinely invested in your success with 24/7 support and regular follow-ups.",
  },
  {
    icon: CheckCircle2,
    title: "100% Transparent",
    description: "Clear communication, no hidden fees, and honest guidance at every step of the way.",
  },
]

export const processSteps = [
  {
    step: 1,
    title: "Register",
    description: "Fill out our secure online form with your information and requirements.",
    icon: Briefcase,
  },
  {
    step: 2,
    title: "Assess",
    description: "Our experts thoroughly analyze your profile and qualifications.",
    icon: Award,
  },
  {
    step: 3,
    title: "Guide",
    description: "Receive customized strategies and personalized recommendations.",
    icon: Lightbulb,
  },
  {
    step: 4,
    title: "Succeed",
    description: "Achieve your goals with our continuous support and mentorship.",
    icon: TrendingUp,
  },
]

export const testimonials = [
  {
    name: "Raj Patel",
    role: "Software Engineer",
    company: "Tech Corp India",
    content: "Athith's guidance was invaluable in landing my dream job. The interview coaching and resume review transformed my application.",
    rating: 5,
    initials: "RP",
  },
  {
    name: "Priya Sharma",
    role: "Business Analyst",
    company: "Finance Solutions Ltd",
    content: "The loan application process was seamless with their support. They explained everything clearly and made the entire experience stress-free.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Arjun Kumar",
    role: "Project Manager",
    company: "Global Solutions",
    content: "Within 3 weeks of starting with Athith, I had multiple job offers. Their personalized approach truly makes a difference.",
    rating: 5,
    initials: "AK",
  },
  {
    name: "Neha Singh",
    role: "Data Scientist",
    company: "Analytics Pro",
    content: "Professional, courteous, and highly effective. They genuinely care about their clients' success and it shows.",
    rating: 5,
    initials: "NS",
  },
]

export const faqs = [
  {
    question: "What services do you offer?",
    answer: "We provide comprehensive job placement assistance and loan application guidance. Our services include profile optimization, interview coaching, document verification, and personalized support throughout your application journey.",
  },
  {
    question: "How long does the job placement process take?",
    answer: "The timeline varies based on individual circumstances and job market conditions. On average, our clients secure positions within 2-8 weeks with our active support and guidance.",
  },
  {
    question: "Is there a guarantee on loan approval?",
    answer: "While we cannot guarantee loan approval, we maximize your chances by ensuring all documentation is perfect and your application is competitive. Our approval rate is significantly higher than the industry average.",
  },
  {
    question: "What qualifications do your consultants have?",
    answer: "Our team comprises certified professionals with 10+ years of experience in recruitment and financial services. We stay updated with the latest industry trends and best practices.",
  },
  {
    question: "Do you offer after-placement support?",
    answer: "Yes, we provide ongoing support even after placement or loan approval. Our commitment extends to ensuring your long-term success and satisfaction.",
  },
]

export const team = [
  {
    name: "Vikram Desai",
    title: "Founder & Career Specialist",
    bio: "15+ years in recruitment and career development.",
    image: "/member.jpg",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Anjali Verma",
    title: "Head of Loan Services",
    bio: "12+ years in financial advisory and loan processing.",
    image: "/member.jpg",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Rohan Gupta",
    title: "Client Success Manager",
    bio: "8+ years in client relationship management.",
    image: "/member.jpg",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
]

export const jobServices = [
  "Professional Resume Enhancement",
  "Strategic Application Guidance",
  "Interview Coaching & Preparation",
  "Salary Negotiation Support",
];

export const loanServices = [
  "Complete Document Verification",
  "Eligibility Assessment & Planning",
  "Application Process Guidance",
  "Post-Approval Support",
];