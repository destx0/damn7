import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const StudentFormPage = () => {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [grade, setGrade] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (id && location.state?.student) {
      const { name, age, grade } = location.state.student
      setName(name)
      setAge(age.toString())
      setGrade(grade)
    }
  }, [id, location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await window.api.updateStudent(id, { name, age: parseInt(age), grade })
      } else {
        await window.api.addStudent({ name, age: parseInt(age), grade })
      }
      navigate('/table')
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'adding'} student:`, error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Student</h1>
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
        <Button type="submit">{id ? 'Update' : 'Add'} Student</Button>
        <Button type="button" onClick={() => navigate('/table')} variant="secondary">
          Cancel
        </Button>
      </form>
    </div>
  )
}

export default StudentFormPage
