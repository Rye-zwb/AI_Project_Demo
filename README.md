# 平行旅人 · Parallel Traveler

> 不是即时聊天，而是异步陪伴。在各自的生活里，发现与好友的默契瞬间。

![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178c6?logo=typescript)
![uni-app](https://img.shields.io/badge/uni--app-4.84-25c2a0)
![Vite](https://img.shields.io/badge/Vite-5.2-646cff?logo=vite)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 项目简介

**平行旅人** 是一款基于 uni-app + Vue 3 开发的轻量社交 Demo，专为忙碌的年轻人设计。它不追求即时消息，而是通过"每日快照 + 同步任务 + 回忆时间轴"的方式，帮助你与好友在各自的生活节奏中发现默契，构建更有温度的羁绊。

### 核心理念

- **异步陪伴**：不用秒回，想分享的时候就分享
- **默契发现**：AI 自动发现你和好友在同一天提到的相似事物、相同的情绪
- **任务驱动**：同步任务让两人在不同地方做同一件事，用共同体验创造回忆
- **手账风格**：温暖的米色主色调，时间轴式的内容呈现

---

## 功能模块

| 模块 | 说明 | 对应页面 |
|------|------|---------|
| 🏠 首页 | 展示当前羁绊、今日任务、即将到来的纪念日 | [index](src/pages/index/index.vue) |
| 💝 羁绊管理 | 创建/查看与好友的羁绊关系 | [bond](src/pages/bond/bond.vue) · [bond-confirm](src/pages/bond-confirm/bond-confirm.vue) |
| 📸 羁绊空间 | 发布每日快照（文字 + 图片），查看好友动态 | [posts](src/posts/posts.vue) · [post-create](src/pages/post-create/post-create.vue) |
| ✨ 默契发现 | AI 自动匹配同日的关键词、情绪、主题重合 | [coincidence](src/pages/coincidence/coincidence.vue) |
| 🎯 同步任务 | 5 种任务类型（拍照/文字/语音/创意/探索），随机任务弹框 | [tasks](src/pages/tasks/tasks.vue) · [task-preferences](src/pages/task-preferences/task-preferences.vue) |
| 📜 回忆时间轴 | 里程碑、默契瞬间、共同任务按时间线串联 | [bond-archive](src/pages/bond-archive/bond-archive.vue) |
| 📅 纪念日系统 | 相识日、自定义纪念日，自动提醒即将到来 | [bond-archive](src/pages/bond-archive/bond-archive.vue) |
| 🏆 成就徽章 | 追踪互动里程碑，解锁隐藏成就 | [achievements](src/pages/achievements/achievements.vue) |
| 🎬 Vlog 周报 | 自动汇总本周动态生成周回顾 | [vlog](src/pages/vlog/vlog.vue) |
| 👤 名片中心 | 个人信息、好友印象查看与编辑 | [profile](src/pages/profile/profile.vue) · [edit-profile](src/pages/edit-profile/edit-profile.vue) |

---

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [uni-app](https://uniapp.dcloud.net.cn/) 4.84 · Vue 3.4 |
| **语言** | TypeScript 4.9 |
| **构建** | Vite 5.2 |
| **样式** | SCSS · [手账风格] 温暖米色调 |
| **路由** | hash 模式（兼容静态托管） |
| **数据** | LocalStorage Mock（`uni.setStorageSync`） |
| **平台** | H5 · 可扩展至微信小程序、App 等 |

---

## 快速开始

### 环境要求

- **Node.js** ≥ 16
- **npm** ≥ 8

### 安装依赖

```bash
cd parallel-traveler
npm install
```

### 本地开发（H5 模式）

```bash
npm run dev:h5
```

启动后访问 [http://localhost:5173](http://localhost:5173)。

首次启动会自动注入 Mock 数据（3 个 Demo 用户 + 预设羁绊 + 示例帖子），你可以直接体验完整流程。

### 生产构建

```bash
npm run build:h5
```

构建产物输出到 `dist/build/h5/` 目录，可直接部署到任意静态资源托管服务。

### 类型检查

```bash
npm run type-check
```

---

## 目录结构

```
parallel-traveler/
├── src/
│   ├── App.vue                     # 应用入口（初始化 Mock 数据）
│   ├── main.ts                     # 应用挂载
│   ├── manifest.json               # uni-app 配置（含 H5 路由设置）
│   ├── pages.json                  # 页面路由 + TabBar 配置
│   ├── types/
│   │   └── index.ts                # 全局 TypeScript 类型定义
│   ├── utils/
│   │   └── mockData.ts             # Mock 数据管理（CRUD + 默契发现算法）
│   ├── styles/
│   │   ├── global.scss             # 全局手账风格样式
│   │   └── variables.scss          # 颜色/字号/间距设计变量
│   ├── pages/
│   │   ├── index/                  # 首页
│   │   ├── profile/                # 个人名片
│   │   ├── edit-profile/           # 编辑资料 + 好友印象
│   │   ├── bond/                   # 我的羁绊列表
│   │   ├── bond-confirm/           # 建立羁绊
│   │   ├── bond-archive/           # 羁绊档案（时间轴 + 纪念日）
│   │   ├── tasks/                  # 同步任务列表 + 随机任务弹框
│   │   ├── task-preferences/       # 任务偏好设置
│   │   ├── post-create/            # 发布动态
│   │   ├── coincidence/            # 默契发现
│   │   ├── vlog/                   # 周 Vlog 回顾
│   │   └── achievements/           # 成就徽章
│   ├── posts/
│   │   └── posts.vue               # 羁绊空间（动态列表）
│   └── static/
│       ├── avatars/                # 头像 SVG
│       ├── posts/                  # 帖子配图 SVG
│       └── tabbar/                 # 底部导航图标
├── dist/build/h5/                  # H5 构建产物
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 核心实现

### 1. 默契发现算法

位于 [mockData.ts](src/utils/mockData.ts) 中 `findCoincidences` 函数，三层匹配：

```
关键词匹配 → 情绪共振 → 图片主题关联
  (麦当劳/咖啡/火锅)    (开心/疲惫)     (天空/美食/宠物/自然)
        ↓                   ↓               ↓
        └──────────────  同日发生 →  标记为默契瞬间  ──────────────┘
```

### 2. 任务系统

- **5 种任务类型**：拍照、文字、语音、创意、探索
- **每日固定任务** + **随机任务弹框**（3 选 1，每次刷新不同）
- **偏好配置**：用户可设置喜欢的任务类型、难度、推送频率
- **任务偏好页面**：带实时预览，切换偏好立即看到影响

### 3. 回忆时间轴

[羁绊档案页](src/pages/bond-archive/bond-archive.vue) 将三类事件统一成时间线：

- 🏆 **里程碑**：系统生成（如"羁绊建立日"）+ 用户自定义
- ✨ **默契瞬间**：由 AI 发现的同日重合内容
- ✅ **共同任务**：两人一起完成的任务
- 💝 **纪念日**：自定义 + 年度重复提醒

时间轴自动按日期倒序排列，支持随时添加新的纪念日。

### 4. Mock 数据层

所有数据通过 `uni.setStorageSync` 存储在浏览器本地，无需后端即可完整体验。提供以下管理函数：

| 功能 | 函数 |
|------|------|
| 用户 CRUD | `getCurrentUser`, `getAllUsers` |
| 羁绊关系 | `getUserBonds`, `getBondById`, `getBondFriend` |
| 帖子/动态 | `getPosts`, `addPost`, `deletePost` |
| 任务 | `getTasks`, `completeTask`, `getRandomTasks` |
| 纪念日 | `addAnniversary`, `deleteAnniversary`, `getUpcomingAnniversaries` |
| 里程碑 | `addMilestone` |
| 默契发现 | `findCoincidences` |
| 好友印象 | `getUserImpressions`, `setImpression` |

> 💡 清空浏览器本地存储（`localStorage.clear()`）即可重置为初始状态，`App.vue` 启动时会重新注入演示数据。

---

## 页面路由

[pages.json](src/pages.json) 配置了 12 个页面和 4 个 Tab 导航入口：

```
首页 (#/) → 羁绊空间 → 任务 → 我的
```

**路由模式**：`hash`（通过 `manifest.json` 中的 `h5.router.mode` 配置），兼容任意静态托管服务，无需服务端 rewrite 规则。

---

## 部署指南

构建产物位于 [dist/build/h5/](dist/build/h5/)，包含：

```
h5/
├── index.html          ← 入口文件
├── assets/            ← 编译后的 JS / CSS（相对路径引用）
└── static/            ← 静态资源（SVG 头像、帖子图片、Tab 图标）
```

### 方式一：腾讯云静态资源托管（推荐）

1. **登录控制台**：腾讯云 → 对象存储（COS）→ 创建存储桶
2. **开启静态网站**：存储桶 → 基础配置 → 静态网站
   - 索引文档：`index.html`
   - 错误文档：`index.html`（hash 路由推荐，避免刷新 404）
3. **上传文件**：将 `dist/build/h5/` 目录下的**所有文件和文件夹**上传到存储桶根目录
4. **测试访问**：使用存储桶默认域名或绑定的自定义域名访问

### 方式二：Nginx 部署

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/build/h5;
    index index.html;

    # hash 路由无需额外 rewrite，所有路径都回落到 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /static/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /assets/ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

### 方式三：任意静态平台

- **Vercel / Netlify**：直接拖拽 `dist/build/h5/` 上传
- **GitHub Pages / Gitee Pages**：将 `h5/` 目录内容推送到 `gh-pages` 分支
- **uniCloud 前端网页托管**：uni-app 官方推荐方案，免费高速

---

## 可扩展方向

- [ ] **真正的后端接入**：将 Mock 数据替换为 RESTful API 或云函数
- [ ] **用户注册与登录**：接入第三方登录（微信 / QQ / 手机号）
- [ ] **图片上传 OSS**：当前帖子图片使用本地 SVG Mock，接入真实上传接口
- [ ] **真实 AI 默契分析**：接入大模型 API（如豆包、通义千问）做语义级相似度匹配
- [ ] **PWA 支持**：添加 Service Worker 实现离线可访问
- [ ] **多端编译**：uni-app 原生支持 → 微信小程序 / App / 支付宝小程序

---

## 常见问题

### Q: 页面刷新后数据还在吗？
A: 在的。所有数据保存在浏览器 LocalStorage 中，刷新不丢失。清空浏览器缓存或在开发者工具中执行 `localStorage.clear()` 即可重置。

### Q: 为什么 H5 部署后图片不显示？
A: 检查 `manifest.json` 中 `h5.router.base` 是否设为 `"./"`（当前已配置）。若部署在子路径（如 `https://domain.com/app/`），需要将 base 改为 `"./"` 或对应的子路径。

### Q: 如何添加新的页面？
A: 在 `src/pages/` 下创建页面目录和 `.vue` 文件，然后在 `pages.json` 的 `pages` 数组中添加路由配置即可。

### Q: Sass 警告 `@import rules are deprecated` 需要处理吗？
A: 不影响构建与运行。这是 Dart Sass 3.0 的弃用提示，当前使用的 Sass 1.x 完全兼容。如需消除警告，可将各 `.vue` 文件中的 `@import '../../styles/variables.scss'` 改为 `@use` 语法。

---

## License

MIT License — 欢迎自由使用、修改、二次创作。

---

<div align="center">
  <sub>在各自的生活里，发现彼此的默契 🌿</sub>
</div>
