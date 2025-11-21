import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainLayout from "@/components/layout/MainLayout"
import { useLogin } from "@/context/AuthContext"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { toast } from "react-toastify"
import {
  User,
  Wallet,
  Copy,
  Check,
  Edit,
  Save,
  X,
  Shield,
  Key,
  Bell,
  Lock,
  LogOut,
} from "lucide-react"
import { truncateAddress } from "@/utils/formatAddress"
import { cn } from "@/lib/utils"

// Minimal local UI helpers with styling
const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("block text-sm font-medium text-gray-300 mb-1", className)}
    {...props}
  />
)

const Textarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "w-full rounded-md border border-orange-500/20 bg-background/50 px-3 py-2 text-sm text-white shadow-sm outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/60 placeholder:text-gray-500",
      className
    )}
    {...props}
  />
)

const Badge = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
      className
    )}
    {...props}
  />
)

const Profile = () => {
  const navigate = useNavigate()
  const account = useCurrentAccount()
  const { logOut } = useLogin()
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const displayAddress = account?.address || "Not connected"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    website: "",
    notifications: true,
    publicProfile: true,
  })
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast("Address copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setIsEditing(false)
    toast("Your profile has been saved successfully")
  }

  const handleLogout = () => {
    logOut()
    navigate("/")
  }

  return (
    <MainLayout>
      <div className="min-h-screen mesh-bg py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Profile Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="glow-card border-orange-500/20">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 via-teal-500 to-purple-500 p-1">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <User className="w-16 h-16 text-orange-400" />
                        </div>
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors">
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1 break-all">
                        {formData.username || "Your username"}
                      </h2>
                      <p className="text-gray-400 text-sm break-all">
                        {formData.email || "No email added"}
                      </p>
                    </div>
                    <div className="w-full flex flex-wrap gap-2 justify-start">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        Active Member
                      </Badge>
                      {formData.publicProfile && (
                        <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                          Public Profile
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Info Card */}
              <Card className="glow-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Wallet className="w-5 h-5 text-orange-400" />
                    Wallet Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Wallet Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-background/50 rounded-lg text-sm text-gray-300 border border-orange-500/20">
                        {truncateAddress(displayAddress)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(displayAddress)}
                        className="hover:bg-orange-500/10"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Network</Label>
                    <p className="text-white mt-1">Sui Devnet</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Account Type</Label>
                    <p className="text-white mt-1">ZK Login</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass-card border-orange-500/20 rounded-full p-0 overflow-hidden">
                  <TabsTrigger
                    value="general"
                    className="data-[state=active]:bg-orange-500/20 rounded-none"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-orange-500/20 rounded-none"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="data-[state=active]:bg-orange-500/20 rounded-none"
                  >
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4">
                  <Card className="glow-card border-orange-500/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-white">General Information</CardTitle>
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="border-orange-500/30 hover:bg-orange-500/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                            className="border-red-500/30 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSave}
                            className="button-primary"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="username" className="text-left text-gray-300">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, username: e.target.value })
                          }
                          disabled={!isEditing}
                          className="mt-1 bg-background/50 border-orange-500/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-left text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={!isEditing}
                          className="mt-1 bg-background/50 border-orange-500/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-left text-gray-300">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                          disabled={!isEditing}
                          rows={4}
                          className="mt-1 bg-background/50 border-orange-500/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website" className="text-left text-gray-300">
                          Website
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, website: e.target.value })
                          }
                          disabled={!isEditing}
                          placeholder="https://yourwebsite.com"
                          className="mt-1 bg-background/50 border-orange-500/20 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-4">
                  <Card className="glow-card border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Shield className="w-5 h-5 text-orange-400" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-background/50 border border-orange-500/20">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-orange-400" />
                          <div className="text-left">
                            <p className="text-white font-medium">ZK Login</p>
                            <p className="text-gray-400 text-sm">
                              Zero-knowledge authentication enabled
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-background/50 border border-orange-500/20">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-gray-400 text-sm">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-orange-500/30">
                          Enable
                        </Button>
                      </div>
                      <div className="pt-4 border-t border-orange-500/20">
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="w-full"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="mt-4">
                  <Card className="glow-card border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Bell className="w-5 h-5 text-orange-400" />
                        Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-background/50 border border-orange-500/20">
                        <div>
                          <p className="text-left text-white font-medium">Email Notifications</p>
                          <p className="text-gray-400 text-sm">
                            Receive updates about your account activity
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.notifications}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, notifications: e.target.checked })
                          }
                          className="w-5 h-5 rounded border-orange-500/30 bg-background/50 text-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-background/50 border border-orange-500/20">
                        <div>
                          <p className="text-left text-white font-medium">Public Profile</p>
                          <p className="text-gray-400 text-sm">
                            Allow others to view your profile
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.publicProfile}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, publicProfile: e.target.checked })
                          }
                          className="w-5 h-5 rounded border-orange-500/30 bg-background/50 text-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Profile

