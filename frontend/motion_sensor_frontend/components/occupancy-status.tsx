"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoveIcon as Motion, ActivitySquare } from "lucide-react"

// Use environment variable or fallback to localhost for development
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://172.20.10.5:5000"

export default function OccupancyStatus() {
  const [isOccupied, setIsOccupied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkMotion = async () => {
      try {
        const response = await fetch(`http://172.20.10.5:5000/motion`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setIsOccupied(data.motion)
        setLoading(false)
        setError(null) // Clear any previous errors
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Could not connect to motion sensor"
        setError(errorMessage)
        setLoading(false)
        console.error("Error fetching motion data:", err)
      }
    }

    // Check immediately on component mount
    checkMotion()

    // Then poll every 2 seconds
    const intervalId = setInterval(checkMotion, 2000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Room Status
          {loading ? (
            <Badge variant="outline" className="animate-pulse">
              Connecting...
            </Badge>
          ) : error ? (
            <Badge variant="destructive">Error</Badge>
          ) : (
            <Badge variant={isOccupied ? "destructive" : "success"} className="transition-all duration-500">
              {isOccupied ? "Occupied" : "Available"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6">
          <div
            className={`
              relative flex items-center justify-center w-32 h-32 rounded-full mb-4
              ${isOccupied ? "bg-red-100 dark:bg-red-950" : "bg-green-100 dark:bg-green-950"}
              transition-colors duration-500
            `}
          >
            {loading ? (
              <ActivitySquare className="h-16 w-16 text-gray-400 animate-pulse" />
            ) : error ? (
              <ActivitySquare className="h-16 w-16 text-red-500" />
            ) : (
              <Motion className={`h-16 w-16 ${isOccupied ? "text-red-500" : "text-green-500"}`} />
            )}
            {isOccupied && !loading && !error && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
              </span>
            )}
          </div>

          <p className="text-center text-muted-foreground">
            {loading
              ? "Connecting to motion sensor..."
              : error
                ? `Error: ${error}`
                : isOccupied
                  ? "Motion detected! The room is currently occupied."
                  : "No motion detected. The room is available."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
