export default defineAppConfig({
  // 站点基本信息
  site: {
    name: '柳尚佐',
    email: '1561790480@qq.com',
    title: '柳尚佐 — 记录生活，分享思考',
    description: '柳尚佐的个人空间，记录技术、旅行与摄影的思考与见闻',
    socialLinks: [
      { href: 'https://github.com/Qasszls', icon: 'ph:github-logo', label: 'GitHub' },
      { href: 'mailto:1561790480@qq.com', icon: 'ph:envelope', label: 'Email' },
      { icon: 'ph:wechat-logo', label: '微信：Zlsqass006', wechat: 'Zlsqass006' },
    ],
    author: {
      avatar: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=200&h=200&fit=crop&crop=face',
      bio: '记录生活，分享思考。',
    },
  },
  icon: {
    aliases: {
      'dark-mode': 'ph:moon',
      'light-mode': 'ph:sun',
    },
  },
})
