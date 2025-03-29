"use client"

import { useState, useRef } from "react"
import { Bold, Italic, List, ListOrdered, Image, Link, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const insertText = (before: string, after = "") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd
    const selectedText = value.substring(selectionStart, selectionEnd)

    const newValue = value.substring(0, selectionStart) + before + selectedText + after + value.substring(selectionEnd)

    onChange(newValue)

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        selectionStart + before.length + selectedText.length + after.length,
        selectionStart + before.length + selectedText.length + after.length,
      )
    }, 0)
  }

  const handleBold = () => insertText("**", "**")
  const handleItalic = () => insertText("*", "*")
  const handleUnorderedList = () => insertText("\n- ")
  const handleOrderedList = () => insertText("\n1. ")
  const handleCode = () => insertText("`", "`")

  const handleLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      if (!textareaRef.current) return

      const textarea = textareaRef.current
      const selectionStart = textarea.selectionStart
      const selectionEnd = textarea.selectionEnd
      const selectedText = value.substring(selectionStart, selectionEnd)

      const linkText = selectedText || "link text"
      insertText(`[${linkText}](${url})`, "")
    }
  }

  const handleImage = async () => {
    // Here you would add your Supabase storage code
    // const fileInput = document.createElement('input')
    // fileInput.type = 'file'
    // fileInput.accept = 'image/*'
    // fileInput.onchange = async (e) => {
    //   const target = e.target as HTMLInputElement
    //   if (!target.files || target.files.length === 0) return
    //
    //   const file = target.files[0]
    //   setIsUploading(true)
    //
    //   try {
    //     const { data, error } = await supabase
    //       .storage
    //       .from('post-images')
    //       .upload(`editor/${Date.now()}-${file.name}`, file)
    //
    //     if (error) throw error
    //
    //     // Get public URL
    //     const { data: { publicUrl } } = supabase
    //       .storage
    //       .from('post-images')
    //       .getPublicUrl(data.path)
    //
    //     insertText(`![Image](${publicUrl})`, '')
    //     toast({
    //       title: "Success",
    //       description: "Image uploaded successfully.",
    //     })
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to upload image. Please try again.",
    //       variant: "destructive",
    //     })
    //   } finally {
    //     setIsUploading(false)
    //   }
    // }
    // fileInput.click()

    // Simulate image upload
    const imageUrl = prompt("Enter image URL:")
    if (imageUrl) {
      insertText(`![Image](${imageUrl})`, "")
    }
  }

  return (
    <div className="border rounded-md">
      <div className="flex items-center p-2 border-b">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleBold}>
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleItalic}>
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleUnorderedList}>
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleOrderedList}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleLink}>
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleImage} disabled={isUploading}>
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCode}>
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[300px] rounded-none border-0 resize-y focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <div className="p-2 border-t text-xs text-gray-500 dark:text-gray-400">Markdown supported</div>
    </div>
  )
}

