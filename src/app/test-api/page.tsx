"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authService } from '@/lib/api/auth';
import { UserType } from '@/lib/api';

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: 'Test User',
    email: 'test@example.com',
    phone: '0912345678',
    user_type: UserType.BUYER,
    password: 'password123'
  });

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectApi = async () => {
    addResult('🌐 Testing direct API call...');
    try {
      const response = await fetch('https://employee.luckbingogames.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        addResult('✅ Direct API call successful!');
      } else {
        addResult(`❌ Direct API call failed: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Direct API call error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testProxyRoute = async () => {
    addResult('🔄 Testing proxy route...');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        addResult('✅ Proxy route successful!');
      } else {
        addResult(`❌ Proxy route failed: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Proxy route error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testAuthService = async () => {
    addResult('🔐 Testing auth service...');
    setIsLoading(true);
    try {
      await authService.register(formData);
      addResult('✅ Auth service registration successful!');
    } catch (error) {
      addResult(`❌ Auth service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              Test different methods to connect to the API and identify CORS issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_type">User Type</Label>
                <Select
                  value={formData.user_type}
                  onValueChange={(value: UserType) => setFormData(prev => ({ ...prev, user_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserType.BUYER}>Buyer</SelectItem>
                    <SelectItem value={UserType.SELLER}>Seller</SelectItem>
                    <SelectItem value={UserType.EMPLOYEE}>Employee</SelectItem>
                    <SelectItem value={UserType.EMPLOYER}>Employer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Methods</CardTitle>
            <CardDescription>
              Try different approaches to connect to the API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={testDirectApi} variant="outline">
                Test Direct API
              </Button>
              <Button onClick={testProxyRoute} variant="outline">
                Test Proxy Route
              </Button>
              <Button onClick={testAuthService} disabled={isLoading}>
                {isLoading ? 'Testing...' : 'Test Auth Service'}
              </Button>
              <Button onClick={clearResults} variant="destructive">
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results from the API connection tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results here.</p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}