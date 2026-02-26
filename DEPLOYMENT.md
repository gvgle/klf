# GitHub Pages 部署说明

## 部署状态

✅ **gh-pages 分支已创建并推送到 GitHub**

构建文件已成功部署到 `gh-pages` 分支。

## GitHub Pages 配置

需要在 GitHub 仓库设置中配置 Pages：

1. 访问: https://github.com/gvgle/klf/settings/pages
2. 在 "Source" 下选择:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. 点击 "Save"

## 部署命令

```bash
# 构建并部署到 gh-pages
npm run deploy

# 或者手动步骤
npm run build
npx gh-pages -d dist
```

## 访问地址

部署完成后，网站将在以下地址可用：
- https://gvgle.github.io/klf/
- http://cleven.guagle.com/klf/ (如果配置了自定义域名)

## 注意事项

1. **首次部署**: GitHub Pages 可能需要 1-5 分钟才能生效
2. **缓存**: 浏览器可能缓存旧版本，使用 Ctrl+Shift+R 强制刷新
3. **base 路径**: vite.config.ts 中已配置 `base: '/klf/'`

## 文件结构

```
gh-pages 分支:
├── index.html          # 入口文件
├── assets/
│   ├── index-*.js     # 打包的 JavaScript
│   └── index-*.css    # 打包的 CSS
└── (其他静态资源)
```

## 验证部署

```bash
# 检查 gh-pages 分支
git checkout gh-pages
cat index.html

# 切回 main 分支
git checkout main
```

## 故障排除

如果网站显示白屏：
1. 检查浏览器控制台是否有 404 错误
2. 确认 GitHub Pages 设置正确
3. 等待几分钟让 GitHub Pages 更新
4. 清除浏览器缓存
