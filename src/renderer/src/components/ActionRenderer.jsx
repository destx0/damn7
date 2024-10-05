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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ActionRenderer = ({ data, onEdit, onDelete, onLeaveCertificate, onBonafideCertificate, onFreeze, onUnfreeze }) => {
  const [isFrozen, setIsFrozen] = useState(data.isFrozen || false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setIsFrozen(data.isFrozen || false)
  }, [data.isFrozen])

  const handleFreeze = async () => {
    setIsDialogOpen(true)
  }

  const handleConfirmFreeze = async () => {
    if (password === '123') {
      setError('')
      setIsDialogOpen(false)
      setPassword('')
      if (isFrozen) {
        await onUnfreeze(data.GRN)
      } else {
        await onFreeze(data.GRN)
      }
      setIsFrozen(!isFrozen)
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <>
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
              <DropdownMenuItem onClick={() => onDelete(data.GRN)}>Delete</DropdownMenuItem>
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
          <DropdownMenuItem onClick={() => onLeaveCertificate(data.GRN)}>Leave Certificate</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBonafideCertificate(data.GRN)}>Bonafide Certificate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isFrozen ? 'Unfreeze' : 'Freeze'} Student Data</DialogTitle>
            <DialogDescription>
              Enter the password to {isFrozen ? 'unfreeze' : 'freeze'} this student's data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmFreeze}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActionRenderer
