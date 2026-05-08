<template>
  <div class="about-page">
    <!-- 顶部信息条 -->
    <div class="top-bar">
      <div class="container top-bar-inner">
        <span>深圳龙岗房产信息网</span>
        <div class="top-links">
          <a href="tel:13603080608">📞 13603080608</a>
          <router-link to="/admin/login">管理登录</router-link>
        </div>
      </div>
    </div>

    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">嘉</span>
          <span class="logo-text">嘉原地产</span>
        </router-link>
        <nav class="main-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about" class="active">关于我们</router-link>
        </nav>
      </div>
    </header>

    <section class="about-hero">
      <div class="container">
        <span class="eyebrow">关于嘉原</span>
        <h1>深耕龙岗，让买房租房更踏实</h1>
        <p>我们专注深圳龙岗区房产市场，熟悉每一个小区的特点和价值，用透明、专业、温暖的服务陪您完成重要选择。</p>
      </div>
    </section>

    <main class="container content">
      <section class="intro-card card">
        <h2>公司简介</h2>
        <p>深圳市嘉原地产是一家专注于龙岗区房产服务的中介机构，致力于为客户提供专业、透明、高效的二手房买卖、新房代理和房屋租赁服务。我们深耕龙岗多年，熟悉龙岗中心城、布吉、坂田、横岗等各大片区的楼盘行情和社区配套，能够精准匹配您的需求。我们重视真实房源、清晰沟通和长期口碑，让每一次咨询都更安心。</p>
      </section>

      <section class="info-grid">
        <div class="info-card card">
          <span class="icon">买</span>
          <h3>二手房买卖</h3>
          <p>从房源匹配、实地看房到交易流程，专人协助把关，确保每一步清晰透明。</p>
        </div>
        <div class="info-card card">
          <span class="icon">新</span>
          <h3>新房代理</h3>
          <p>精选龙岗区优质新盘，帮您了解价格、户型和周边配套，抢先锁定心仪房源。</p>
        </div>
        <div class="info-card card">
          <span class="icon">租</span>
          <h3>房屋租赁</h3>
          <p>匹配通勤、预算和生活需求，龙岗各区优质租房资源，减少来回奔波。</p>
        </div>
      </section>

      <section class="areas-card card">
        <h2>服务区域</h2>
        <div class="area-tags">
          <span v-for="a in areas" :key="a">{{ a }}</span>
        </div>
      </section>

      <section class="contact-card">
        <div>
          <h2>联系我们</h2>
          <p><strong>电话：</strong><a href="tel:13603080608">13603080608</a></p>
          <p><strong>地址：</strong>深圳市龙岗区龙岗中心城</p>
          <p><strong>工作时间：</strong>周一至周日 9:00-18:00</p>
        </div>
        <a href="tel:13603080608" class="contact-btn">立即咨询</a>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <strong>嘉原地产</strong>
          <p>专注深圳龙岗区房产服务</p>
          <p>电话：13603080608</p>
        </div>
        <div class="footer-links">
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about">关于我们</router-link>
        </div>
        <span class="footer-copy">© 2026 嘉原地产 版权所有</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const areas = [
  '龙岗中心城', '布吉', '坂田', '横岗', '龙城',
  '坪地', '南湾', '吉华', '园山', '宝龙',
];
</script>

<style scoped>
.top-bar {
  background: #2D2118;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  padding: 6px 0;
}
.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-links {
  display: flex;
  gap: 20px;
}
.top-links a {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
}
.top-links a:hover { color: #fff; }

.header {
  background: #fff;
  border-bottom: 2px solid var(--color-accent);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(45,33,24,0.06);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B6F47, #C4A882);
  color: #fff;
  border-radius: 10px;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
}
.logo-text {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 2px;
}
.main-nav {
  display: flex;
  gap: 4px;
}
.main-nav a {
  padding: 8px 18px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
}
.main-nav a:hover {
  color: var(--color-accent);
  background: rgba(139,111,71,0.06);
}
.main-nav a.active,
.main-nav a.router-link-exact-active {
  color: #fff;
  background: var(--color-accent);
}

.about-hero {
  position: relative;
  padding: 72px 0 68px;
  overflow: hidden;
  background: var(--bg-cream);
  border-bottom: 1px solid var(--color-border-light);
}
.about-hero::after {
  content: '';
  position: absolute;
  top: -180px;
  right: -80px;
  width: 460px;
  height: 460px;
  background: radial-gradient(circle, rgba(196, 168, 130, 0.18), transparent 70%);
  border-radius: 50%;
}
.about-hero .container {
  position: relative;
  z-index: 1;
}
.eyebrow {
  display: inline-block;
  margin-bottom: 14px;
  padding: 5px 12px;
  background: rgba(139, 111, 71, 0.08);
  border-radius: 100px;
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 800;
}
.about-hero h1 {
  max-width: 680px;
  margin-bottom: 16px;
  font-family: var(--font-serif);
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.28;
}
.about-hero p {
  max-width: 640px;
  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 1.8;
}
.content {
  padding-top: 40px;
  padding-bottom: 72px;
}
.intro-card {
  padding: 34px;
  margin-bottom: 24px;
}
.intro-card h2,
.contact-card h2,
.areas-card h2 {
  margin-bottom: 14px;
  font-family: var(--font-serif);
  font-size: 26px;
}
.intro-card p {
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.9;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}
.info-card {
  padding: 28px 24px;
  transition: var(--transition);
}
.info-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}
.icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  background: linear-gradient(135deg, rgba(139, 111, 71, 0.1), rgba(196, 168, 130, 0.16));
  border-radius: 14px;
  color: var(--color-accent);
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 800;
}
.info-card h3 {
  margin-bottom: 8px;
  font-size: 18px;
}
.info-card p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.areas-card {
  padding: 34px;
  margin-bottom: 24px;
}
.area-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.area-tags span {
  padding: 8px 18px;
  background: var(--bg-cream);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s;
}
.area-tags span:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.contact-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 36px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  border-radius: var(--radius-xl);
  color: #fff;
}
.contact-card p {
  margin-top: 6px;
  opacity: 0.86;
}
.contact-card a {
  color: #fff;
}
.contact-btn {
  display: inline-flex;
  min-height: 48px;
  flex-shrink: 0;
  align-items: center;
  padding: 0 30px;
  background: #fff;
  border-radius: var(--radius);
  color: var(--color-accent-dark);
  font-weight: 800;
  text-decoration: none;
  transition: var(--transition);
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Footer */
.footer {
  padding: 40px 0 28px;
  background: #2D2118;
  color: rgba(255,255,255,0.5);
}
.footer-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.footer-brand strong {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 18px;
  margin-bottom: 8px;
}
.footer-brand p {
  font-size: 13px;
  margin-bottom: 4px;
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  color: rgba(255,255,255,0.5);
  font-size: 14px;
  text-decoration: none;
}
.footer-links a:hover {
  color: #fff;
}
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }
  .main-nav {
    gap: 0;
  }
  .main-nav a {
    padding: 8px 10px;
    font-size: 14px;
  }
  .about-hero {
    padding: 52px 0;
  }
  .about-hero p {
    font-size: 15px;
  }
  .content {
    padding-top: 28px;
    padding-bottom: 48px;
  }
  .intro-card,
  .contact-card {
    padding: 26px 22px;
  }
  .contact-card,
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
