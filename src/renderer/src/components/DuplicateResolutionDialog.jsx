import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const DuplicateResolutionDialog = ({ duplicates, onResolve, onCancel }) => {
  const [resolutions, setResolutions] = useState(
    duplicates.map(student => ({ ...student, action: 'skip' }))
  )

  const handleResolutionChange = (index, action) => {
    setResolutions(prev =>
      prev.map((resolution, i) =>
        i === index ? { ...resolution, action } : resolution
      )
    )
  }

  const handleResolve = () => {
    onResolve(resolutions)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Duplicate Students</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {duplicates.map((student, index) => (
            <div key={student.GRN} className="mb-4 p-2 border rounded">
              <p>GRN: {student.GRN}</p>
              <p>Name: {student.name} {student.surname}</p>
              <RadioGroup
                value={resolutions[index].action}
                onValueChange={(value) => handleResolutionChange(index, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="keep" id={`keep-${student.GRN}`} />
                  <Label htmlFor={`keep-${student.GRN}`}>Keep Existing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replace" id={`replace-${student.GRN}`} />
                  <Label htmlFor={`replace-${student.GRN}`}>Replace</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skip" id={`skip-${student.GRN}`} />
                  <Label htmlFor={`skip-${student.GRN}`}>Skip</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleResolve}>Resolve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DuplicateResolutionDialog
