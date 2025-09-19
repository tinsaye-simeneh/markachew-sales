"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'

export default function DebugAuthPage() {
  const { user, isLoading } = useAuth()
  const [localStorageData, setLocalStorageData] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    user: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
    user: null,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user'),
      }
      setLocalStorageData(data)
    }
  }, [])

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setLocalStorageData({})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Auth Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {user ? 'Logged In' : 'Not Logged In'}</p>
                {user && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p><strong>Name:</strong> {user.full_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Type:</strong> {user.user_type}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Access Token:</strong> {localStorageData.accessToken ? 'Present' : 'Missing'}</p>
                <p><strong>Refresh Token:</strong> {localStorageData.refreshToken ? 'Present' : 'Missing'}</p>
                <p><strong>User Data:</strong> {localStorageData.user ? 'Present' : 'Missing'}</p>
                
                {localStorageData.accessToken && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p><strong>Token Preview:</strong> {localStorageData.accessToken.substring(0, 20)}...</p>
                  </div>
                )}
                
                <Button onClick={clearStorage} variant="outline" className="mt-4">
                  Clear Storage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={async () => {
                try {
                  const user = localStorageData.user ? JSON.parse(localStorageData.user) : null;
                  if (!user || !user.id) {
                    alert('No user ID found. Please log in first.');
                    return;
                  }
                  
                  const response = await fetch(`/api/profile/${user.id}`, {
                    headers: {
                      'Authorization': `Bearer ${localStorageData.accessToken}`,
                    }
                  })
                  const data = await response.json()
                  console.log('API Response:', data)
                  alert(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`)
                } catch (error) {
                  console.error('API Error:', error)
                  alert(`Error: ${error}`)
                }
              }}
              disabled={!localStorageData.accessToken || !localStorageData.user}
            >
              Test Profile API
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}