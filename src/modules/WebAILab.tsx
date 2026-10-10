import React, { useState, useRef, useEffect } from 'react'
import { Bot, Play, Pause, RotateCcw, Search, Sparkles } from 'lucide-react'

// 模拟语义向量条目
const KNOWLEDGE_BASE = [
  { text: 'React 19 Actions 与并发调度原理', vector: [0.85, 0.9, 0.1, 0.2] },
  { text: 'Tailwind CSS v4 零配置氧化与 LightningCSS 性能', vector: [0.3, 0.2, 0.95, 0.8] },
  { text: 'Web Workers 与 OffscreenCanvas 多线程渲染架构', vector: [0.7, 0.1, 0.85, 0.4] },
  { text: '前端大模型流式推理（SSE / Fetch Streams）与打字机状态机', vector: [0.95, 0.7, 0.3, 0.5] },
  { text: '现代浏览器 View Transitions 原生无缝页面过渡', vector: [0.2, 0.4, 0.9, 0.75] },
]

// 余弦相似度计算函数
function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return (dotProduct / (magA * magB)).toFixed(4)
}

const SAMPLE_LLM_STREAM = `### 深度探索现代前端 AI 流式架构

在当下前端开发中，与大语言模型（LLM）的结合已从简单的 HTTP 请求演变为**全双工流式互动**。

#### 核心优化维度：
1. **TTFT (Time To First Token)**：利用 HTTP Chunked Transfer 与 SSE（Server-Sent Events）实现 < 300ms 首字上屏。
2. **渐进式渲染与状态批处理**：避免每个 token 都触发 React 重渲染，使用微任务队列与 requestAnimationFrame 进行打字节流。
3. **端侧推理与向量检索 (Client-side RAG)**：借助 WebAssembly 与 WebGPU，许多轻量 Embedding 和 Rerank 可以直接在用户浏览器中执行，实现 0 延迟保护隐私！
`

export const WebAILab: React.FC = () => {
  // 流式输出状态
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [ttft, setTtft] = useState<number | null>(null)
  const [tokensPerSecond, setTokensPerSecond] = useState<number>(0)
  const [tokenCount, setTokenCount] = useState<number>(0)
  const timerRef = useRef<number | null>(null)
  const streamStartRef = useRef<number>(0)
  const firstTokenReceivedRef = useRef<boolean>(false)

  // 向量检索状态
  const [queryCategory, setQueryCategory] = useState<'react' | 'css' | 'ai'>('ai')

  const queryVectors: Record<'react' | 'css' | 'ai', number[]> = {
    react: [0.9, 0.85, 0.15, 0.2],
    css: [0.25, 0.3, 0.92, 0.85],
    ai: [0.92, 0.75, 0.35, 0.55],
  }

  const handleStartStream = () => {
    setStreamedText('')
    setIsStreaming(true)
    setTtft(null)
    setTokenCount(0)
    setTokensPerSecond(0)
    firstTokenReceivedRef.current = false
    streamStartRef.current = performance.now()

    let charIndex = 0
    let currentCount = 0

    // 模拟首包延迟（TTFT）
    const initialDelay = 260

    setTimeout(() => {
      const now = performance.now()
      setTtft(Math.round(now - streamStartRef.current))
      firstTokenReceivedRef.current = true

      timerRef.current = window.setInterval(() => {
        if (charIndex >= SAMPLE_LLM_STREAM.length) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsStreaming(false)
          return
        }

        // 每次输出 1~3 个字符（模拟 Chunk）
        const chunkSize = Math.floor(Math.random() * 3) + 1
        const nextChars = SAMPLE_LLM_STREAM.slice(charIndex, charIndex + chunkSize)
        charIndex += chunkSize
        currentCount += Math.max(1, Math.round(chunkSize / 1.5))

        setStreamedText((prev) => prev + nextChars)
        setTokenCount(currentCount)

        const elapsedSec = (performance.now() - streamStartRef.current) / 1000
        if (elapsedSec > 0.2) {
          setTokensPerSecond(Math.round(currentCount / elapsedSec))
        }
      }, 35)
    }, initialDelay)
  }

  const handleStopStream = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsStreaming(false)
  }

  const handleResetStream = () => {
    handleStopStream()
    setStreamedText('')
    setTtft(null)
    setTokensPerSecond(0)
    setTokenCount(0)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 计算检索相似度并排序
  const searchResults = KNOWLEDGE_BASE.map((item) => ({
    ...item,
    similarity: parseFloat(cosineSimilarity(item.vector, queryVectors[queryCategory])),
  })).sort((a, b) => b.similarity - a.similarity)

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          Web AI 交互与端侧智能实验
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          探查前端流式生成（Streaming UI）、打字机性能指标（TTFT / TPS）以及浏览器端离线向量相似度检索（Cosine Vector Search）。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧两列：LLM 流式输出模拟器 */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              流式渲染与状态机监控
            </h3>

            <div className="flex items-center gap-2">
              {!isStreaming ? (
                <button
                  onClick={handleStartStream}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  <Play className="w-3.5 h-3.5" /> 开始流式生成
                </button>
              ) : (
                <button
                  onClick={handleStopStream}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-all"
                >
                  <Pause className="w-3.5 h-3.5" /> 暂停流
                </button>
              )}
              <button
                onClick={handleResetStream}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                title="清空重置"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 性能仪表盘 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500">首字响应 (TTFT)</span>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">
                {ttft !== null ? `${ttft} ms` : '--'}
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500">生成速率</span>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                {tokensPerSecond > 0 ? `${tokensPerSecond} t/s` : '--'}
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500">Token 累计</span>
              <div className="text-lg font-mono font-bold text-indigo-400 mt-0.5">
                {tokenCount > 0 ? `${tokenCount}` : '--'}
              </div>
            </div>
          </div>

          {/* 渲染终端 */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {streamedText ? (
              <>
                {streamedText}
                {isStreaming && <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse" />}
              </>
            ) : (
              <span className="text-slate-600">点击右上角“开始流式生成”，观察首字延迟与持续吞吐率...</span>
            )}
          </div>
        </div>

        {/* 右侧一列：纯浏览器端向量语义检索 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              浏览器端向量检索 (Vector RAG)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              通过纯 JavaScript 原生余弦相似度计算，模拟端侧 Embedding 知识匹配。
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 block">选择搜索语义意图：</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['react', 'css', 'ai'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setQueryCategory(cat)}
                  className={`py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-all ${
                    queryCategory === cat
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">语义匹配排序：</span>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium line-clamp-1">{item.text}</span>
                    <span className={`font-mono font-bold text-[11px] ${idx === 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {(item.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        idx === 0 ? 'bg-cyan-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.max(10, item.similarity * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
