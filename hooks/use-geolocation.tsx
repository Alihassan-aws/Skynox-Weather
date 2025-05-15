"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface GeolocationState {
  loading: boolean
  error: string | null
  data: {
    latitude: number
    longitude: number
  } | null
  timestamp: number | null
}

interface GeolocationHook extends GeolocationState {
  getLocation: () => Promise<void>
  locationPermissionStatus: "prompt" | "granted" | "denied" | "unavailable"
  retryLocation: () => Promise<void>
}

export function useGeolocation(): GeolocationHook {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    data: null,
    timestamp: null,
  })

  const [locationPermissionStatus, setLocationPermissionStatus] = useState<
    "prompt" | "granted" | "denied" | "unavailable"
  >("prompt")

  // Use a ref to track if we've already tried to get location automatically
  const initialLocationAttemptMade = useRef(false)
  const isMounted = useRef(true)

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Check if geolocation is available and permission status on mount
  useEffect(() => {
    checkGeolocationAvailability()
  }, [])

  const checkGeolocationAvailability = useCallback(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setLocationPermissionStatus("unavailable")
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }))
      return false
    }

    // Check permission status if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (!isMounted.current) return

          setLocationPermissionStatus(result.state as "prompt" | "granted" | "denied")

          // Listen for permission changes
          result.onchange = () => {
            if (!isMounted.current) return
            setLocationPermissionStatus(result.state as "prompt" | "granted" | "denied")
          }

          // If already granted and we haven't tried yet, automatically get location
          if (result.state === "granted" && !initialLocationAttemptMade.current) {
            initialLocationAttemptMade.current = true
            getLocation()
          }
        })
        .catch((err) => {
          // If we can't query permissions, we'll just try to get location
          console.log("Could not query geolocation permission status:", err)
        })
    }

    return true
  }, [])

  const getLocation = useCallback(async (): Promise<void> => {
    // Don't proceed if already loading
    if (state.loading) return Promise.resolve()

    // Don't proceed if geolocation is unavailable
    if (!navigator.geolocation) {
      setLocationPermissionStatus("unavailable")
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }))
      return Promise.resolve()
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted.current) return resolve()

          setState({
            loading: false,
            error: null,
            data: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            timestamp: position.timestamp,
          })
          setLocationPermissionStatus("granted")
          resolve()
        },
        (error) => {
          if (!isMounted.current) return resolve()

          let errorMessage = "Unknown error occurred"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied"
              setLocationPermissionStatus("denied")
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }

          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }))
          resolve()
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }, [state.loading])

  const retryLocation = useCallback(async (): Promise<void> => {
    // Clear previous errors
    setState((prev) => ({ ...prev, error: null }))

    // Try to get location again
    return getLocation()
  }, [getLocation])

  return {
    ...state,
    getLocation,
    retryLocation,
    locationPermissionStatus,
  }
}
