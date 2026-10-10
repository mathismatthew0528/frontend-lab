import React, { useRef, useEffect, useState } from 'react'
import { Flame, Play, Pause, Sliders, RefreshCw } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  radius: number
}

export const CanvasLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [particleCount, setParticleCount] = useState(2000)
  const [fps, setFps] = useState(60)
  const [isRunning, setIsRunning] = useState(true)
  const [gravityMode, setGravityMode] = useState<'attract' | 'repel'>('attract')

  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let frameCount = 0
    let fpsTimer = performance.now()

    // 适配高分屏 DPI
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b']

    // 初始化粒子
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: Math.random() * 1.5 + 0.8,
    }))

    const render = (now: number) => {
      frameCount++
      if (now - fpsTimer >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - fpsTimer)))
        frameCount = 0
        fpsTimer = now
      }

      // 半透明背景清屏制造拖尾光效 (Motion Blur)
      ctx.fillStyle = 'rgba(10, 14, 23, 0.25)'
      ctx.fillRect(0, 0, width, height)

      const mouse = mousePosRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // 鼠标引力/斥力相互作用
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180 && dist > 1) {
            const force = (180 - dist) / 180
            const dir = gravityMode === 'attract' ? 1 : -1
            p.vx += (dx / dist) * force * 0.4 * dir
            p.vy += (dy / dist) * force * 0.4 * dir
          }
        }

        // 物理惯性与空气阻尼
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx
        p.y += p.vy

        // 边界碰撞弹射
        if (p.x < 0) {
          p.x = 0
          p.vx *= -1
        } else if (p.x > width) {
          p.x = width
          p.vx *= -1
        }
        if (p.y < 0) {
          p.y = 0
          p.vy *= -1
        } else if (p.y > height) {
          p.y = height
          p.vy *= -1
        }

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      if (isRunning) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, isRunning, gravityMode])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }

  const handleMouseLeave = () => {
    mousePosRef.current.active = false
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            高性能 Canvas 物理粒子引力场
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            研究原生 HTML5 Canvas 批量绘制吞吐量、RequestAnimationFrame 垂直同步及鼠标物理动力学交互。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">FPS:</span>
            <span className="text-emerald-400 font-bold">{fps}</span>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? '暂停' : '继续'}
          </button>
        </div>
      </div>

      {/* 控制工具条 */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" />
            粒子数量:
          </span>
          {[1000, 2000, 5000, 8000].map((count) => (
            <button
              key={count}
              onClick={() => setParticleCount(count)}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                particleCount === count
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {count}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">鼠标力场模式:</span>
          <button
            onClick={() => setGravityMode(gravityMode === 'attract' ? 'repel' : 'attract')}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            {gravityMode === 'attract' ? '引力汇聚 (Attract)' : '斥力扩散 (Repel)'}
          </button>
        </div>
      </div>

      {/* Canvas 画布容器 */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0a0e17] shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-[400px] cursor-crosshair block"
        />
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-500 pointer-events-none select-none font-mono">
          移动鼠标至画布内即可触发引力相互作用 · 渲染粒子: {particleCount.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
