import React, { useState, useTransition, useOptimistic } from 'react'
import { Sparkles, CheckCircle2, RefreshCw, Send, AlertCircle } from 'lucide-react'

interface Comment {
  id: string
  text: string
  sending?: boolean
}

export const React19Experiments: React.FC = () => {
  // 1. useTransition 演示
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'optimistic' | 'transition'>('optimistic')
  const [heavyData, setHeavyData] = useState<number[]>([])

  // 2. useOptimistic 演示
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', text: '探索 React 19 的新特性：Actions 与 useOptimistic' },
    { id: '2', text: 'Tailwind CSS v4 零配置启动速度极快！' },
  ])
  const [inputVal, setInputVal] = useState('')

  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (state, newCommentText: string) => [
      ...state,
      { id: Date.now().toString(), text: newCommentText, sending: true },
    ]
  )

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputVal.trim()) return

    const text = inputVal
    setInputVal('')

    // 乐观更新 UI
    setOptimisticComments(text)

    // 模拟服务端异步响应
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // 真实状态更新
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), text, sending: false },
    ])
  }

  const triggerHeavyCalculation = () => {
    startTransition(() => {
      // 模拟大计算量更新
      const arr: number[] = []
      for (let i = 0; i < 50000; i++) {
        arr.push(Math.sqrt(i * Math.random()))
      }
      setHeavyData(arr)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            React 19 核心特性实验
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            研究并验证 React 19 引入的 Actions 范式、乐观更新（useOptimistic）与并发并发过渡（useTransition）。
          </p>
        </div>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('optimistic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'optimistic'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            useOptimistic (乐观更新)
          </button>
          <button
            onClick={() => setActiveTab('transition')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'transition'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            useTransition (并发过渡)
          </button>
        </div>
      </div>

      {activeTab === 'optimistic' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧：表单提交 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">发表评论（模拟网络延迟 1.2s）</h3>
            <form onSubmit={handleSendComment} className="space-y-3">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="输入评论内容并回车..."
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" /> 发送
              </button>
            </form>

            <div className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
              <span className="text-indigo-400 font-semibold">机制解读：</span>
              点击发送时，页面立刻渲染带有虚线或淡色标记的“发送中”项，无须等待网络请求返回；网络成功后自动合入真实状态。
            </div>
          </div>

          {/* 右侧：列表视图 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center justify-between">
              <span>评论列表</span>
              <span className="text-xs text-slate-500">{optimisticComments.length} 条</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {optimisticComments.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg text-sm border flex items-center justify-between transition-all ${
                    item.sending
                      ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{item.text}</span>
                  {item.sending ? (
                    <span className="text-xs text-indigo-400 flex items-center gap-1 font-mono">
                      <RefreshCw className="w-3 h-3 animate-spin" /> 发送中...
                    </span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">50,000 条数据并发过渡</h3>
              <p className="text-xs text-slate-400 mt-1">
                利用 useTransition 保持主线程响应，输入框与按钮绝不卡死。
              </p>
            </div>
            <button
              onClick={triggerHeavyCalculation}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
              {isPending ? '正在计算中...' : '生成大计算量'}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>当前生成数组长度：<b className="text-white font-mono">{heavyData.length}</b> 个元素</span>
          </div>
        </div>
      )}
    </div>
  )
}
