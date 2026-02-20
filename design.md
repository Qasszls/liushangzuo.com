rkdown 作为内容格式是业界公认的最佳实践——它既保证了纯文本的可读性与版本控制友好性，又能通过简单的语法标记实现丰富的排版效果，同时与 Nuxt Content 模块无缝集成 。

每篇随笔应当包含完整的 Front Matter 元数据结构：标题、发布日期、最后修改时间、摘要、正文内容、标签分类以及可选的封面图片。内容组织层面，建议建立时间倒序排列作为默认视图，同时支持标签云与年度归档两种辅助导航方式，让读者能够按主题或时间维度灵活浏览。针对文艺风格的定位，排版细节需要特别关注：行高控制在 1.6-1.8 倍，段落间距大于行高以形成明确的内容分块，引用块采用左侧边框装饰与斜体字体组合营造书卷气息 。

Markdown 渲染方面，Nuxt Content 内置的 MDC（Markdown Components）语法允许在文章中直接嵌入 Vue 组件，实现富文本与交互内容的融合——例如在随笔中插入自定义的提示框、时间线或引用卡片。这种"内容即代码"的架构让创作者能够使用熟悉的文本编辑器（如 VS Code、Obsidian）撰写内容，保存至 `content/` 目录后即可自动生效，无需接触复杂的数据库或后台管理界面 。

1.1.2 旅行日志模块：行程记录与地理信息整合

旅行日志模块是个人网站中最具视觉张力与空间叙事特征的内容板块，需要将地理信息、时间序列与多媒体素材有机融合。与普通的图文博客不同，该模块的核心设计挑战在于如何在简约风格框架内，有效呈现丰富的旅行信息而不显杂乱。建议采用"时间轴 + 地图"双重视图模式：时间轴视图按时间倒序展示旅行经历，每段行程以卡片形式呈现关键信息；地图视图则在地理空间上标注旅行足迹，支持点击交互查看详情 。

技术实现上，单篇旅行日志需要扩展标准的 Front Matter 结构，增加地理位置字段（经纬度数组或地名描述）、行程日期范围、同行人员、交通方式等专属属性。地图集成推荐 Leaflet 作为开源首选——其核心体积仅约 40KB，社区生态成熟，支持自定义标记样式与弹窗内容，底图可对接 OpenStreetMap 等免费服务，非常适合预算有限且需求标准的个人项目 。对于追求更高视觉品质的场景，Mapbox GL 提供更精致的矢量渲染、3D 地形与自定义样式能力，但需权衡 API 调用成本与加载性能。

照片展示方面，旅行日志应当支持地理位置标签的批量导入，实现照片与地图位置的自动关联。相册集成可采用网格布局或幻灯片模式，与文字叙事穿插呈现，形成多维度（时间、空间、视觉）的内容探索体验。移动端适配需要特别关注：地图组件在窄屏设备上可切换为简化的时间轴视图，或采用底部抽屉式交互避免遮挡主要内容 。

1.1.3 摄影作品模块：图片展示与视觉叙事

摄影作品模块对视觉呈现质量提出了最高要求，需要在简约框架内实现画廊级别的展示效果。该模块的核心设计原则是"让图片自己说话"——最小化界面元素的干扰，最大化图片本身的视觉冲击力。页面布局建议采用两种基础形态：瀑布流（Masonry）布局适合横竖构图混杂的作品集，能够充分利用屏幕空间营造动态节奏；规整网格布局则更适合风格统一的系列作品，传递秩序感与专业度 。

技术实现层面，该模块需要解决三大核心问题：高性能图片加载、沉浸式查看体验、响应式布局适配。图片加载方面，Nuxt Image 模块提供了一站式解决方案——自动格式转换（WebP/AVIF 优先，JPEG 回退）、响应式尺寸生成（根据设备像素密度与容器宽度提供最优版本）、懒加载（视口外图片延迟加载）以及模糊占位符过渡 。原始高分辨率图片建议存储于对象存储服务（如 Cloudflare R2、AWS S3），构建时生成多尺寸缩略图，实现"渐进式加载"策略：首屏低分辨率占位图即时呈现，视口内图片异步加载高清版本。

沉浸式查看推荐采用灯箱（Lightbox）模式，支持键盘导航（左右箭头切换、ESC 关闭）、手势滑动（移动端）、缩放查看与信息面板切换。图片元数据展示（EXIF 信息：相机型号、镜头、光圈、快门、ISO）是专业性的体现，可通过服务端解析或客户端库实现。响应式布局需要针对桌面端、平板端与手机端分别优化网格列数与间距比例，确保在各种设备上都能呈现最佳视觉效果 。

1.1.4 技术模块：专业内容展示与知识沉淀

技术模块作为网站中风格差异化的特殊板块，需要在保持整体设计语言一致性的前提下，体现专业性与可信度。该模块的内容形态包括：技术博客文章（教程、源码分析、最佳实践）、开源项目展示（GitHub 集成、README 渲染、贡献统计）、工具推荐与教程文档等。与文艺风格的生活内容相比，技术模块应当采用更加结构化的信息架构与更高的信息密度，通过清晰的层级标题、代码高亮、数据表格与架构图等专业元素传递严谨感 。

代码展示是技术模块的核心功能。推荐集成 Shiki 作为语法高亮方案——它基于 TextMate 语法引擎，支持超过 100 种编程语言与多种主题风格，能够生成语义化的 HTML 结构便于样式定制，与 Nuxt Content 模块集成便捷 。代码块应当支持行号显示、一键复制、文件名标注、差异对比（diff）模式以及折叠展开功能。对于较长的技术文章，还应实现目录导航（Table of Contents）组件，自动提取标题层级生成可点击的跳转链接，大幅提升长文阅读体验。

项目展示页面建议集成 GitHub API，动态获取仓库的星标数、fork 数、最后更新时间、语言占比等统计信息，增强内容的时效性与可信度。每张项目卡片包含：项目封面图或演示 GIF、技术栈标签（彩色徽章区分类别）、简短描述、核心功能列表、以及直达 GitHub 仓库与在线演示的链接。技术博客的发布日期与最后更新日期应当并列显示，建立内容的时效性认知；对于引用外部资料的内容，采用规范的脚注或文末参考文献格式，体现学术严谨性 。

1.2 风格定位

1.2.1 简约主义：大量留白、清晰层次、减少视觉干扰

简约主义（Minimalism）作为本项目的核心设计哲学，其本质并非简单的"少即是多"，而是通过精心控制的视觉元素实现信息的高效传达。留白（Negative Space）是简约设计的关键技法——研究表明，适当的留白能够提升 20% 以上的内容理解度，同时营造品质感与呼吸感 。具体实践中，建议将页面边距设置为视口宽度的 8%-12%（移动端 16-24px，桌面端 64-96px），内容区域的最大宽度限制在 720-800px（文字密集型页面）或 1200-1400px（图文混排页面），行高控制在 1.6-1.8 倍，段落间距采用 8px 基数的倍数系统（如 24px、32px、48px）建立可预测的韵律感。

清晰的视觉层次通过字号对比、字重变化与色彩明度差异来实现。建议建立模块化的字号系统：基础正文 16-18px，一级标题 2.5-3 倍于正文（40-54px），二级标题 1.75-2 倍（28-36px），三级标题 1.25-1.5 倍（20-27px），形成明显的阶梯关系。字重方面，正文采用 400（Regular） 保证长时间阅读的舒适性，标题采用 600-700（SemiBold-Bold） 建立视觉重心。色彩明度的控制同样重要，正文与背景的对比度应当达到 WCAG 2.1 AA 标准（4.5:1），辅助信息可以适当降低明度形成层级差异 。

减少视觉干扰意味着审慎使用装饰性元素。边框、阴影、渐变与动画都应当服务于功能需求而非纯粹的美学表达。建议采用"功能性装饰"的设计策略：悬停状态的变化暗示可交互性，微动画引导注意力转移，色彩编码区分内容类型。每一处视觉元素的存在都应当能够回答"它帮助用户理解了什么"或"它帮助用户完成了什么"的问题。导航栏在滚动后可采用毛玻璃效果（`backdrop-blur-md bg-white/80`），既保持上下文感知又不遮挡内容 。

1.2.2 文艺气质：优雅字体、柔和色调、精致细节

文艺气质的培养需要在简约基底之上注入 subtle 的精致感，避免落入过度装饰的陷阱。字体选择是营造文艺氛围的核心手段：标题字体可考虑采用有衬线体（Serif）如 Source Han Serif（思源宋体）、Noto Serif SC 或 Playfair Display，传递经典、优雅、书卷气息；正文字体则优先保障可读性，推荐系统字体栈（`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`）或 Inter、Source Han Sans 等现代无衬线体 。中英文混排时，建议通过 `font-feature-settings` 启用连字与旧式数字等排版细节，提升整体品质感。

柔和色调的选择需要避免高饱和度的鲜艳色彩，转向低饱和度、高明度的莫兰迪色系或自然色系。主色调建议采用中性灰阶（Tailwind 的 Slate、Gray、Zinc、Neutral、Stone 等预设色板），在灰度中微调色相倾向——偏蓝的冷灰营造冷静理性，偏黄的暖灰传递温和亲切。强调色选择 1-2 种低饱和度彩色，如雾霾蓝（#7C9CB5）、豆沙绿（#8FA395）、藕荷粉（#B8A9A1）、淡漠驼（#A89F91），用于链接、按钮、标签等交互元素，保持整体色彩的克制与和谐 。背景色不建议使用纯白色（#FFFFFF），而是采用略微偏暖或偏冷的米白（如 #FAFAF9、#F8FAFC），减少屏幕强光下的视觉疲劳。

精致细节体现在对微观交互的精心打磨：链接下划线采用动画展开效果（`background-size` 从 0% 到 100% 过渡）、按钮点击时产生涟漪反馈、图片悬停时轻微放大（`scale-105`）并叠加渐变遮罩、页面切换的淡入淡出动画。这些细节单独观察几乎不可察觉，但共同构成了品质感的潜意识认知。建议将 20%-30% 的开发周期分配给 polish 阶段，专门优化这类边缘体验。

1.2.3 专业表达：技术模块的严谨性与可信度

技术模块的专业表达需要在视觉统一性与功能特殊性之间取得平衡。视觉层面，技术内容应当采用更加紧凑的信息密度与结构化的布局方式，与生活内容的呼吸感形成对比但保持设计语言的一致性。具体策略包括：固定宽度的代码块、带行号的语法高亮、清晰的数据表格、规范的图表呈现，以及深色主题的代码编辑器风格（与全站暗黑模式联动）。

可信度建立依赖具体而非抽象的呈现。开源项目展示应包含真实的 GitHub 数据、可访问的在线演示和详细的技术文档；技术博客应标注最后更新日期、预计阅读时长和相关延伸阅读；工具推荐应说明使用场景和个人评价而非简单罗列。技术模块的交互设计应当优先考虑效率——代码块的一键复制、目录导航的快速跳转、搜索功能的即时响应，这些细节虽然微小，却能够显著改善专业用户的使用体验 。

---

2. 技术架构选型与决策依据

2.1 核心框架选择：Nuxt.js

2.1.1 服务端渲染（SSR）优势：SEO友好、首屏加载优化

Nuxt.js 作为基于 Vue 3 的全栈框架，其服务端渲染（SSR）能力为个人网站带来了显著的 SEO 优势与性能提升。与纯客户端渲染（CSR）的单页应用相比，SSR 将首屏 HTML 的生成过程从浏览器转移至服务器端，搜索引擎爬虫能够直接获取完整的页面内容，无需执行 JavaScript 即可索引 。对于依赖自然流量的博客网站，这意味着技术文章、生活随笔等长尾内容有更高概率被搜索引擎收录和推荐，直接决定网站的流量获取能力。

首屏加载优化是 SSR 的另一核心收益。用户接收到的是已渲染的 HTML，可以立即看到页面骨架与关键内容，无需等待 JavaScript bundle 下载与执行完成。根据 Web 性能研究，首屏时间每延迟 1 秒可能导致跳出率增加 7%，SSR 通过减少关键渲染路径上的阻塞资源，有效提升了用户体验与留存率 。Nuxt 3 的 Nitro 引擎进一步优化了这一流程，支持边缘渲染、流式传输与智能缓存，将 Time to First Byte（TTFB）控制在 100ms 以内 。

SSR 的实现机制涉及同构应用架构：同一套 Vue 组件在服务端执行一次生成静态 HTML，在客户端再次执行（hydration）绑定交互事件。Nuxt 自动处理了这一复杂性，开发者只需遵循组合式 API 的规范（`useAsyncData`、`useFetch` 等），框架确保数据在两端的一致性。潜在挑战在于服务端无 DOM 环境，需避免直接访问 `window`、`document` 等浏览器 API，或通过 `process.client` 条件判断隔离 。

2.1.2 静态站点生成（SSG）：部署便捷、性能卓越

对于内容更新频率相对可控的个人网站，静态站点生成（SSG）是更为理想的部署策略。`nuxt generate` 命令在构建阶段预渲染所有路由为静态 HTML 文件，输出至 `.output/public` 目录后可部署至任何静态托管服务（CDN、对象存储、GitHub Pages 等），无需维护 Node.js 服务器运行时 。

SSG 的核心优势体现在三个维度：

维度    具体收益    
部署架构    极度简化，任何静态文件托管服务均可承载，配置复杂度趋近于零 
运行时性能  纯静态文件响应，全球 CDN 边缘缓存，延迟接近物理极限（<50ms）    
安全性  无服务端代码执行，消除 SQL 注入、服务器漏洞等攻击面 

Nuxt 3 的 SSG 支持增量静态再生（ISR）与按需预渲染，为内容更新场景提供了灵活解决方案。ISR 允许在指定时间间隔后自动重新生成页面，平衡内容新鲜度与构建开销；按需预渲染则在首次请求时动态生成页面并缓存，适合更新频率低但内容量大的场景。对于个人博客，建议采用定时触发的全量构建策略，配合 Webhook 实现内容更新后的自动部署 。

2.1.3 Vue 3 生态：Composition API、TypeScript 支持

Nuxt 3 基于 Vue 3 构建，完整继承了其现代化的开发体验。Composition API 是 Vue 3 的核心创新，通过 `setup` 函数与组合式函数（composables）实现逻辑复用，替代了 Options API 的分散配置。对于个人网站开发，这意味着可将"暗黑模式切换"、"滚动监听"、"本地存储同步"等功能封装为可复用的 composables，在多个组件间共享实现，代码组织更加清晰可维护 。

TypeScript 的深度集成提升了代码质量与开发体验。Nuxt 3 默认生成类型定义，自动推断组件 props、composables 返回值、路由参数与 API 响应类型。配置 `typescript.strict: true` 可启用严格模式，在编译期捕获潜在错误。对于技术模块的复杂数据结构（如项目元数据、技能图谱），接口定义（interface）提供了必要的类型约束与 IDE 智能提示，长期维护成本显著降低 。

Vue 3 的生态系统为功能扩展提供了丰富选择：状态管理使用 Pinia（轻量、TypeScript 友好）或 VueUse（实用函数集合）；表单处理使用 VeeValidate；动画使用 VueUse Motion 或 GSAP 的 Vue 封装。这些库与 Nuxt 的模块系统深度整合，通过 `nuxt.config.ts` 的 `modules` 数组一键启用 。

2.1.4 与纯 Vue 对比：路由自动化、元数据管理、构建优化

相较于纯 Vue 项目（通过 Vite 或 Vue CLI 创建），Nuxt 提供了大量开箱即用的自动化能力，显著减少样板代码与配置决策：

能力    纯 Vue 方案 Nuxt 方案   
路由系统    手动维护 `router/index.ts` 路由表   文件系统自动生成，`pages/` 目录即路由  
动态路由    手动配置路径参数与正则匹配  方括号语法（`[slug].vue`）声明式定义   
嵌套路由    手动配置 children 层级  目录层级自动映射   
元数据管理  手动集成 Vue Meta，监听路由变化 `useHead`/`useSeoMeta` 组合式函数，自动同步 
代码分割    手动配置 Webpack/Rollup 路由级自动分割，零配置 
构建优化    手动配置 Tree Shaking、资源压缩 内置优化，开箱即用 

元数据管理是 Nuxt 的显著优势。`useHead` 与 `useSeoMeta` 组合式函数允许在每个页面组件中声明式配置页面标题、描述、Open Graph 标签、Twitter Card 等 SEO 关键元素，这些元数据在 SSR/SSG 过程中被提取注入 HTML 头部，确保搜索引擎与社交媒体爬虫获取正确的页面信息 。对于博客详情页，可以动态设置文章标题与摘要作为页面元数据，实现每篇文章的独立 SEO 优化。

2.2 样式解决方案：Tailwind CSS

2.2.1 Utility-First 方法论：快速实现设计意图

Tailwind CSS 的 Utility-First 方法论彻底改变了 CSS 的开发方式。与传统 CSS 通过语义化类名（如 `.btn-primary`）封装样式不同，Tailwind 提供原子化的工具类（如 `bg-blue-500 text-white px-4 py-2 rounded-lg`）直接描述视觉表现，开发者在 HTML 中组合这些类实现设计 。

这一方法的核心优势：

- 开发速度：无需在 HTML 与 CSS 文件间切换，无需为命名纠结，设计意图即时转化为代码
- 设计一致性：所有样式值来自预定义的设计系统（spacing scale、color palette），避免随意数值
- 包体积优化：JIT 引擎实时生成所需样式，生产构建仅包含实际使用的 CSS，默认配置下 <10KB gzip

对于个人网站的快速迭代需求，Utility-First 尤为适合。设计探索阶段可直接在模板中尝试不同的间距组合（`p-6` vs `p-8`）、色彩变体（`bg-stone-100` vs `bg-slate-100`），即时预览效果；确定方案后可通过 `@apply` 指令提取组件类，或保持内联以保留灵活性。Tailwind 的类名遵循系统化命名规则，IDE 插件（Tailwind CSS IntelliSense）提供自动补全与悬停预览，大幅降低记忆负担 。

2.2.2 设计系统一致性：配色、间距、排版规范

Tailwind 内置了完整的设计系统令牌，为视觉一致性提供基础保障：

设计维度    内置规范    自定义扩展  
配色系统    22 种色调 × 11 个明度层级（50-950） `theme.extend.colors` 定义品牌色    
间距系统    4px 基准，0.5-96 的 25 个级别   自定义间距刻度 
字体大小    xs 到 9xl 的 13 个级别  自定义字号与行高组合   
字重    100-900 的 9 个级别 —   
圆角    none 到 full 的 9 个级别    自定义圆角值    
阴影    5 个预设层级 + 彩色阴影 自定义阴影效果  

对于简约文艺风格，建议通过 `tailwind.config.ts` 的 `theme.extend` 配置：
- 品牌色：提取 1-2 种低饱和度强调色，定义 50-950 的完整色阶
- 字体族：标题字体（serif）与正文字体（sans）的组合
- 动画：自定义过渡时长与缓动函数

设计令牌的集中管理确保了全站一致性——当需要调整品牌色时，仅需修改配置文件一处，全站自动更新。这对于长期维护的个人网站尤为重要，避免样式债务的累积 。

2.2.3 响应式开发：移动端优先的断点设计

Tailwind 采用移动端优先（Mobile-First）的响应式策略，默认样式应用于所有屏幕尺寸，通过 `sm:`、`md:`、`lg:`、`xl:`、`2xl:` 前缀为更大屏幕添加覆盖规则。这与当代网页访问趋势高度一致——全球移动设备流量占比已超过 60%，优先保障移动端体验是务实的工程决策 。

个人网站的响应式设计建议遵循以下断点规划：

断点    宽度    布局策略    
默认（移动端）  <640px  单列布局，导航折叠为汉堡菜单，图片全宽展示 
`sm:`（平板）   640px+  增加边距，部分场景启用双列布局 
`md:`（桌面小屏）   768px+  展开完整导航，博客列表启用侧边栏，作品展示启用网格 
`lg:`（桌面大屏）   1024px+ 旅行地图启用双栏布局，增加内容宽度 
`xl:`（超大屏） 1280px+ 限制最大宽度并居中，避免行宽过长   

具体实现示例：`class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"` 表示默认单列，平板双列，桌面大屏三列，间距始终为 24px。

2.2.4 暗黑模式支持：用户偏好适配

暗黑模式已成为现代网站的标配功能，Tailwind 通过 `dark:` 前缀提供便捷的实现方案。推荐采用 class 策略而非 media 查询，允许用户手动切换主题并持久化偏好 。

实现层面：
1. `tailwind.config.ts` 中配置 `darkMode: 'class'`
2. HTML 根元素动态添加/移除 `dark` 类（通过 `@nuxtjs/color-mode` 模块）
3. 使用 `dark:` 前缀定义暗黑模式下的样式覆盖，如 `bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`

暗黑模式的设计需要超越简单的色彩反转：
- 背景色：避免纯黑（#000000），采用深灰（如 `bg-gray-900` #111827）减少视觉疲劳
- 文本色：避免纯白，采用浅灰（如 `text-gray-100` #F3F4F6）更加柔和
- 图片处理：添加细微的亮度调整（`dark:brightness-90`）或暗色遮罩
- 代码块：同步切换语法高亮主题（Shiki 支持多主题配置）

主题切换按钮建议置于导航栏右侧，使用太阳/月亮图标配合平滑的过渡动画（`transition-colors duration-300`）。

2.3 内容管理系统

2.3.1 Markdown 驱动：@nuxt/content 模块

@nuxt/content 是 Nuxt 官方的内容管理模块，将 Markdown、YAML、JSON 等文件转换为类型安全、可查询的数据源。其核心价值在于分离内容创作与技术实现——作者使用熟悉的 Markdown 语法撰写，开发者通过 Vue 组件灵活呈现，双方无需深入了解对方的工作领域 。

核心功能特性：

功能    说明    
Markdown/MDC 解析   标准 CommonMark + GFM 扩展 + Vue 组件嵌入   
Front Matter 元数据 YAML/TOML/JSON 格式，自动类型推断   
代码高亮    Shiki 集成，100+ 语言支持，多主题切换   
全文搜索    基于 FlexSearch 的客户端索引    
目录生成    自动提取标题层级，支持锚点跳转  
热重载  开发阶段保存即刷新，保持组件状态    

MDC（Markdown Components）语法是 Content 模块的独特优势，允许在 Markdown 中直接嵌入 Vue 组件：

```markdown
---
title: "我的旅行日记"
date: 2024-03-15
---

今天来到了京都，樱花盛开。

::map{center="[135.7681, 35.0116]" zoom="12"}
::

::photo-grid{:images="['/img/kyoto-1.jpg', '/img/kyoto-2.jpg']"}
::
```

这种"增强型 Markdown"让内容创作者能够在不离开写作环境的情况下，实现富媒体与交互内容的嵌入。

2.3.2 Front Matter 元数据：标题、日期、标签、封面图

统一的 Front Matter 规范是内容系统可扩展性的基础。建议为个人网站建立以下标准字段：

字段    类型    必填    说明    示例    
`title` string  是  文章标题    "京都樱花季：一场粉色的邂逅"    
`description`   string  建议    SEO 描述与列表摘要  "记录 2024 年 3 月京都赏樱之旅..."  
`date`  string  是  ISO 8601 格式发布日期   "2024-03-15"    
`updated`   string  可选    最后修改日期    "2024-03-20"    
`tags`  string[]    建议    标签数组，用于分类与推荐   ["旅行", "日本", "摄影"]    
`cover` string  建议    封面图路径，相对于 public 目录 "/images/kyoto-cover.jpg"   
`draft` boolean 可选    草稿标记，true 时不发布 false   
`featured`  boolean 可选    精选标记，用于首页推荐  true    

旅行日志扩展字段：
- `location`: `{ name: "京都", lat: 35.0116, lng: 135.7681 }`
- `itinerary`: 日程数组，包含每日的日期、地点、活动
- `companions`: 同行人员列表

摄影作品扩展字段：
- `camera`: "Sony A7R IV"
- `lens`: "FE 24-70mm f/2.8 GM"
- `settings`: `{ aperture: "f/2.8", shutter: "1/500s", iso: 400 }`
- `series`: 系列标识，用于分组展示

技术博客扩展字段：
- `readingTime`: 预估阅读分钟数（自动计算或手动指定）
- `difficulty`: "beginner" | "intermediate" | "advanced"
- `tech`: 技术栈标签数组
- `repo`: GitHub 仓库链接

2.3.3 内容查询与排序：按时间倒序、分类筛选

Content 模块提供了类似 MongoDB 的链式查询 API，支持复杂的内容组织策略：

基础查询——获取博客全部内容：

```typescript
const { data: posts } = await useAsyncData('posts', () => 
  queryContent('blog').find()
)
```

排序操作——按日期倒序（最新优先）：

```typescript
queryContent('blog').sort({ date: -1 }).find()  // -1 表示降序
```

过滤操作——按标签筛选：

```typescript
queryContent('blog').where({ tags: { $contains: '旅行' } }).find()
```

组合条件——2024 年的技术文章：

```typescript
queryContent('blog')
  .where({ 
    $and: [
      { date: { $gte: '2024-01-01', $lte: '2024-12-31' } },
      { tags: { $contains: '技术' } }
    ]
  })
  .sort({ date: -1 })
  .find()
```

分页实现——结合 `skip` 与 `limit`：

```typescript
const page = ref(1)
const pageSize = 10

const { data: posts } = await useAsyncData(`posts-${page.value}`, () => 
  queryContent('blog')
    .sort({ date: -1 })
    .skip((page.value - 1) * pageSize)
    .limit(pageSize)
    .find()
)
```

这些查询在 SSR/SSG 阶段执行，结果序列化为 JSON 嵌入 HTML，客户端无需额外请求即可获得数据 。

2.3.4 动态路由生成：文件系统即路由结构

Nuxt Content 与 Nuxt 路由深度集成，实现"内容文件即页面"的映射机制。`pages/blog/[...slug].vue` 组件匹配所有博客详情页，通过 `useRoute().params.slug` 获取内容路径，传递给 `queryContent()` 查询对应文章 。

这一机制的工作流程：
1. 用户访问 `/blog/2024/kyoto-sakura`
2. Nuxt 路由匹配 `pages/blog/[...slug].vue`，`slug` 参数为 `['2024', 'kyoto-sakura']`
3. 组件执行 `queryContent('blog', '2024', 'kyoto-sakura').findOne()`
4. Content 模块定位 `content/blog/2024/kyoto-sakura.md` 文件
5. 返回解析后的内容对象，包含 Front Matter 元数据与渲染后的 HTML

内容集合的索引页面同样采用动态路由：
- `pages/blog/index.vue`：全部文章列表
- `pages/blog/tag/[tag].vue`：特定标签的文章
- `pages/blog/archive/[year].vue`：年度归档

URL 结构与文件系统的直接对应，既利于 SEO（语义化路径），也便于内容管理（直观的文件组织）。

2.4 扩展工具链

2.4.1 图标系统：Iconify / UnoCSS Icons

Iconify 是开源的图标聚合服务，整合 100+ 图标集的 100,000+ 图标，通过统一 API 按需加载。Nuxt Icon 模块（`@nuxt/icon`）提供便捷的 Vue 组件封装：

```vue
<Icon name="ph:house-duotone" class="w-6 h-6 text-blue-500" />
```

`name` 属性遵循 `[集合]:[图标名]` 格式，常用集合包括：
- `ph:` — Phosphor Icons（现代、多权重，推荐）
- `heroicons:` — Heroicons（Tailwind 官方出品，风格一致）
- `lucide:` — Lucide（Fork 自 Feather Icons，持续维护）
- `mdi:` — Material Design Icons（数量庞大）

构建时自动下载所需 SVG，内联为组件，无运行时依赖，支持动态图标与样式定制 。

UnoCSS Icons 是更轻量的替代方案，基于 UnoCSS 引擎将图标转化为 CSS 类（`i-ph-house-duotone`），纯 CSS 渲染，零 JavaScript 运行时开销。与 Tailwind 配合时可通过 `@apply` 复用，适合性能极致敏感的场景。

2.4.2 动画效果：GSAP / VueUse Motion

动画提升界面活力，但需克制使用以避免性能开销与视觉干扰。推荐的分层策略：

场景    工具    实现方式    
简单入场动画    VueUse Motion   `v-motion` 指令，声明式配置 
滚动触发动画    VueUse Motion   `visibleOnce` 响应式触发   
复杂时间轴控制  GSAP    Timeline + ScrollTrigger    
页面过渡    Nuxt 内置   `<NuxtPage>` transition 属性   

VueUse Motion 示例：

```vue
<div
  v-motion
  :initial="{ opacity: 0, y: 20 }"
  :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
>
  内容
</div>
```

GSAP ScrollTrigger 适合视差滚动、固定元素等复杂效果，但需注意：
- 仅在客户端执行（`onMounted` 或 `process.client`）
- 尊重 `prefers-reduced-motion` 用户偏好
- 避免同时运行过多动画，防止帧率下降 

2.4.3 图片优化：Nuxt Image / IPX

Nuxt Image 模块提供一站式图片优化方案 ：

功能    配置示例    说明    
响应式尺寸  `sizes="sm:100vw md:50vw lg:800px"` 自动生成 srcset    
格式转换    `format="webp"` 优先 WebP/AVIF，自动回退   
懒加载  `loading="lazy"`    视口外图片延迟加载  
占位符  `placeholder`   模糊预览或颜色占位  
质量    `quality="80"`  平衡视觉与体积  

IPX（Image Processing X）是 Nuxt Image 的底层引擎，基于 Sharp 库实现高效图片转换。开发阶段即时处理请求，生产构建可预生成常用尺寸，或部署到支持 IPX 的边缘服务实现按需处理。

完整配置示例：

```vue
<NuxtImg
  src="/images/photo.jpg"
  alt="描述"
  width="1200"
  height="800"
  sizes="sm:100vw md:50vw lg:800px"
  format="webp"
  quality="80"
  loading="lazy"
  placeholder
/>
```

2.4.4 地图集成：Leaflet / Mapbox GL（旅行模块）

旅行日志的地图可视化需要权衡功能丰富度、视觉品质与成本：

方案    优势    劣势    适用场景    
Leaflet 开源免费、轻量（40KB）、插件丰富    默认样式较朴素 预算有限、需求标准  
Mapbox GL   矢量渲染精美、3D 地形、自定义样式   需 API key、有调用成本  追求视觉品质、复杂数据可视化    

Leaflet 基础集成：

```vue
<script setup>
import L from 'leaflet'

onMounted(() => {
  const map = L.map('map').setView([35.0116, 135.7681], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  
  L.marker([35.0116, 135.7681])
    .addTo(map)
    .bindPopup('京都')
})
</script>

<template>
  <div id="map" class="h-96 w-full rounded-lg" />
</template>
```

关键注意事项：
- 地图初始化必须在客户端执行（`onMounted` 或 `<ClientOnly>`）
- 响应式适配：移动端简化交互或切换为时间轴视图
- 性能优化：标记点聚类（clustering）处理密集数据，懒加载避免首屏阻塞 

---

3. 从零搭建实施路径

3.1 项目初始化

3.1.1 环境准备：Node.js 版本、包管理器选择

Node.js 版本：Nuxt 3 要求 18.0.0 或更高，推荐 20.x LTS 以获得长期支持与安全更新。版本管理建议使用 nvm（macOS/Linux）或 nvm-windows，通过 `.nvmrc` 文件锁定项目版本：

```bash
# .nvmrc
20.11.0
```

包管理器选择：

工具    安装速度    磁盘效率    推荐场景    
pnpm    最快    最优（全局存储+硬链接） 首选，磁盘敏感、多项目共享 
yarn (berry)    快  最优（PnP 零拷贝）  严格依赖管理、大型项目 
npm 基准    基准    简单项目、团队统一  

启用 pnpm：`corepack enable pnpm`，随后使用 `pnpm create nuxt@latest` 创建项目 。

编辑器配置：Visual Studio Code + 推荐扩展
- Volar — Vue 官方语言支持，类型检查与智能提示
- Tailwind CSS IntelliSense — 工具类自动补全
- ESLint + Prettier — 代码规范与格式化
- MDC — Markdown Components 语法高亮

3.1.2 创建命令：`npx nuxi@latest init my-website`

Nuxt 官方脚手架 `nuxi` 提供项目初始化：

```bash
# 基础模板
npx nuxi@latest init my-website

# 或直接使用 Content Wind 模板（推荐）
npx nuxi@latest init my-website -t github:atinux/content-wind
```

Content Wind 模板由 Nuxt 核心团队成员 Atinux 维护，预配置了：
- Nuxt 3 + TypeScript
- @nuxt/content 内容管理
- Tailwind CSS + @nuxt/ui 组件库
- 暗黑模式支持
- 响应式导航与布局

是快速启动个人网站的理想基础 。

交互式向导选项建议：
- Package manager: pnpm
- UI framework: None（模板已集成）
- TypeScript: Yes
- ESLint: Yes
- Prettier: Optional（可先跳过，后续手动配置）

初始化完成后，启动开发服务器：

```bash
cd my-website
pnpm install
pnpm dev
```

默认监听 `http://localhost:3000`，保存文件后自动热更新，保持组件状态不变。

3.1.3 目录结构规划：components、composables、layouts、pages、content、public、assets

Nuxt 项目遵循约定优于配置的目录结构，建议按以下规划组织：

```
my-website/
├── .nuxt/                 # 自动生成，构建缓存（gitignore）
├── .output/               # 构建输出（gitignore）
├── components/            # Vue 组件（自动导入）
│   ├── content/           # Markdown 渲染组件（Prose 覆盖）
│   ├── ui/                # 基础 UI 组件（Button, Card, Tag）
│   ├── layout/            # 布局组件（Header, Footer, Nav）
│   └── sections/          # 页面区块（Hero, PostList, Gallery）
├── composables/           # 组合式函数（自动导入）
│   ├── useContentQuery.ts # 内容查询封装
│   ├── useTheme.ts        # 主题切换逻辑
│   └── useScrollSpy.ts    # 滚动监听与目录高亮
├── layouts/               # 页面布局模板
│   ├── default.vue        # 默认布局（导航+页脚）
│   ├── blog.vue           # 博客专用（窄内容+侧边栏）
│   └── gallery.vue        # 作品展示（全屏沉浸）
├── pages/                 # 路由页面（文件系统即路由）
│   ├── index.vue          # 首页
│   ├── about.vue          # 关于页面
│   ├── blog/
│   │   ├── index.vue      # 博客列表
│   │   └── [...slug].vue  # 博客详情（动态路由）
│   ├── travel/
│   │   ├── index.vue      # 旅行列表
│   │   └── [trip].vue     # 旅行详情
│   ├── works/
│   │   ├── index.vue      # 作品画廊
│   │   └── [slug].vue     # 作品详情
│   └── tech/
│       ├── index.vue      # 技术文章列表
│       └── [slug].vue     # 技术文章详情
├── content/               # Markdown 内容源（Git 管理）
│   ├── blog/              # 生活随笔
│   ├── travel/            # 旅行日志
│   ├── works/             # 摄影作品数据
│   └── tech/              # 技术文章
├── public/                # 静态资源（直接复制）
│   ├── images/            # 图片资源
│   │   ├── blog/
│   │   ├── travel/
│   │   └── works/
│   ├── fonts/             # 自定义字体
│   └── favicon.ico
├── assets/                # 构建处理资源
│   └── css/
│       └── main.css       # Tailwind 入口
├── server/                # Nitro 服务端代码（可选）
│   └── api/               # API 路由
├── nuxt.config.ts         # Nuxt 配置
├── tailwind.config.ts     # Tailwind 配置
├── content.config.ts      # Nuxt Content v3 配置
└── package.json
```

3.2 核心模块开发

3.2.1 布局系统：默认布局、博客布局、作品展示布局

默认布局（`layouts/default.vue`） 应用于大多数页面，包含全局导航、页脚与页面过渡：

```vue
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
    <AppHeader :scrolled="isScrolled" />
    <main class="pt-16"> <!-- 为固定导航预留空间 -->
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})
</script>
```

博客布局（`layouts/blog.vue`） 针对阅读场景优化：

```vue
<template>
  <div class="min-h-screen bg-white dark:bg-stone-950">
    <AppHeader />
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
      <main class="max-w-2xl">
        <slot />
      </main>
      <aside class="hidden lg:block">
        <TableOfContents />
        <RelatedPosts class="mt-12" />
      </aside>
    </div>
    <AppFooter />
  </div>
</template>
```

作品展示布局（`layouts/gallery.vue`） 最小化界面干扰：

```vue
<template>
  <div class="min-h-screen bg-black text-white">
    <button class="fixed top-6 left-6 z-50 p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition">
      <Icon name="ph:arrow-left" class="w-6 h-6" />
    </button>
    <slot />
  </div>
</template>
```

页面通过 `definePageMeta` 指定布局：

```vue
<script setup>
definePageMeta({
  layout: 'blog'
})
</script>
```

3.2.2 导航组件：响应式头部、移动端抽屉菜单

`AppHeader` 组件实现滚动状态响应与移动端适配：

```vue
<script setup lang="ts">
defineProps<{ scrolled: boolean }>()

const isMobileMenuOpen = ref(false)
const colorMode = useColorMode()

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '随笔' },
  { to: '/travel', label: '旅行' },
  { to: '/works', label: '作品' },
  { to: '/tech', label: '技术' },
  { to: '/about', label: '关于' }
]
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    ]"
  >
    <nav class="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="text-xl font-serif font-bold tracking-tight">
        Your Name
      </NuxtLink>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors relative group"
          active-class="text-stone-900 dark:text-stone-100"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-900 dark:bg-stone-100 transition-all group-hover:w-full" />
        </NuxtLink>
        
        <!-- Theme Toggle -->
        <button 
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
          class="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <Icon :name="colorMode.value === 'dark' ? 'ph:sun' : 'ph:moon'" class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden p-2"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-6 h-6" />
      </button>
    </nav>
    
    <!-- Mobile Drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-lg"
      >
        <div class="px-6 py-4 space-y-1">
          <NuxtLink 
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="block py-3 text-lg font-medium"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
```

3.2.3 首页设计：Hero 区域、精选内容、个人简介

首页作为流量入口，需在首屏传递核心价值主张。Hero 区域采用全屏背景图 + 底部左对齐文案的布局（仅一套），无背景图时隐藏图片、改用深色渐变底色，文案与按钮不变。具体实现见 `app/pages/index.vue`。

首页区块：
1. **Hero** — 65vh 高度，背景图（可选）+ 渐变遮罩 + 白色文案（标题、副标题、CTA 按钮）
2. **最新文章** — 3 列 ArticleCard 网格
3. **摄影精选** — 3 列图片网格（仅在有 featured 内容时显示）
4. **关于我** — 头像 + 简介 + 链接

3.2.4 博客列表页：文章卡片、分页/无限滚动、分类过滤

博客列表页的核心是内容发现效率与信息密度的平衡：

```vue
<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl md:text-4xl font-serif font-bold mb-4">生活随笔</h1>
      <p class="text-stone-600 dark:text-stone-400 max-w-2xl">
        记录日常思考、阅读笔记与生活观察。文字是思想的沉淀，也是与世界的对话方式。
      </p>
    </div>

    <!-- Filter & Search -->
    <div class="flex flex-col sm:flex-row gap-4 mb-10">
      <!-- Tag Filter -->
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="tag in allTags" 
          :key="tag"
          @click="selectedTag = selectedTag === tag ? null : tag"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition',
            selectedTag === tag
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Post Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ArticleCard 
        v-for="post in filteredPosts" 
        :key="post._path"
        :post="post"
      />
    </div>

    <!-- Load More / Pagination -->
    <div v-if="hasMore" class="mt-16 text-center">
      <button 
        @click="loadMore"
        class="px-8 py-3 border border-stone-300 dark:border-stone-700 rounded-full font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition"
      >
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup>
const selectedTag = ref(null)
const page = ref(1)
const pageSize = 9

const { data: allPosts } = await useAsyncData('all-posts', () => 
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()
)

const allTags = computed(() => {
  const tags = new Set()
  allPosts.value?.forEach(post => post.tags?.forEach(tag => tags.add(tag)))
  return Array.from(tags).sort()
})

const filteredPosts = computed(() => {
  let posts = allPosts.value || []
  if (selectedTag.value) {
    posts = posts.filter(post => post.tags?.includes(selectedTag.value))
  }
  return posts.slice(0, page.value * pageSize)
})

const hasMore = computed(() => 
  filteredPosts.value.length < (selectedTag.value 
    ? allPosts.value?.filter(p => p.tags?.includes(selectedTag.value)).length 
    : allPosts.value?.length)
)

const loadMore = () => page.value++

useHead({ title: '生活随笔 — Your Name' })
</script>
```

`ArticleCard` 组件实现：

```vue
<script setup lang="ts">
defineProps<{
  post: {
    _path: string
    title: string
    description?: string
    date: string
    tags?: string[]
    cover?: string
  }
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <article class="group">
    <NuxtLink :to="post._path" class="block">
      <!-- Cover Image -->
      <div v-if="post.cover" class="aspect-[16/10] overflow-hidden rounded-xl mb-5 bg-stone-100 dark:bg-stone-800">
        <NuxtImg 
          :src="post.cover" 
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <!-- Content -->
      <div class="space-y-3">
        <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          <time>{{ formatDate(post.date) }}</time>
          <span v-if="post.tags?.length" class="flex gap-2">
            <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="text-teal-600 dark:text-teal-400">#{{ tag }}</span>
          </span>
        </div>
        
        <h3 class="text-xl font-bold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">
          {{ post.title }}
        </h3>
        
        <p v-if="post.description" class="text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {{ post.description }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>
```

3.2.5 博客详情页：Markdown 渲染、目录导航、相关文章

博客详情页 `pages/blog/[...slug].vue`：

```vue
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string[]

const { data: article } = await useAsyncData(`article-${slug.join('-')}`, () =>
  queryContent('blog', ...slug).findOne()
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}

// SEO
useHead({
  title: `${article.value.title} — Your Name`,
  meta: [
    { name: 'description', content: article.value.description },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.description },
    { property: 'og:image', content: article.value.cover },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: article.value.date }
  ]
})

// Related posts
const { data: relatedPosts } = await useAsyncData(`related-${slug.join('-')}`, () =>
  queryContent('blog')
    .where({ 
      _path: { $ne: article.value!._path },
      tags: { $contains: article.value?.tags?.[0] || '' }
    })
    .sort({ date: -1 })
    .limit(2)
    .find()
)
</script>

<template>
  <article v-if="article" class="max-w-2xl mx-auto">
    <!-- Header -->
    <header class="mb-10">
      <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400 mb-4">
        <time>{{ new Date(article.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</time>
        <span v-if="article.readingTime">· {{ article.readingTime }} 分钟阅读</span>
      </div>
      
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
        {{ article.title }}
      </h1>
      
      <p v-if="article.description" class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
        {{ article.description }}
      </p>
      
      <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mt-6">
        <NuxtLink 
          v-for="tag in article.tags" 
          :key="tag"
          :to="`/blog/tag/${tag}`"
          class="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition"
        >
          {{ tag }}
        </NuxtLink>
      </div>
    </header>

    <!-- Cover Image -->
    <div v-if="article.cover" class="mb-10 -mx-6 md:mx-0">
      <NuxtImg 
        :src="article.cover" 
        :alt="article.title"
        class="w-full aspect-[16/9] object-cover rounded-xl"
      />
    </div>

    <!-- Content -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="article" />
    </div>

    <!-- Footer -->
    <footer class="mt-16 pt-10 border-t border-stone-200 dark:border-stone-800">
      <div v-if="relatedPosts?.length" class="mb-10">
        <h3 class="text-lg font-bold mb-4">相关文章</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ArticleCard 
            v-for="post in relatedPosts" 
            :key="post._path"
            :post="post"
            compact
          />
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <NuxtLink to="/blog" class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-2">
          <Icon name="ph:arrow-left" class="w-4 h-4" />
          返回列表
        </NuxtLink>
        
        <button class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-2">
          <Icon name="ph:share-network" class="w-4 h-4" />
          分享
        </button>
      </div>
    </footer>
  </article>
</template>
```

3.2.6 作品展示页：网格布局、懒加载、灯箱查看

摄影作品画廊 `pages/works/index.vue`：

```vue
<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <div class="mb-12">
      <h1 class="text-3xl md:text-4xl font-serif font-bold mb-4">摄影作品</h1>
      <p class="text-stone-600 dark:text-stone-400 max-w-2xl">
        用镜头捕捉光影与瞬间。风光、人文、街头，每一帧都是与世界的对话。
      </p>
    </div>

    <!-- Filter -->
    <div class="flex flex-wrap gap-2 mb-10">
      <button 
        v-for="category in categories" 
        :key="category"
        @click="selectedCategory = selectedCategory === category ? null : category"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          selectedCategory === category
            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
        ]"
      >
        {{ category }}
      </button>
    </div>

    <!-- Masonry Grid -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      <div 
        v-for="photo in filteredPhotos" 
        :key="photo._path"
        class="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
        @click="openLightbox(photo)"
      >
        <NuxtImg 
          :src="photo.image"
          :alt="photo.title"
          class="w-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="sm:100vw md:50vw lg:33vw"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <h3 class="text-white font-bold text-lg">{{ photo.title }}</h3>
          <p class="text-white/80 text-sm">{{ photo.location }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <PhotoLightbox 
      v-model="lightboxOpen"
      :photos="filteredPhotos"
      :initial-index="lightboxIndex"
    />
  </div>
</template>

<script setup>
const selectedCategory = ref(null)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const categories = ['全部', '风光', '人文', '街头', '建筑']

const { data: photos } = await useAsyncData('photos', () => 
  queryContent('works').sort({ date: -1 }).find()
)

const filteredPhotos = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === '全部') return photos.value
  return photos.value?.filter(p => p.category === selectedCategory.value)
})

const openLightbox = (photo) => {
  lightboxIndex.value = filteredPhotos.value?.findIndex(p => p._path === photo._path) || 0
  lightboxOpen.value = true
}

useHead({ title: '摄影作品 — Your Name' })
</script>
```

3.2.7 旅行日志页：时间轴、地图标记、相册集成

旅行日志详情 `pages/travel/[trip].vue`：

```vue
<template>
  <div v-if="trip" class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <!-- Header -->
    <header class="mb-12">
      <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400 mb-4">
        <time>{{ formatDateRange(trip.startDate, trip.endDate) }}</time>
        <span>· {{ trip.duration }} 天</span>
      </div>
      
      <h1 class="text-3xl md:text-5xl font-serif font-bold mb-4">{{ trip.title }}</h1>
      <p class="text-lg text-stone-600 dark:text-stone-400 max-w-2xl">{{ trip.description }}</p>
      
      <!-- Location Tags -->
      <div class="flex flex-wrap gap-2 mt-6">
        <span 
          v-for="location in trip.locations" 
          :key="location.name"
          class="px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-full text-sm flex items-center gap-1"
        >
          <Icon name="ph:map-pin" class="w-4 h-4" />
          {{ location.name }}
        </span>
      </div>
    </header>

    <!-- Map -->
    <div class="mb-12 rounded-2xl overflow-hidden h-[400px] bg-stone-100 dark:bg-stone-800">
      <TravelMap :locations="trip.locations" :route="trip.route" />
    </div>

    <!-- Timeline -->
    <div class="space-y-12">
      <div 
        v-for="(day, index) in trip.itinerary" 
        :key="index"
        class="relative pl-8 md:pl-12 border-l-2 border-stone-200 dark:border-stone-800"
      >
        <!-- Timeline Dot -->
        <div class="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-500 ring-4 ring-white dark:ring-stone-950" />
        
        <!-- Day Header -->
        <div class="mb-6">
          <span class="text-sm font-medium text-teal-600 dark:text-teal-400">第 {{ index + 1 }} 天</span>
          <h3 class="text-xl font-bold mt-1">{{ day.title }}</h3>
          <p class="text-stone-500 dark:text-stone-400 text-sm mt-1">{{ day.date }}</p>
        </div>
        
        <!-- Day Content -->
        <div class="prose dark:prose-invert max-w-none mb-6">
          <ContentRenderer :value="day" />
        </div>
        
        <!-- Day Photos -->
        <div v-if="day.photos?.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="photo in day.photos" 
            :key="photo"
            class="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
            @click="openGallery(day.photos, photo)"
          >
            <NuxtImg :src="photo" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: trip } = await useAsyncData(`trip-${route.params.trip}`, () =>
  queryContent('travel', route.params.trip as string).findOne()
)

if (!trip.value) {
  throw createError({ statusCode: 404, statusMessage: '旅行记录未找到' })
}

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const sameYear = startDate.getFullYear() === endDate.getFullYear()
  
  if (sameYear) {
    return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日 — ${endDate.getMonth() + 1}月${endDate.getDate()}日`
  }
  return `${startDate.toLocaleDateString('zh-CN')} — ${endDate.toLocaleDateString('zh-CN')}`
}

useHead({
  title: `${trip.value.title} — 旅行日志`,
  meta: [
    { name: 'description', content: trip.value.description }
  ]
})
</script>
```

3.3 内容组织规范

3.3.1 文件命名约定：日期-标题-slug.md

一致的文件命名规范是内容可维护性的基础。推荐格式：

```
YYYY-MM-DD-[kebab-case-title].md
```

示例：
- `2024-03-15-exploring-kyoto-in-spring.md`
- `2024-06-20-vue-3-composition-api-best-practices.md`
- `2024-09-10-portfolio-redesign-2024.md`

命名原则：
- 日期前缀确保文件系统按时间排序，便于浏览管理
- `kebab-case`（短横线连接的小写）与 URL 路径保持一致
- 避免空格、特殊字符与非 ASCII 字符，确保跨平台兼容
- 标题片段简洁描述内容主题，无需完整句子

对于嵌套分类的内容，使用子目录组织：

```
content/
├── blog/
│   ├── 2024/
│   │   ├── 03-kyoto-trip/
│   │   │   └── 2024-03-15-arrival-and-first-impressions.md
│   │   └── 06-vue-3-guide/
│   │       ├── 2024-06-01-introduction.md
│   │       └── 2024-06-10-reactive-system.md
```

3.3.2 图片资源管理：按内容模块分目录存储

图片资源按内容类型分目录存储于 `public/images/`，保持结构清晰与可维护性：

```
public/images/
├── blog/                    # 博客文章配图
│   └── 2024/
│       └── 03-kyoto-trip/
│           └── cover.jpg
├── travel/                  # 旅行照片
│   └── 2024-kyoto/
│       ├── day-1/
│       │   ├── temple-001.jpg
│       │   └── temple-002.jpg
│       └── day-2/
├── works/                   # 摄影作品
│   ├── landscape/
│   │   └── mountain-sunrise.jpg
│   ├── street/
│   │   └── tokyo-night.jpg
│   └── portrait/
└── about/                   # 关于页面图片
    └── avatar.jpg
```

管理原则：
- 原始高分辨率图片（RAW/PSD）单独存储（云存储或本地），仓库仅保留 Web 优化版本
- 使用有意义的文件名描述内容，避免 `IMG_1234.jpg`
- 按年份/主题细分目录，避免单目录文件过多
- 封面图与正文配图分开放置，便于批量处理

3.3.3 元数据标准：title、date、description、tags、cover、location（旅行）

建立统一的 Front Matter 模板，确保内容一致性：

标准博客文章模板：

```markdown
---
title: "文章标题"
description: "文章摘要，用于 SEO 和列表预览，建议 100-150 字"
date: 2024-03-15
updated: 2024-03-20  # 可选，最后修改日期
tags: ["标签1", "标签2", "标签3"]  # 3-5 个相关标签
cover: "/images/blog/2024/03/cover.jpg"  # 可选，封面图路径
draft: false  # true 时不发布
featured: false  # true 时首页推荐
readingTime: 8  # 可选，预估阅读分钟数
---

正文内容...
```

旅行日志扩展模板：

```markdown
---
title: "京都樱花季：一场粉色的邂逅"
description: "2024年3月，在京都度过的一周赏樱之旅..."
date: 2024-03-15
endDate: 2024-03-22
duration: 7
tags: ["旅行", "日本", "京都", "樱花"]
cover: "/images/travel/2024-kyoto/cover.jpg"
locations:
  - name: "京都"
    lat: 35.0116
    lng: 135.7681
  - name: "奈良"
    lat: 34.6851
    lng: 135.8048
itinerary:
  - date: "2024-03-15"
    title: "抵达与初见"
    photos:
      - "/images/travel/2024-kyoto/day-1/arrival.jpg"
---

正文内容...
```

摄影作品扩展模板：

```markdown
---
title: "山巅日出"
description: "在海拔3000米的营地等待的第一缕阳光"
date: 2024-01-15
category: "风光"  # 风光、人文、街头、建筑
series: "雪山系列"  # 可选，系列标识
image: "/images/works/landscape/mountain-sunrise.jpg"
camera: "Sony A7R IV"
lens: "FE 16-35mm f/2.8 GM"
settings:
  aperture: "f/8"
  shutter: "1/125s"
  iso: 100
location: "四川·贡嘎山"
---

创作手记...
```

3.4 性能与体验优化

3.4.1 代码分割：路由级懒加载

Nuxt 3 基于 Vite 的构建系统自动支持路由级代码分割，每个页面组件及其依赖打包为独立的 chunk，按需加载。进一步优化策略：

场景    优化方式    实现代码    
重型组件    动态导入    `const HeavyMap = defineAsyncComponent(() => import('~/components/HeavyMap.vue'))`  
第三方库    条件导入    `onMounted(async () => { const { default: Leaflet } = await import('leaflet') })`   
图表/可视化 路由懒加载  组件级别 `defineAsyncComponent` 
非首屏内容  延迟加载    `v-if` 控制渲染时机，或 `IntersectionObserver` 触发 

关键原则：首屏关键路径资源 < 100KB（gzipped），JavaScript 执行时间 < 200ms。

3.4.2 图片优化：WebP 格式、响应式尺寸

Nuxt Image 模块配置优化策略：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  
  image: {
    // 默认质量
    quality: 80,
    
    // 响应式断点
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    
    // 格式优先级
    format: ['webp', 'avif', 'jpg', 'png'],
    
    // 占位符
    placeholder: true,  // 启用模糊占位
    
    // IPX 配置（自托管）
    ipx: {
      maxAge: 60 * 60 * 24 * 365  // 1年缓存
    }
  }
})
```

组件使用示例：

```vue
<NuxtImg
  src="/images/photo.jpg"
  alt="描述"
  width="1200"
  height="800"
  sizes="sm:100vw md:50vw lg:800px"
  format="webp"
  quality="80"
  loading="lazy"
  placeholder
/>
```

优化效果：相比原始 JPEG，WebP 格式体积减少 25-35%，AVIF 可减少 50%+；响应式尺寸避免移动端加载桌面级大图，节省 60%+ 流量 。

3.4.3 字体策略：系统字体栈、可变字体、字体子集化

分层字体加载策略：

优先级  方案    实现    适用场景    
第一优先    系统字体栈  `font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` 正文，追求即时渲染  
第二优先    可变字体    Inter、Source Sans 3 Variable   需要统一跨平台视觉  
第三优先    子集化字体  glyphhanger、有字库 CDN 中文标题，控制体积 

关键配置：

```css
/* 系统字体栈（推荐正文） */
.font-sans {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

/* 标题字体（可选，需权衡加载成本） */
.font-serif {
  font-family: 'Noto Serif SC', 'Source Han Serif CN', 'STSong', 'SimSun', serif;
}

/* 等宽字体（代码） */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 
    'Roboto Mono', Consolas, 'Courier New', monospace;
}
```

性能优化要点：
- `font-display: swap` 避免 FOIT（不可见文本闪烁）
- 预加载关键字体：`<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>`
- 中文字体子集化：仅加载使用的字符，体积从 5MB+ 降至 50-200KB

3.4.4 缓存策略：CDN 部署、Service Worker

静态资源缓存策略：

资源类型    Cache-Control   说明    
HTML 文件   `public, max-age=0, must-revalidate`    实时验证，确保内容新鲜  
JS/CSS（哈希命名）  `public, max-age=31536000, immutable`   永久缓存，文件名变化时失效  
图片（优化后）  `public, max-age=2592000`   30天缓存，平衡新鲜度与性能 
字体文件    `public, max-age=31536000`  永久缓存，版本通过文件名控制   

PWA 与 Service Worker（可选）：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],
  
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: { cacheName: 'google-fonts-cache' }
        }
      ]
    },
    manifest: {
      name: 'Your Name — 个人网站',
      short_name: 'Your Name',
      description: '记录生活，分享思考',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone'
    }
  }
})
```

---

4. 视觉设计系统

4.1 色彩体系

4.1.1 主色调：中性灰阶（slate/gray/zinc）

中性灰阶构成简约设计的基础，Tailwind 提供五种灰阶选择，各有微妙的色相倾向：

色板    色相倾向    气质特征    推荐场景    
Slate   偏蓝灰  冷静、现代、科技感  技术博客、开发者网站   
Gray    纯中性  百搭、通用、平衡    不确定时的安全选择 
Zinc    偏青灰  现代、精致、中性    简约文艺、作品集   
Neutral 偏暖灰  温和、自然、人文    生活方式、个人博客 
Stone   偏黄灰（米色调）    温暖、质朴、大地感  旅行日志、摄影网站 

推荐配置（简约文艺风格）：

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // 主灰阶：Zinc 或 Stone
        primary: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        }
      }
    }
  }
}
```

4.1.2 强调色：低饱和度品牌色（莫兰迪色系）

强调色用于链接、按钮、标签等交互元素，选择低饱和度、高明度的莫兰迪色系，与中性灰阶和谐共存：

色彩名称    色值    应用场景    
雾霾蓝  `#7C9CB5` / `#5A7A93`   主链接、主要按钮    
豆沙绿  `#8FA395` / `#6B826F`   成功状态、标签高亮  
藕荷粉  `#B8A9A1` / `#9A8B83`   特殊标记、引用边框  
淡漠驼  `#A89F91` / `#8A8173`   次要按钮、悬停状态  
青石灰  `#8A9A9A` / `#6A7A7A`   技术模块强调    

使用原则：单一页面不超过 2 种强调色，保持视觉焦点集中；交互状态通过明度变化（hover 加深 10-15%）而非色相跳跃区分。

4.1.3 功能色：成功、警告、错误的语义化应用

功能色遵循通用的色彩语义，同样降低饱和度以保持整体调性：

状态    色值    使用场景    
成功（Success） `#6B826F` / `emerald-600`   表单提交成功、操作完成提示 
警告（Warning） `#B8A09A` / `amber-600` 需要注意、非阻断性提示 
错误（Error）   `#A67C7C` / `rose-600`  表单验证失败、操作错误 
信息（Info）    `#7C9CB5` / `sky-600`   中性提示、帮助信息 

可访问性要求：功能色与背景的对比度 ≥ 3:1（大文本）或 4.5:1（正文），确保色盲用户可识别。

4.2 排版系统

4.2.1 标题字体：有衬线或人文主义无衬线（营造文艺感）

推荐字体组合：

层级    中文字体    西文字体    字重    用途    
大标题 (H1) 思源宋体 / 方正清刻本悦宋   Playfair Display / Canela   700 页面主标题、Hero 文字   
小标题 (H2-H4)  思源宋体 / 霞鹜文楷 Source Serif Pro / Lyon 600 章节标题、卡片标题  
正文    系统字体 / 思源黑体 Inter / Source Sans Pro 400 段落文字、列表内容  
代码    —   JetBrains Mono / Fira Code  400 代码块、技术术语   

字体加载策略：

```css
/* 系统字体栈（推荐，零加载成本） */
font-family: 'Noto Serif SC', 'Source Han Serif CN', 'STSong', 'SimSun', serif;

/* 或：可变字体（单文件多字重） */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
```

4.2.2 正文字体：高可读性无衬线（系统字体或 Inter）

系统字体栈（推荐）：

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

特性：零加载延迟、原生渲染优化、跨平台一致性良好。

Inter 字体（可选升级）：

- 专为屏幕 UI 设计，字形清晰、字距优化
- 支持可变字体格式，单文件覆盖 100-900 字重
- 数字等高宽（tabular nums），表格对齐更美观

4.2.3 字号比例：模块化比例尺（1.25 或 1.5 倍率）

Major Third（1.25）比例尺——温和、实用：

层级    计算    像素值  用途    
3xl 1rem × 1.25⁴    3.052rem (48.8px)   页面大标题  
2xl 1rem × 1.25³    2.441rem (39.1px)   章节标题    
xl  1rem × 1.25²    1.953rem (31.2px)   小标题  
lg  1rem × 1.25¹    1.563rem (25px) 引导文字    
base    1rem    1rem (16px) 正文    
sm  1rem ÷ 1.25¹    0.8rem (12.8px) 辅助信息    
xs  1rem ÷ 1.25²    0.64rem (10.2px)    标注、脚注  

Perfect Fifth（1.5）比例尺——戏剧性、展示性强：

层级    计算    像素值  用途    
3xl 1rem × 1.5⁴ 5.063rem (81px) Hero 大标题 
2xl 1rem × 1.5³ 3.375rem (54px) 页面标题    
xl  1rem × 1.5² 2.25rem (36px)  章节标题    
lg  1rem × 1.5¹ 1.5rem (24px)   小标题  
base    1rem    1rem (16px) 正文    
sm  1rem ÷ 1.5¹ 0.667rem (10.7px)   辅助信息    

选择建议：内容型网站（博客）用 1.25，展示型网站（作品集）用 1.5。

4.2.4 行高与段落：1.6-1.8 行高、舒适段间距

场景    行高    段间距  说明    
中文正文    1.8 1.5em   方块字需要更多呼吸空间  
西文正文    1.6 1.5em   字母形态允许更紧凑  
标题    1.2-1.3 —   避免过大行距削弱标题感  
代码块  1.5 —   等宽字体，保持对齐  

Tailwind 配置：

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      lineHeight: {
        'tight': '1.2',
        'snug': '1.375',
        'normal': '1.6',
        'relaxed': '1.75',
        'loose': '2',
      }
    }
  }
}
```

4.3 空间与布局

4.3.1 网格系统：12 列或不对称网格

12 列网格——灵活、经典：

```css
/* Tailwind 默认 */
.grid-cols-12

/* 常用组合 */
.col-span-12  /* 全宽 */
.col-span-8   /* 2/3 */
.col-span-6   /* 1/2 */
.col-span-4   /* 1/3 */
.col-span-3   /* 1/4 */
```

不对称网格——动态、艺术感：

```css
/* 黄金比例 1:1.618 */
.grid-cols-[1fr_1.618fr]

/* 内容+侧边栏 */
.grid-cols-[minmax(0,1fr)_280px]

/* 瀑布流 */
.columns-1 sm:columns-2 lg:columns-3
```

4.3.2 留白策略：大尺度边距、呼吸感营造

页面级间距：

场景    移动端  平板    桌面    超大屏  
页面边距 (px)   16-24px 32-48px 64-96px 128px+  
区块间距 (py)   48-64px 64-96px 96-128px    128-192px   
内容最大宽度    100%    720px   960px   1200px  

组件级间距：
- 卡片内边距：24-32px（`p-6` / `p-8`）
- 表单字段间距：16-24px（`space-y-4` / `space-y-6`）
- 按钮组间距：12-16px（`gap-3` / `gap-4`）

4.3.3 内容宽度：最佳阅读行宽（65-75 字符）

阅读舒适性的科学研究：
- 英文最佳行宽：45-75 字符（理想 66 字符）
- 中文最佳行宽：25-35 个汉字（约 35em）

Tailwind 实现：

```html
<!-- 正文阅读宽度 -->
<article class="max-w-prose mx-auto">  <!-- 65ch ≈ 720px -->

<!-- 图文混排宽度 -->
<div class="max-w-3xl mx-auto">  <!-- 768px -->

<!-- 展示型全宽 -->
<div class="max-w-7xl mx-auto">  <!-- 1280px -->
```

4.4 交互细节

4.4.1 悬停状态：微妙反馈、避免过度设计

元素    默认状态    悬停状态    过渡时长    
文字链接    无下划线    下划线或颜色变化    150ms   
按钮    背景色  背景加深 10% 或上移 2px 200ms   
卡片    无阴影  阴影增强 + 轻微放大 (scale-102) 300ms   
图片    正常亮度    亮度降低 5% + 信息浮层显现  400ms   

缓动函数：`ease-out` 或 `cubic-bezier(0.4, 0, 0.2, 1)`（Material Design 标准）

4.4.2 页面过渡：淡入淡出或滑动效果

Nuxt 页面过渡配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
      duration: 200
    }
  }
})
```

```css
/* 淡入淡出 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 或：轻微上滑 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
```

4.4.3 滚动行为：平滑滚动、进度指示

全局平滑滚动：

```css
html {
  scroll-behavior: smooth;
}
```

阅读进度条（可选）：

```vue
<template>
  <div class="fixed top-0 left-0 h-1 bg-teal-500 z-50 transition-all" 
       :style="{ width: `${scrollProgress}%` }" />
</template>

<script setup>
const scrollProgress = ref(0)

onMounted(() => {
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = (window.scrollY / docHeight) * 100
  })
})
</script>
```

---

5. 部署与运维方案

5.1 构建输出

5.1.1 静态生成：`nuxt generate` 预渲染所有路由

生产构建命令：

```bash
# 开发环境验证
npm run dev

# 生产构建
npm run generate  # 或 npx nuxt generate

# 输出目录：.output/public
```

构建流程：
1. 扫描 `pages/` 目录生成路由清单
2. 执行 `useAsyncData` 与 `queryContent` 获取内容数据
3. 服务端渲染每个路由为完整 HTML
4. 提取客户端 JS/CSS，进行代码分割与压缩
5. 优化图片资源（若配置 Nuxt Image）
6. 输出至 `.output/public`，可直接部署

5.1.2 混合渲染：部分路由 SSR、部分静态

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 静态生成（默认）
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/works/**': { prerender: true },
    
    // 服务端渲染（动态数据）
    '/api/stats': { ssr: true },
    
    // 客户端渲染（重交互）
    '/admin': { ssr: false },
    
    // 增量静态再生（ISR）
    '/travel/**': { isr: 60 * 60 }  // 1小时重新验证
  }
})
```

5.2 托管平台

平台    核心优势    免费额度    最佳场景    
Vercel  原生 Nuxt 支持、边缘网络、无服务器函数  100GB 带宽/月、6000 分钟构建/月 首选推荐，完整功能体验  
Netlify Git 集成、表单处理、边缘函数    100GB 带宽/月、300 分钟构建/月  需要表单处理功能    
Cloudflare Pages    全球 CDN、Workers 集成、无限请求   无限请求、500 次构建/月 极致性能、边缘计算需求  
GitHub Pages    零成本、与仓库集成  1GB 存储、100GB 带宽/月 极简需求、完全免费  

Vercel 部署步骤：
1. 推送代码至 GitHub 仓库
2. 登录 vercel.com，点击 "New Project"
3. 导入 GitHub 仓库，框架预设选择 "Nuxt.js"
4. 环境变量配置（如有需要）
5. 点击 Deploy，自动构建与部署

5.3 域名与 HTTPS

5.3.1 自定义域名配置

1. 购买域名（推荐：Cloudflare Registrar、Namecheap、阿里云）
2. 在托管平台添加自定义域名
3. 配置 DNS 记录：
   - 类型：CNAME
   - 名称：www 或 @（裸域）
   - 值：托管平台提供的域名（如 `cname.vercel-dns.com`）
4. 等待 DNS 传播（通常 5-30 分钟）
5. 启用自动 HTTPS 证书

5.3.2 自动 SSL 证书

所有主流托管平台均集成 Let's Encrypt，自动申请与续期 SSL 证书。强制 HTTPS 重定向建议在平台层启用，或在 Nuxt 中配置：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': { headers: { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } }
    }
  }
})
```

5.4 持续集成

5.4.1 Git 工作流：内容更新触发自动构建

推荐工作流：

分支    用途    触发行为    
`main`  生产环境    推送即部署至生产    
`develop`   功能开发    推送即部署至预览环境    
`content/*` 内容编辑    推送即部署至预览环境，PR 至 main 后生产 

内容创作者友好方案：
- 使用 GitHub Web 界面直接编辑 Markdown 文件
- 或使用 Obsidian + Git 插件本地编辑后推送
- 或使用 Nuxt Studio（可视化 CMS，基于 Git）

5.4.2 预览部署：PR 预览环境

托管平台自动为每个 Pull Request 生成预览 URL，便于：
- 内容审核（编辑检查文章排版）
- 设计验证（视觉调整效果确认）
- 功能测试（新模块上线前验证）

---

6. 优秀案例参考与学习路径

6.1 开发者博客典范

6.1.1 Anthony Fu (antfu.me)：极致简约、交互细节、开源精神

网站地址：https://antfu.me

核心特征：
- 技术栈：Nuxt 3 + UnoCSS + TypeScript + Markdown
- 设计风格：纯黑白极致简约，大量留白，内容为核心
- 交互亮点：页面切换平滑过渡、代码块优雅高亮、主题切换即时响应
- 开源价值：完整源码开源，是学习现代 Nuxt 开发的最佳实践参考

学习要点：
- UnoCSS 与 Tailwind 的差异化设计思路
- 自定义 VueUse 组合式函数的组织方式
- 演讲日程、项目时间线等特殊页面的实现

6.1.2 Marina Aísa (marinaaisa.com)：双语设计、Nuxt + Markdown 实践、文艺优雅

网站地址：https://marinaaisa.com

核心特征：
- 技术栈：Nuxt 3 + Content + Tailwind CSS + i18n
- 设计风格：柔和色彩、精致排版、双语无缝切换
- 内容组织：博客文章与作品集项目独立管理，清晰的分类导航

学习要点：
- 多语言内容的管理与切换实现
- 从 Middleman 迁移到 Nuxt 的决策过程（作者有详细博客记录）
- 设计师与开发者身份的平衡表达

6.2 设计驱动案例

6.2.1 Camillette (camillette.com)：精致排版、色彩和谐、电商简约

网站地址：https://camillette.com

核心特征：
- 设计风格：温暖的女性化色调，柔和粉色与中性色平衡
- 排版技艺：不对称布局、大胆的留白、产品摄影主导
- 交互细节：导航项目细体大写字母、悬停状态的微妙反馈

学习要点：
- 电商场景下的极简设计表达
- 色彩系统与产品摄影的协调
- 字体搭配（衬线标题 + 无衬线正文）的高级感营造

6.2.2 Klur (klur.co)：极简主义、产品摄影、留白艺术

网站地址：https://klur.co

核心特征：
- 设计风格：纯白背景、单色产品摄影、信息密度极低
- 页面结构：单一大图占据视窗、隐藏式导航、滚动叙事
- 品牌表达：设计完全服务于产品，"内容即设计"的极致体现

学习要点：
- 当内容质量足够高时，设计如何"隐形"
- 滚动触发的内容显现节奏控制
- 极简风格下的品牌识别建立

6.3 内容创作者网站

6.3.1 Jules Acree：生活方式博客、柔和色调、个人品牌

核心特征：
- 温暖的视觉调性与生活化摄影
- 首页大图展示与分类筛选的清晰导航
- 个人故事与专业内容的平衡表达

6.3.2 Sean Halpin：前端开发者、卡通风格、友好交互

网站地址：https://seanhalpin.xyz

核心特征：
- 独特的卡通插画风格贯穿全站
- 手绘元素与专业能力的反差表达
- 平滑的滚动动画与悬停反馈

6.4 技术实现参考

6.4.1 Content Wind 模板：Nuxt Content + Tailwind 轻量启动

仓库地址：https://github.com/atinux/content-wind

核心特性：
- 基于 Nuxt 3 + Content v3 + Tailwind CSS
- 预配置暗黑模式、响应式导航、MDC 组件
- 文档驱动的页面渲染，自动生成的导航菜单
- MIT 协议开源，901+ Stars 

快速启动：

```bash
npx nuxi@latest init my-website -t github:atinux/content-wind
```

6.4.2 Nuxt UI Portfolio：官方组件库、快速搭建作品集

仓库地址：https://github.com/nuxt-ui-templates/portfolio

核心特性：
- 基于 Nuxt UI 组件库（50+ 可访问组件）
- 预配置响应式导航、项目卡片、联系表单
- 206 Stars，适合快速搭建专业作品集 

快速启动：

```bash
npm create nuxt@latest -- -t github:nuxt-ui-templates/portfolio
```

---

7. 开发里程碑与迭代策略

7.1 最小可行产品（MVP）

时间预估：1-2 周

核心功能：

模块    功能点  验收标准    
首页    Hero 区域、最新文章列表、个人简介   响应式布局、暗黑模式切换   
博客列表    文章卡片、标签筛选、分页    按时间倒序、标签点击筛选   
博客详情    Markdown 渲染、目录导航 代码高亮、响应式图片   
关于页面    个人介绍、社交链接  静态内容完整展示    

技术验证：
- Nuxt + Content + Tailwind 集成无误
- 构建输出正常，可部署至 Vercel
- 核心页面 Lighthouse 评分 > 90

7.2 功能扩展阶段

时间预估：
