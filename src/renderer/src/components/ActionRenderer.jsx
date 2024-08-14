import React from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const ActionRenderer = ({ data, onEdit, onDelete, onGenerateCertificate }) => {
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
        <DropdownMenuItem onClick={() => onEdit(data)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(data.id)}>Delete</DropdownMenuItem>
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
