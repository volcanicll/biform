# common-component

一套 API、两套 UI 的 React 表单组件库 —— 同一个 `<Input>` / `<Select>` / `<Switch>` / `<Checkbox>` / `<Form>`，在 PC 上渲染紧凑的下拉/网格布局，在移动端渲染底部弹出选择器/大触摸区/纵向堆叠，由**平台上下文自动切换**。

- 🎯 **一套 API，两套 UI**：headless 钩子写一次逻辑，PC / 移动两端表现层各自渲染，由 `usePlatform()` 分发。
- 🧠 **逻辑零重复**：每个组件拆为 `useXxx` 钩子（状态 + 键盘 + a11y）+ `pc/` + `mobile/` 表现层。
- 📱 **SSR 安全**：平台检测在服务端默认 PC，挂载后修正，`unstable` 门控避免 hydration 不匹配。
- 🎨 **零运行时 CSS**：CSS Modules + Less，单文件 `theme.css`，运行期主题靠 CSS 变量覆盖。
- 📦 **可发布**：Vite 库模式，ESM + CJS + `.d.ts`，`preserveModules` 支持 `common-component/select` 子路径按需引入。
- ♿ **可访问**：WAI-ARIA combobox/listbox/dialog、焦点陷阱、键盘导航、axe 校验。

## 技术栈

React 18 · TypeScript 5（strict）· Vite 6 · Less + CSS Modules · Storybook 8 · Vitest · @testing-library/react

## 快速开始

```bash
yarn install        # 使用 .npmrc 配置的 npmmirror 镜像
yarn dev            # 启动 Storybook（http://localhost:6006）
yarn test           # 运行单元测试
yarn build          # 构建库（dist/，ESM + CJS + d.ts）
yarn build:storybook# 构建静态文档站
yarn lint
```

## 架构：一套 API 两套 UI

每个组件遵循同样的四层结构（以 `select` 为例）：

```
src/components/select/
├── index.ts            # 公共导出 + 子路径入口
├── Select.tsx          # 自适应包装器：读 usePlatform()，分发到 pc/mobile
├── types.ts            # 统一 SelectProps + 平台命名空间 + 状态包类型
├── useSelect.ts        # HEADLESS 钩子：状态 + 键盘导航 + a11y（平台无关，唯一逻辑来源）
├── Select.stories.tsx
├── Select.test.tsx / useSelect.test.ts
├── pc/Select.tsx       # 消费状态包 → 下拉框
└── mobile/Select.tsx   # 消费同一状态包 → 底部弹出 sheet
```

**关键：包装器只跑一次钩子，再把「状态包」分发给对应平台的表现层。** PC 是锚定下拉 + 键盘导航 + `aria-activedescendant`；移动端是遮罩 + 底部 sheet + 焦点陷阱。逻辑（开关、高亮、选中、搜索过滤、aria 生成）只存在于 `useSelect` 里，两端共享。

### 平台解析

```tsx
import { PlatformProvider, ConfigProvider } from 'common-component';

// 自动检测（默认，断点 768px）
<PlatformProvider><App /></PlatformProvider>

// 强制平台
<PlatformProvider platform="mobile"><MobileApp /></PlatformProvider>

// 单组件逃生舱（无视上下文）
<Select platform="mobile" />
```

解析优先级：**组件 `platform` prop > Provider > 自动 media query**。

平台专属属性走命名空间，不会互相污染：

```tsx
<Select pc={{ maxHeight: 320 }} mobile={{ showDoneBar: true, title: '选择' }} />
```

## 用法

```tsx
import { Form, Input, Select, Switch, Checkbox } from 'common-component';
import 'common-component/theme.css';   // 引入一次样式

<Form initialValues={{ fruit: 'apple' }} onSubmit={(v) => console.log(v)}>
  <Form.Item name="email" label="邮箱" rules={[{ required: true }, { pattern: /@/, message: '邮箱格式不正确' }]}>
    <Input placeholder="you@example.com" />
  </Form.Item>
  <Form.Item name="fruit" label="喜好" rules={[{ required: true }]}>
    <Select options={[{ label: '苹果', value: 'apple' }, { label: '香蕉', value: 'banana' }]} />
  </Form.Item>
  <Form.Item name="agree" label="同意条款" rules={[{ required: true }]}>
    <Checkbox />
  </Form.Item>
  <button type="submit">提交</button>
</Form>
```

`Form.Item` 通过 `cloneElement` 把 `value`/`onChange`/`status`/`aria` 注入子控件；Switch/Checkbox 自动识别为 `checked`。校验是 0 依赖的同步实现（`required`/`min`/`max`/`pattern`/`validator`），不耦合 react-hook-form（见下方适配器）。

### 按需引入（子路径）

```ts
import { Select } from 'common-component/select';      // 只打包 select
import { PlatformProvider } from 'common-component/platform';
```

### 主题

运行期覆盖 CSS 变量即可瞬时换肤，无需重新构建：

```css
:root {
  --lib-color-primary: #7c3aed;
  --lib-radius-md: 10px;
}
```

构建期 token 在 `src/theme/variables.less`，运行期映射在 `src/theme/runtime.css`。

### 与 react-hook-form 适配（不内置依赖）

组件接受原生 `value`/`onChange`/`ref`/`status`，因此 RHF 的 `register()` 可直接展开：

```tsx
const { register, formState: { errors } } = useForm();
<Input {...register('email')} status={errors.email ? 'error' : 'default'} />
```

## 目录结构

```
src/
├── index.ts                 # 公共根入口
├── components/{input,select,switch,checkbox,form}/
├── core/
│   ├── platform/            # PlatformProvider, usePlatform, useMediaQuery
│   └── portal/              # Portal, PortalContext, Overlay（焦点陷阱/滚动锁/Esc/点外，双端复用）
├── hooks/                   # useControlled, useId, useForkRef, useLatest, useEventListener, useClickOutside, useFocusTrap, ...
├── theme/                   # variables.less, runtime.css, mixins.less
├── utils/                   # cx, omit, ssr, types
└── test/                    # setup (matchMedia/scrollIntoView polyfill), renderWithPlatform
```

## 测试

- **headless 钩子单元测试**：平台无关，快速验证逻辑（开关、键盘导航、受控/非受控、校验）。
- **组件测试**：`renderWithPlatform` 强制平台，断言 PC/移动两端渲染与交互。
- **Storybook 双视口**：`preview.tsx` 用真实 `<iframe>` 设备框（`MobileFrame`）渲染移动端 story——底部弹层 / 焦点陷阱 / 滚动锁通过 `PortalContext` 作用域到「设备」内，不再逃逸到画布；PC 端并排渲染。样式表从画布增量镜像，HMR 无闪烁。
- a11y 由 Storybook `addon-a11y`（axe）在每个 story 上校验。

## 路线图

- `useSyncExternalStore` 替换 `useMediaQuery` 的 `unstable` 门控（更严格的 SSR）。
- Select 多选、虚拟滚动（`pc.virtual`）。
- `ThemeProvider` / `ConfigProvider` 运行期主题注入组件（当前靠 CSS 变量覆盖）。
- 更多组件：Radio、DatePicker、Dialog、Drawer。
