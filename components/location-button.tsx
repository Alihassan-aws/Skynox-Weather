"use client"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LocationButtonProps {
  onClick: () => void
  loading: boolean
  permissionStatus: "prompt" | "granted" | "denied" | "unavailable"
  locationActive: boolean
  locationError: string | null
}

export function LocationButton({
  onClick,
  loading,
  permissionStatus,
  locationActive,
  locationError,
}: LocationButtonProps) {
  const getStatusColor = () => {
    if (loading) return "text-slate-300"
    if (locationActive) return "text-green-400"
    if (permissionStatus === "denied") return "text-red-400"
    if (permissionStatus === "unavailable") return "text-yellow-400"
    if (locationError) return "text-yellow-400"
    return "text-slate-300"
  }

  const getTooltipText = () => {
    if (loading) return "Getting your location..."
    if (locationActive) return "Using your location"
    if (permissionStatus === "denied") return "Location access denied. Check browser settings."
    if (permissionStatus === "unavailable") return "Location unavailable on this device"
    if (locationError) return `Location error: ${locationError}`
    return "Use your current location"
  }

  const getIcon = () => {
    if (loading) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    } else if (locationError && !locationActive) {
      return <AlertCircle className={`h-4 w-4 ${getStatusColor()}`} />
    } else {
      return <MapPin className={`h-4 w-4 ${getStatusColor()}`} />
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            disabled={loading || permissionStatus === "unavailable"}
            className={`rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/30 text-white transition-all duration-300 shadow-md hover:shadow-lg ${
              locationActive ? "ring-2 ring-green-400 ring-opacity-50" : ""
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${loading}-${locationActive}-${!!locationError}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {getIcon()}
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
