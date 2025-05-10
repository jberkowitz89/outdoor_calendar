"use client"

import { useState } from "react"
import { FileDown, Printer, Check } from "lucide-react"
import html2pdf from "html2pdf.js"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"

interface PdfExportProps {
  events: Event[]
  currentMonth: number
  currentYear: number
}

export function PdfExport({ events, currentMonth, currentYear }: PdfExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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

  // Sort events by date
  const sortedEvents = [...currentMonthEvents].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  const generatePdf = async () => {
    setIsGenerating(true)

    // Create a temporary div for the PDF content
    const element = document.createElement("div")
    element.className = "pdf-container"
    element.style.padding = "20px"
    element.style.maxWidth = "800px"
    element.style.margin = "0 auto"
    element.style.fontFamily = "Arial, sans-serif"

    // Add title and header
    const header = document.createElement("div")
    header.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #059669; padding-bottom: 10px;">
        <h1 style="color: #059669; margin: 0; font-size: 24px;">Sassowitz Family Adventures</h1>
        <h2 style="color: #374151; margin: 0; font-size: 18px;">${monthNames[currentMonth]} ${currentYear}</h2>
      </div>
    `
    element.appendChild(header)

    // Create calendar grid
    const calendarGrid = document.createElement("div")
    calendarGrid.style.marginBottom = "30px"

    // Add weekday headers
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const weekdayRow = document.createElement("div")
    weekdayRow.style.display = "grid"
    weekdayRow.style.gridTemplateColumns = "repeat(7, 1fr)"
    weekdayRow.style.gap = "5px"
    weekdayRow.style.marginBottom = "10px"

    weekdays.forEach((day) => {
      const dayHeader = document.createElement("div")
      dayHeader.style.padding = "5px"
      dayHeader.style.textAlign = "center"
      dayHeader.style.fontWeight = "bold"
      dayHeader.style.color = day === "Friday" || day === "Saturday" || day === "Sunday" ? "#059669" : "#374151"
      dayHeader.textContent = day
      weekdayRow.appendChild(dayHeader)
    })

    calendarGrid.appendChild(weekdayRow)

    // Create the days grid
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()

    const daysGrid = document.createElement("div")
    daysGrid.style.display = "grid"
    daysGrid.style.gridTemplateColumns = "repeat(7, 1fr)"
    daysGrid.style.gap = "5px"

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement("div")
      emptyDay.style.height = "100px"
      emptyDay.style.border = "1px solid #e5e7eb"
      emptyDay.style.backgroundColor = "#f9fafb"
      daysGrid.appendChild(emptyDay)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isWeekend = [0, 5, 6].includes(date.getDay()) // Sunday, Friday, Saturday

      const dayCell = document.createElement("div")
      dayCell.style.height = "100px"
      dayCell.style.border = "1px solid #e5e7eb"
      dayCell.style.padding = "5px"
      dayCell.style.position = "relative"
      dayCell.style.backgroundColor = isWeekend ? "#ecfdf5" : "#ffffff" // Light green for weekends

      // Add day number
      const dayNumber = document.createElement("div")
      dayNumber.style.textAlign = "right"
      dayNumber.style.fontWeight = "bold"
      dayNumber.style.color = isWeekend ? "#059669" : "#374151"
      dayNumber.textContent = day.toString()
      dayCell.appendChild(dayNumber)

      // Add events for this day
      const dayEvents = sortedEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.getDate() === day
      })

      if (dayEvents.length > 0) {
        const eventsList = document.createElement("div")
        eventsList.style.marginTop = "5px"
        eventsList.style.fontSize = "10px"

        dayEvents.forEach((event) => {
          const eventItem = document.createElement("div")
          eventItem.style.backgroundColor = "#d1fae5"
          eventItem.style.padding = "2px 4px"
          eventItem.style.borderRadius = "2px"
          eventItem.style.marginBottom = "2px"
          eventItem.style.overflow = "hidden"
          eventItem.style.textOverflow = "ellipsis"
          eventItem.style.whiteSpace = "nowrap"
          eventItem.style.color = "#065f46"
          eventItem.textContent = event.title
          eventsList.appendChild(eventItem)
        })

        dayCell.appendChild(eventsList)
      }

      daysGrid.appendChild(dayCell)
    }

    calendarGrid.appendChild(daysGrid)
    element.appendChild(calendarGrid)

    // Add events list
    if (sortedEvents.length > 0) {
      const eventsHeader = document.createElement("h3")
      eventsHeader.textContent = `Events for ${monthNames[currentMonth]}`
      eventsHeader.style.color = "#059669"
      eventsHeader.style.borderBottom = "1px solid #d1d5db"
      eventsHeader.style.paddingBottom = "5px"
      element.appendChild(eventsHeader)

      const eventsList = document.createElement("div")

      sortedEvents.forEach((event) => {
        const eventDate = new Date(event.date)
        const eventItem = document.createElement("div")
        eventItem.style.marginBottom = "15px"
        eventItem.style.padding = "10px"
        eventItem.style.border = "1px solid #e5e7eb"
        eventItem.style.borderRadius = "4px"

        const eventTitle = document.createElement("div")
        eventTitle.style.fontWeight = "bold"
        eventTitle.style.fontSize = "14px"
        eventTitle.textContent = event.title
        eventItem.appendChild(eventTitle)

        const eventDateEl = document.createElement("div")
        eventDateEl.style.fontSize = "12px"
        eventDateEl.style.color = "#4b5563"
        eventDateEl.style.marginTop = "5px"
        eventDateEl.textContent = format(eventDate, "EEEE, MMMM d, yyyy")
        eventItem.appendChild(eventDateEl)

        const eventLocation = document.createElement("div")
        eventLocation.style.fontSize = "12px"
        eventLocation.style.marginTop = "5px"
        eventLocation.textContent = event.location
        eventItem.appendChild(eventLocation)

        if (event.description) {
          const eventDesc = document.createElement("div")
          eventDesc.style.fontSize = "12px"
          eventDesc.style.marginTop = "5px"
          eventDesc.style.color = "#4b5563"
          eventDesc.textContent = event.description
          eventItem.appendChild(eventDesc)
        }

        eventsList.appendChild(eventItem)
      })

      element.appendChild(eventsList)
    }

    // Add footer
    const footer = document.createElement("div")
    footer.style.marginTop = "30px"
    footer.style.borderTop = "1px solid #d1d5db"
    footer.style.paddingTop = "10px"
    footer.style.fontSize = "10px"
    footer.style.color = "#6b7280"
    footer.style.textAlign = "center"
    footer.textContent = "Sassowitz Family Adventures - Made with love for Mother's Day 2025"
    element.appendChild(footer)

    // Append to document temporarily
    document.body.appendChild(element)

    // Generate PDF
    const opt = {
      margin: 10,
      filename: `Sassowitz-Family-Adventures-${monthNames[currentMonth]}-${currentYear}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }

    try {
      await html2pdf().set(opt).from(element).save()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      // Remove the temporary element
      document.body.removeChild(element)
      setIsGenerating(false)
    }
  }

  return (
    <div className="mt-4">
      <Button
        onClick={generatePdf}
        disabled={isGenerating}
        className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
      >
        {isGenerating ? (
          <>
            <Printer className="h-4 w-4 animate-pulse" />
            Generating PDF...
          </>
        ) : showSuccess ? (
          <>
            <Check className="h-4 w-4" />
            PDF Downloaded!
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4" />
            Export Calendar to PDF
          </>
        )}
      </Button>
    </div>
  )
}
