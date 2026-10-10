import React, { useState } from 'react'
import {
  Sparkles,
  Bot,
  Flame,
  Activity,
  Palette,
  Terminal,
  Code2,
  ExternalLink,
} from 'lucide-react'
import { React19Lab } from './modules/React19Experiments'
import { WebAILab } from './modules/WebAILab'
import { CanvasLab } from './modules/CanvasLab'
import { PerformanceBenchmarks } from './modules/PerformanceBenchmarks'
import { ModernCSSLab } from './modules/ModernCSSLab'
import { WebAPIsLab } from './modules/WebAPIsLab'

type TabType = 'react19' | 'webai' | 'canvas' | 'perf' | 'moderncss' | 'webapis'

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('react19')

  const navItems = [
    { id: 'react19', label: 'React 19 新范式', icon: Sparkles, color: 'text-indigo-400' },
    { id: 'webai', label: 'Web AI & 流式智能', icon: Bot, color: 'text-amber-400' },
    { id: 'canvas', label: 'Canvas 粒子引力场', icon: Flame, color: 'text-orange-400' },
    { id: 'perf', label: 'DOM 密集渲染性能', icon: Activity, color: 'text-emerald-400' },
    { id: 'moderncss', label: '前沿 CSS & 动效', icon: Palette, color: 'text-purple-400' },
    { id: 'webapis', label: '浏览器底层 Web API', icon: Terminal, color: 'text-cyan-400' },
  ]

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 顶部导航 */}
      <header className="border-b border-slate-800/80 bg-[#0a0f1d]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Frontend Research Lab
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  2026 Next-Gen
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                现代化前端技术演进、渲染性能量化与端侧 AI 实验工作台
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/mathismatthew0528/frontend-lab"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
            >
              <span>GitHub 源码</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </header>

      {/* 主体区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* 顶部模块分类切换导航栏 */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-lg border border-slate-700 shadow-indigo-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-500'}`} />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* 核心工作区 */}
        <div className="bg-[#0b101e]/80 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {currentTab === 'react19' && <React19Lab />}
          {currentTab === 'webai' && <WebAILab />}
          {currentTab === 'canvas' && <CanvasLab />}
          {currentTab === 'perf' && <PerformanceBenchmarks />}
          {currentTab === 'moderncss' && <ModernCSSLab />}
          {currentTab === 'webapis' && <WebAPIsLab />}
        </div>
      </main>

      {/* 底部 */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>Frontend Research Lab · React 19 · TypeScript · Tailwind CSS v4 · Vite</p>
      </footer>
    </div>
  )
}

export default App
