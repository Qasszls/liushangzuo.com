<template>
  <div class="max-w-3xl mx-auto px-6 md:px-12 py-20">
    <div class="text-center mb-16">
      <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: var(--font-title)">
        柳尚佐
      </h1>
      <p class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl mx-auto">
        开发者 / 摄影爱好者 / 旅行者
      </p>
    </div>

    <div class="prose prose-lg dark:prose-invert prose-stone max-w-none mb-16">
      <p>
        你好，欢迎来到我的个人空间。这里记录着日常的思考、旅途的见闻、镜头捕捉的瞬间，以及技术探索的心得。
      </p>
      <p>
        我相信，记录是一种与时间对话的方式。文字赋予思想形状，照片定格光影片刻，而代码则构建连接人与世界的桥梁。
      </p>
    </div>

    <!-- Social Links -->
    <div class="flex justify-center gap-4">
      <a
        v-for="link in socialLinks"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="p-4 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
        :aria-label="link.label"
      >
        <Icon :name="link.icon" class="w-5 h-5" />
      </a>
      <div
        class="p-4 rounded-full bg-stone-100 dark:bg-stone-800 cursor-default"
        title="微信：Zlsqass006"
        aria-label="微信：Zlsqass006"
      >
        <Icon name="ph:wechat-logo" class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const socialLinks = [
  { href: 'https://github.com/Qasszls', icon: 'ph:github-logo', label: 'GitHub' },
  { href: 'mailto:1561790480@qq.com', icon: 'ph:envelope', label: 'Email' },
]

useHead({
  title: '关于',
  meta: [{ name: 'description', content: '关于我的个人介绍' }],
})
</script>
