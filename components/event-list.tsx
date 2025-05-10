"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"
import { format } from "date-fns"

interface EventListProps {
  events: Event[]
  onDelete: (id: string) => void
}

export function EventList({ events, onDelete }: EventListProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No events for this month yet.</p>
        <p className="text-sm mt-2">Click "Add Event" to create one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <div key={event.id} className="border rounded-md p-3 bg-white">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{event.title}</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(event.id)}
              className="h-6 w-6 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-500 mt-1">{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</div>

          <div className="text-sm mt-1">{event.location}</div>

          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 hover:underline mt-2 inline-block"
            >
              Visit event website
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
