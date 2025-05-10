"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"

interface EventFormProps {
  onSubmit: (event: Event) => void
  onCancel: () => void
  editEvent?: Event
}

export function EventForm({ onSubmit, onCancel, editEvent }: EventFormProps) {
  const [title, setTitle] = useState(editEvent?.title || "")
  const [date, setDate] = useState<Date | undefined>(editEvent?.date ? new Date(editEvent.date) : undefined)
  const [location, setLocation] = useState(editEvent?.location || "")
  const [description, setDescription] = useState(editEvent?.description || "")
  const [url, setUrl] = useState(editEvent?.url || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!date) {
      newErrors.date = "Date is required"
    } else {
      // Check if date is a weekend (Friday, Saturday, or Sunday)
      const day = date.getDay()
      if (day !== 0 && day !== 5 && day !== 6) {
        newErrors.date = "Only Friday, Saturday, or Sunday events are allowed"
      }

      // Check if date is within May-October 2025
      const month = date.getMonth()
      const year = date.getFullYear()
      if (year !== 2025 || month < 4 || month > 9) {
        newErrors.date = "Date must be between May and October 2025"
      }
    }

    if (!location.trim()) {
      newErrors.location = "Location is required"
    }

    if (url && !url.startsWith("http")) {
      newErrors.url = "URL must start with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newEvent: Event = {
      id: editEvent?.id || uuidv4(),
      title,
      date: date!.toISOString(),
      location,
      description,
      url,
    }

    onSubmit(newEvent)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{editEvent ? "Edit Event" : "Add New Event"}</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chicago Outdoor Festival"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date (Weekends Only)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    // Disable weekdays (Monday-Thursday)
                    const day = date.getDay()
                    if (day !== 0 && day !== 5 && day !== 6) {
                      return true
                    }

                    // Disable dates outside May-October 2025
                    const month = date.getMonth()
                    const year = date.getFullYear()
                    return year !== 2025 || month < 4 || month > 9
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Millennium Park, Chicago"
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about the event..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Event Website URL (Optional)</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.example.com/event"
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {editEvent ? "Update Event" : "Add Event"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
