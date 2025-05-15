"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Float, PerspectiveCamera, Cloud, Stars } from "@react-three/drei"
import type * as THREE from "three"

interface WeatherScene3DProps {
  weatherId: number
  timeOfDay: "day" | "night"
}

// City silhouette
function CitySilhouette({ timeOfDay }: { timeOfDay: "day" | "night" }) {
  const buildingCount = 20
  const color = timeOfDay === "day" ? "#334155" : "#0f172a"

  return (
    <group position={[0, -5, -15]}>
      {Array.from({ length: buildingCount }).map((_, i) => {
        const width = 1 + Math.random() * 2
        const height = 3 + Math.random() * 7
        const posX = (i - buildingCount / 2) * 3

        return (
          <mesh key={i} position={[posX, height / 2, 0]}>
            <boxGeometry args={[width, height, width]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })}
    </group>
  )
}

// Main weather model
function WeatherModel({ weatherId, timeOfDay }: { weatherId: number; timeOfDay: "day" | "night" }) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useThree()

  // Set scene background to transparent
  useEffect(() => {
    scene.background = null
  }, [scene])

  // Rotate the model slowly
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  // Render weather-specific elements
  const renderWeatherElements = () => {
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return (
        <>
          <CloudGroup count={15} timeOfDay={timeOfDay} />
          {timeOfDay === "night" && <Stars radius={100} depth={50} count={500} factor={2} />}
        </>
      )
    }

    // Drizzle and Light Rain
    if (weatherId >= 300 && weatherId < 400) {
      return (
        <>
          <CloudGroup count={10} timeOfDay={timeOfDay} />
          {timeOfDay === "night" && <Stars radius={100} depth={50} count={500} factor={2} />}
        </>
      )
    }

    // Heavy Rain
    if (weatherId >= 500 && weatherId < 600) {
      return (
        <>
          <CloudGroup count={15} timeOfDay={timeOfDay} />
          {timeOfDay === "night" && <Stars radius={100} depth={50} count={200} factor={1} />}
        </>
      )
    }

    // Snow
    if (weatherId >= 600 && weatherId < 700) {
      return (
        <>
          <CloudGroup count={8} timeOfDay={timeOfDay} />
          {timeOfDay === "night" && <Stars radius={100} depth={50} count={800} factor={3} />}
        </>
      )
    }

    // Atmosphere (fog, mist, etc)
    if (weatherId >= 700 && weatherId < 800) {
      return (
        <>
          <CloudGroup count={5} timeOfDay={timeOfDay} />
          {timeOfDay === "night" && <Stars radius={100} depth={50} count={300} factor={1} />}
        </>
      )
    }

    // Clear
    if (weatherId === 800) {
      return <>{timeOfDay === "night" && <Stars radius={100} depth={50} count={5000} factor={7} />}</>
    }

    // Clouds
    if (weatherId > 800) {
      const cloudCount = weatherId === 801 ? 5 : weatherId === 802 ? 10 : weatherId === 803 ? 15 : 20
      return (
        <>
          <CloudGroup count={cloudCount} timeOfDay={timeOfDay} />
          {timeOfDay === "night" && <Stars radius={100} depth={50} count={500} factor={2} />}
        </>
      )
    }

    // Default
    return <>{timeOfDay === "night" && <Stars radius={100} depth={50} count={3000} factor={5} />}</>
  }

  return (
    <>
      <ambientLight intensity={timeOfDay === "day" ? 0.8 : 0.3} />
      <directionalLight position={[5, 5, 5]} intensity={timeOfDay === "day" ? 1 : 0.2} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={timeOfDay === "day" ? 0.5 : 0.1} />

      <group ref={group}>
        {renderWeatherElements()}
        <CitySilhouette timeOfDay={timeOfDay} />
      </group>
    </>
  )
}

// Dynamic clouds
function CloudGroup({ count = 10, timeOfDay }: { count: number; timeOfDay: "day" | "night" }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Float
          key={i}
          speed={0.5 + Math.random() * 0.5}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          position={[(Math.random() - 0.5) * 30, Math.random() * 5 + 5, (Math.random() - 0.5) * 30]}
        >
          <Cloud
            opacity={timeOfDay === "day" ? 0.8 : 0.4}
            speed={0.2}
            width={10 + Math.random() * 10}
            depth={1.5}
            segments={20}
          />
        </Float>
      ))}
    </group>
  )
}

export function WeatherScene3D({ weatherId, timeOfDay }: WeatherScene3DProps) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={60} />
      <WeatherModel weatherId={weatherId} timeOfDay={timeOfDay} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
