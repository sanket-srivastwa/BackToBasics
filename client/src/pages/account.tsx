import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft,
  User,
  Settings,
  Shield,
  Camera,
  Phone,
  Mail,
  Lock,
  Key,
  Building,
  GraduationCap,
  Globe,
  MessageSquare,
  Linkedin,
  Facebook,
  Chrome,
  UserCircle,
  Edit3,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Download
} from "lucide-react";

export default function Account() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [show2FACode, setShow2FACode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "Demo",
    lastName: user?.lastName || "User",
    email: user?.email || "demo@example.com",
    phone: "+1 (555) 123-4567",
    headline: "Senior Product Manager at Tech Corp",
    company: "Tech Corp",
    university: "Stanford University",
    education: "MBA in Technology Management",
    gender: "prefer-not-to-say",
    language: "English",
    linkedinUrl: "https://linkedin.com/in/demouser",
    facebookUrl: "",
    googleUrl: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    securityAlerts: true
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Source Sans Pro', 'Roboto', sans-serif" }}>
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <UserCircle className="h-16 w-16 text-[#455A64] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#263238] mb-2">Sign In Required</h1>
            <p className="text-[#455A64] mb-6">Please sign in to access your account settings.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-[#2962FF] hover:bg-[#1E88E5] text-white"
            >
              Go to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    // Show success message
  };

  const handlePhotoUpload = () => {
    // In a real app, this would handle file upload
    console.log("Photo upload functionality would be implemented here");
  };

  const enable2FA = () => {
    setShow2FACode(true);
    setSecuritySettings({ ...securitySettings, twoFactorEnabled: true });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Source Sans Pro', 'Roboto', sans-serif" }}>
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-6 text-[#455A64]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#263238] mb-2">Account Settings</h1>
          <p className="text-[#455A64]">Manage your account information and security settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security & Privacy
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#263238]">Basic Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.email || "User"} />
                    <AvatarFallback className="text-lg">
                      {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#263238] mb-2">Profile Photo</p>
                    <Button
                      variant="outline"
                      onClick={handlePhotoUpload}
                      className="flex items-center gap-2"
                      disabled={!isEditing}
                    >
                      <Camera className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-[#455A64] mt-2">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#455A64]" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                    <Badge variant="outline" className="text-green-600">Verified</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#455A64]" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                    <Badge variant="outline" className="text-yellow-600">Verify</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={profileData.headline}
                    onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Senior Product Manager at Google"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={profileData.gender} 
                      onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Spoken Language</Label>
                    <Select 
                      value={profileData.language} 
                      onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                        <SelectItem value="Korean">Korean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#263238]">Professional Information</CardTitle>
                <CardDescription>Your work and education background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Current Company</Label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#455A64]" />
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#455A64]" />
                    <Input
                      id="university"
                      value={profileData.university}
                      onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={profileData.education}
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., MBA in Technology Management"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#263238]">Social Links</CardTitle>
                <CardDescription>Connect your professional social profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-[#0077B5]" />
                    <Input
                      id="linkedinUrl"
                      value={profileData.linkedinUrl}
                      onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebookUrl">Facebook Profile</Label>
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-[#1877F2]" />
                    <Input
                      id="facebookUrl"
                      value={profileData.facebookUrl}
                      onChange={(e) => setProfileData({ ...profileData, facebookUrl: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://facebook.com/yourprofile"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleUrl">Google Profile</Label>
                  <div className="flex items-center gap-2">
                    <Chrome className="h-4 w-4 text-[#4285F4]" />
                    <Input
                      id="googleUrl"
                      value={profileData.googleUrl}
                      onChange={(e) => setProfileData({ ...profileData, googleUrl: e.target.value })}
                      disabled={!isEditing}
                      placeholder="https://plus.google.com/yourprofile"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Privacy Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Password Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#263238]">Password & Security</CardTitle>
                <CardDescription>Manage your password and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button className="bg-[#2962FF] hover:bg-[#1E88E5] text-white">
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#263238]">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-[#455A64]" />
                    <div>
                      <p className="font-medium text-[#263238]">Authenticator App</p>
                      <p className="text-sm text-[#455A64]">Use an app like Google Authenticator</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={enable2FA}
                  />
                </div>

                {show2FACode && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <QrCode className="h-5 w-5 text-[#2962FF]" />
                      <p className="font-medium text-[#263238]">Scan QR Code</p>
                    </div>
                    <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300 text-center mb-4">
                      <div className="w-32 h-32 bg-gray-100 mx-auto rounded flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                      <p className="text-sm text-[#455A64] mt-2">QR Code would appear here</p>
                    </div>
                    <p className="text-sm text-[#455A64] mb-4">
                      Scan this QR code with your authenticator app, then enter the verification code below:
                    </p>
                    <div className="flex gap-3">
                      <Input placeholder="Enter 6-digit code" className="flex-1" />
                      <Button className="bg-[#2962FF] hover:bg-[#1E88E5] text-white">
                        Verify
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-[#455A64]" />
                    <div>
                      <p className="font-medium text-[#263238]">SMS Authentication</p>
                      <p className="text-sm text-[#455A64]">Receive codes via text message</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.smsNotifications}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, smsNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#263238]">Security Alerts</CardTitle>
                <CardDescription>Get notified about important security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#263238]">Email Security Alerts</p>
                      <p className="text-sm text-[#455A64]">Get notified of suspicious activity</p>
                    </div>
                    <Switch
                      checked={securitySettings.emailNotifications}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#263238]">Login Notifications</p>
                      <p className="text-sm text-[#455A64]">Alert when someone signs into your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.securityAlerts}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, securityAlerts: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#263238]">Account Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#263238]">Course Reminders</p>
                      <p className="text-sm text-[#455A64]">Get reminded to continue your learning</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#263238]">Progress Reports</p>
                      <p className="text-sm text-[#455A64]">Weekly summary of your learning progress</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#263238]">Marketing Emails</p>
                      <p className="text-sm text-[#455A64]">Updates about new courses and features</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-[#263238]">Data & Privacy</h3>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download My Data
                  </Button>

                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Delete Account
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