# 🔍 PVZ.GUAGLE.COM 白屏问题诊断

## 问题发现

pvz.guagle.com 和 cleven.guagle.com/klf/ **指向同一个 GitHub 仓库**！

### 证据
1. DNS 解析到 GitHub Pages IP: `185.199.108.153`
2. vite.config.ts 完全相同 (base: '/klf/')
3. package.json 完全相同
4. README.md 完全相同

## 根本原因

GitHub Pages 当前配置问题：
- **当前状态**: 从 `main` 分支的根目录提供服务
- **问题**: main 分支包含开发版本的 index.html (加载 /src/main.tsx)
- **需要**: 从 `gh-pages` 分支提供服务 (包含构建后的文件)

## 解决方案

### 步骤 1: 配置 GitHub Pages 源

访问: https://github.com/gvgle/klf/settings/pages

在 "Build and deployment" 部分:
1. **Source**: 选择 "Deploy from a branch"
2. **Branch**: 选择 `gh-pages` (不是 main)
3. **Folder**: 选择 `/ (root)`
4. 点击 "Save"

### 步骤 2: 配置自定义域名

在同一页面的 "Custom domain" 部分:

**选项 A: 使用单个域名**
- 输入: `pvz.guagle.com`
- 或输入: `cleven.guagle.com`
- 点击 "Save"

**选项 B: 移除自定义域名**
- 留空或点击 "Remove"
- 使用默认 URL: https://gvgle.github.io/klf/

### 步骤 3: 等待生效

- GitHub Pages 需要 1-5 分钟重新部署
- DNS 缓存可能需要额外时间
- 使用 Ctrl+Shift+R 强制刷新浏览器

## 验证

部署完成后，以下 URL 应该都能正常工作：

```bash
# 测试 GitHub Pages 默认 URL
curl -I https://gvgle.github.io/klf/

# 测试自定义域名
curl -I https://pvz.guagle.com/
curl -I http://cleven.guagle.com/klf/

# 检查资源文件
curl -I https://gvgle.github.io/klf/assets/index--q1qLVSr.js
```

## 当前文件结构

### main 分支 (开发版本)
```
klf/
├── index.html          # ❌ 开发版本 (加载 /src/main.tsx)
├── src/
│   ├── App.tsx
│   ├── GameCanvas.tsx
│   └── main.tsx
├── vite.config.ts
└── package.json
```

### gh-pages 分支 (生产版本) ✅
```
klf/
├── index.html          # ✅ 生产版本 (加载 /klf/assets/...)
└── assets/
    ├── index--q1qLVSr.js
    └── index-VJNXyj2h.css
```

## 快速修复命令

如果需要重新部署 gh-pages 分支：

```bash
cd /home/cleven/klf
npm run deploy
```

这会：
1. 运行 `npm run build` 构建生产版本
2. 使用 `gh-pages -d dist` 推送到 gh-pages 分支

## 总结

**问题**: GitHub Pages 配置错误，从 main 分支提供服务
**解决**: 在 GitHub 设置中将源改为 gh-pages 分支
**预计时间**: 2 分钟配置 + 1-5 分钟生效

---

**更新时间**: 2026-02-25 22:30
**状态**: 等待 GitHub Pages 配置更改
