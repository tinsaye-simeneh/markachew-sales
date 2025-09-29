"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { COMPANY_DISPLAY_NAME } from '@/lib/constants'
import {  User, LogOut, Menu, X, Heart, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    setIsRegisterOpen(false)
  }

  const handleRegisterClick = () => {
    setIsRegisterOpen(true)
    setIsLoginOpen(false)
  }

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const handleCloseModals = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleHousesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMobileMenu()
    router.push('/houses')
  }

  const handleJobsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMobileMenu()
    router.push('/jobs')
  }

  const handleSavedClick = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMobileMenu()
    if (user) {
      router.push('/saved')
    } else {
      setIsLoginOpen(true)
    }
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <button className="text-xl font-bold text-primary cursor-pointer" onClick={() => router.push('/')}>{COMPANY_DISPLAY_NAME}</button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {user && (user.user_type === 'EMPLOYER' || user.user_type === 'SELLER') && (
            <button 
                onClick={() => router.push('/')}
                className="text-gray-700 hover:text-primary cursor-pointer transition-colors"
              >
                Dashboard
              </button>
              )}
              <button 
                onClick={handleHousesClick}
                className="text-gray-700 hover:text-primary cursor-pointer transition-colors"
              >
                Houses
              </button>
              <button 
                onClick={handleJobsClick}
                className="text-gray-700 hover:text-primary cursor-pointer transition-colors"
              >
                Jobs
              </button>
             
              <button 
                onClick={() => router.push('/about')}
                className="text-gray-700 hover:text-primary cursor-pointer transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="text-gray-700 hover:text-primary cursor-pointer transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.full_name || 'User'} />
                        <AvatarFallback>
                          {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                          {user.user_type}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className='cursor-pointer'>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {user.user_type === 'EMPLOYEE' && (
                      <DropdownMenuItem onClick={() => router.push('/applications')} className='cursor-pointer'>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Applications</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push('/saved')} className='cursor-pointer'>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Saved Items</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={handleLoginClick} className="cursor-pointer">
                    Sign In
                  </Button>
                  <Button onClick={handleRegisterClick} className="cursor-pointer">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                {/* Mobile Navigation Links */}
                <button 
                  onClick={handleHousesClick}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  Houses
                </button>
                <button 
                  onClick={handleJobsClick}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  Jobs
                </button>
                {user && (
                  <button 
                    onClick={handleSavedClick}
                    className="flex items-center w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Saved
                  </button>
                )}
                <button 
                  onClick={() => { closeMobileMenu(); router.push('/about'); }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => { closeMobileMenu(); router.push('/contact'); }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  Contact
                </button>

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={user.full_name || 'User'} />
                            <AvatarFallback>
                              {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => { closeMobileMenu(); router.push('/profile'); }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      >
                        <User className="inline h-4 w-4 mr-2" />
                        Profile
                      </button>
                      {user.user_type === 'EMPLOYEE' && (
                        <button 
                          onClick={() => { closeMobileMenu(); router.push('/applications'); }}
                          className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        >
                          <FileText className="inline h-4 w-4 mr-2" />
                          My Applications
                        </button>
                      )}
                      <button 
                        onClick={() => { closeMobileMenu(); router.push('/saved'); }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      >
                        <Heart className="inline h-4 w-4 mr-2" />
                        Saved Items
                      </button>
                      <button 
                        onClick={() => { closeMobileMenu(); logout(); }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => { closeMobileMenu(); handleLoginClick(); }} 
                        className="w-full justify-start cursor-pointer"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => { closeMobileMenu(); handleRegisterClick(); }} 
                        className="w-full cursor-pointer"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseModals}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}