<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="code">404</div>
      <h1>页面未找到</h1>
      <p>您访问的页面不存在或已被移除</p>
      <router-link to="/" class="btn">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}
.not-found-content {
  max-width: 480px;
}
.code {
  font-family: var(--font-serif);
  font-size: 120px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: 16px;
  opacity: 0.6;
}
h1 {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--color-text);
  margin-bottom: 12px;
}
p {
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  font-size: 16px;
}
.btn {
  display: inline-block;
  padding: 12px 32px;
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}
.btn:hover {
  background: var(--color-accent-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
</style>
