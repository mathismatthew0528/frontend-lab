import React, { useState } from 'react'
import { Sparkles, Activity, Palette, Terminal, Code2 } from 'lucide-react'
import { React19Experiments } from './modules/React19Experiments'
import { PerformanceBenchmarks } from './modules/PerformanceBenchmarks'
import { DesignSystemLab } from './modules/DesignSystemLab'
import { WebAPIsLab } from './modules/WebAPIsLab'

type TabType = 'react19' | 'perf' | 'design' | 'webapis'

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('react19')

  const navItems = [
    { id: 'react19', label: 'React 19 实验', icon: Sparkles, color: 'text-indigo-400' },
    { id: 'perf', label: 'DOM 性能基准', icon: Activity, color: 'text-emerald-400' },
    { id: 'design', label: 'Tailwind v4 设计系统', icon: Palette, color: 'text-purple-400' },
    { id: 'webapis', label: '现代 Web API 探查', icon: Terminal, color: 'text-cyan-400' },
  ]

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 顶部导航条 */}
      <header className="border-b border-slate-800/80 bg-[#0c1220]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Frontend Lab
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  v1.0
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">
                现代化前端技术与前沿规范研究工作台
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              React 19 + Tailwind v4 + Vite
            </span>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* 模块切换导航 */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-500'}`} />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* 动态渲染研究模块 */}
        <div className="bg-[#0e1526]/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          {currentTab === 'react19' && <React19Experiments />}
          {currentTab === 'perf' && <PerformanceBenchmarks />}
          {currentTab === 'design' && <DesignSystemLab />}
          {currentTab === 'webapis' && <WebAPIsLab />}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>Frontend Lab · Built with React 19, TypeScript & Tailwind CSS v4</p>
      </footer>
    </div>
  )
}

export default App
