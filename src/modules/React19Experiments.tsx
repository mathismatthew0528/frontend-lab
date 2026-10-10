import React, { useState, useTransition, useOptimistic, useActionState } from 'react'
import { Sparkles, RefreshCw, Send, CheckCircle2, Undo2 } from 'lucide-react'

// 1. 模拟 React 19 Server Action
async function updateUsernameAction(_previousState: { success: boolean; message: string; name: string }, formData: FormData) {
  const newName = formData.get('username') as string
  await new Promise((resolve) => setTimeout(resolve, 800)) // 模拟异步接口
  if (!newName || newName.length < 3) {
    return { success: false, message: '用户名至少需要 3 个字符！', name: '' }
  }
  return { success: true, message: `用户名已成功更新为: ${newName}`, name: newName }
}

interface MessageItem {
  id: string
  text: string
  status: 'sent' | 'pending' | 'failed'
}

export const React19Lab: React.FC = () => {
  const [subTab, setSubTab] = useState<'actionState' | 'optimisticRollback' | 'transition'>('actionState')

  // 1. useActionState (React 19 核心)
  const [actionState, formAction, isActionPending] = useActionState(updateUsernameAction, {
    success: true,
    message: '当前尚未修改',
    name: 'Explorer_User',
  })

  // 2. useOptimistic 带有失败自动回滚机制
  const [messages, setMessages] = useState<MessageItem[]>([
    { id: '1', text: '探索 React 19 Form Actions 统一规范', status: 'sent' },
    { id: '2', text: '测试高并发过渡状态下的 UI 响应', status: 'sent' },
  ])
  const [msgInput, setMsgInput] = useState('')
  const [shouldSimulateFail, setShouldSimulateFail] = useState(false)

  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (current: MessageItem[], update: { text: string; id: string }): MessageItem[] => [
      ...current,
      { id: update.id, text: update.text, status: 'pending' as const },
    ]
  )

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msgInput.trim()) return

    const tempId = Date.now().toString()
    const content = msgInput
    setMsgInput('')

    // 乐观更新
    setOptimisticMessages({ text: content, id: tempId })

    // 模拟服务端响应
    await new Promise((r) => setTimeout(r, 1000))

    if (shouldSimulateFail) {
      // 模拟请求失败：不向真实状态追加，乐观状态会自动回滚清除
      alert('模拟服务端接口 500 异常！触发 useOptimistic 自动回滚。')
    } else {
      // 成功合入
      setMessages((prev) => [...prev, { id: tempId, text: content, status: 'sent' }])
    }
  }

  // 3. useTransition 密集过滤对比
  const [isPending, startTransition] = useTransition()
  const [searchFilter, setSearchFilter] = useState('')
  const [deferredFilter, setDeferredFilter] = useState('')

  const allItems = Array.from({ length: 6000 }, (_, i) => `前端架构实验项目 #${i + 1} - React 19 并发调度测试数据条目`)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchFilter(val) // 高优先级：即时响应打字输入
    startTransition(() => {
      setDeferredFilter(val) // 低优先级：允许被中断的重计算
    })
  }

  const filteredItems = allItems.filter((item) =>
    deferredFilter ? item.toLowerCase().includes(deferredFilter.toLowerCase()) : false
  ).slice(0, 50)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            React 19 新范式深度实验
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            研究 React 19 正式推出的 <code>useActionState</code>、带失败回滚的 <code>useOptimistic</code> 以及非阻塞并发调度。
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('actionState')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              subTab === 'actionState' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            useActionState
          </button>
          <button
            onClick={() => setSubTab('optimisticRollback')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              subTab === 'optimisticRollback' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            useOptimistic (含回滚)
          </button>
          <button
            onClick={() => setSubTab('transition')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              subTab === 'transition' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            useTransition
          </button>
        </div>
      </div>

      {subTab === 'actionState' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-200">原生 Form Actions 状态机</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              无需手动维护 <code>isLoading</code>、<code>error</code>，React 19 通过 <code>useActionState</code> 自动管理表单提交状态与返回值。
            </p>

            <form action={formAction} className="space-y-4 pt-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">修改用户名：</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={actionState.name}
                  placeholder="输入新用户名（至少3字符）"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isActionPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
              >
                {isActionPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> 处理中...
                  </>
                ) : (
                  '提交更新 (Server Action)'
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Action 状态监听控制台</h3>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-500">isPending:</span>
                  <span className={isActionPending ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {String(isActionPending)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-500">actionState.success:</span>
                  <span className={actionState.success ? 'text-emerald-400' : 'text-rose-400'}>
                    {String(actionState.success)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-500">当前名称:</span>
                  <span className="text-indigo-300">{actionState.name || '未设置'}</span>
                </div>
                <div className="pt-1 text-slate-400">
                  <span className="text-slate-500">返回信息: </span>
                  <span className={actionState.success ? 'text-emerald-300' : 'text-rose-300'}>
                    {actionState.message}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300/80">
              💡 核心演进：消除了在组件中大量编写 <code>try/catch/setLoading(false)</code> 的样板代码。
            </div>
          </div>
        </div>
      )}

      {subTab === 'optimisticRollback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">消息发送与容错实验</h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={shouldSimulateFail}
                  onChange={(e) => setShouldSimulateFail(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                模拟接口报错 (500)
              </label>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="输入新消息并发送..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
              >
                <Send className="w-4 h-4" /> 乐观推送消息
              </button>
            </form>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="text-indigo-400 font-semibold flex items-center gap-1">
                <Undo2 className="w-3.5 h-3.5" /> 自动回滚机制：
              </div>
              <p>勾选右上角“模拟接口报错”，发送后将在 1 秒后模拟服务端拒绝。观察列表中的临时项如何无缝消失，恢复真实数据一致性。</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-200">消息队列视图</h3>
                <span className="text-xs font-mono text-slate-500">{optimisticMessages.length} 项</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {optimisticMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border text-sm flex items-center justify-between transition-all ${
                      m.status === 'pending'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 animate-pulse'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <span>{m.text}</span>
                    {m.status === 'pending' ? (
                      <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> 等待 ACK
                      </span>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'transition' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">6,000 节点非阻塞搜索过滤</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                输入时输入框保持 120 FPS 响应，列表的计算与渲染交给并发后台过渡。
              </p>
            </div>
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-medium animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 并发切片计算中...
              </span>
            )}
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={handleSearchChange}
            placeholder="输入关键词（如 '34', '500'）体验丝滑打字输入..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
          />

          <div className="max-h-56 overflow-y-auto bg-slate-950 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-600">
                {deferredFilter ? '未匹配到结果' : '输入关键词以实时过滤 6,000 条条目...'}
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-900/60 text-xs text-slate-400 font-mono flex items-center justify-between">
                  <span>{item}</span>
                  <span className="text-[10px] text-slate-600">Chunk #{idx + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
