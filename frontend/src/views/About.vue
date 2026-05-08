<template>
  <div class="about-page">
    <!-- 顶部信息条 -->
    <div class="top-bar">
      <div class="container top-bar-inner">
        <span class="top-brand">深圳龙岗房产信息网</span>
        <div class="top-links">
          <a href="tel:13603080608">
            <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/></svg>
            吴女士 13603080608
          </a>
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
      <div class="hero-grain"></div>
      <div class="container hero-content">
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
          <p><strong>联系人：</strong>吴女士</p>
          <p><strong>电话：</strong><a href="tel:13603080608">13603080608</a></p>
          <p><strong>地址：</strong>深圳市龙岗区龙岗中心城</p>
          <p><strong>工作时间：</strong>周一至周日 9:00-18:00</p>
        </div>
        <a href="tel:13603080608" class="contact-btn">立即咨询</a>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="gold-line"></div>
      <div class="container footer-inner">
        <div class="footer-brand">
          <strong>嘉原地产</strong>
          <p>专注深圳龙岗区房产服务</p>
          <p>联系人：吴女士 · <a href="tel:13603080608">13603080608</a></p>
        </div>
        <div class="footer-links">
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about">关于我们</router-link>
        </div>
        <span class="footer-copy">&copy; 2026 嘉原地产 版权所有</span>
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
  background: var(--color-text);
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  padding: 7px 0;
}
.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-brand {
  font-family: var(--font-display);
  letter-spacing: 0.08em;
}
.top-links {
  display: flex;
  gap: 20px;
  align-items: center;
}
.top-links a {
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.25s;
}
.top-links a:hover { color: var(--color-primary); }

.header {
  background: rgba(248, 244, 238, 0.92);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(30, 22, 16, 0.04);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 66px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--color-accent), var(--color-gold));
  color: #fff;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(122, 92, 58, 0.25);
}
.logo-text {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 3px;
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
  transition: all 0.25s var(--ease-out);
}
.main-nav a:hover {
  color: var(--color-accent);
  background: var(--color-accent-glow);
}
.main-nav a.active,
.main-nav a.router-link-exact-active {
  color: var(--color-accent-dark);
  font-weight: 700;
  background: rgba(122, 92, 58, 0.06);
}

/* Hero */
.about-hero {
  position: relative;
  padding: 76px 0 72px;
  overflow: hidden;
  background: linear-gradient(165deg, #2A1F15 0%, #1E1610 40%, #2A1F15 100%);
}
.hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 1;
}
.eyebrow {
  display: inline-block;
  margin-bottom: 16px;
  padding: 6px 18px;
  background: rgba(184, 148, 62, 0.12);
  border: 1px solid rgba(184, 148, 62, 0.2);
  border-radius: 100px;
  color: var(--color-gold);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.about-hero h1 {
  max-width: 680px;
  margin-bottom: 18px;
  font-family: var(--font-display);
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.28;
  color: #fff;
  letter-spacing: 0.04em;
}
.about-hero p {
  max-width: 640px;
  color: rgba(196, 168, 130, 0.6);
  font-size: 17px;
  line-height: 1.8;
}

/* Content */
.content {
  padding-top: 44px;
  padding-bottom: 72px;
  animation: fadeInUp 0.6s var(--ease-out) both;
}
.intro-card {
  padding: 36px;
  margin-bottom: 24px;
}
.intro-card h2,
.contact-card h2,
.areas-card h2 {
  margin-bottom: 16px;
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 0.04em;
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
  padding: 30px 24px;
  transition: var(--transition);
}
.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: linear-gradient(145deg, rgba(122, 92, 58, 0.08), rgba(184, 148, 62, 0.12));
  border: 1px solid rgba(184, 148, 62, 0.15);
  border-radius: 14px;
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
}
.info-card h3 {
  margin-bottom: 8px;
  font-size: 18px;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}
.info-card p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

/* Areas */
.areas-card {
  padding: 36px;
  margin-bottom: 24px;
}
.area-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.area-tags span {
  padding: 8px 20px;
  background: var(--bg-cream);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  transition: all 0.25s var(--ease-out);
}
.area-tags span:hover {
  border-color: var(--color-primary);
  color: var(--color-accent);
  transform: translateY(-1px);
}

/* Contact */
.contact-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding: 38px;
  background: linear-gradient(145deg, var(--color-accent), var(--color-accent-dark));
  border-radius: var(--radius-xl);
  color: #fff;
  position: relative;
  overflow: hidden;
}
.contact-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(184, 148, 62, 0.15), transparent 60%);
  border-radius: 50%;
}
.contact-card h2 {
  position: relative;
}
.contact-card p {
  margin-top: 6px;
  opacity: 0.86;
  position: relative;
}
.contact-card a {
  color: #fff;
}
.contact-btn {
  display: inline-flex;
  min-height: 48px;
  flex-shrink: 0;
  align-items: center;
  padding: 0 32px;
  background: #fff;
  border-radius: var(--radius);
  color: var(--color-accent-dark);
  font-weight: 800;
  font-family: var(--font-display);
  text-decoration: none;
  transition: var(--transition);
  position: relative;
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Footer */
.footer {
  padding: 0;
  background: var(--color-text);
  color: rgba(255,255,255,0.45);
}
.footer .gold-line {
  height: 2px;
  background: linear-gradient(90deg, transparent 5%, var(--color-gold), transparent 95%);
  opacity: 0.25;
}
.footer-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 0 28px;
}
.footer-brand strong {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.08em;
}
.footer-brand p {
  font-size: 13px;
  margin-bottom: 5px;
}
.footer-brand a {
  color: var(--color-primary-light);
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  color: rgba(255,255,255,0.45);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--color-primary); }
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }
  .main-nav a {
    padding: 8px 10px;
    font-size: 14px;
  }
  .about-hero {
    padding: 52px 0;
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
