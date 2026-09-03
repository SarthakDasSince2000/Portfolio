import { useEffect, useRef } from 'react'

interface Star {
  x: number // Normalized -1.15 to 1.15
  y: number // Normalized -1.15 to 1.15
  z: number // Depth: 0.04 (closest) to 1.0 (furthest)
  baseSize: number
  layer: 0 | 1 | 2 | 3 // 0: Deep Space, 1: Mid Space, 2: Near Space, 3: Glowing Stars
  baseOpacity: number
  colorType: 'white' | 'emerald' | 'warm' | 'cyan'
  isGlowing: boolean // 15 special glowing stars
  pulsePhase: number
  pulseSpeed: number
  isTwinkling: boolean
  twinkleSpeed: number
  twinklePhase: number
  twinkleAmount: number
  driftAngle: number
  driftSpeed: number
}

interface CosmicDust {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseOpacity: number
  phase: number
}

interface ShootingStar {
  active: boolean
  x: number
  y: number
  dx: number
  dy: number
  length: number
  progress: number
  duration: number
  size: number
}

// Deterministic pseudorandom generator for rock-solid starfield stability
function createPRNG(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateStarfield(count: number): Star[] {
  const rand = createPRNG(384729)
  const stars: Star[] = []

  // Count distribution:
  // ~65% Layer 0 (Deep Space tiny stars): ~180-210
  // ~20% Layer 1 (Mid Space medium stars): ~55-70
  // ~10% Layer 2 (Near Space bright stars): ~28-36
  // ~5%  Layer 3 (Special glowing stars): ~14-18

  for (let i = 0; i < count; i++) {
    const layerRand = rand()
    let layer: 0 | 1 | 2 | 3 = 0
    let z = 0.55 + rand() * 0.45
    let baseSize = 0.85 + rand() * 0.55 // 0.85px - 1.4px
    let baseOpacity = 0.48 + rand() * 0.28 // 0.48 - 0.76
    let driftSpeed = 0.000025 + rand() * 0.00003
    let isGlowing = false

    if (layerRand > 0.95) {
      // Layer 3: Special Glowing Stars (14-18 total)
      layer = 3
      z = 0.05 + rand() * 0.22
      baseSize = 2.2 + rand() * 0.9 // 2.2px - 3.1px
      baseOpacity = 0.92 + rand() * 0.08 // 0.92 - 1.0
      driftSpeed = 0.00014 + rand() * 0.00009
      isGlowing = true
    } else if (layerRand > 0.85) {
      // Layer 2: Near Space Bright Stars (28-36 total)
      layer = 2
      z = 0.15 + rand() * 0.28
      baseSize = 1.5 + rand() * 0.7 // 1.5px - 2.2px
      baseOpacity = 0.75 + rand() * 0.22 // 0.75 - 0.97
      driftSpeed = 0.000095 + rand() * 0.00007
    } else if (layerRand > 0.65) {
      // Layer 1: Mid Space Medium Stars (55-70 total)
      layer = 1
      z = 0.35 + rand() * 0.32
      baseSize = 1.1 + rand() * 0.5 // 1.1px - 1.6px
      baseOpacity = 0.58 + rand() * 0.25 // 0.58 - 0.83
      driftSpeed = 0.000055 + rand() * 0.000045
    }

    // Color distribution: 90% white, 5% emerald, 3% cyan, 2% warm amber
    const colorRoll = rand()
    let colorType: Star['colorType'] = 'white'
    if (colorRoll > 0.95) colorType = 'emerald'
    else if (colorRoll > 0.92) colorType = 'cyan'
    else if (colorRoll > 0.90) colorType = 'warm'

    // Subtle twinkling for ~35% of stars with individual phases
    const isTwinkling = rand() > 0.65

    stars.push({
      x: (rand() - 0.5) * 2.3, // full viewport spread
      y: (rand() - 0.5) * 2.3,
      z,
      baseSize,
      layer,
      baseOpacity,
      colorType,
      isGlowing,
      pulsePhase: rand() * Math.PI * 2,
      pulseSpeed: 0.001 + rand() * 0.002,
      isTwinkling,
      twinkleSpeed: 0.0014 + rand() * 0.003,
      twinklePhase: rand() * Math.PI * 2,
      twinkleAmount: 0.22 + rand() * 0.35,
      driftAngle: rand() * Math.PI * 2,
      driftSpeed,
    })
  }

  return stars
}

function generateCosmicDust(count: number): CosmicDust[] {
  const rand = createPRNG(48291)
  const dust: CosmicDust[] = []
  for (let i = 0; i < count; i++) {
    dust.push({
      x: rand(),
      y: rand(),
      vx: 0.00009 + rand() * 0.00008,
      vy: 0.00005 + rand() * 0.00006,
      size: 1.1 + rand() * 0.8,
      baseOpacity: 0.25 + rand() * 0.25,
      phase: rand() * Math.PI * 2,
    })
  }
  return dust
}

// Linear interpolation helper
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function CosmicBackground({ theme }: { theme: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    let isReducedMotion = reducedMotionQuery.matches

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    let width = 0
    let height = 0
    let dpr = 1
    let frameId = 0
    let isVisible = !document.hidden
    let lastTime = performance.now()

    // Smooth pointer state with spring inertia
    let pointerX = 0
    let pointerY = 0
    let targetPointerX = 0
    let targetPointerY = 0

    let scrollY = window.scrollY
    let targetScrollY = window.scrollY

    // Theme transition state: 0 = Light, 1 = Dark
    let themeProgress = theme === 'dark' ? 1 : 0
    let targetThemeProgress = theme === 'dark' ? 1 : 0

    // Calibrated star counts for full rich coverage
    const getStarCount = (w: number) => {
      if (w < 768) return 110 // Mobile
      if (w < 1024) return 190 // Tablet
      return 290 // Desktop: 220 deep/mid + 40 bright + 15 glowing
    }

    let stars = generateStarfield(getStarCount(window.innerWidth))
    const dustParticles = generateCosmicDust(4)

    // Rare shooting star (meteor) system
    const shootingStar: ShootingStar = {
      active: false,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      length: 65,
      progress: 0,
      duration: 1.2,
      size: 1.4,
    }
    let nextShootingStarTime = performance.now() + 16000 + Math.random() * 18000

    const triggerShootingStar = () => {
      shootingStar.active = true
      shootingStar.progress = 0
      shootingStar.duration = 1.0 + Math.random() * 0.6
      shootingStar.x = (Math.random() * 0.75 + 0.1) * width
      shootingStar.y = (Math.random() * 0.35 + 0.05) * height
      const angle = (Math.random() > 0.5 ? 1 : -1) * (0.42 + Math.random() * 0.38)
      const speed = width * 0.42 + Math.random() * width * 0.25
      shootingStar.dx = Math.cos(angle) * speed
      shootingStar.dy = Math.abs(Math.sin(angle)) * speed
      shootingStar.length = 55 + Math.random() * 50
      shootingStar.size = 1.2 + Math.random() * 0.8
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const targetCount = getStarCount(width)
      if (Math.abs(stars.length - targetCount) > 40) {
        stars = generateStarfield(targetCount)
      }
    }

    const onScroll = () => {
      targetScrollY = window.scrollY
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') {
        targetPointerX = (event.clientX / width - 0.5) * 2
        targetPointerY = (event.clientY / height - 0.5) * 2
      }
    }

    const onPointerLeave = () => {
      targetPointerX = 0
      targetPointerY = 0
    }

    // Dynamic color palettes for dark <-> light interpolation
    const getStarColor = (type: Star['colorType'], darkRatio: number) => {
      if (darkRatio > 0.5) {
        switch (type) {
          case 'emerald':
            return { r: 180, g: 255, b: 210 }
          case 'warm':
            return { r: 255, g: 232, b: 200 }
          case 'cyan':
            return { r: 200, g: 245, b: 255 }
          case 'white':
          default:
            return { r: 255, g: 255, b: 255 }
        }
      } else {
        switch (type) {
          case 'emerald':
            return { r: 35, g: 90, b: 65 }
          case 'warm':
            return { r: 130, g: 75, b: 50 }
          case 'cyan':
            return { r: 40, g: 95, b: 120 }
          case 'white':
          default:
            return { r: 40, g: 65, b: 55 }
        }
      }
    }

    // Main 60fps render loop
    const render = (now: number) => {
      if (!isVisible) return

      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      frameId = requestAnimationFrame(render)

      // Smooth interpolation for theme transition
      targetThemeProgress = theme === 'dark' ? 1 : 0
      themeProgress += (targetThemeProgress - themeProgress) * (1 - Math.exp(-dt * 4.5))

      // Smooth pointer parallax with spring-damped inertia
      const pointerDamping = 1 - Math.exp(-dt * 4.2)
      pointerX += (targetPointerX - pointerX) * pointerDamping
      pointerY += (targetPointerY - pointerY) * pointerDamping

      const scrollDamping = 1 - Math.exp(-dt * 7.5)
      scrollY += (targetScrollY - scrollY) * scrollDamping

      context.clearRect(0, 0, width, height)

      const timeSec = now * 0.001
      const isDark = themeProgress > 0.5

      // =========================================================================
      // 1. VISIBLE ATMOSPHERIC NEBULAS & HERO CENTER GLOW
      // =========================================================================

      // Hero Center Glow
      const centerGlowX = width * (0.5 + pointerX * 0.015)
      const centerGlowY = height * (0.36 + pointerY * 0.015 + Math.sin(timeSec * 0.1) * 0.02)
      const centerGlowRadius = Math.max(width, height) * (0.52 + Math.sin(timeSec * 0.14) * 0.03)
      const centerGlow = context.createRadialGradient(centerGlowX, centerGlowY, 0, centerGlowX, centerGlowY, centerGlowRadius)
      const centerGlowAlphaDark = 0.16 * themeProgress
      const centerGlowAlphaLight = 0.05 * (1 - themeProgress)
      centerGlow.addColorStop(0, isDark ? `rgba(216, 255, 82, ${centerGlowAlphaDark})` : `rgba(216, 255, 140, ${centerGlowAlphaLight})`)
      centerGlow.addColorStop(0.5, isDark ? `rgba(26, 85, 64, ${centerGlowAlphaDark * 0.55})` : `rgba(195, 230, 220, ${centerGlowAlphaLight * 0.4})`)
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = centerGlow
      context.fillRect(0, 0, width, height)

      // Nebula 1: Deep Cosmic Emerald / Teal (upper-right quadrant)
      const n1X = width * (0.74 + Math.sin(timeSec * 0.08) * 0.05 + pointerX * 0.02)
      const n1Y = height * (0.22 + Math.cos(timeSec * 0.07) * 0.04 + pointerY * 0.02)
      const n1Radius = Math.max(width, height) * (0.55 + Math.sin(timeSec * 0.1) * 0.04)
      const nebula1 = context.createRadialGradient(n1X, n1Y, 0, n1X, n1Y, n1Radius)
      const n1AlphaDark = 0.25 * themeProgress
      const n1AlphaLight = 0.07 * (1 - themeProgress)
      nebula1.addColorStop(0, isDark ? `rgba(26, 85, 64, ${n1AlphaDark})` : `rgba(185, 225, 215, ${n1AlphaLight})`)
      nebula1.addColorStop(0.55, isDark ? `rgba(16, 52, 40, ${n1AlphaDark * 0.5})` : `rgba(205, 235, 228, ${n1AlphaLight * 0.35})`)
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = nebula1
      context.fillRect(0, 0, width, height)

      // Nebula 2: Warm Coral / Amber Ember Glow (hero typography accent)
      const n2X = width * (0.78 + Math.cos(timeSec * 0.07) * 0.04 + pointerX * 0.015)
      const n2Y = height * (0.18 + Math.sin(timeSec * 0.09) * 0.03 + pointerY * 0.015)
      const n2Radius = Math.max(width, height) * 0.44
      const nebula2 = context.createRadialGradient(n2X, n2Y, 0, n2X, n2Y, n2Radius)
      const n2AlphaDark = 0.12 * themeProgress
      const n2AlphaLight = 0.04 * (1 - themeProgress)
      nebula2.addColorStop(0, isDark ? `rgba(255, 125, 95, ${n2AlphaDark})` : `rgba(255, 140, 115, ${n2AlphaLight})`)
      nebula2.addColorStop(0.6, isDark ? `rgba(255, 125, 95, ${n2AlphaDark * 0.3})` : `rgba(255, 160, 135, ${n2AlphaLight * 0.2})`)
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = nebula2
      context.fillRect(0, 0, width, height)

      // Nebula 3: Cosmic Indigo / Slate (lower-left quadrant)
      const n3X = width * (0.2 + Math.sin(timeSec * 0.06) * 0.04 - pointerX * 0.015)
      const n3Y = height * (0.75 + Math.cos(timeSec * 0.08) * 0.05 - pointerY * 0.015)
      const n3Radius = Math.max(width, height) * 0.5
      const nebula3 = context.createRadialGradient(n3X, n3Y, 0, n3X, n3Y, n3Radius)
      const n3AlphaDark = 0.18 * themeProgress
      const n3AlphaLight = 0.05 * (1 - themeProgress)
      nebula3.addColorStop(0, isDark ? `rgba(24, 48, 88, ${n3AlphaDark})` : `rgba(180, 205, 225, ${n3AlphaLight})`)
      nebula3.addColorStop(0.7, 'rgba(0, 0, 0, 0)')
      nebula3.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = nebula3
      context.fillRect(0, 0, width, height)

      // =========================================================================
      // 2. 4-LAYER 3D STARFIELD UPDATE & RENDERING
      // =========================================================================
      const centerX = width * 0.5
      const centerY = height * 0.5
      const forwardTravelSpeed = isReducedMotion ? 0 : 0.0155

      // Hero text protection boundary
      const inHeroSection = scrollY < height * 0.35
      const textZoneLeft = width * 0.05
      const textZoneRight = width * 0.65
      const textZoneTop = height * 0.20
      const textZoneBottom = height * 0.65

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        if (!isReducedMotion) {
          // 3D Forward Camera Motion
          star.z -= forwardTravelSpeed * dt

          // Individual organic drift
          star.x += Math.cos(star.driftAngle + timeSec * 0.08) * star.driftSpeed
          star.y += Math.sin(star.driftAngle + timeSec * 0.08) * star.driftSpeed

          // Wrap-around when star passes camera
          if (star.z <= 0.04) {
            star.z = 1.0
            star.x = (Math.random() - 0.5) * 2.3
            star.y = (Math.random() - 0.5) * 2.3
          }

          // Boundary wrap
          if (star.x < -1.2) star.x += 2.4
          if (star.x > 1.2) star.x -= 2.4
          if (star.y < -1.2) star.y += 2.4
          if (star.y > 1.2) star.y -= 2.4
        }

        // Layer-specific Parallax
        let mouseParallaxFactor = 1.4
        let scrollParallaxFactor = 0.006

        if (star.layer === 1) {
          mouseParallaxFactor = 3.6
          scrollParallaxFactor = 0.018
        } else if (star.layer === 2) {
          mouseParallaxFactor = 7.2
          scrollParallaxFactor = 0.038
        } else if (star.layer === 3) {
          mouseParallaxFactor = 10.0
          scrollParallaxFactor = 0.052
        }

        // 3D Perspective Projection
        const perspectiveFactor = 0.45 + (1.0 - star.z) * 0.55

        const sx = centerX + star.x * width * 0.5 * perspectiveFactor + (pointerX * mouseParallaxFactor * (isReducedMotion ? 0 : 1))
        const sy = centerY + star.y * height * 0.5 * perspectiveFactor + (pointerY * mouseParallaxFactor * 0.72 * (isReducedMotion ? 0 : 1)) + ((scrollY * scrollParallaxFactor) % height)

        // Screen wrap with soft margin
        const margin = 40
        const renderX = ((sx % (width + margin * 2)) + (width + margin * 2)) % (width + margin * 2) - margin
        const renderY = ((sy % (height + margin * 2)) + (height + margin * 2)) % (height + margin * 2) - margin

        // Twinkling & pulsing factor
        let twinkleFactor = 1.0
        if (star.isTwinkling && !isReducedMotion) {
          twinkleFactor = 1.0 + Math.sin(now * star.twinkleSpeed + star.twinklePhase) * star.twinkleAmount
        }

        let pulseFactor = 1.0
        if (star.isGlowing && !isReducedMotion) {
          pulseFactor = 1.0 + Math.sin(now * star.pulseSpeed + star.pulsePhase) * 0.2
        }

        // Depth-fade curve
        let depthAlpha = 1.0
        if (star.z > 0.85) {
          depthAlpha = (1.0 - star.z) / 0.15
        } else if (star.z < 0.12) {
          depthAlpha = (star.z - 0.04) / 0.08
        }
        depthAlpha = Math.max(0.2, Math.min(1, depthAlpha))

        // Readability protection: soften only bright stars in headline zone
        let readabilityMultiplier = 1.0
        if (inHeroSection && renderX >= textZoneLeft && renderX <= textZoneRight && renderY >= textZoneTop && renderY <= textZoneBottom) {
          readabilityMultiplier = (star.layer >= 2 || star.isGlowing) ? 0.65 : 0.88
        }

        // Mode alpha adaptation
        const modeAlphaMultiplier = lerp(0.42, 1.0, themeProgress)
        const starAlpha = Math.max(0, Math.min(1, star.baseOpacity * twinkleFactor * pulseFactor * depthAlpha * readabilityMultiplier * modeAlphaMultiplier))

        if (starAlpha < 0.02) continue

        const color = getStarColor(star.colorType, themeProgress)
        const currentSize = Math.max(0.7, star.baseSize * (0.65 + (1.0 - star.z) * 0.75) * (star.isGlowing ? pulseFactor : 1.0))

        // Render distinct star types
        if (star.isGlowing || star.layer === 3) {
          // Special Glowing Star: soft 2-layer radial halo glow & bright core
          const glowRadius = currentSize * 5.0
          const starGlow = context.createRadialGradient(renderX, renderY, 0, renderX, renderY, glowRadius)
          starGlow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha * 0.95})`)
          starGlow.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha * 0.35})`)
          starGlow.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

          context.beginPath()
          context.fillStyle = starGlow
          context.arc(renderX, renderY, glowRadius, 0, Math.PI * 2)
          context.fill()

          // Core
          context.beginPath()
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.min(1, starAlpha * 1.25)})`
          context.arc(renderX, renderY, currentSize * 0.95, 0, Math.PI * 2)
          context.fill()

          // Delicate 4-point cross diffraction flare
          if (starAlpha > 0.4 && !isReducedMotion && star.layer === 3) {
            context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha * 0.35})`
            context.lineWidth = 0.7
            context.beginPath()
            context.moveTo(renderX - currentSize * 2.8, renderY)
            context.lineTo(renderX + currentSize * 2.8, renderY)
            context.moveTo(renderX, renderY - currentSize * 2.8)
            context.lineTo(renderX, renderY + currentSize * 2.8)
            context.stroke()
          }
        } else if (star.layer === 0) {
          // Layer 0 (Deep Space): tiny defined points
          context.beginPath()
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha})`
          context.arc(renderX, renderY, currentSize, 0, Math.PI * 2)
          context.fill()
        } else if (star.layer === 1) {
          // Layer 1 (Mid Space): crisp bright points
          context.beginPath()
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha})`
          context.arc(renderX, renderY, currentSize, 0, Math.PI * 2)
          context.fill()
        } else {
          // Layer 2 (Near Space): bright core with soft aura
          context.beginPath()
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha * 0.35})`
          context.arc(renderX, renderY, currentSize * 1.8, 0, Math.PI * 2)
          context.fill()

          context.beginPath()
          context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${starAlpha})`
          context.arc(renderX, renderY, currentSize, 0, Math.PI * 2)
          context.fill()
        }
      }

      // =========================================================================
      // 3. FAINT DRIFTING COSMIC DUST MOTES
      // =========================================================================
      if (!isReducedMotion) {
        for (let i = 0; i < dustParticles.length; i++) {
          const dust = dustParticles[i]
          dust.x = (dust.x + dust.vx * (dt * 60)) % 1.0
          dust.y = (dust.y + dust.vy * (dt * 60)) % 1.0

          const dx = dust.x * width + pointerX * 6.0
          const dy = dust.y * height + pointerY * 4.5 + ((scrollY * 0.02) % height)

          const dustAlpha = dust.baseOpacity * (0.6 + Math.sin(timeSec * 0.5 + dust.phase) * 0.4) * lerp(0.35, 0.85, themeProgress)
          const dCol = themeProgress > 0.5 ? '210, 245, 230' : '45, 75, 65'

          context.beginPath()
          context.fillStyle = `rgba(${dCol}, ${dustAlpha})`
          context.arc(dx % width, dy % height, dust.size, 0, Math.PI * 2)
          context.fill()
        }
      }

      // =========================================================================
      // 4. RARE CINEMATIC SHOOTING STAR (METEOR)
      // =========================================================================
      if (!isReducedMotion) {
        if (!shootingStar.active && now > nextShootingStarTime) {
          triggerShootingStar()
          nextShootingStarTime = now + 18000 + Math.random() * 22000
        }

        if (shootingStar.active) {
          shootingStar.progress += dt / shootingStar.duration

          if (shootingStar.progress >= 1) {
            shootingStar.active = false
          } else {
            const p = shootingStar.progress
            let meteorAlpha = 0
            if (p < 0.2) {
              meteorAlpha = p / 0.2
            } else if (p > 0.7) {
              meteorAlpha = (1 - p) / 0.3
            } else {
              meteorAlpha = 1
            }

            const currentMeteorX = shootingStar.x + shootingStar.dx * p
            const currentMeteorY = shootingStar.y + shootingStar.dy * p

            const mag = Math.hypot(shootingStar.dx, shootingStar.dy) || 1
            const dirX = shootingStar.dx / mag
            const dirY = shootingStar.dy / mag
            const tailX = currentMeteorX - dirX * shootingStar.length
            const tailY = currentMeteorY - dirY * shootingStar.length

            const meteorThemeAlpha = meteorAlpha * lerp(0.4, 0.95, themeProgress)
            const meteorGradient = context.createLinearGradient(currentMeteorX, currentMeteorY, tailX, tailY)
            const mCol = themeProgress > 0.5 ? '255, 255, 255' : '42, 78, 66'

            meteorGradient.addColorStop(0, `rgba(${mCol}, ${meteorThemeAlpha})`)
            meteorGradient.addColorStop(0.35, `rgba(${mCol}, ${meteorThemeAlpha * 0.5})`)
            meteorGradient.addColorStop(1, `rgba(${mCol}, 0)`)

            context.beginPath()
            context.strokeStyle = meteorGradient
            context.lineWidth = shootingStar.size
            context.lineCap = 'round'
            context.moveTo(tailX, tailY)
            context.lineTo(currentMeteorX, currentMeteorY)
            context.stroke()

            // Head glow
            context.beginPath()
            context.fillStyle = `rgba(${mCol}, ${meteorThemeAlpha})`
            context.arc(currentMeteorX, currentMeteorY, shootingStar.size * 1.3, 0, Math.PI * 2)
            context.fill()
          }
        }
      }
    }

    const onVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        lastTime = performance.now()
        cancelAnimationFrame(frameId)
        frameId = requestAnimationFrame(render)
      }
    }

    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches
    }

    resize()
    frameId = requestAnimationFrame(render)

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    reducedMotionQuery.addEventListener('change', onReducedMotionChange)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="cosmic-background" aria-hidden="true" />
}
