# 贡献指南 / Contributing

感谢你对本项目的兴趣！欢迎提交 Issue 和 Pull Request。

## 开发环境

需要 Node >= 18（推荐 20+），包管理使用 yarn。

```bash
yarn install        # .npmrc 已配置 npmmirror 镜像
yarn dev            # 启动 Storybook（http://localhost:6006）
yarn test           # 单元测试（Vitest）
yarn build          # 构建库（dist/，ESM + CJS + d.ts）
yarn lint           # ESLint
yarn format         # Prettier 格式化
```

## 项目结构

每个组件遵循「headless 钩子 + `pc/` + `mobile/`」四层拆分（详见 README）。新增组件请保持这一约定：

- 逻辑（开关、高亮、选中、键盘导航、aria 生成）**只写在 `useXxx` 钩子里**；
- 两端表现层各自消费同一个「状态包」，互不耦合；
- 平台差异通过 `usePlatform()` 分发，不要在钩子里写平台分支。

## 提交 Pull Request 前

1. `yarn lint`、`yarn test`、`yarn build` 全部通过（CI 也会校验）。
2. 为新逻辑补充单元测试，优先测平台无关的 headless 钩子。
3. 若改动了用户可见行为，更新 `CHANGELOG.md` 的 `[Unreleased]` 段。
4. 同步更新 Storybook story（含 `addon-a11y` axe 校验）。

## 提交信息约定

遵循 [Conventional Commits](https://www.conventionalcommits.org/)，便于自动生成变更日志：

```
feat(select): 支持多选
fix(form): 校验未触发
perf(hooks): 复用 useLatest
docs: 补充 README
refactor / test / chore
```

## 分支模型

- `main`：始终稳定、可发布。
- `feat/*`、`fix/*`、`optimize/*`：开发分支，完成后合并回 `main`。

## 行为准则

请保持友善与尊重，围绕技术本身讨论。对事不对人。
