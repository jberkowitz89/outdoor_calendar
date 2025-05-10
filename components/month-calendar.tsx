"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWeekend } from "date-fns"

import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { EventDetails } from "@/components/event-details"

interface MonthCalendarProps {
  month: number
  year: number
  events: Event[]
}

export function MonthCalendar({ month, year, events }: MonthCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Create date for the first day of the month
  const firstDayOfMonth = startOfMonth(new Date(year, month))

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startingDayOfWeek = getDay(firstDayOfMonth)

  // Get all days in the month
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: endOfMonth(firstDayOfMonth),
  })

  // Create array for all days to display (including empty cells for days from previous/next month)
  const calendarDays = Array(42).fill(null)

  // Fill in the actual days of the month
  daysInMonth.forEach((day, index) => {
    calendarDays[startingDayOfWeek + index] = day
  })

  // Function to get events for a specific day
  const getEventsForDay = (date: Date | null) => {
    if (!date) return []

    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center text-sm font-medium py-2",
              (index === 0 || index === 5 || index === 6) && "text-emerald-600",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isWeekendDay = day ? isWeekend(day) : false

          return (
            <div
              key={index}
              className={cn(
                "min-h-[100px] p-1 border rounded-md",
                day && day.getMonth() === month ? "bg-white" : "bg-gray-50",
                isWeekendDay && "bg-emerald-50",
              )}
            >
              {day && (
                <>
                  <div className={cn("text-right text-sm font-medium p-1", isWeekendDay && "text-emerald-600")}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <Badge
                        key={event.id}
                        className="cursor-pointer text-xs w-full justify-start truncate bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.title}
                      </Badge>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  )
}
