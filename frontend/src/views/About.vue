<!-- frontend/src/views/About.vue -->
<template>
  <div class="about-page">
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">嘉原地产</router-link>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <div class="container content">
      <div class="hero-card card">
        <h1>嘉原地产</h1>
        <p class="slogan">专业、诚信、温暖，为您找到理想的家</p>
      </div>

      <div class="info-grid">
        <div class="info-card card">
          <h3>公司简介</h3>
          <p>嘉原地产是一家专注于本地房产服务的中介机构，致力于为客户提供专业、透明、高效的二手房买卖、新房代理和房屋租赁服务。我们深耕本地市场，了解每一个小区的特点和价值。</p>
        </div>

        <div class="info-card card">
          <h3>服务范围</h3>
          <ul>
            <li>二手房买卖</li>
            <li>新房代理</li>
            <li>房屋租赁</li>
            <li>房产咨询</li>
          </ul>
        </div>

        <div class="info-card card">
          <h3>联系我们</h3>
          <p><strong>电话：</strong>400-XXX-XXXX</p>
          <p><strong>地址：</strong>XX市XX区XX路XX号</p>
          <p><strong>工作时间：</strong>周一至周日 9:00-18:00</p>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <p>© 2026 嘉原地产 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  background: var(--color-card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 20px;
  color: var(--color-accent);
  font-weight: 700;
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  font-size: 15px;
  color: var(--color-text);
}
nav a.router-link-exact-active {
  color: var(--color-accent);
}
.content {
  padding: 20px 16px;
}
.hero-card {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: #fff;
  margin-bottom: 20px;
}
.hero-card h1 {
  font-size: 28px;
  margin-bottom: 8px;
}
.slogan {
  font-size: 16px;
  opacity: 0.9;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.info-card {
  padding: 20px;
}
.info-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--color-accent);
}
.info-card p, .info-card li {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
}
.info-card ul {
  padding-left: 20px;
}
.footer {
  background: var(--color-text);
  color: var(--color-text-secondary);
  text-align: center;
  padding: 20px 0;
  margin-top: 32px;
}
</style>
