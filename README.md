# Frontend Research Lab (前沿前端技术研究实验室)

基于 **React 19 + TypeScript + Tailwind CSS v4 + Vite** 构建的现代化前端前沿技术探索工作台。

## 🌟 包含的前沿研究模块

### 1. 🚀 React 19 新范式深度实验 (`React19Lab`)
- **`useActionState` 统一表单状态机**：脱离传统的 `try/catch/setLoading` 状态样板代码，体验原生 Action 调度。
- **带自动回滚的 `useOptimistic`**：模拟真实弱网与服务端接口报错（500）场景，测试乐观 UI 的无痕自动回滚。
- **`useTransition` 并发过滤**：在 6,000 级数据量搜索过滤下保持输入框 120 FPS 的顺畅交互。

### 2. 🤖 Web AI & 端侧智能交互 (`WebAILab`)
- **LLM 流式打字机状态机**：测量首字上屏时间（TTFT, Time To First Token）、动态生成速率（Tokens Per Second）与流式排版。
- **纯浏览器端向量语义检索 (Client Vector RAG)**：无须外部后端与 Python 服务，在浏览器主线程实现纯 JavaScript 余弦相似度计算与语义知识检索。

### 3. ⚡ 高性能 Canvas 物理粒子引力场 (`CanvasLab`)
- 原生 HTML5 Canvas 批量绘制吞吐量测试。
- 1,000 ~ 8,000 级物理粒子动力学模拟，支持鼠标引力汇聚与斥力扩散实时计算。
- 高分屏（DPI）适配与基于 `requestAnimationFrame` 的真实帧率（FPS）监控。

### 4. 📊 DOM 密集渲染性能基准 (`PerformanceBenchmarks`)
- 量化评估从 500 到 5,000 个复杂节点的 VDOM Diffing、Reconciliation 及浏览器真实的 Layout / Paint 耗时（精确至 0.01ms）。

### 5. 🎨 前沿 CSS 规范与现代动效 (`ModernCSSLab`)
- **View Transitions API 原生过渡**：免去繁重的外部 JS 动画库，浏览器核心层执行无级形态插值。
- **OKLCH 感知均匀色彩调谐器**：探索 W3C Color Level 4 规范在 P3 广色域下的感知一致性。
- **现代微交互与玻璃拟态**：Tailwind v4 零配置氧化引擎与现代设计系统。

### 6. 📡 现代浏览器底层 Web API (`WebAPIsLab`)
- 硬件逻辑核心（`navigator.hardwareConcurrency`）与网络探测。
- 跨标签页即时同步通信机制（`BroadcastChannel`）。
- 堆内存（JS Heap）占用指标监控。

---

## 🚀 本地开发与构建

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 编译与类型检查
pnpm build
```

---

## 🌐 自动化部署
本项目已配置 GitHub Actions 自动部署工作流（`.github/workflows/deploy.yml`），每次推送到 `main` 分支均会自动构建并发布至 GitHub Pages。
