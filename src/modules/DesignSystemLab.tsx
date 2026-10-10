import React, { useState } from 'react'
import { Palette, Layers, Box, Check } from 'lucide-react'

export const DesignSystemLab: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('indigo')

  const themes = [
    { name: 'Indigo', key: 'indigo', class: 'from-indigo-500 to-purple-600', ring: 'ring-indigo-500' },
    { name: 'Emerald', key: 'emerald', class: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-500' },
    { name: 'Rose', key: 'rose', class: 'from-rose-500 to-pink-600', ring: 'ring-rose-500' },
    { name: 'Amber', key: 'amber', class: 'from-amber-400 to-orange-500', ring: 'ring-amber-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          Tailwind CSS v4 与设计系统研究
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          探索新一代 CSS 原生特性、动态渐变、玻璃拟态（Glassmorphism）、微交互动效与现代卡片架构。
        </p>
      </div>

      {/* 主题选择 */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 font-medium">设计主题色：</span>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedColor(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-900 transition-all ${
                selectedColor === t.key ? `ring-2 ${t.ring} text-white` : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${t.class}`} />
              {t.name}
              {selectedColor === t.key && <Check className="w-3 h-3 text-white ml-0.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* 现代卡片展示网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 卡片 1: 玻璃拟态 */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Glassmorphism</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            利用 CSS <code>backdrop-filter</code> 与半透明边框，在深色背景上实现高通透感和层级沉浸体验。
          </p>
        </div>

        {/* 卡片 2: 渐变光晕 */}
        <div className="relative group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 transition-all hover:border-slate-700">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Subtle Glow Border</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            悬停时利用径向与线性渐变产生平滑的边缘微光反馈，无需额外重型 JS 动画库。
          </p>
        </div>

        {/* 卡片 3: 状态反馈 */}
        <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Tokenized Variables</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              基于 CSS 变量标准与 Tailwind v4 的统一 design tokens，实现零运行时成本的动态切色。
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Tailwind v4.3 Engine</span>
            <span className="text-emerald-400">Lightning Fast ⚡</span>
          </div>
        </div>
      </div>
    </div>
  )
}
