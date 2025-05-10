"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MonthCalendar } from "@/components/month-calendar"
import { EventForm } from "@/components/event-form"
import { EventList } from "@/components/event-list"
import { PdfExport } from "@/components/pdf-export"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/lib/types"

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(4) // May is 4 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const { toast } = useToast()

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents))
      } catch (e) {
        console.error("Failed to parse saved events", e)
      }
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  const handlePrevMonth = () => {
    if (currentMonth === 4 && currentYear === 2025) return // Don't go before May 2025

    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 9 && currentYear === 2025) return // Don't go after October 2025

    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const addEvent = (event: Event) => {
    setEvents([...events, event])
    setShowEventForm(false)
    toast({
      title: "Event Added",
      description: `${event.title} has been added to your calendar.`,
    })
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    toast({
      title: "Event Removed",
      description: "The event has been removed from your calendar.",
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Filter events for the current month
  const currentMonthEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
  })

  // Check if we're within the May-October 2025 range
  const isInRange = currentYear === 2025 && currentMonth >= 4 && currentMonth <= 9 // May-October 2025

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            disabled={currentMonth === 4 && currentYear === 2025}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            disabled={currentMonth === 9 && currentYear === 2025}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowEventForm(true)} className="ml-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {isInRange ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1 lg:col-span-2 p-4">
              <MonthCalendar month={currentMonth} year={currentYear} events={events} />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Events for {monthNames[currentMonth]}</h3>
              <EventList events={currentMonthEvents} onDelete={deleteEvent} />
              <PdfExport events={events} currentMonth={currentMonth} currentYear={currentYear} />
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center p-8">
          <p className="text-gray-500">This calendar is designed to show events from May 2025 to October 2025.</p>
        </div>
      )}

      {showEventForm && <EventForm onSubmit={addEvent} onCancel={() => setShowEventForm(false)} />}
    </div>
  )
}
