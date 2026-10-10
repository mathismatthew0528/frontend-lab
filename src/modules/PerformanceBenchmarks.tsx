import React, { useState, useRef } from 'react'
import { Activity, Zap, Play, RotateCcw } from 'lucide-react'

export const PerformanceBenchmarks: React.FC = () => {
  const [itemCount, setItemCount] = useState(1000)
  const [items, setItems] = useState<number[]>([])
  const [renderDuration, setRenderDuration] = useState<number | null>(null)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const startTimeRef = useRef<number>(0)

  const handleRunBenchmark = () => {
    setIsMeasuring(true)
    startTimeRef.current = performance.now()

    // 触发批量渲染
    const newItems = Array.from({ length: itemCount }, (_, i) => i + 1)
    setItems(newItems)

    // 使用 requestAnimationFrame 捕获真实 DOM 绘制完成时间点
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const duration = performance.now() - startTimeRef.current
        setRenderDuration(Number(duration.toFixed(2)))
        setIsMeasuring(false)
      })
    })
  }

  const handleReset = () => {
    setItems([])
    setRenderDuration(null)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          DOM 密集渲染性能基准测试
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          量化测量在不同节点规模下，React VDOM Diffing、Reconciliation 与真实浏览器 Layout / Paint 的耗时（毫秒）。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">渲染节点规模</span>
          <div className="flex items-center gap-2 mt-2">
            {[500, 1000, 3000, 5000].map((num) => (
              <button
                key={num}
                onClick={() => setItemCount(num)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all ${
                  itemCount === num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400">渲染耗时 (Render + Paint)</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            {renderDuration !== null ? `${renderDuration} ms` : '--'}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <button
            onClick={handleRunBenchmark}
            disabled={isMeasuring}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all"
          >
            <Play className="w-4 h-4" /> 开始测试
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
            title="清空"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 虚拟网格演示 */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            渲染输出区域（网格容器）
          </span>
          <span className="text-xs text-slate-500 font-mono">已挂载: {items.length} 节点</span>
        </div>

        <div className="h-64 overflow-y-auto bg-slate-950 rounded-lg p-3 border border-slate-800/80">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-600">
              点击上方“开始测试”生成 DOM 节点并计算用时
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {items.map((n) => (
                <div
                  key={n}
                  className="p-2 rounded bg-slate-900 border border-slate-800 text-center text-xs font-mono text-slate-400 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                >
                  #{n}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
