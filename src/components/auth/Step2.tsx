import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserType } from '@/lib/api';
import { MapPin } from 'lucide-react';

interface Step2Props {
  location: string;
  setLocation: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  degree: string;
  setDegree: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  experience: string;
  setExperience: (value: string) => void;
  availability: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  setAvailability: (value: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT') => void;
  salaryExpectation: string;
  setSalaryExpectation: (value: string) => void;
  photo: File | null;
  setPhoto: (file: File | null) => void;
  document: File | null;
  setDocument: (file: File | null) => void;
  license: File | null;
  setLicense: (file: File | null) => void;
  cv: File | null;
  setCv: (file: File | null) => void;
  userType: UserType;
  handleFileUpload: (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Step2({
  location,
  setLocation,
  address,
  setAddress,
  degree,
  setDegree,
  department,
  setDepartment,
  experience,
  setExperience,
  availability,
  setAvailability,
  salaryExpectation,
  setSalaryExpectation,
  photo,
  setPhoto,
  document,
  setDocument,
  license,
  setLicense,
  cv,
  setCv,
  userType,
  handleFileUpload,
}: Step2Props) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Complete your profile details
        </CardDescription>
      </CardHeader>
      
      <CardContent className='mt-4'>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className='mb-2'>Location *</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Addis Ababa, Ethiopia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className='mb-2'>Address *</Label>
            <Input
              id="address"
              type="text"
              placeholder="Your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Employee-specific fields */}
          {userType === UserType.EMPLOYEE && (
            <>
              <div className="space-y-2">
                <Label htmlFor="degree" className='mb-2'>Degree/Education *</Label>
                <Input
                  id="degree"
                  type="text"
                  placeholder="e.g., BSc Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department" className='mb-2'>Department *</Label>
                <Input
                  id="department"
                  type="text"
                  placeholder="e.g., IT, Marketing"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience" className='mb-2'>Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g., 5"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability" className='mb-2'>Availability</Label>
                  <Select value={availability} onValueChange={(value: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT') => setAvailability(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salaryExpectation" className='mb-2'>Salary Expectation (ETB)</Label>
                <Input
                  id="salaryExpectation"
                  type="number"
                  placeholder="e.g., 15000"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cv" className='mb-2'>CV/Resume *</Label>
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload(setCv)}
                  required
                />
                {cv && (
                  <p className="text-sm text-green-600">✓ {cv.name}</p>
                )}
                <p className="text-xs text-gray-500">Upload your CV in PDF or Word format</p>
              </div>
            </>
          )}

          {/* Employer/Seller-specific fields */}
          {(userType === UserType.EMPLOYER || userType === UserType.SELLER) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="license" className='mb-2'>Business License (Optional)</Label>
                <Input
                  id="license"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload(setLicense)}
                />
                {license && (
                  <p className="text-sm text-green-600">✓ {license.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document" className='mb-2'>Business Document (Optional)</Label>
                <Input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload(setDocument)}
                />
                {document && (
                  <p className="text-sm text-green-600">✓ {document.name}</p>
                )}
              </div>
            </>
          )}

          {/* Profile photo for all users */}
          <div className="space-y-2">
            <Label htmlFor="photo" className='mb-2'>Profile Photo (Optional)</Label>
            <Input
              id="photo"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileUpload(setPhoto)}
            />
            {photo && (
              <p className="text-sm text-green-600">✓ {photo.name}</p>
            )}
          </div>
        </div>
      </CardContent>
    </>
  );
}