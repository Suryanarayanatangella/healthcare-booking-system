/**
 * Home Page Component
 * 
 * The landing page for the healthcare booking system featuring
 * hero section, features, and call-to-action for new users.
 */

import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { 
  Calendar, 
  Clock, 
  Shield, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Logo from '../components/common/Logo'

const HomePage = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  // Testimonial slider state
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [direction, setDirection] = useState(0)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }



  // Slider animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity
  }

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book appointments with your preferred doctors in just a few clicks. Simple and intuitive interface designed for everyone.',
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'See available time slots instantly and avoid double bookings. Get confirmed appointments immediately.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your medical information is protected with enterprise-grade security and privacy measures.',
    },
    {
      icon: Users,
      title: 'Qualified Doctors',
      description: 'Connect with licensed healthcare professionals across various specializations and experience levels.',
    },
  ]

  const benefits = [
    'No more waiting on hold to book appointments',
    'Instant email confirmations for you and your doctor',
    'Easy rescheduling and cancellation options',
    'View your complete appointment history',
    'Mobile-friendly design for booking on the go',
    'Automated reminders for upcoming appointments',
  ]

  // Testimonials data
  const testimonials = [
    {
      name: 'Emily Chen',
      role: 'Patient',
      content: 'This platform made booking my appointments so much easier. No more waiting on hold! The interface is intuitive and I love getting instant confirmations.',
      rating: 5,
      avatar: '👩‍💼',
      location: 'San Francisco, CA'
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'Cardiologist',
      content: 'The automated scheduling has streamlined my practice significantly. Patients love the convenience and I can focus more on providing quality care.',
      rating: 5,
      avatar: '👨‍⚕️',
      location: 'New York, NY'
    },
    {
      name: 'James Wilson',
      role: 'Patient',
      content: 'Simple, fast, and reliable. I can book appointments anytime, anywhere. The reminder system ensures I never miss an appointment.',
      rating: 5,
      avatar: '👨‍💻',
      location: 'Austin, TX'
    },
    {
      name: 'Dr. Sarah Johnson',
      role: 'Family Medicine',
      content: 'This system has revolutionized how I manage patient appointments. The analytics help me optimize my schedule and improve patient satisfaction.',
      rating: 5,
      avatar: '👩‍⚕️',
      location: 'Chicago, IL'
    },
    {
      name: 'Maria Garcia',
      role: 'Patient',
      content: 'As a busy mom, this platform is a lifesaver. I can book appointments for my whole family quickly and easily. Highly recommended!',
      rating: 5,
      avatar: '👩‍👧‍👦',
      location: 'Los Angeles, CA'
    }
  ]

  // Calculate total slides (2 cards per slide)
  const totalSlides = Math.ceil(testimonials.length / 2)

  // Slider functions
  const nextTestimonial = () => {
    setDirection(1)
    setCurrentTestimonial((prev) => (prev + 1) % totalSlides)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentTestimonial((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToTestimonial = (index) => {
    setDirection(index > currentTestimonial ? 1 : -1)
    setCurrentTestimonial(index)
  }

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial()
    }, 6000) // Change every 6 seconds

    return () => clearInterval(timer)
  }, [currentTestimonial])

  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero-background.svg')`,
            y: backgroundY
          }}
        />
        
        {/* Professional medical overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-800/90 to-purple-900/95" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 25h-5v-5h5v5zm0 10h-5v-5h5v5zm10 0h-5v-5h5v5zm0-10h-5v-5h5v5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full blur-lg"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full blur-xl"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 2 }}
          />
          
          {/* Medical icons floating */}
          <motion.div 
            className="absolute top-1/3 left-10 opacity-10"
            variants={floatingVariants}
            animate="animate"
          >
            <Heart className="h-16 w-16 text-white" />
          </motion.div>
          <motion.div 
            className="absolute top-1/4 right-10 opacity-10"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 1 }}
          >
            <Shield className="h-12 w-12 text-white" />
          </motion.div>
          <motion.div 
            className="absolute bottom-1/3 right-1/4 opacity-10"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 3 }}
          >
            <Users className="h-14 w-14 text-white" />
          </motion.div>
        </div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 z-10"
          style={{ y: textY }}
        >
          <div className="text-center">
            {/* Large Logo for Hero Section */}
            <motion.div 
              className="flex justify-center mb-8"
              variants={itemVariants}
            >
              <Logo 
                size="large" 
                showText={true}
                variant="full"
                theme="white"
                linkTo={null}
              />
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6"
              variants={itemVariants}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Your Health,
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Our Priority
              </motion.span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              className="text-xl sm:text-2xl text-white/95 mb-4 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Book appointments with qualified healthcare professionals instantly
            </motion.p>
            
            {/* Supporting text */}
            <motion.p 
              className="text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              No more phone calls, no more waiting. Just simple, secure, and fast booking 
              with trusted medical professionals in your area.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/register"
                  className="group bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-10 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-3xl"
                >
                  <span className="text-lg">Get Started Free</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/doctors"
                  className="group border-2 border-white/80 text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-10 rounded-xl transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-none"
                >
                  <span className="text-lg">Browse Doctors</span>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="mt-16"
              variants={itemVariants}
            >
              <motion.p 
                className="text-white/70 text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                Trusted by thousands of patients and healthcare providers
              </motion.p>
              <motion.div 
                className="flex justify-center items-center space-x-8 opacity-70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white text-sm">HIPAA Compliant</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white text-sm">Secure & Private</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white text-sm">Licensed Doctors</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-heading font-bold text-text-primary mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why Choose Our Platform?
            </motion.h2>
            <motion.p 
              className="text-lg text-text-secondary max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We've designed the simplest and most efficient way to manage your healthcare appointments.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors duration-200"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                    <Icon className="h-8 w-8 text-primary-600" />
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-heading font-semibold text-text-primary mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-text-secondary leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 bg-background-light"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text-primary mb-6">
                Everything You Need for Healthcare Management
              </h2>
              <p className="text-lg text-text-secondary mb-8">
                Our platform streamlines the entire appointment booking process, 
                making healthcare more accessible and convenient for everyone.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <CheckCircle className="h-6 w-6 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-text-primary">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Dr. Sarah Johnson</h3>
                    <p className="text-sm text-text-secondary">Cardiologist</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-text-secondary">Today, 2:00 PM</span>
                    <span className="text-sm font-medium text-primary-600">Available</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-text-secondary">Today, 3:30 PM</span>
                    <span className="text-sm font-medium text-primary-600">Available</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-text-secondary">Today, 4:00 PM</span>
                    <span className="text-sm font-medium text-gray-400">Booked</span>
                  </div>
                </div>
                
                <Link to="/register"
                className="w-full btn-primary font-bold py-4 px-10 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl text-lg">
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Slider Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-heading font-bold text-text-primary mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              What Our Users Say
            </motion.h2>
            <motion.p 
              className="text-lg text-text-secondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Trusted by thousands of patients and healthcare providers
            </motion.p>
          </motion.div>

          {/* Testimonial Slider */}
          <div className="relative">
            {/* Navigation Buttons */}
            <motion.button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </motion.button>
            
            <motion.button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </motion.button>

            {/* Slider Container */}
            <div className="relative h-[450px] overflow-hidden rounded-2xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentTestimonial}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)

                    if (swipe < -swipeConfidenceThreshold) {
                      nextTestimonial()
                    } else if (swipe > swipeConfidenceThreshold) {
                      prevTestimonial()
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  {/* Two Cards Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
                    {/* First Card */}
                    {testimonials[currentTestimonial * 2] && (
                      <motion.div 
                        className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        <div className="text-center">
                          {/* Avatar */}
                          <motion.div 
                            className="text-4xl mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          >
                            {testimonials[currentTestimonial * 2].avatar}
                          </motion.div>

                          {/* Rating */}
                          <motion.div 
                            className="flex justify-center items-center space-x-1 mb-4"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                          >
                            {[...Array(testimonials[currentTestimonial * 2].rating)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, rotate: -180 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                              >
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Content */}
                          <motion.blockquote 
                            className="text-lg text-text-secondary mb-6 italic leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                          >
                            "{testimonials[currentTestimonial * 2].content}"
                          </motion.blockquote>

                          {/* Author Info */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                          >
                            <p className="text-lg font-bold text-text-primary mb-1">
                              {testimonials[currentTestimonial * 2].name}
                            </p>
                            <p className="text-primary-600 font-medium mb-1">
                              {testimonials[currentTestimonial * 2].role}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {testimonials[currentTestimonial * 2].location}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Second Card */}
                    {testimonials[currentTestimonial * 2 + 1] && (
                      <motion.div 
                        className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <div className="text-center">
                          {/* Avatar */}
                          <motion.div 
                            className="text-4xl mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                          >
                            {testimonials[currentTestimonial * 2 + 1].avatar}
                          </motion.div>

                          {/* Rating */}
                          <motion.div 
                            className="flex justify-center items-center space-x-1 mb-4"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                          >
                            {[...Array(testimonials[currentTestimonial * 2 + 1].rating)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, rotate: -180 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.7 + i * 0.1 }}
                              >
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Content */}
                          <motion.blockquote 
                            className="text-lg text-text-secondary mb-6 italic leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                          >
                            "{testimonials[currentTestimonial * 2 + 1].content}"
                          </motion.blockquote>

                          {/* Author Info */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                          >
                            <p className="text-lg font-bold text-text-primary mb-1">
                              {testimonials[currentTestimonial * 2 + 1].name}
                            </p>
                            <p className="text-primary-600 font-medium mb-1">
                              {testimonials[currentTestimonial * 2 + 1].role}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {testimonials[currentTestimonial * 2 + 1].location}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-3 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial 
                      ? 'bg-primary-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => goToTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 relative overflow-hidden min-h-[600px] flex items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/cta-background.svg')`,
          }}
        />
        
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 via-primary-700/90 to-purple-600/95" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Additional floating medical elements */}
        <motion.div 
          className="absolute top-1/4 left-20 opacity-10"
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="h-12 w-12 text-white" />
        </motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-20 opacity-10"
          animate={{
            y: [10, -10, 10],
            rotate: [0, -3, 0, 3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Shield className="h-10 w-10 text-white" />
        </motion.div>
        <motion.div 
          className="absolute top-1/2 left-1/4 opacity-8"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Users className="h-14 w-14 text-white" />
        </motion.div>
        
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced header with icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Ready to Transform Your
            <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Healthcare Experience?
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-white/95 mb-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of users who have simplified their healthcare booking experience.
          </motion.p>
          <motion.p 
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Start your journey to better health management today - it's completely free!
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/register"
                className="group bg-white text-primary-600 hover:bg-gray-50 font-bold py-4 px-10 rounded-xl transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl text-lg"
              >
                <Users className="h-6 w-6" />
                <span>Create Free Account</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                to="/login"
                className="group border-2 border-white/90 text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-10 rounded-xl transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-none text-lg inline-flex items-center space-x-2"
              >
                <span>Sign In</span>
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Additional trust indicators */}
          <motion.div 
            className="mt-12 flex justify-center items-center space-x-8 opacity-80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-2 text-white/90"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Free Forever</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 text-white/90"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Secure & Private</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 text-white/90"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Setup in 2 Minutes</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default HomePage