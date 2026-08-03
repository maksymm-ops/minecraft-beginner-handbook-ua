const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setRevealTargets() {
  const selectors = document.body.classList.contains("home-page")
    ? [".cover-art", ".cover-copy", ".contents-header", ".continue-panel", ".chapter-card"]
    : [".intro", ".hero-art", ".topic-card > section", ".card-footer"];

  const targets = selectors.flatMap((selector) => [...document.querySelectorAll(selector)]);
  targets.forEach((target, index) => {
    target.dataset.reveal = "";
    target.dataset.revealIndex = String(index);
    target.style.setProperty("--reveal-delay", "0ms");
  });
  return targets;
}

function revealContent() {
  const targets = setRevealTargets();
  if (!targets.length || prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("motion-ready");
  const openingTargets = targets.slice(0, 2);
  openingTargets.forEach((target, index) => {
    target.dataset.revealStyle = index === 0 ? "art" : "copy";
  });

  window.setTimeout(() => {
    openingTargets.forEach((target, index) => {
      target.style.setProperty("--reveal-delay", `${index * 110}ms`);
    });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        openingTargets.forEach((target) => target.classList.add("is-revealed"));
      });
    });
  }, 110);

  const pendingReveals = new Set();
  let flushTimer;

  function flushReveals() {
    const batch = [...pendingReveals].sort((a, b) => Number(a.dataset.revealIndex) - Number(b.dataset.revealIndex));
    pendingReveals.clear();
    batch.forEach((target, index) => {
      target.style.setProperty("--reveal-delay", `${index * 80}ms`);
      target.classList.add("is-revealed");
    });
  }

  window.setTimeout(() => {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        pendingReveals.add(entry.target);
        activeObserver.unobserve(entry.target);
      });
      window.clearTimeout(flushTimer);
      flushTimer = window.setTimeout(flushReveals, 0);
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.slice(2).forEach((target) => observer.observe(target));
  }, 240);
}

revealContent();
