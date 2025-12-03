import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/_card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/_tabs';
import { Button } from '../../ui/_button';
import { Input } from '../../ui/_input';
import { Textarea } from '../../ui/_textarea';
import { Label } from '../../ui/_label';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/_avatar';
import { Badge } from '../../ui/_badge';
import { Switch } from '../../ui/_switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/_select';
import { Separator } from '../../ui/_separator';
import { toast } from 'sonner';
import {
  User as userIcon,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Clock,
  Shield,
  Bell,
  Globe,
  Lock,
  Camera,
  Edit2,
  Save,
  X,
  Github,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Activity,
  Briefcase,
  Award,
  UserIcon,
} from 'lucide-react';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  company: string;
  jobTitle: string;
  department: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  timezone: string;
  language: string;
  dateFormat: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  projectUpdates: boolean;
  taskAssignments: boolean;
  comments: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

function UserProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior Project Manager with 8+ years of experience in leading cross-functional teams and delivering complex projects on time and within budget.',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    zipCode: '94102',
    company: 'Tech Innovations Inc.',
    jobTitle: 'Senior Project Manager',
    department: 'Product Development',
    website: 'johndoe.com',
    github: 'johndoe',
    linkedin: 'john-doe',
    twitter: '@johndoe',
    timezone: 'America/Los_Angeles',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });

  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    comments: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfileData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempProfileData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setTempProfileData(profileData);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }
    toast.success('Password changed successfully!');
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: securityData.twoFactorEnabled,
    });
  };

  const stats = [
    { label: 'Projects Completed', value: '47', icon: Briefcase },
    { label: 'Active Tasks', value: '12', icon: Activity },
    { label: 'Team Members', value: '23', icon: UserIcon },
    { label: 'Achievements', value: '8', icon: Award },
  ];

  return (
    <div className="h-full overflow-auto bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={avatarUrl} alt={`${profileData.firstName} ${profileData.lastName}`} />
                    <AvatarFallback>{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1>{profileData.firstName} {profileData.lastName}</h1>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></div>
                      Online
                    </Badge>
                  </div>
                  <p className="text-slate-600">{profileData.jobTitle}</p>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-4 w-4" />
                      <span>{profileData.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.city}, {profileData.state}, {profileData.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span>{profileData.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              {activeTab === 'personal' && (
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={handleEdit} className="gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-slate-50 p-4 text-center">
                  <stat.icon className="mx-auto mb-2 h-5 w-5 text-blue-600" />
                  <div className="text-slate-600">{stat.value}</div>
                  <div className="text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      <UserIcon className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={isEditing ? tempProfileData.firstName : profileData.firstName}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      <UserIcon className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={isEditing ? tempProfileData.lastName : profileData.lastName}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? tempProfileData.email : profileData.email}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={isEditing ? tempProfileData.phone : profileData.phone}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={isEditing ? tempProfileData.bio : profileData.bio}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">
                      <Building className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={isEditing ? tempProfileData.company : profileData.company}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, company: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">
                      <Briefcase className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      value={isEditing ? tempProfileData.jobTitle : profileData.jobTitle}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, jobTitle: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={isEditing ? tempProfileData.department : profileData.department}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, department: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3>Address Information</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={isEditing ? tempProfileData.address : profileData.address}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      {isEditing ? (
                        <Select
                          value={tempProfileData.country}
                          onValueChange={(value) => setTempProfileData({ ...tempProfileData, country: value, state: '' })}
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Spain">Spain</SelectItem>
                            <SelectItem value="Italy">Italy</SelectItem>
                            <SelectItem value="Netherlands">Netherlands</SelectItem>
                            <SelectItem value="Belgium">Belgium</SelectItem>
                            <SelectItem value="Switzerland">Switzerland</SelectItem>
                            <SelectItem value="Austria">Austria</SelectItem>
                            <SelectItem value="Sweden">Sweden</SelectItem>
                            <SelectItem value="Norway">Norway</SelectItem>
                            <SelectItem value="Denmark">Denmark</SelectItem>
                            <SelectItem value="Finland">Finland</SelectItem>
                            <SelectItem value="Poland">Poland</SelectItem>
                            <SelectItem value="Ireland">Ireland</SelectItem>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Greece">Greece</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                            <SelectItem value="China">China</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="South Korea">South Korea</SelectItem>
                            <SelectItem value="Singapore">Singapore</SelectItem>
                            <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                            <SelectItem value="Taiwan">Taiwan</SelectItem>
                            <SelectItem value="Malaysia">Malaysia</SelectItem>
                            <SelectItem value="Thailand">Thailand</SelectItem>
                            <SelectItem value="Indonesia">Indonesia</SelectItem>
                            <SelectItem value="Philippines">Philippines</SelectItem>
                            <SelectItem value="Vietnam">Vietnam</SelectItem>
                            <SelectItem value="New Zealand">New Zealand</SelectItem>
                            <SelectItem value="Brazil">Brazil</SelectItem>
                            <SelectItem value="Mexico">Mexico</SelectItem>
                            <SelectItem value="Argentina">Argentina</SelectItem>
                            <SelectItem value="Chile">Chile</SelectItem>
                            <SelectItem value="Colombia">Colombia</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                            <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                            <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                            <SelectItem value="Israel">Israel</SelectItem>
                            <SelectItem value="Turkey">Turkey</SelectItem>
                            <SelectItem value="Russia">Russia</SelectItem>
                            <SelectItem value="Ukraine">Ukraine</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="country"
                          value={profileData.country}
                          disabled={true}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State / Province</Label>
                      {isEditing ? (
                        tempProfileData.country === 'United States' ? (
                          <Select
                            value={tempProfileData.state}
                            onValueChange={(value) => setTempProfileData({ ...tempProfileData, state: value })}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alabama">Alabama</SelectItem>
                              <SelectItem value="Alaska">Alaska</SelectItem>
                              <SelectItem value="Arizona">Arizona</SelectItem>
                              <SelectItem value="Arkansas">Arkansas</SelectItem>
                              <SelectItem value="California">California</SelectItem>
                              <SelectItem value="Colorado">Colorado</SelectItem>
                              <SelectItem value="Connecticut">Connecticut</SelectItem>
                              <SelectItem value="Delaware">Delaware</SelectItem>
                              <SelectItem value="Florida">Florida</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                              <SelectItem value="Hawaii">Hawaii</SelectItem>
                              <SelectItem value="Idaho">Idaho</SelectItem>
                              <SelectItem value="Illinois">Illinois</SelectItem>
                              <SelectItem value="Indiana">Indiana</SelectItem>
                              <SelectItem value="Iowa">Iowa</SelectItem>
                              <SelectItem value="Kansas">Kansas</SelectItem>
                              <SelectItem value="Kentucky">Kentucky</SelectItem>
                              <SelectItem value="Louisiana">Louisiana</SelectItem>
                              <SelectItem value="Maine">Maine</SelectItem>
                              <SelectItem value="Maryland">Maryland</SelectItem>
                              <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                              <SelectItem value="Michigan">Michigan</SelectItem>
                              <SelectItem value="Minnesota">Minnesota</SelectItem>
                              <SelectItem value="Mississippi">Mississippi</SelectItem>
                              <SelectItem value="Missouri">Missouri</SelectItem>
                              <SelectItem value="Montana">Montana</SelectItem>
                              <SelectItem value="Nebraska">Nebraska</SelectItem>
                              <SelectItem value="Nevada">Nevada</SelectItem>
                              <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                              <SelectItem value="New Jersey">New Jersey</SelectItem>
                              <SelectItem value="New Mexico">New Mexico</SelectItem>
                              <SelectItem value="New York">New York</SelectItem>
                              <SelectItem value="North Carolina">North Carolina</SelectItem>
                              <SelectItem value="North Dakota">North Dakota</SelectItem>
                              <SelectItem value="Ohio">Ohio</SelectItem>
                              <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                              <SelectItem value="Oregon">Oregon</SelectItem>
                              <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                              <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                              <SelectItem value="South Carolina">South Carolina</SelectItem>
                              <SelectItem value="South Dakota">South Dakota</SelectItem>
                              <SelectItem value="Tennessee">Tennessee</SelectItem>
                              <SelectItem value="Texas">Texas</SelectItem>
                              <SelectItem value="Utah">Utah</SelectItem>
                              <SelectItem value="Vermont">Vermont</SelectItem>
                              <SelectItem value="Virginia">Virginia</SelectItem>
                              <SelectItem value="Washington">Washington</SelectItem>
                              <SelectItem value="West Virginia">West Virginia</SelectItem>
                              <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                              <SelectItem value="Wyoming">Wyoming</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : tempProfileData.country === 'Canada' ? (
                          <Select
                            value={tempProfileData.state}
                            onValueChange={(value) => setTempProfileData({ ...tempProfileData, state: value })}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alberta">Alberta</SelectItem>
                              <SelectItem value="British Columbia">British Columbia</SelectItem>
                              <SelectItem value="Manitoba">Manitoba</SelectItem>
                              <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                              <SelectItem value="Newfoundland and Labrador">Newfoundland and Labrador</SelectItem>
                              <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                              <SelectItem value="Ontario">Ontario</SelectItem>
                              <SelectItem value="Prince Edward Island">Prince Edward Island</SelectItem>
                              <SelectItem value="Quebec">Quebec</SelectItem>
                              <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                              <SelectItem value="Northwest Territories">Northwest Territories</SelectItem>
                              <SelectItem value="Nunavut">Nunavut</SelectItem>
                              <SelectItem value="Yukon">Yukon</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : tempProfileData.country === 'Australia' ? (
                          <Select
                            value={tempProfileData.state}
                            onValueChange={(value) => setTempProfileData({ ...tempProfileData, state: value })}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New South Wales">New South Wales</SelectItem>
                              <SelectItem value="Victoria">Victoria</SelectItem>
                              <SelectItem value="Queensland">Queensland</SelectItem>
                              <SelectItem value="South Australia">South Australia</SelectItem>
                              <SelectItem value="Western Australia">Western Australia</SelectItem>
                              <SelectItem value="Tasmania">Tasmania</SelectItem>
                              <SelectItem value="Northern Territory">Northern Territory</SelectItem>
                              <SelectItem value="Australian Capital Territory">Australian Capital Territory</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id="state"
                            value={tempProfileData.state}
                            onChange={(e) => setTempProfileData({ ...tempProfileData, state: e.target.value })}
                            placeholder="Enter state/province"
                          />
                        )
                      ) : (
                        <Input
                          id="state"
                          value={profileData.state}
                          disabled={true}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={isEditing ? tempProfileData.city : profileData.city}
                        onChange={(e) => setTempProfileData({ ...tempProfileData, city: e.target.value })}
                        disabled={!isEditing}
                        placeholder="San Francisco"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip / Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={isEditing ? tempProfileData.zipCode : profileData.zipCode}
                        onChange={(e) => setTempProfileData({ ...tempProfileData, zipCode: e.target.value })}
                        disabled={!isEditing}
                        placeholder="94102"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">
                    <LinkIcon className="mb-1 mr-1.5 inline-block h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={isEditing ? tempProfileData.website : profileData.website}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder="yourwebsite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">
                    <Github className="mb-1 mr-1.5 inline-block h-4 w-4" />
                    GitHub
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">github.com/</span>
                    <Input
                      id="github"
                      value={isEditing ? tempProfileData.github : profileData.github}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, github: e.target.value })}
                      disabled={!isEditing}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">
                    <Linkedin className="mb-1 mr-1.5 inline-block h-4 w-4" />
                    LinkedIn
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">linkedin.com/in/</span>
                    <Input
                      id="linkedin"
                      value={isEditing ? tempProfileData.linkedin : profileData.linkedin}
                      onChange={(e) => setTempProfileData({ ...tempProfileData, linkedin: e.target.value })}
                      disabled={!isEditing}
                      placeholder="username"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">
                    <Twitter className="mb-1 mr-1.5 inline-block h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={isEditing ? tempProfileData.twitter : profileData.twitter}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, twitter: e.target.value })}
                    disabled={!isEditing}
                    placeholder="@username"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Customize your regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">
                      <Clock className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Timezone
                    </Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      <Globe className="mb-1 mr-1.5 inline-block h-4 w-4" />
                      Language
                    </Label>
                    <Select
                      value={profileData.language}
                      onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">
                    <Calendar className="mb-1 mr-1.5 inline-block h-4 w-4" />
                    Date Format
                  </Label>
                  <Select
                    value={profileData.dateFormat}
                    onValueChange={(value) => setProfileData({ ...profileData, dateFormat: value })}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (11/03/2025)</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (03/11/2025)</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-11-03)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p>Export Account Data</p>
                    <p className="text-slate-500">Download all your account data</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                  <div>
                    <p className="text-red-900">Delete Account</p>
                    <p className="text-red-700">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    <Lock className="mb-1 mr-1.5 inline-block h-4 w-4" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  />
                </div>
                <Button onClick={handlePasswordChange} className="w-full">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <p>Two-Factor Authentication</p>
                    </div>
                    <p className="text-slate-500">
                      {securityData.twoFactorEnabled
                        ? 'Two-factor authentication is enabled'
                        : 'Protect your account with 2FA'}
                    </p>
                  </div>
                  <Switch
                    checked={securityData.twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      setSecurityData({ ...securityData, twoFactorEnabled: checked });
                      toast.success(checked ? '2FA enabled successfully!' : '2FA disabled');
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage devices where you're currently logged in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p>MacBook Pro - Chrome</p>
                      <p className="text-slate-500">San Francisco, CA • Current session</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2">
                      <Activity className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p>iPhone 14 Pro - Safari</p>
                      <p className="text-slate-500">San Francisco, CA • 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Revoke</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <p>Email Notifications</p>
                    </div>
                    <p className="text-slate-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>Project Updates</p>
                      <p className="text-slate-500">Get notified about project status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.projectUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, projectUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>Task Assignments</p>
                      <p className="text-slate-500">Get notified when you're assigned to a task</p>
                    </div>
                    <Switch
                      checked={notificationSettings.taskAssignments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, taskAssignments: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>Comments & Mentions</p>
                      <p className="text-slate-500">Get notified when someone comments or mentions you</p>
                    </div>
                    <Switch
                      checked={notificationSettings.comments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, comments: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>Weekly Digest</p>
                      <p className="text-slate-500">Receive a weekly summary of your activity</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weeklyDigest: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>Marketing Emails</p>
                      <p className="text-slate-500">Receive updates about new features and tips</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Configure Browser Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Configure Mobile Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
export default UserProfile;