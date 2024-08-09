import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const location = useLocation()
  const userType = location.state?.userType

  if (!userType) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome, {userType}!</CardTitle>
          <CardDescription>You have successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Your user type is: <strong>{userType}</strong>
          </p>
          <p>You now have access to all {userType} features.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.history.back()}>Logout</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Dashboard
