import { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserType } from '@/lib/api';
import { User } from 'lucide-react';

interface Step1Props {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  userType: UserType;
  setUserType: (value: UserType) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

export function Step1({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  userType,
  setUserType,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: Step1Props) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Please fill in the following information to create your account.
        </CardDescription>
      </CardHeader>
      
      <CardContent className='mt-4'>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="09xxxxxxxx or +2519xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userType">Account Type *</Label>
            <Select value={userType} onValueChange={(value: UserType) => setUserType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserType.BUYER}>House Buyer</SelectItem>
                <SelectItem value={UserType.SELLER}>House Seller</SelectItem>
                <SelectItem value={UserType.EMPLOYEE}>Job Seeker</SelectItem>
                <SelectItem value={UserType.EMPLOYER}>Employer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </>
  );
}