"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface DynamicAnimatedBackgroundProps {
  weatherId: number
  timeOfDay: "day" | "night"
}

export function DynamicAnimatedBackground({ weatherId, timeOfDay }: DynamicAnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const [bgClass, setBgClass] = useState("")
  const [particles, setParticles] = useState<any[]>([])
  const previousTimeRef = useRef<number>()

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

      // Thunderstorm
      if (weatherId >= 200 && weatherId < 300) {
        // Rain particles
        for (let i = 0; i < 200; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 25 + 15,
            thickness: Math.random() * 2 + 1,
            opacity: timeOfDay === "day" ? 0.6 : 0.3,
            type: "rain",
          })
        }

        // Lightning particles
        for (let i = 0; i < 3; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: 0,
            width: Math.random() * 3 + 1,
            height: canvas.height,
            opacity: 0,
            nextFlash: Math.random() * 3000 + 1000,
            lastFlash: 0,
            duration: Math.random() * 200 + 50,
            type: "lightning",
          })
        }
      }

      // Rain
      else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
        const count = weatherId >= 500 ? 300 : 150
        for (let i = 0; i < count; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 20 + 10,
            thickness: Math.random() * 2 + 1,
            opacity: timeOfDay === "day" ? 0.6 : 0.3,
            type: "rain",
          })
        }
      }

      // Snow
      else if (weatherId >= 600 && weatherId < 700) {
        for (let i = 0; i < 200; i++) {
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
      else if (weatherId >= 700 && weatherId < 800) {
        for (let i = 0; i < 30; i++) {
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

      // Clear sky with stars at night
      else if (weatherId === 800 && timeOfDay === "night") {
        for (let i = 0; i < 200; i++) {
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

        // Shooting stars
        for (let i = 0; i < 5; i++) {
          newParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 3),
            length: Math.random() * 100 + 50,
            angle: (Math.random() * Math.PI) / 4 + Math.PI / 4,
            speed: Math.random() * 5 + 10,
            thickness: Math.random() * 2 + 1,
            opacity: 0,
            active: false,
            nextShoot: Math.random() * 10000 + 5000,
            lastShoot: 0,
            duration: Math.random() * 1000 + 500,
            type: "shootingStar",
          })
        }
      }

      // Clear sky with sun rays during day
      else if (weatherId === 800 && timeOfDay === "day") {
        for (let i = 0; i < 20; i++) {
          newParticles.push({
            x: canvas.width / 2,
            y: canvas.height / 4,
            length: Math.random() * 300 + 200,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.001 + 0.0005,
            opacity: Math.random() * 0.2 + 0.1,
            type: "sunray",
          })
        }
      }

      // Clouds
      else if (weatherId > 800) {
        const cloudCount = weatherId === 801 ? 5 : weatherId === 802 ? 10 : weatherId === 803 ? 15 : 20
        for (let i = 0; i < cloudCount; i++) {
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

      setParticles(newParticles)
    }

    createParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [weatherId, timeOfDay])

  // Animation loop
  const animate = (time: number) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time
    }

    const deltaTime = time - (previousTimeRef.current || 0)
    previousTimeRef.current = time

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((p) => {
      if (p.type === "rain") {
        // Draw rain drop
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + p.length * 0.5, p.y + p.length)
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.lineWidth = p.thickness
        ctx.stroke()

        // Move rain drop
        p.y += p.speed * (deltaTime / 16)
        p.x += p.speed * 0.2 * (deltaTime / 16)

        if (p.y > canvas.height) {
          p.y = 0
          p.x = Math.random() * canvas.width
        }
      } else if (p.type === "lightning") {
        if (time - p.lastFlash > p.nextFlash) {
          p.opacity = 0.8
          p.lastFlash = time
          p.nextFlash = Math.random() * 3000 + 1000
        } else if (time - p.lastFlash < p.duration) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fillRect(p.x, p.y, p.width, p.height)

          // Fade out
          p.opacity *= 0.9
        } else {
          p.opacity = 0
        }
      } else if (p.type === "snow") {
        // Draw snowflake
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()

        // Move snowflake with swinging motion
        p.y += p.speed * (deltaTime / 16)
        p.x += Math.sin(p.y * p.swingSpeed) * p.swing * (deltaTime / 16)

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
        p.x += p.speed * (deltaTime / 16)
        if (p.x > canvas.width + p.width / 2) {
          p.x = -p.width / 2
        }
      } else if (p.type === "star") {
        // Animate twinkling stars
        p.opacity += p.twinkleSpeed * p.twinkleDirection * (deltaTime / 16)
        if (p.opacity > 1 || p.opacity < 0.2) {
          p.twinkleDirection *= -1
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.fill()
      } else if (p.type === "shootingStar") {
        if (!p.active && time - p.lastShoot > p.nextShoot) {
          p.active = true
          p.opacity = 1
          p.x = Math.random() * canvas.width
          p.y = Math.random() * (canvas.height / 3)
          p.lastShoot = time
        }

        if (p.active) {
          // Draw shooting star
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          const endX = p.x + Math.cos(p.angle) * p.length
          const endY = p.y + Math.sin(p.angle) * p.length
          ctx.lineTo(endX, endY)

          // Create gradient
          const gradient = ctx.createLinearGradient(p.x, p.y, endX, endY)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`)
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.strokeStyle = gradient
          ctx.lineWidth = p.thickness
          ctx.stroke()

          // Move shooting star
          p.x += Math.cos(p.angle) * p.speed * (deltaTime / 16)
          p.y += Math.sin(p.angle) * p.speed * (deltaTime / 16)

          // Check if out of bounds or time elapsed
          if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || time - p.lastShoot > p.duration) {
            p.active = false
            p.opacity = 0
            p.nextShoot = Math.random() * 10000 + 5000
          }
        }
      } else if (p.type === "sunray") {
        p.angle += p.speed * deltaTime
        if (p.angle > Math.PI * 2) p.angle = 0

        const startX = p.x
        const startY = p.y
        const endX = startX + Math.cos(p.angle) * p.length
        const endY = startY + Math.sin(p.angle) * p.length

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()
      } else if (p.type === "cloud") {
        // Draw cloud
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        // Move cloud
        p.x += p.speed * (deltaTime / 16)
        if (p.x > canvas.width + p.width / 2) {
          p.x = -p.width / 2
        }
      }
    })

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
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
