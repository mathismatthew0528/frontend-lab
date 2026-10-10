import React, { useState, useEffect } from 'react'
import { Terminal, Cpu, Globe, BatteryCharging, Radio } from 'lucide-react'

export const WebAPIsLab: React.FC = () => {
  const [hardwareConcurrency, setHardwareConcurrency] = useState<number>(0)
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true)
  const [memoryInfo, setMemoryInfo] = useState<string>('Not supported')
  const [channelMessage, setChannelMessage] = useState<string>('')
  const [receivedMessages, setReceivedMessages] = useState<string[]>([])

  useEffect(() => {
    // 1. 硬件并发数
    setHardwareConcurrency(navigator.hardwareConcurrency || 4)

    // 2. 网络在线状态
    setOnlineStatus(navigator.onLine)
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 3. 性能内存（Chrome 私有 API 探测）
    // @ts-expect-error performance.memory is Chrome specific
    if (performance.memory) {
      // @ts-expect-error performance.memory is Chrome specific
      const mem = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)
      setMemoryInfo(`${mem} MB`)
    }

    // 4. BroadcastChannel 跨标签页即时通讯
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel('frontend_lab_channel')
      bc.onmessage = (event) => {
        setReceivedMessages((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 收到: ${event.data}`,
        ])
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported', e)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (bc) bc.close()
    }
  }, [])

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!channelMessage.trim()) return

    try {
      const bc = new BroadcastChannel('frontend_lab_channel')
      bc.postMessage(channelMessage)
      setReceivedMessages((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 发送: ${channelMessage}`,
      ])
      setChannelMessage('')
      bc.close()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          浏览器底层与现代 Web API 实验
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          实时探查浏览器环境属性、硬件线程、堆内存开销，并测试多 Tab 页面间的无刷新广播同步通信（BroadcastChannel）。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">CPU 逻辑核心数</div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              {hardwareConcurrency} Cores
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">网络连接状态</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {onlineStatus ? 'Online (在线)' : 'Offline (离线)'}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">JS 堆内存占用</div>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              {memoryInfo}
            </div>
          </div>
        </div>
      </div>

      {/* BroadcastChannel 实验 */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            跨浏览器标签页通信 (BroadcastChannel)
          </h3>
          <span className="text-xs text-slate-500">尝试在多个窗口打开此页面并发送</span>
        </div>

        <form onSubmit={handleSendBroadcast} className="flex gap-2">
          <input
            type="text"
            value={channelMessage}
            onChange={(e) => setChannelMessage(e.target.value)}
            placeholder="输入广播消息，并在另一个标签页观察..."
            className="flex-1 px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            广播
          </button>
        </form>

        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80 max-h-36 overflow-y-auto space-y-1 font-mono text-xs">
          {receivedMessages.length === 0 ? (
            <div className="text-slate-600">暂无广播记录...</div>
          ) : (
            receivedMessages.map((msg, i) => (
              <div key={i} className="text-cyan-300">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
