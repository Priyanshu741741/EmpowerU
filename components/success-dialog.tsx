"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  buttonText?: string
  redirectPath?: string
}

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Submission Successful!",
  description = "Your story has been submitted successfully. Our team will review it shortly. Thank you for sharing your story with us!",
  buttonText = "Return to Home",
  redirectPath = "/",
}: SuccessDialogProps) {
  const router = useRouter()

  const handleButtonClick = () => {
    onOpenChange(false)
    if (redirectPath) {
      router.push(redirectPath)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-center mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center mt-4">
          <Button 
            onClick={handleButtonClick}
            className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 