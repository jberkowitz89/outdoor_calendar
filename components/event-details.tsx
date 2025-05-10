"use client"

import { X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Event } from "@/lib/types"

interface EventDetailsProps {
  event: Event
  onClose: () => void
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{event.title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Date</div>
            <div>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500">Location</div>
            <div>{event.location}</div>
          </div>

          {event.description && (
            <div>
              <div className="text-sm font-medium text-gray-500">Description</div>
              <div className="whitespace-pre-line">{event.description}</div>
            </div>
          )}

          {event.url && (
            <div>
              <div className="text-sm font-medium text-gray-500">Event Website</div>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                {event.url}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </Card>
    </div>
  )
}
