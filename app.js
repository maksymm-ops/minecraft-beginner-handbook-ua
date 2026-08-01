const progressKey = "minecraft-book:reading-progress";
const card = document.querySelector(".topic-card");
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
const checkpoints = [...document.querySelectorAll("[data-checkpoint]")].map((element, index) => {
  const id = element.dataset.checkpoint;
  if (!element.id) element.id = id;
  return {
    id,
    element,
    label: element.dataset.checkpointLabel || (index === 0 ? "початок картки" : element.querySelector("h2")?.textContent.trim()),
  };
});

function saveProgress() {
  if (!progressStorage || !card || !checkpoints.length) return;
  const readingLine = window.innerHeight * 0.42;
  let current = checkpoints[0];

  checkpoints.forEach((checkpoint) => {
    const element = checkpoint.element;
    if (element && element.getBoundingClientRect().top <= readingLine) current = checkpoint;
  });

  try {
    progressStorage.setItem(progressKey, JSON.stringify({
      cardId: card.dataset.cardId,
      cardTitle: card.dataset.cardTitle,
      href: card.dataset.cardHref,
      anchor: current.id,
      checkpointLabel: current.label,
      savedAt: Date.now(),
    }));
  } catch {
    // The book stays readable when a browser blocks local storage.
  }
}

if (progressStorage && card && checkpoints.length) {
  let scrollTimer;
  window.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(saveProgress, 180);
  }, { passive: true });
  window.addEventListener("beforeunload", saveProgress);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveProgress();
  });
  window.setTimeout(saveProgress, 150);
}

const readinessGuides = {
  anvil: { type: "craft", title: "Перед тим як спробувати", lead: "Ковадло дороге. Зроби його тоді, коли вже маєш залізні інструменти й хочеш берегти хороші речі.", needs: ["3 блоки заліза", "4 залізні злитки", "Верстак"], note: "Разом це 31 залізний злиток. На початку гри точило часто корисніше." },
  grindstone: { type: "craft", title: "Перед тим як спробувати", lead: "Точило легко зробити рано — воно стане в пригоді, коли випадкові чари тобі не підходять.", needs: ["2 палиці", "Кам’яна плита", "2 дошки"], note: "Прокляття не знімаються. Усі інші чари з речі зникнуть." },
  enchanting: { type: "craft", title: "Як збудувати стіл зачарувань", lead: "Стіл працює одразу. Полички — не обов’язкові: вони лише відкривають сильніші варіанти пізніше.", needs: ["4 обсидіани", "2 діаманти", "1 книга"], grid: "enchant", note: "Книгу зроби зі шкіри та паперу. Залиш один блок повітря між столом і поличками; максимум — 15 поличок." },
  shield: { type: "craft", title: "Перед тим як спробувати", lead: "Щит — ранній захист. Зроби його відразу після першого заліза.", needs: ["6 дощок", "1 залізний злиток", "Верстак"], note: "Після крафту поклади щит у комірку другої руки в інвентарі." },
  barrel: { type: "craft", title: "Перед тим як спробувати", lead: "Бочка — проста річ для першої комори.", needs: ["6 дощок", "2 дерев’яні плити", "Верстак"], note: "Не потрібні залізо чи рідкісні ресурси — зручно почати зі сховища біля бази." },
  smoker: { type: "craft", title: "Перед тим як спробувати", lead: "Спочатку зроби звичайну піч, а з неї — швидку кухню.", needs: ["1 піч", "4 колоди або обкоровані колоди", "Верстак"], note: "Коптильня працює лише з їжею. Для руди залиш звичайну або плавильну піч." },
  "blast-furnace": { type: "craft", title: "Перед тим як спробувати", lead: "Плавильна піч потрібна вже тоді, коли ти часто переплавляєш руду.", needs: ["1 піч", "5 залізних злитків", "3 гладкі камені"], note: "Гладкий камінь: переплав звичайний камінь у печі ще раз." },
  composter: { type: "craft", title: "Перед тим як спробувати", lead: "Постав компостер поруч із фермою — так зайві рослини одразу стають корисними.", needs: ["7 дерев’яних плит", "Верстак", "Зайві рослини"], note: "Насіння, квіти та врожай мають різний шанс заповнити компостер." },
  "villager-job": { type: "prepare", title: "Підготуй першу майстерню", lead: "Жителю потрібне просте, безпечне місце — тоді ти не шукатимеш його по всьому селу.", needs: ["Ліжко поруч", "Робочий блок", "Світло", "Стіна або двері"], note: "Обирай дорослого жителя без професії. Нітвіт у зеленому одязі професію не візьме." },
  trading: { type: "prepare", title: "Перед першою торгівлею", lead: "Не чекай скарбу: перші смарагди можна заробити звичайними речами з бази.", needs: ["Пшениця, морква або картопля", "Палиці чи вугілля", "Житель із професією"], note: "Перший успішний обмін закріплює пропозиції жителя. Перевір їх перед тим, як торгувати." },
  librarian: { type: "prepare", title: "Збери шлях до книжки", lead: "Бібліотекар не дає чари сам — він продає книгу, яку потім переносить ковадло.", needs: ["Кафедра: книжкова полиця + 4 плити", "Смарагди", "Звичайна книга", "Ковадло"], note: "Книга з чарами → ковадло → твоя річ. До першого обміну можна змінювати професію, переставляючи кафедру." },
  "zombie-villager": { type: "prepare", title: "Підготуй лікування", lead: "Це не швидка дія. Спочатку збереш ліки й зробиш безпечну кімнату.", needs: ["Вибухове зілля слабкості", "Золоте яблуко", "Закрита кімната", "Час на лікування"], note: "Вибухове зілля: пляшка води + ферментоване павуче око, потім порох. Спершу кинь зілля, потім дай яблуко." },
  "nether-portal": { type: "portal", title: "Як збудувати портал", lead: "Це точна мінімальна рамка: 4 блоки завширшки, 5 заввишки. Усередині має лишитися отвір 2 × 3.", needs: ["10 обсидіанів", "Кресало", "Вертикальна рамка", "Їжа й будівельні блоки"], note: "Кути можна не робити з обсидіану. Після рамки клацни кресалом по внутрішньому нижньому блоку." },
  nether: { type: "prepare", title: "Набір для першого Незеру", lead: "Перший похід — це розвідка, не забіг за всіма ресурсами.", needs: ["Щит", "Золоті чоботи", "Їжа", "Будівельні блоки", "Кресало"], note: "Запиши координати порталу. У Незері одна пройдена клітинка відповідає восьми у звичайному світі." },
  stronghold: { type: "prepare", title: "Збери Око Енду", lead: "Спершу зроби очі, лише потім кидай їх у небо.", needs: ["Перлина ендера", "Порошок іфрита", "12–16 очей Енду", "Їжа й кирка"], note: "Одне око = перлина ендера + порошок іфрита. Частина очей може розбитися під час пошуку." },
  end: { type: "prepare", title: "Не поспішай у фінал", lead: "До Енду можна повернутися пізніше. Іди лише тоді, коли базовий набір уже готовий.", needs: ["Броня та щит", "Лук і стріли", "Відро води", "Їжа", "Будівельні блоки"], note: "Спочатку руйнуй кристали на вежах, а вже потім бійся з драконом." }
};

function craftSlots(kind) {
  if (kind !== "enchant") return "";
  const cells = ["", "Книга", "", "Діамант", "Обсидіан", "Діамант", "Обсидіан", "Обсидіан", "Обсидіан"];
  return `<div class="craft-slots" aria-label="Рецепт столу зачарувань">${cells.map(cell => `<span class="${cell ? "filled" : "empty"}">${cell}</span>`).join("")}</div>`;
}

function portalFrame() {
  const cells = ["corner", "obsidian", "obsidian", "corner", "obsidian", "air", "air", "obsidian", "obsidian", "air", "air", "obsidian", "obsidian", "air", "air", "obsidian", "corner", "obsidian", "obsidian", "corner"];
  return `<div class="portal-frame" aria-label="Рамка порталу: 4 блоки завширшки та 5 заввишки">${cells.map(type => `<span class="${type}" aria-hidden="true"></span>`).join("")}</div>`;
}

function readinessBlock(data) {
  const art = data.type === "portal" ? portalFrame() : craftSlots(data.grid);
  return `<section id="ready-${card.dataset.cardId}" class="readiness ${data.type}" data-checkpoint="ready-${card.dataset.cardId}"><div class="expansion-heading"><span class="block-icon">▦</span><div><p class="section-kicker">Коротка підготовка</p><h2>${data.title}</h2></div></div><p class="readiness-lead">${data.lead}</p><div class="readiness-content"><div class="needs-list"><h3>Потрібно</h3>${data.needs.map((item, index) => `<p><span>${index + 1}</span>${item}</p>`).join("")}</div>${art}<p class="readiness-note"><b>Важливо:</b> ${data.note}</p></div></section>`;
}

const readiness = readinessGuides[card.dataset.cardId];
if (readiness) {
  const target = card.querySelector(".how-it-works");
  if (target) target.insertAdjacentHTML("beforebegin", readinessBlock(readiness));
}

const sectionFourOrder = {
  "nether-portal": { position: "Розділ 4 · картка 1 із 5" },
  nether: { position: "Розділ 4 · картка 2 із 5", next: "potions.html" },
  potions: { position: "Розділ 4 · картка 3 із 5" },
  stronghold: { position: "Розділ 4 · картка 4 із 5", previous: "potions.html" },
  end: { position: "Розділ 4 · картка 5 із 5" }
};
const sectionFour = sectionFourOrder[card.dataset.cardId];
if (sectionFour) {
  const position = document.querySelector(".position");
  if (position) position.textContent = sectionFour.position;
  if (sectionFour.next) document.querySelector(".pager .primary")?.setAttribute("href", sectionFour.next);
  if (sectionFour.previous) document.querySelector(".pager .secondary")?.setAttribute("href", sectionFour.previous);
}
