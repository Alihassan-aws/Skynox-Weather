"use client"

import { useEffect, useRef } from "react"

interface EnhancedWeatherAnimationProps {
  weatherId: number
  timeOfDay: "day" | "night"
}

export function EnhancedWeatherAnimation({ weatherId, timeOfDay }: EnhancedWeatherAnimationProps) {
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
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create particles based on weather condition
    const createParticles = () => {
      particles = []

      // Rain
      if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
        const particleCount = weatherId >= 500 ? 200 : 100 // More particles for rain than drizzle

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 15 + 10,
            thickness: Math.random() * 2 + 1,
            color: "rgba(255, 255, 255, 0.4)",
          })
        }
      }

      // Snow
      else if (weatherId >= 600 && weatherId < 700) {
        for (let i = 0; i < 150; i++) {
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
        for (let i = 0; i < 200; i++) {
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

      // Clear sky with sun rays during day
      else if (weatherId === 800 && timeOfDay === "day") {
        for (let i = 0; i < 20; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: (Math.random() * canvas.height) / 3,
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
        for (let i = 0; i < 15; i++) {
          particles.push({
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

      // Thunderstorm
      if (weatherId >= 200 && weatherId < 300) {
        // Add rain particles
        for (let i = 0; i < 150; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 15 + 10,
            thickness: Math.random() * 2 + 1,
            color: "rgba(255, 255, 255, 0.3)",
          })
        }

        // Add lightning particles
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: 0,
            segments: Math.floor(Math.random() * 5) + 3,
            width: Math.random() * 10 + 5,
            nextFlash: Math.random() * 5000 + 2000,
            lastFlash: 0,
            duration: Math.random() * 200 + 100,
            active: false,
            type: "lightning",
          })
        }
      }

      // Fog/Mist
      if (weatherId >= 700 && weatherId < 800) {
        for (let i = 0; i < 20; i++) {
          particles.push({
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
    }

    createParticles()

    let lastTime = 0
    // Animation loop
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Rain animation
      if (
        (weatherId >= 300 && weatherId < 400) ||
        (weatherId >= 500 && weatherId < 600) ||
        (weatherId >= 200 && weatherId < 300)
      ) {
        particles.forEach((p) => {
          if (p.type === "lightning") {
            // Handle lightning animation
            if (!p.active && timestamp - p.lastFlash > p.nextFlash) {
              p.active = true
              p.lastFlash = timestamp
            }

            if (p.active && timestamp - p.lastFlash < p.duration) {
              // Draw lightning
              ctx.beginPath()
              ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
              ctx.lineWidth = p.width

              let x = p.x
              let y = 0
              ctx.moveTo(x, y)

              for (let i = 0; i < p.segments; i++) {
                const nextX = x + (Math.random() * 100 - 50)
                const nextY = y + canvas.height / p.segments
                ctx.lineTo(nextX, nextY)
                x = nextX
                y = nextY
              }

              ctx.stroke()
            } else if (p.active) {
              p.active = false
              p.nextFlash = Math.random() * 5000 + 2000
              p.x = Math.random() * canvas.width
            }
          } else {
            // Draw rain
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x + p.length * 0.5, p.y + p.length)
            ctx.strokeStyle = p.color
            ctx.lineWidth = p.thickness
            ctx.stroke()

            p.y += p.speed * (deltaTime / 16)
            p.x += p.speed * 0.2 * (deltaTime / 16)

            if (p.y > canvas.height) {
              p.y = 0
              p.x = Math.random() * canvas.width
            }
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

          p.y += p.speed * (deltaTime / 16)
          p.x += Math.sin(p.y * p.swingSpeed) * p.swing * (deltaTime / 16)

          if (p.y > canvas.height) {
            p.y = 0
            p.x = Math.random() * canvas.width
          }
        })
      }

      // Stars animation (for clear night)
      else if (weatherId === 800 && timeOfDay === "night") {
        particles.forEach((p) => {
          p.opacity += p.twinkleSpeed * p.twinkleDirection * (deltaTime / 16)
          if (p.opacity > 1 || p.opacity < 0.2) {
            p.twinkleDirection *= -1
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fill()
        })
      }

      // Sun rays animation (for clear day)
      else if (weatherId === 800 && timeOfDay === "day") {
        particles.forEach((p) => {
          p.angle += p.speed * deltaTime
          if (p.angle > Math.PI * 2) p.angle = 0

          const startX = canvas.width / 2
          const startY = canvas.height / 4

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
        })
      }

      // Clouds animation
      else if (weatherId > 800) {
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()

          p.x += p.speed * (deltaTime / 16)
          if (p.x > canvas.width + p.width / 2) {
            p.x = -p.width / 2
          }
        })
      }

      // Fog animation
      else if (weatherId >= 700 && weatherId < 800) {
        particles.forEach((p) => {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()

          p.x += p.speed * (deltaTime / 16)
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

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
