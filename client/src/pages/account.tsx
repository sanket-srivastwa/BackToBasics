import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useLocation } from "wouter";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Bell, 
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Key,
  QrCode,
  Link,
  Building,
  GraduationCap,
  Globe,
  Users,
  Briefcase,
  Edit,
  Save,
  X,
  Upload,
  MessageSquare,
  Heart,
  MapPin,
  Calendar,
  Languages
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Account() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your account.",
        variant: "destructive",
      });
      setLocation("/signin");
    }
  }, [isAuthenticated, isLoading, setLocation, toast]);

  // Personal Information
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    bio: "",
    profileImage: ""
  });

  // Professional Information
  const [professionalData, setProfessionalData] = useState({
    company: "",
    position: "",
    university: "",
    education: "",
    headline: "",
    experience: "",
    skills: "",
    spokenLanguage: "",
    linkedIn: "",
    facebook: "",
    instagram: "",
    portfolio: ""
  });

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    smsVerification: false,
    authenticatorEnabled: false,
    backupCodes: [] as string[]
  });

  // Privacy & Notifications
  const [privacyData, setPrivacyData] = useState({
    profileVisibility: "public",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true,
    learningReminders: true,
    progressReports: true,
    marketingEmails: false,
    securityAlerts: true,
    dataSharing: false
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setPersonalData(prev => ({
        ...prev,
        firstName: (user as any).firstName || "",
        lastName: (user as any).lastName || "",
        email: (user as any).email || "",
        profileImage: (user as any).profileImageUrl || ""
      }));
    }
  }, [user]);

  const handlePersonalUpdate = async () => {
    try {
      // Save to localStorage for persistence
      localStorage.setItem('userPersonalData', JSON.stringify(personalData));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Personal information updated",
        description: "Your personal details have been successfully saved.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your information.",
        variant: "destructive",
      });
    }
  };

  const handleProfessionalUpdate = async () => {
    try {
      // Save to localStorage for persistence
      localStorage.setItem('userProfessionalData', JSON.stringify(professionalData));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Professional information updated",
        description: "Your professional details have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your professional information.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
      setSecurityData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      toast({
        title: "Password update failed",
        description: "There was an error updating your password.",
        variant: "destructive",
      });
    }
  };

  const enable2FA = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecurityData(prev => ({ ...prev, twoFactorEnabled: true }));
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now more secure with 2FA.",
      });
    } catch (error) {
      toast({
        title: "2FA setup failed",
        description: "There was an error setting up two-factor authentication.",
        variant: "destructive",
      });
    }
  };

  const enableSMSVerification = async () => {
    if (!personalData.phone) {
      toast({
        title: "Phone number required",
        description: "Please add your phone number first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSecurityData(prev => ({ ...prev, smsVerification: true }));
      toast({
        title: "SMS verification enabled",
        description: "You will now receive SMS codes for verification.",
      });
    } catch (error) {
      toast({
        title: "SMS setup failed",
        description: "There was an error setting up SMS verification.",
        variant: "destructive",
      });
    }
  };

  const generateBackupCodes = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      );
      
      setSecurityData(prev => ({ ...prev, backupCodes: codes }));
      toast({
        title: "Backup codes generated",
        description: "Save these codes in a secure location.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating backup codes.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPersonalData(prev => ({ ...prev, profileImage: result }));
        toast({
          title: "Image uploaded",
          description: "Your profile picture has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-2">Manage your personal information, security settings, and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Professional</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal details and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={personalData.profileImage} alt="Profile picture" />
                    <AvatarFallback className="text-lg">
                      {personalData.firstName?.[0]}{personalData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <p className="text-sm text-gray-600">Upload a new profile picture</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Personal Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={personalData.firstName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={personalData.lastName}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={personalData.email}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        type="tel"
                        value={personalData.phone}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={personalData.dateOfBirth}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={personalData.gender} onValueChange={(value) => setPersonalData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="location"
                        value={personalData.location}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={personalData.bio}
                      onChange={(e) => setPersonalData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handlePersonalUpdate} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information Tab */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>
                  Share your professional background and connect your social profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="company"
                        value={professionalData.company}
                        onChange={(e) => setProfessionalData(prev => ({ ...prev, company: e.target.value }))}
                        className="pl-10"
                        placeholder="Your current company"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={professionalData.position}
                      onChange={(e) => setProfessionalData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Your job title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="university"
                        value={professionalData.university}
                        onChange={(e) => setProfessionalData(prev => ({ ...prev, university: e.target.value }))}
                        className="pl-10"
                        placeholder="Your university"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select value={professionalData.education} onValueChange={(value) => setProfessionalData(prev => ({ ...prev, education: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      value={professionalData.headline}
                      onChange={(e) => setProfessionalData(prev => ({ ...prev, headline: e.target.value }))}
                      placeholder="e.g., Senior Product Manager at Tech Company"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select value={professionalData.experience} onValueChange={(value) => setProfessionalData(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="11-15">11-15 years</SelectItem>
                        <SelectItem value="15+">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spokenLanguage">Spoken Languages</Label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="spokenLanguage"
                        value={professionalData.spokenLanguage}
                        onChange={(e) => setProfessionalData(prev => ({ ...prev, spokenLanguage: e.target.value }))}
                        className="pl-10"
                        placeholder="e.g., English, Spanish, French"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="skills">Skills & Expertise</Label>
                    <Textarea
                      id="skills"
                      value={professionalData.skills}
                      onChange={(e) => setProfessionalData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="List your key skills and expertise areas..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                {/* Social Media Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media & Professional Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="linkedIn"
                          value={professionalData.linkedIn}
                          onChange={(e) => setProfessionalData(prev => ({ ...prev, linkedIn: e.target.value }))}
                          className="pl-10"
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="portfolio"
                          value={professionalData.portfolio}
                          onChange={(e) => setProfessionalData(prev => ({ ...prev, portfolio: e.target.value }))}
                          className="pl-10"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook Profile</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="facebook"
                          value={professionalData.facebook}
                          onChange={(e) => setProfessionalData(prev => ({ ...prev, facebook: e.target.value }))}
                          className="pl-10"
                          placeholder="https://facebook.com/yourprofile"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Profile</Label>
                      <div className="relative">
                        <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="instagram"
                          value={professionalData.instagram}
                          onChange={(e) => setProfessionalData(prev => ({ ...prev, instagram: e.target.value }))}
                          className="pl-10"
                          placeholder="https://instagram.com/yourprofile"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfessionalUpdate} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Professional Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password Security
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            {/* Multi-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Multi-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <QrCode className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Authenticator App</h3>
                      <p className="text-sm text-gray-600">Use an app like Google Authenticator or Authy</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {securityData.twoFactorEnabled && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Button
                      variant={securityData.twoFactorEnabled ? "outline" : "default"}
                      onClick={enable2FA}
                      disabled={securityData.twoFactorEnabled}
                    >
                      {securityData.twoFactorEnabled ? "Configured" : "Set Up"}
                    </Button>
                  </div>
                </div>

                {/* SMS Verification */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">SMS Verification</h3>
                      <p className="text-sm text-gray-600">Receive verification codes via text message</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {securityData.smsVerification && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Button
                      variant={securityData.smsVerification ? "outline" : "default"}
                      onClick={enableSMSVerification}
                      disabled={securityData.smsVerification}
                    >
                      {securityData.smsVerification ? "Active" : "Enable"}
                    </Button>
                  </div>
                </div>

                {/* Backup Codes */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Key className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Backup Codes</h3>
                        <p className="text-sm text-gray-600">Recovery codes for when you can't access your phone</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={generateBackupCodes}>
                      Generate New Codes
                    </Button>
                  </div>
                  
                  {securityData.backupCodes.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="text-sm font-medium mb-2">Your backup codes:</p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                        {securityData.backupCodes.map((code, index) => (
                          <div key={index} className="bg-white p-2 rounded border text-center">
                            {code}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Save these codes in a secure place. Each code can only be used once.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Notifications Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive updates and communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive updates and alerts via email</p>
                    </div>
                    <Switch
                      checked={privacyData.emailNotifications}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">Receive important alerts via text message</p>
                    </div>
                    <Switch
                      checked={privacyData.smsNotifications}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <Switch
                      checked={privacyData.pushNotifications}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Learning Reminders</h3>
                      <p className="text-sm text-gray-600">Get reminded about your learning goals</p>
                    </div>
                    <Switch
                      checked={privacyData.learningReminders}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, learningReminders: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Progress Reports</h3>
                      <p className="text-sm text-gray-600">Weekly summaries of your learning progress</p>
                    </div>
                    <Switch
                      checked={privacyData.progressReports}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, progressReports: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-gray-600">Receive promotional content and tips</p>
                    </div>
                    <Switch
                      checked={privacyData.marketingEmails}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Security Alerts</h3>
                      <p className="text-sm text-gray-600">Important security and login notifications</p>
                    </div>
                    <Switch
                      checked={privacyData.securityAlerts}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, securityAlerts: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <Select value={privacyData.profileVisibility} onValueChange={(value) => setPrivacyData(prev => ({ ...prev, profileVisibility: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                        <SelectItem value="members">Members Only - Only BackToBasics members</SelectItem>
                        <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Data Sharing</h3>
                      <p className="text-sm text-gray-600">Allow anonymized data for research and improvement</p>
                    </div>
                    <Switch
                      checked={privacyData.dataSharing}
                      onCheckedChange={(checked) => setPrivacyData(prev => ({ ...prev, dataSharing: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}