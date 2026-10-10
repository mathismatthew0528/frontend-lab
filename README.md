# Frontend Lab (前端开发研究实验室)

基于 **React 19 + TypeScript + Tailwind CSS v4 + Vite** 构建的现代化前端技术实验工作台。

## 项目定位与研究模块

本项目专为前端前沿特性、渲染性能量化及架构模式探索而设计，内置以下实验模块：

1. **React 19 核心特性实验 (`/src/modules/React19Experiments.tsx`)**
   - 乐观 UI 更新范式（`useOptimistic`）
   - 非阻塞并发状态过渡（`useTransition`）
   - Actions 异步调用状态管理与用户交互反馈

2. **DOM 密集渲染性能基准 (`/src/modules/PerformanceBenchmarks.tsx`)**
   - 量化测试 500 ~ 5,000 个高频节点下的 VDOM Diffing、Reconciliation 与真实重排/重绘（Layout & Paint）耗时
   - 基于 `performance.now()` 与 `requestAnimationFrame` 的双帧延迟测量

3. **Tailwind CSS v4 与现代设计系统 (`/src/modules/DesignSystemLab.tsx`)**
   - 极速编译引擎与零繁琐配置验证
   - 玻璃拟态（Glassmorphism）、微光边框（Glow borders）与动态 Design Tokens 切换

4. **现代浏览器底层 API 探查 (`/src/modules/WebAPIsLab.tsx`)**
   - 硬件逻辑核心（`navigator.hardwareConcurrency`）探测
   - 跨标签页即时同步通信机制（`BroadcastChannel`）
   - 堆内存（JS Heap）占用指标监控

---

## 常用开发命令

```bash
# 启动本地开发热更新服务器
pnpm dev

# 类型检查与生产打包构建
pnpm build

# 本地预览打包产物
pnpm preview

# 代码代码风格检查
pnpm lint
```
