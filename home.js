const progressKey = "minecraft-book:reading-progress";
const progressTitle = document.querySelector("[data-progress-title]");
const progressDescription = document.querySelector("[data-progress-description]");
const continueLinks = document.querySelectorAll("[data-continue]");
const continuePanel = document.querySelector(".continue-panel");

function getAvailableStorage() {
  try {
    const storage = window.localStorage;
    const testKey = `${progressKey}:test`;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

const progressStorage = getAvailableStorage();

let savedProgress = null;

if (progressStorage) {
  try {
    savedProgress = JSON.parse(progressStorage.getItem(progressKey));
  } catch {
    try {
      progressStorage.removeItem(progressKey);
    } catch {
      // The page remains usable if storage becomes unavailable mid-session.
    }
  }
} else {
  continuePanel?.setAttribute("hidden", "");
  continueLinks.forEach((link) => link.setAttribute("hidden", ""));
}

if (savedProgress?.href && savedProgress?.anchor && savedProgress?.cardTitle) {
  const resumeUrl = `${savedProgress.href}#${savedProgress.anchor}`;

  continueLinks.forEach((link) => {
    link.href = resumeUrl;
  });

  document.querySelector(".continue-link").textContent = `Продовжити: ${savedProgress.cardTitle} →`;
  document.querySelector(".continue-panel [data-continue]").textContent = "Продовжити читати →";
  progressTitle.textContent = "Продовжимо з місця, де ти зупинився";
  progressDescription.textContent = `${savedProgress.cardTitle} · ${savedProgress.checkpointLabel}`;
}
