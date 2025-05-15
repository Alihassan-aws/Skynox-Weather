"use client"

import { useEffect, useRef } from "react"

interface WeatherAnimationProps {
  weatherId: number
  timeOfDay: "day" | "night"
}

export function WeatherAnimation({ weatherId, timeOfDay }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameIdRef = useRef<number>()

  // Animation for the card background
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: any[] = []

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles based on weather condition
    const createParticles = () => {
      particles = []

      // Rain
      if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
        const particleCount = weatherId >= 500 ? 100 : 50 // More particles for rain than drizzle

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 15 + 10,
            thickness: Math.random() * 2 + 1,
            color: timeOfDay === "day" ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)",
          })
        }
      }

      // Snow
      else if (weatherId >= 600 && weatherId < 700) {
        for (let i = 0; i < 80; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 4 + 1,
            speed: Math.random() * 3 + 1,
            color: "rgba(255, 255, 255, 0.8)",
            swing: Math.random() * 3,
            swingSpeed: Math.random() * 0.02 + 0.01,
          })
        }
      }

      // Clear sky with stars at night
      else if (weatherId === 800 && timeOfDay === "night") {
        for (let i = 0; i < 30; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          })
        }
      }

      // Clouds
      else if (weatherId > 800) {
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 2),
            width: Math.random() * 100 + 50,
            height: Math.random() * 40 + 20,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.3 + 0.1,
          })
        }
      }
    }

    createParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Rain animation
      if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.length * 0.5, p.y + p.length)
          ctx.strokeStyle = p.color
          ctx.lineWidth = p.thickness
          ctx.stroke()

          p.y += p.speed
          p.x += p.speed * 0.2

          if (p.y > canvas.height) {
            p.y = 0
            p.x = Math.random() * canvas.width
          }
        })
      }

      // Snow animation
      else if (weatherId >= 600 && weatherId < 700) {
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()

          p.y += p.speed
          p.x += Math.sin(p.y * p.swingSpeed) * p.swing

          if (p.y > canvas.height) {
            p.y = 0
            p.x = Math.random() * canvas.width
          }
        })
      }

      // Stars animation (for clear night)
      else if (weatherId === 800 && timeOfDay === "night") {
        particles.forEach((p) => {
          p.opacity += p.twinkleSpeed * p.twinkleDirection
          if (p.opacity > 1 || p.opacity < 0.2) {
            p.twinkleDirection *= -1
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fill()
        })
      }

      // Clouds animation
      else if (weatherId > 800) {
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()

          p.x += p.speed
          if (p.x > canvas.width + p.width / 2) {
            p.x = -p.width / 2
          }
        })
      }

      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    animationFrameIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [weatherId, timeOfDay])

  // Determine if we need lightning effect
  const isThunderstorm = weatherId >= 200 && weatherId < 300

  return (
    <div className="absolute inset-0 overflow-hidden">
      {isThunderstorm && <div className="absolute inset-0 bg-white opacity-0 animate-lightning"></div>}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
