/**
 * Analytics Page Component - Comprehensive Practice Analytics Dashboard
 * 
 * This component provides doctors with detailed analytics and insights including:
 * - Appointment trends and patterns
 * - Patient demographics and statistics
 * - Revenue and financial metrics
 * - Performance indicators and KPIs
 * - Interactive charts and visualizations
 * - Exportable reports and data insights
 * 
 * @author Healthcare Development Team
 * @version 1.0
 * @since 2024
 */

import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Heart,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  FileText
} from 'lucide-react'

// Import chart components (you would install recharts: npm install recharts)
// For now, we'll create placeholder chart components
import LoadingSpinner, { CardLoader } from '../../components/common/LoadingSpinner'

/**
 * Mock Chart Components
 * In production, replace these with actual chart library components (Recharts, Chart.js, etc.)
 */
const LineChart = ({ data, title, color = '#007C91' }) => (
  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
    <div className="text-center">
      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500">{title} Chart</p>
      <p className="text-xs text-gray-400">Chart visualization would appear here</p>
    </div>
  </div>
)

const BarChart = ({ data, title }) => (
  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
    <div className="text-center">
      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500">{title} Chart</p>
      <p className="text-xs text-gray-400">Chart visualization would appear here</p>
    </div>
  </div>
)

const DonutChart = ({ data, title }) => (
  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
    <div className="text-center">
      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500">{title} Chart</p>
      <p className="text-xs text-gray-400">Chart visualization would appear here</p>
    </div>
  </div>
)

/**
 * Analytics time period configurations
 */
const TIME_PERIODS = [
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 3 Months' },
  { key: '1y', label: 'Last Year' }
]

const AnalyticsPage = () => {
  // Redux state management
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { appointments } = useSelector((state) => state.appointments)

  // Local state for analytics controls
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('appointments')

  // Mock analytics data - In production, this would come from API
  const [analyticsData] = useState({
    overview: {
      totalAppointments: 156,
      totalPatients: 89,
      totalRevenue: 23400,
      averageRating: 4.8,
      appointmentGrowth: 12.5,
      patientGrowth: 8.3,
      revenueGrowth: 15.2,
      ratingChange: 0.2
    },
    appointments: {
      byStatus: {
        completed: 120,
        scheduled: 25,
        cancelled: 8,
        no_show: 3
      },
      byType: {
        consultation: 89,
        follow_up: 45,
        routine_checkup: 15,
        emergency: 7
      },
      trends: [
        { date: '2024-01-01', count: 12 },
        { date: '2024-01-02', count: 15 },
        { date: '2024-01-03', count: 18 },
        { date: '2024-01-04', count: 14 },
        { date: '2024-01-05', count: 20 }
      ]
    },
    patients: {
      demographics: {
        ageGroups: {
          '18-30': 25,
          '31-45': 35,
          '46-60': 20,
          '60+': 9
        },
        gender: {
          male: 42,
          female: 47
        }
      },
      satisfaction: {
        excellent: 65,
        good: 20,
        average: 3,
        poor: 1
      }
    },
    revenue: {
      monthly: [
        { month: 'Jan', amount: 18500 },
        { month: 'Feb', amount: 21200 },
        { month: 'Mar', amount: 23400 }
      ],
      byService: {
        consultation: 15600,
        follow_up: 5200,
        procedures: 2600
      }
    },
    performance: {
      punctuality: 94.5,
      patientSatisfaction: 4.8,
      appointmentCompletion: 92.3,
      responseTime: 2.1 // hours
    }
  })

  /**
   * Calculate key performance indicators
   */
  const kpiMetrics = useMemo(() => [
    {
      title: 'Total Appointments',
      value: analyticsData.overview.totalAppointments,
      change: analyticsData.overview.appointmentGrowth,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100',
      trend: 'up'
    },
    {
      title: 'Active Patients',
      value: analyticsData.overview.totalPatients,
      change: analyticsData.overview.patientGrowth,
      icon: Users,
      color: 'text-green-600 bg-green-100',
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: `$${analyticsData.overview.totalRevenue.toLocaleString()}`,
      change: analyticsData.overview.revenueGrowth,
      icon: DollarSign,
      color: 'text-primary-600 bg-primary-100',
      trend: 'up'
    },
    {
      title: 'Avg Rating',
      value: analyticsData.overview.averageRating,
      change: analyticsData.overview.ratingChange,
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100',
      trend: 'up'
    }
  ], [analyticsData])

  /**
   * Performance metrics calculation
   */
  const performanceMetrics = useMemo(() => [
    {
      title: 'Punctuality Rate',
      value: `${analyticsData.performance.punctuality}%`,
      target: 95,
      current: analyticsData.performance.punctuality,
      icon: Clock,
      color: analyticsData.performance.punctuality >= 95 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      title: 'Patient Satisfaction',
      value: `${analyticsData.performance.patientSatisfaction}/5`,
      target: 4.5,
      current: analyticsData.performance.patientSatisfaction,
      icon: Heart,
      color: analyticsData.performance.patientSatisfaction >= 4.5 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      title: 'Completion Rate',
      value: `${analyticsData.performance.appointmentCompletion}%`,
      target: 90,
      current: analyticsData.performance.appointmentCompletion,
      icon: CheckCircle,
      color: analyticsData.performance.appointmentCompletion >= 90 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      title: 'Response Time',
      value: `${analyticsData.performance.responseTime}h`,
      target: 2,
      current: analyticsData.performance.responseTime,
      icon: Activity,
      color: analyticsData.performance.responseTime <= 2 ? 'text-green-600' : 'text-red-600'
    }
  ], [analyticsData])

  /**
   * Handle data refresh
   */
  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  /**
   * Handle report export
   */
  const handleExport = (format) => {
    console.log(`Exporting analytics report in ${format} format`)
    // Implementation would generate and download report
  }

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              Practice Analytics
            </h1>
            <p className="text-text-secondary">
              Comprehensive insights into your practice performance
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-input"
            >
              {TIME_PERIODS.map(period => (
                <option key={period.key} value={period.key}>
                  {period.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn-ghost flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <div className="relative">
              <button className="btn-outline flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiMetrics.map((metric, index) => {
            const Icon = metric.icon
            const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown
            
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-text-primary mb-1">
                    {metric.value}
                  </p>
                  <p className="text-sm font-medium text-text-secondary">
                    {metric.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointment Trends */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">
                Appointment Trends
              </h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="form-input py-1 text-sm"
                >
                  <option value="appointments">Appointments</option>
                  <option value="revenue">Revenue</option>
                  <option value="patients">New Patients</option>
                </select>
              </div>
            </div>
            <LineChart 
              data={analyticsData.appointments.trends} 
              title="Appointment Trends"
              color="#007C91"
            />
          </div>

          {/* Appointment Status Distribution */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Appointment Status
            </h2>
            <DonutChart 
              data={analyticsData.appointments.byStatus} 
              title="Status Distribution"
            />
            
            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {Object.entries(analyticsData.appointments.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'completed' ? 'bg-green-500' :
                      status === 'scheduled' ? 'bg-blue-500' :
                      status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm text-text-secondary capitalize">
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon
              const percentage = (metric.current / metric.target) * 100
              
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    percentage >= 100 ? 'bg-green-100' : 
                    percentage >= 80 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {metric.title}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 100 ? 'bg-green-500' :
                        percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-text-muted mt-1">
                    Target: {metric.target}{metric.title.includes('Rate') || metric.title.includes('Satisfaction') ? 
                      (metric.title.includes('Satisfaction') ? '/5' : '%') : 
                      (metric.title.includes('Time') ? 'h' : '')
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Demographics */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Patient Demographics
            </h2>
            
            {/* Age Groups */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Age Groups</h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.patients.demographics.ageGroups).map(([age, count]) => {
                  const percentage = (count / analyticsData.overview.totalPatients) * 100
                  return (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">{age} years</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary w-8">
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Gender Distribution */}
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">Gender</h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.patients.demographics.gender).map(([gender, count]) => {
                  const percentage = (count / analyticsData.overview.totalPatients) * 100
                  return (
                    <div key={gender} className="flex items-center justify-between">
                      <span className="text-sm text-text-primary capitalize">{gender}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary w-8">
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Revenue Analysis
            </h2>
            
            <div className="mb-6">
              <div className="text-3xl font-bold text-text-primary mb-2">
                ${analyticsData.overview.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  +{analyticsData.overview.revenueGrowth}% from last period
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">Revenue by Service</h3>
              {Object.entries(analyticsData.revenue.byService).map(([service, amount]) => {
                const percentage = (amount / analyticsData.overview.totalRevenue) * 100
                return (
                  <div key={service} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary capitalize">
                        {service.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Patient Satisfaction */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Patient Satisfaction
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-text-primary mb-2">
                {analyticsData.overview.averageRating}
              </div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(analyticsData.overview.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-text-secondary">
                Based on {analyticsData.overview.totalPatients} reviews
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(analyticsData.patients.satisfaction).map(([rating, count]) => {
                const percentage = (count / analyticsData.overview.totalPatients) * 100
                return (
                  <div key={rating} className="flex items-center justify-between">
                    <span className="text-sm text-text-primary capitalize">{rating}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage