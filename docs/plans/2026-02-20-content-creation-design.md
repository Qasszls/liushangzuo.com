# 内容创作设计方案

**日期**: 2026-02-20
**目标**: 为个人网站创建真实的文章内容和高清配图，解决首页单调问题

## 概述

创建 6 篇文艺散文风格的博客文章（北京秋天 3 篇 + 黑龙江冬天 3 篇），每篇配封面图和文内插图，同时更新摄影作品页。清空所有占位内容。

## 文章规划

### 北京秋天系列（3 篇）

| # | 标题 | 切入角度 | 关键意象 |
|---|------|----------|----------|
| 1 | 故宫红墙与银杏 | 紫禁城的秋色层叠 | 红墙、银杏、琉璃瓦上的落叶 |
| 2 | 胡同里的秋光 | 老北京巷弄的日常秋意 | 四合院、柿子树、老槐树、斜阳 |
| 3 | 西山的最后一抹红 | 香山/西山的深秋尾声 | 红叶、山径、薄雾、远眺城市天际线 |

### 黑龙江冬天系列（3 篇）

| # | 标题 | 切入角度 | 关键意象 |
|---|------|----------|----------|
| 1 | 松花江上的冰与雪 | 哈尔滨的冬日江面 | 冰封的江面、雾凇、防洪纪念塔 |
| 2 | 雪乡的夜与炊烟 | 雪乡/雪谷的极致冬景 | 雪蘑菇、红灯笼、炊烟、木屋 |
| 3 | 北境的白桦林 | 大兴安岭/漠河的极寒之美 | 白桦树、冰雾、星空、-40度的呼吸 |

### 写作规范

- **风格**: 文艺散文，注重意境和修辞
- **字数**: 每篇 600-800 字
- **标签**: `随笔` + `旅行` + 季节标签（`秋天` 或 `冬天`）
- **Front Matter**: 按 CLAUDE.md 规范，包含 title、description、date、tags、cover、featured、readingTime

## 图片规划

### 配置方案

| 图片类型 | 数量/篇 | 尺寸 | 用途 |
|---------|---------|------|------|
| 封面图 | 1 | 1200x800 | 列表卡片 + 详情页顶部 |
| 文内插图 | 2 | 1200x800 | 正文中穿插 |

**总计**: 6 封面 + 12 插图 = 18 张图片

### 搜索关键词

| 文章 | 搜索关键词 |
|------|-----------|
| 故宫银杏 | `beijing forbidden city autumn`, `ginkgo red wall china` |
| 胡同秋光 | `beijing hutong autumn`, `old beijing alley autumn` |
| 西山红叶 | `fragrant hills beijing red leaves`, `china autumn mountain` |
| 松花江 | `harbin songhua river winter`, `harbin ice snow` |
| 雪乡 | `china snow village`, `chinese winter village lantern` |
| 白桦林 | `birch forest winter snow`, `northeast china winter forest` |

### 来源平台

- Unsplash (unsplash.com)
- Pexels (pexels.com)
- Pixabay (pixabay.com)

### 文件组织

```
public/images/
  blog/
    beijing-autumn-gugong-cover.jpg
    beijing-autumn-gugong-1.jpg
    beijing-autumn-gugong-2.jpg
    beijing-autumn-hutong-cover.jpg
    beijing-autumn-hutong-1.jpg
    beijing-autumn-hutong-2.jpg
    beijing-autumn-xishan-cover.jpg
    beijing-autumn-xishan-1.jpg
    beijing-autumn-xishan-2.jpg
    hlj-winter-songhua-cover.jpg
    hlj-winter-songhua-1.jpg
    hlj-winter-songhua-2.jpg
    hlj-winter-xuexiang-cover.jpg
    hlj-winter-xuexiang-1.jpg
    hlj-winter-xuexiang-2.jpg
    hlj-winter-birch-cover.jpg
    hlj-winter-birch-1.jpg
    hlj-winter-birch-2.jpg
  works/
    autumn-gugong-ginkgo.jpg
    autumn-hutong-alley.jpg
    autumn-xishan-redleaves.jpg
    winter-songhua-river.jpg
    winter-xuexiang-night.jpg
    winter-birch-forest.jpg
```

## Works 摄影作品

从下载的图片中选 6 张最佳的作为摄影作品条目，附虚构的合理相机参数。

## 清理工作

- 删除 `content/blog/` 下所有旧文章（hello-world、reading-notes、winter-thoughts）
- 删除 `content/works/` 下所有旧作品（mountain-sunrise、old-street、tokyo-night）
- 删除 `public/images/placeholder.svg`

## 任务拆分

```
任务 A：图片搜索与下载
├── 从 Unsplash/Pexels/Pixabay 搜索 18 张图片
├── 下载到 public/images/blog/ 和 public/images/works/
└── 输出图片清单（文件名 + 来源 URL）

任务 B：北京秋天 3 篇文章
├── 写 3 篇 600-800 字散文
├── 引用图片路径
└── 生成 front matter

任务 C：黑龙江冬天 3 篇文章
├── 写 3 篇 600-800 字散文
├── 引用图片路径
└── 生成 front matter

任务 D：Works 摄影作品更新
├── 删除旧的 3 个占位作品
├── 创建 6 个新作品条目
└── 虚构合理的相机参数

任务 E：清理旧内容 + 验证
├── 删除旧的占位博客文章
├── 删除 placeholder.svg
└── 验证所有内容文件格式正确
```

## 执行顺序

```
Wave 1: 任务 A（图片先下载，后续任务依赖图片路径）
Wave 2: 任务 B + C + D（并行）
Wave 3: 任务 E（验证清理）
```
