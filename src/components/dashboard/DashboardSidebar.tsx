"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Briefcase, 
  Home, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Receipt,
  Calendar,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { UserType } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface DashboardSidebarProps {
  userType: UserType.EMPLOYER | UserType.SELLER
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardSidebar({ userType, activeTab, onTabChange }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const isEmployer = userType === UserType.EMPLOYER

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Dashboard summary'
    },
    {
      id: isEmployer ? 'jobs' : 'properties',
      label: isEmployer ? 'My Jobs' : 'My Properties',
      icon: isEmployer ? Briefcase : Home,
      description: isEmployer ? 'Manage job postings' : 'Manage property listings'
    },
    {
      id: isEmployer ? 'applications' : 'inquiries',
      label: isEmployer ? 'Applications' : 'Inquiries',
      icon: Users,
      description: isEmployer ? 'Job applications' : 'Property inquiries'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: Receipt,
      description: 'Payment submissions and history'
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: Calendar,
      description: 'Manage your subscription plan'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Updates and alerts'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Account preferences'
    }
  ]

  const handleLogout = async () => {
    await logout()
  }

  const handleReturnToMain = () => {
    router.push('/houses')
  }

  return (
    <motion.div
      className={`bg-white shadow-lg border-r border-gray-200 flex flex-col h-full ${
        isCollapsed ? 'w-16' : 'w-64'
      } transition-all duration-300`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
      <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleReturnToMain}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Main Dashboard  
              </Button>
            </div>
    
        <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col overflow-hidden">
     
            
      </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {isEmployer ? 'Employer' : 'Seller'} Dashboard
              </h2>
              <p className="text-sm text-gray-500">Welcome back, {user?.full_name}</p>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start cursor-pointer ${
                  isActive 
                    ? 'bg-primary hover:bg-primary/80 text-white' 
                    : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                } ${isCollapsed ? 'px-2' : 'px-3'}`}
                onClick={() => onTabChange(item.id)}
              >
                <IconComponent className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </motion.div>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/10 cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                Help & Support
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User className="h-4 w-4 text-white" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}