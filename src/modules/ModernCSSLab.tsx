import React, { useState } from 'react'
import { Palette, Eye, Layers, Sparkles, Sliders, Shuffle } from 'lucide-react'

export const ModernCSSLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viewTransitions' | 'oklch' | 'glassmorphism'>('viewTransitions')

  // View Transition 状态
  const [cardLayout, setCardLayout] = useState<'grid' | 'list'>('grid')

  // OKLCH 现代色彩空间状态
  const [lightness, setLightness] = useState(0.7)
  const [chroma, setChroma] = useState(0.2)
  const [hue, setHue] = useState(260)

  // 触发 View Transition
  const toggleLayout = () => {
    if ('startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setCardLayout((prev) => (prev === 'grid' ? 'list' : 'grid'))
      })
    } else {
      setCardLayout((prev) => (prev === 'grid' ? 'list' : 'grid'))
    }
  }

  const items = [
    { title: 'CSS Grid & Subgrid 嵌套网格对齐', tag: 'Layout', color: 'from-indigo-500 to-purple-600' },
    { title: 'OKLCH 新一代人眼感知均匀色彩空间', tag: 'Color Level 4', color: 'from-pink-500 to-rose-600' },
    { title: 'View Transitions API 原生平滑动画过渡', tag: 'Animation', color: 'from-emerald-400 to-teal-600' },
    { title: '@container 容器查询响应式设计', tag: 'Container Queries', color: 'from-amber-400 to-orange-500' },
  ]

  const oklchCss = `oklch(${lightness} ${chroma} ${hue})`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            前沿 CSS 规范与现代动效实验
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            研究原生 View Transitions API、OKLCH 广色域与感知均匀色彩空间、以及 Tailwind v4 声明式架构。
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('viewTransitions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'viewTransitions' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            View Transitions
          </button>
          <button
            onClick={() => setActiveTab('oklch')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'oklch' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            OKLCH 色彩实验室
          </button>
          <button
            onClick={() => setActiveTab('glassmorphism')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'glassmorphism' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            现代微交互组件
          </button>
        </div>
      </div>

      {activeTab === 'viewTransitions' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                原生 View Transitions API 布局形态切换
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                无需复杂的 Framer Motion / FLIP 算法，浏览器核心层自动捕捉快照并执行无级插值形变。
              </p>
            </div>

            <button
              onClick={toggleLayout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" /> 切换为 {cardLayout === 'grid' ? '列表视图' : '网格视图'}
            </button>
          </div>

          <div
            className={`transition-all duration-500 ${
              cardLayout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'
            }`}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">{item.tag}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-600 group-hover:text-slate-400 font-mono">0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'oklch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-pink-400" />
              OKLCH 感知均匀色彩调谐器
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              相比传统的 sRGB / HSL，OKLCH 彻底解决了“相同亮度在不同色相下人眼感觉明暗严重不均”的历史遗留问题。
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Lightness (亮度 L):</span>
                  <span className="font-mono text-white">{lightness}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.01"
                  value={lightness}
                  onChange={(e) => setLightness(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Chroma (彩度/饱和度 C):</span>
                  <span className="font-mono text-white">{chroma}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.37"
                  step="0.01"
                  value={chroma}
                  onChange={(e) => setChroma(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Hue (色相角 H):</span>
                  <span className="font-mono text-white">{hue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={hue}
                  onChange={(e) => setHue(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-3">实时色板预览</h3>
              <div
                className="w-full h-36 rounded-2xl shadow-xl flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: oklchCss }}
              >
                <span
                  className="font-mono text-sm font-bold px-3 py-1 rounded-lg backdrop-blur-md"
                  style={{
                    color: lightness > 0.5 ? '#000' : '#fff',
                    backgroundColor: lightness > 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  {oklchCss}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-400">
              <span className="text-slate-500">CSS 导出: </span>
              <code className="text-pink-400">color: {oklchCss};</code>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'glassmorphism' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Backdrop Blur</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              基于 GPU 实时模糊的高透光层级，配合微细亚像素白色描边打造轻量高级质感。
            </p>
          </div>

          <div className="relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 transition-all hover:border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Radial Mesh Glow</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              无需复杂 DOM 堆叠，单层 CSS 径向色彩混合即可营造有生命力的悬停响应微光。
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Tailwind v4 零配置</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                无需 <code>tailwind.config.js</code>，采用全新 CSS 原生优先模式与 Oxide 编译核心。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
