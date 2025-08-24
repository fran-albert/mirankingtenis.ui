"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getAvatarUrl, getResponsiveAvatarUrls, type AvatarSize } from "@/lib/cloudinary-utils"

interface OptimizedAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string | null
  alt?: string
  size?: AvatarSize
  fallbackText?: string
  showFallback?: boolean
  priority?: boolean
  onLoadingStateChange?: (isLoading: boolean) => void
}

const OptimizedAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  OptimizedAvatarProps
>(({ 
  className, 
  src, 
  alt = "Avatar", 
  size = "small", 
  fallbackText,
  showFallback = true,
  priority = false,
  onLoadingStateChange,
  ...props 
}, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const optimizedSrc = React.useMemo(() => getAvatarUrl(src, size), [src, size])
  const responsiveUrls = React.useMemo(() => getResponsiveAvatarUrls(src, size), [src, size])

  // Determinar el tamaño en píxeles basado en el size prop
  const sizeClasses = {
    thumbnail: "h-10 w-10", // 40x40px
    small: "h-20 w-20",     // 80x80px  
    medium: "h-50 w-50",    // 200x200px
    large: "h-100 w-100"    // 400x400px
  }

  const pixelSizes = {
    thumbnail: 40,
    small: 80,
    medium: 200,
    large: 400
  }

  React.useEffect(() => {
    onLoadingStateChange?.(isLoading)
  }, [isLoading, onLoadingStateChange])

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
    setIsLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
    setIsLoading(false)
  }

  // Generar texto de fallback automáticamente si no se proporciona
  const autoFallbackText = React.useMemo(() => {
    if (fallbackText) return fallbackText
    
    // Intentar extraer iniciales del alt text
    const words = alt.split(' ').filter(word => word.length > 0)
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    
    return "U"
  }, [alt, fallbackText])

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Imagen principal */}
      {optimizedSrc && !imageError && (
        <div className="relative w-full h-full">
          <Image
            src={optimizedSrc}
            alt={alt}
            fill
            sizes={`${pixelSizes[size]}px`}
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            quality={85}
          />
          
          {/* Skeleton/Loading state */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
          )}
        </div>
      )}

      {/* Fallback */}
      {showFallback && (imageError || !optimizedSrc) && (
        <AvatarPrimitive.Fallback 
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold",
            {
              "text-xs": size === "thumbnail",
              "text-sm": size === "small", 
              "text-lg": size === "medium",
              "text-2xl": size === "large"
            }
          )}
        >
          {autoFallbackText}
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  )
})

OptimizedAvatar.displayName = "OptimizedAvatar"

export { OptimizedAvatar, type OptimizedAvatarProps }