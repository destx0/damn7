import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useUserStore from '@/stores/useUserStore'
import { Eye, EyeOff, LockKeyhole, School, ShieldCheck } from 'lucide-react'
import logo from '@/assets/logo.png'

const LoginPage = () => {
  const [adminPassword, setAdminPassword] = useState('')
  const [teacherPassword, setTeacherPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)

  const DEFAULT_ADMIN_PASSWORD = '123'
  const DEFAULT_TEACHER_PASSWORD = '123'

  const handleLogin = (e, type) => {
    e.preventDefault()
    const password = type === 'admin' ? adminPassword : teacherPassword
    const correctPassword = type === 'admin' ? DEFAULT_ADMIN_PASSWORD : DEFAULT_TEACHER_PASSWORD

    if (password === correctPassword) {
      // Successful login
      setUser(type, type)
      navigate('/table')
    } else {
      // Failed login
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Left panel with logo and branding - modern gradient background */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col justify-center items-center p-8 md:p-12 relative">
        {/* Abstract shapes for modern look */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[20%] left-[10%] w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute bottom-[10%] right-[5%] w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-[60%] left-[30%] w-20 h-20 rounded-full bg-white"></div>
        </div>

        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="bg-white rounded-full p-4 inline-block mb-6 shadow-xl">
            <img src={logo} alt="School Logo" className="h-28 w-auto object-contain" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-3">Student Management System</h1>
          <div className="h-1 w-20 bg-white/30 mx-auto mb-4"></div>
          <p className="text-white/80 mb-6">
            Jagannath Shikshan Prasarak Mandal&apos;s
            <br />
            <span className="text-lg font-medium text-white">
              Shashikant Sakharam Chaudhari Vidyalaya
            </span>
            <br />
            Yawal, Dist. Jalgaon
          </p>
          <div className="text-white/70 text-sm mt-8 font-medium">विद्या ददाति विनयम्</div>
        </div>
      </div>

      {/* Right panel with login form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl overflow-hidden backdrop-blur-sm bg-white/90">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <h2 className="text-xl font-medium">Welcome Back</h2>
              <p className="text-white/80 text-sm mt-1">
                Please enter your credentials to access the system
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="mx-6 mt-6 border-red-200 bg-red-50 text-red-600"
              >
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="admin" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2 mx-6">
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <ShieldCheck size={16} className="mr-2" />
                  Administrator
                </TabsTrigger>
                <TabsTrigger
                  value="teacher"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <School size={16} className="mr-2" />
                  Teacher
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, 'admin')}>
                  <CardContent className="space-y-5 p-6">
                    <div>
                      <label
                        htmlFor="admin-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Administrator Password
                      </label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="admin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="pl-10 pr-10 py-2 h-11 border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 rounded-md font-medium transition-all"
                    >
                      Sign in as Administrator
                    </Button>
                  </CardContent>
                </form>
              </TabsContent>

              <TabsContent value="teacher">
                <form onSubmit={(e) => handleLogin(e, 'teacher')}>
                  <CardContent className="space-y-5 p-6">
                    <div>
                      <label
                        htmlFor="teacher-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Teacher Password
                      </label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="teacher-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          className="pl-10 pr-10 py-2 h-11 border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 rounded-md font-medium transition-all"
                    >
                      Sign in as Teacher
                    </Button>
                  </CardContent>
                </form>
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-center py-5 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-600">Need help? Contact your system administrator</p>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Student Management System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
