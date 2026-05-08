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

    <section class="about-hero">
      <div class="container">
        <span class="eyebrow">关于嘉原</span>
        <h1>把买房租房这件事，做得更踏实</h1>
        <p>我们深耕本地房产市场，熟悉每一个小区的特点和价值，用透明、专业、温暖的服务陪您完成重要选择。</p>
      </div>
    </section>

    <main class="container content">
      <section class="intro-card card">
        <h2>公司简介</h2>
        <p>嘉原地产是一家专注于本地房产服务的中介机构，致力于为客户提供专业、透明、高效的二手房买卖、新房代理和房屋租赁服务。我们重视真实房源、清晰沟通和长期口碑，让每一次咨询都更安心。</p>
      </section>

      <section class="info-grid">
        <div class="info-card card">
          <span class="icon">买</span>
          <h3>二手房买卖</h3>
          <p>从房源匹配、实地看房到交易流程，专人协助把关。</p>
        </div>
        <div class="info-card card">
          <span class="icon">新</span>
          <h3>新房代理</h3>
          <p>精选本地优质新盘，帮您了解价格、户型和配套。</p>
        </div>
        <div class="info-card card">
          <span class="icon">租</span>
          <h3>房屋租赁</h3>
          <p>匹配通勤、预算和生活需求，减少来回奔波。</p>
        </div>
      </section>

      <section class="contact-card">
        <div>
          <h2>联系我们</h2>
          <p><strong>电话：</strong>400-XXX-XXXX</p>
          <p><strong>地址：</strong>XX市XX区XX路XX号</p>
          <p><strong>工作时间：</strong>周一至周日 9:00-18:00</p>
        </div>
        <router-link to="/list" class="contact-btn">先看看房源</router-link>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <span>© 2026 嘉原地产 版权所有</span>
        <span>专业房产服务平台</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
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
.contact-card h2 {
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
  transition: var(--transition);
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.footer {
  padding: 28px 0;
  background: var(--color-text);
  color: rgba(255, 255, 255, 0.58);
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
}
@media (max-width: 768px) {
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
