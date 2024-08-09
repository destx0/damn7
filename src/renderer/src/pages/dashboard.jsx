import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useUserStore from '@/stores/useUserStore'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, userType, clearUser } = useUserStore()

  if (!user) {
    navigate('/')
    return null
  }

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome, {user}!</CardTitle>
          <CardDescription>You have successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Your user type is: <strong>{userType}</strong>
          </p>
          <p>You now have access to all {userType} features.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Dashboard
