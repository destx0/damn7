import React, { useState, useEffect } from 'react'
import { MoreHorizontal, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const ActionRenderer = ({ data, onEdit, onDelete, onGenerateCertificate, onFreeze, onUnfreeze }) => {
  const [isFrozen, setIsFrozen] = useState(data.isFrozen || false)

  useEffect(() => {
    setIsFrozen(data.isFrozen || false)
  }, [data.isFrozen])

  const handleFreeze = async () => {
    if (isFrozen) {
      await onUnfreeze(data.studentId)
    } else {
      await onFreeze(data.studentId)
    }
    setIsFrozen(!isFrozen)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {!isFrozen && (
          <>
            <DropdownMenuItem onClick={() => onEdit(data)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(data.studentId)}>Delete</DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={handleFreeze}>
          {isFrozen ? (
            <>
              <Unlock className="mr-2 h-4 w-4" /> Unfreeze
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" /> Freeze
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Certificates</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onGenerateCertificate(data, 'leave')}>
          View Leave Certificate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGenerateCertificate(data, 'bonafide')}>
          View Bonafide Certificate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionRenderer
