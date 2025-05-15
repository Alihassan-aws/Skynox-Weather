"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface DynamicBackgroundProps {
  weatherId: number
  timeOfDay: "day" | "night"
}

export function DynamicBackground({ weatherId, timeOfDay }: DynamicBackgroundProps) {
  const [bgClass, setBgClass] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particles, setParticles] = useState<any[]>([])
  const animationRef = useRef<number>()

  // Set background gradient based on weather and time of day
  useEffect(() => {
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"
          : "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
      )
    }
    // Drizzle and Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
          : "bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900",
      )
    }
    // Snow
    else if (weatherId >= 600 && weatherId < 700) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500"
          : "bg-gradient-to-br from-slate-700 via-blue-900 to-slate-800",
      )
    }
    // Atmosphere (fog, mist, etc)
    else if (weatherId >= 700 && weatherId < 800) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600"
          : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
      )
    }
    // Clear
    else if (weatherId === 800) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900",
      )
    }
    // Clouds
    else if (weatherId > 800) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-slate-400 via-blue-500 to-slate-500"
          : "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900",
      )
    }
    // Default
    else {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900",
      )
    }
  }, [weatherId, timeOfDay])

  // Initialize canvas and particles
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles based on weather
    const createParticles = () => {
      const newParticles = []

      // Clear sky with stars at night
      if (weatherId === 800 && timeOfDay === "night") {
        for (let i = 0; i < 100; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinkleDirection: Math.random() > 0.5 ? 1 : -1,
            type: "star",
          })
        }
      }

      // Clouds
      if (weatherId > 800) {
        for (let i = 0; i < 15; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 2),
            width: Math.random() * 200 + 100,
            height: Math.random() * 80 + 40,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.3 + 0.1,
            type: "cloud",
          })
        }
      }

      // Rain
      if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
        const count = weatherId >= 500 ? 200 : 100
        for (let i = 0; i < count; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 15 + 10,
            thickness: Math.random() * 2 + 1,
            opacity: timeOfDay === "day" ? 0.6 : 0.3,
            type: "rain",
          })
        }
      }

      // Snow
      if (weatherId >= 600 && weatherId < 700) {
        for (let i = 0; i < 150; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 1,
            speed: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            swing: Math.random() * 5,
            swingSpeed: Math.random() * 0.02 + 0.01,
            swingDirection: Math.random() > 0.5 ? 1 : -1,
            type: "snow",
          })
        }
      }

      // Fog/Mist
      if (weatherId >= 700 && weatherId < 800) {
        for (let i = 0; i < 20; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.random() * 300 + 200,
            height: Math.random() * 100 + 50,
            speed: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.2 + 0.1,
            type: "fog",
          })
        }
      }

      setParticles(newParticles)
    }

    createParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [weatherId, timeOfDay])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || particles.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        if (p.type === "star") {
          // Animate twinkling stars
          p.opacity += p.twinkleSpeed * p.twinkleDirection
          if (p.opacity > 1 || p.opacity < 0.2) {
            p.twinkleDirection *= -1
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fill()
        } else if (p.type === "cloud") {
          // Draw cloud
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()

          // Move cloud
          p.x += p.speed
          if (p.x > canvas.width + p.width / 2) {
            p.x = -p.width / 2
          }
        } else if (p.type === "rain") {
          // Draw rain drop
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.length * 0.5, p.y + p.length)
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.lineWidth = p.thickness
          ctx.stroke()

          // Move rain drop
          p.y += p.speed
          p.x += p.speed * 0.2

          if (p.y > canvas.height) {
            p.y = 0
            p.x = Math.random() * canvas.width
          }
        } else if (p.type === "snow") {
          // Draw snowflake
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fill()

          // Move snowflake with swinging motion
          p.y += p.speed
          p.x += Math.sin(p.y * p.swingSpeed) * p.swing

          if (p.y > canvas.height) {
            p.y = 0
            p.x = Math.random() * canvas.width
          }
        } else if (p.type === "fog") {
          // Draw fog patch
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()

          // Move fog
          p.x += p.speed
          if (p.x > canvas.width + p.width / 2) {
            p.x = -p.width / 2
          }
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particles])

  return (
    <div className="fixed inset-0 overflow-hidden">
      <motion.div
        className={`absolute inset-0 ${bgClass} transition-colors duration-1000`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Weather animation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-soft-light pointer-events-none"></div>

      {/* Lightning effect for thunderstorms */}
      {weatherId >= 200 && weatherId < 300 && (
        <div className="absolute inset-0 bg-white opacity-0 animate-lightning pointer-events-none"></div>
      )}
    </div>
  )
}
