"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface UnitToggleProps {
  currentUnit: "metric" | "imperial"
  onUnitChange: (unit: "metric" | "imperial") => void
}

export function UnitToggle({ currentUnit, onUnitChange }: UnitToggleProps) {
  return (
    <div className="relative flex rounded-full bg-white/20 backdrop-blur-md border border-white/30 p-0.5 shadow-lg">
      <div className="absolute inset-0 z-0 flex rounded-full p-0.5">
        <motion.div
          className="h-full rounded-full bg-white/30 backdrop-blur-md"
          initial={false}
          animate={{
            x: currentUnit === "metric" ? 0 : "100%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
          currentUnit === "metric" ? "text-white" : "text-slate-300"
        }`}
        onClick={() => onUnitChange("metric")}
      >
        °C
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
          currentUnit === "imperial" ? "text-white" : "text-slate-300"
        }`}
        onClick={() => onUnitChange("imperial")}
      >
        °F
      </Button>
    </div>
  )
}
