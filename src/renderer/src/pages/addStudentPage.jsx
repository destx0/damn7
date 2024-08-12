
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'

const AddStudentPage = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [grade, setGrade] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await window.api.addStudent({ name, age: parseInt(age), grade })
      navigate('/table')
    } catch (error) {
      console.error('Error adding student:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="grade">Grade</Label>
          <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} required />
        </div>
        <Button type="submit">Add Student</Button>
        <Button type="button" onClick={() => navigate('/table')} variant="secondary">
          Cancel
        </Button>
      </form>
    </div>
  )
}

export default AddStudentPage
