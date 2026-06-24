# Changelog

本项目所有重要变更记录于此文件。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 性能

- **`useClickOutside` 不再每次渲染重订阅**：`refs` 移入 ref 在事件时读取，订阅仅依赖 `[active, doc]`。此前 `Overlay` 传入的内联 `[...outsideRefs, contentRef]` 数组每次渲染都是新引用，导致 `mousedown`/`touchstart` 监听器每次渲染都被卸载重挂。
- **`useSelect` 的 `refs` 稳定化**：此前 `refs: { trigger, listbox }` 每次渲染都是新对象，使 PC Select 的 `[open, refs]` 定位 effect 在弹层打开期间每次渲染都重跑（每次按键 / 悬停 / 属性变更都触发 `getBoundingClientRect` + `setState`）。改为 `useMemo` 稳定引用。同时移除从未被读取的死代码 `optionsRef`。
- **Form 上下文不再每次渲染失效**：`useFormState` 返回值每次渲染都是新对象，原 `contextValue = useMemo(..., [formState, layout])` 失效 → `FormItem` 的注册 effect `[ctx, name, rules]` 每次按键都重跑（反复 unregister/register）。改为依赖各个稳定成员（setter 均为 `useCallback`），注册只在挂载/卸载或 `name`/`rules` 变更时发生。

### 新增

- **`PortalContext`（`core/portal`）**：声明 portal 渲染目标 `{ doc, container }`，默认主 `document` / `document.body`。`Portal` 优先写入上下文容器，`Overlay` 及 `useScrollLock` / `useEscapeKey` / `useClickOutside` / `useFocusTrap` 均新增 `doc` 入参，把滚动锁、Esc、点外、焦点陷阱作用域到指定文档。
- **`useLatest`（`hooks`）**：统一「把最新值/回调放进 ref、在事件时读取」的模式，含 4 个单测。`useEscapeKey` / `useClickOutside` / `useEventListener` / `useSelect` 已改用它，删除了重复的 ref 同步样板。
- **Storybook iframe 设备框 `MobileFrame`**：用真实 `<iframe>` 模拟手机，把移动端 story 渲染进隔离文档，确保底部弹层 / 焦点陷阱 / 滚动锁作用域在「设备」内、不再逃逸到外层画布；样式表从画布增量镜像（按签名去重，HMR 不再整片重建、无闪烁）。

### 变更

- `.storybook/preview.tsx`：双视口装饰器改用 `MobileFrame`（iframe 真机）+ PC 卡片，新增画布背景与标题说明。

### 文档

- 新增 `CHANGELOG.md`；`README.md` 补充 `useLatest` / `PortalContext` 与 Storybook iframe 设备框说明。
- 开源化：新增 `LICENSE`（MIT）、`CONTRIBUTING.md`、GitHub Actions CI（lint / test / build）；`README.md` 增加英文简介、徽章与 License 段；`package.json` 补全 `license` / `author` / `repository` / `keywords` / `engines` 等元信息。

## [0.1.0] - 2026-06-14

### 新增

- 初始化 common-component：一套 API 两套 UI 的 React 表单组件库（PC + 移动端）。
- 组件：`Form` / `Input` / `Select` / `Switch` / `Checkbox`，均按「headless 钩子 + `pc/` + `mobile/` 表现层」四层拆分。
- 平台解析：`PlatformProvider` + `usePlatform`，SSR 安全的 `unstable` 门控；组件级 `platform` prop 逃生舱。
- portal 基元：`Portal` / `Overlay`（焦点陷阱 / 滚动锁 / Esc / 点外，双端复用）。
- hooks：`useControlled` / `useId` / `useForkRef` / `useEventListener` / `useClickOutside` / `useEscapeKey` / `useScrollLock` / `useFocusTrap`。
- 构建：Vite 库模式（ESM + CJS + `.d.ts`，`preserveModules` 支持子路径按需引入）；Storybook 8 + Vitest + @testing-library/react。
