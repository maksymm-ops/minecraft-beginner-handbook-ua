const topicId = new URLSearchParams(location.search).get('topic') || 'redstone';
const icon = (name, label) => `<img src="assets/topic-icons/${name}.png" alt="${label}">`;

const mechanismExamples = {
  redstone: { title: '6 ідей для перших механізмів', intro: 'Кожна ідея працює за одним правилом: щось дає сигнал, редстоун або блок передає його, а інший блок робить дію. Почни з того, що одразу стане в пригоді на базі.', shelf: [
    { icon: 'mechanism-lamp', title: 'Світло одним ричагом', result: 'Вмикає все світло в кімнаті з одного місця.', parts: 'ричаг · редстоун · лампа', flow: 'Ричаг дає сигнал, пил передає його, лампа світиться.' },
    { icon: 'mechanism-doorbell', title: 'Дзвінок біля дверей', result: 'Кнопка грає звук, коли хтось прийшов.', parts: 'кнопка · редстоун · нотний блок', flow: 'Натискаєш кнопку — сигнал доходить до нотного блока.' },
    { icon: 'mechanism-secret-door', title: 'Таємний прохід', result: 'Стіна відсувається й відкриває схованку.', parts: 'ричаг · редстоун · 2 липкі поршні · блоки стіни', flow: 'Сигнал вмикає поршні, а вони рухають блоки стіни.' },
    { icon: 'mechanism-cane-farm', title: 'Ферма тростини', result: 'Тростина ламається сама, коли виросте.', parts: 'вода · тростина · спостерігач · поршень', flow: 'Спостерігач бачить ріст і коротко вмикає поршень.' },
    { icon: 'mechanism-armor', title: 'Станція з бронею', result: 'Наступаєш на плиту — роздавач надягає шолом.', parts: 'натискна плита · роздавач · шолом', flow: 'Плита дає сигнал, а роздавач використовує предмет усередині.' },
    { icon: 'mechanism-fireworks', title: 'Кнопка для феєрверків', result: 'Один клік запускає святковий постріл.', parts: 'кнопка · роздавач · феєрверк', flow: 'Кнопка вмикає роздавач, а він випускає ракету.' }
  ] },
  lever: { title: 'Що можна збудувати', intro: 'Ричаг — це простий перемикач. З ним легко побачити, як одна дія запускає цілу маленьку конструкцію.', example: { title: 'Таємний прохід у стіні', result: 'Звичайна стіна від’їде й відкриє схованку.', parts: [['lever', 'Ричаг'], ['redstone', 'Редстоун'], ['piston', '2 липкі поршні'], ['wall', 'Блоки стіни']], flow: 'Ричаг вмикає сигнал → поршні рухають блоки → прохід відкритий.', steps: ['Постав два липкі поршні за блоками стіни.', 'З’єднай їх із ричагом редстоуном.', 'Перевір конструкцію спочатку без цінних речей за стіною.'] } },
  observer: { title: 'Що можна збудувати', intro: 'Спостерігач корисний там, де світ сам змінюється. Він помічає цю зміну й коротко вмикає інший блок.', example: { title: 'Проста ферма тростини', result: 'Верх тростини зламається сам, коли вона виросте.', parts: [['observer', 'Спостерігач'], ['piston', 'Поршень'], ['redstone', 'Редстоун'], ['cane', 'Тростина']], flow: 'Тростина виросла → спостерігач помітив → поршень штовхнув.', steps: ['Посади тростину поруч із водою.', 'Постав спостерігач так, щоб він дивився на верх тростини.', 'Під’єднай його до поршня та перевір на одному стеблі.'] } },
  dispenser: { title: 'Що можна збудувати', intro: 'Роздавач перетворює сигнал на дію. Для першої перевірки обери безпечний предмет, щоб одразу побачити результат.', example: { title: 'Автоматичний шолом', result: 'Стаєш на плиту — роздавач одягає шолом.', parts: [['plate', 'Натискна плита'], ['dispenser', 'Роздавач'], ['helmet', 'Шолом']], flow: 'Ти наступив → сигнал пішов → роздавач одягнув броню.', steps: ['Постав роздавач перед місцем, де стоятиме гравець.', 'Поклади в нього один шолом.', 'Під’єднай натискну плиту та наступи на неї.'] } }
};

const rareScenarios = {
  copper: { title: 'Знайшов — що далі?', where: 'Шукай мідну руду під землею, а потім переплав її в злитки.', now: 'Збудуй маленький зразок біля бази та виріши: хочеш блискучу мідь чи зелений, старий вигляд.', extra: true },
  wax: { title: 'Знайшов — що далі?', where: 'Стільники дають бджолині гнізда та вулики. Багаття під вуликом допомагає зібрати їх без злості бджіл.', now: 'Дочекайся потрібного кольору міді й використай стільники на блоці — колір зупиниться.' },
  'trial-key': { title: 'Знайшов — що далі?', where: 'Trial Key трапляється у випробувальних палатах — підземних кімнатах із боями та нагородами.', now: 'Шукай саме Vault: ключ працює на ньому, а не на звичайній скрині. Візьми щит, їжу й будівельні блоки.' },
  'shulker-box': { title: 'Знайшов — що далі?', where: 'Шалкери живуть у містах Енду. З панцирів і скрині робиться шалкерова скринька.', now: 'Зроби перші три набори: «шахта», «будівництво» й «Незер». Так у рюкзаку не буде хаосу.' }
};

const moreFinds = [
  ['amethyst', 'Геода аметисту', 'Глибоко під землею. Дає кристали для підзорної труби й тонованого скла.', 'Не ламай блок, на якому ростуть кристали.'],
  ['name-tag', 'Бірка', 'Трапляється у скринях та серед рибальських скарбів. Дає мобу ім’я.', 'Назви улюблену тварину через ковадло.'],
  ['totem', 'Тотем безсмертя', 'Його можна здобути з заклинача під час рейду або в лісовому маєтку.', 'Тримай у другій руці для складної подорожі.'],
  ['echo-shard', 'Ехо-уламок', 'Шукай у стародавньому місті. Потрібен для компаса відновлення.', 'Залиш це як наступну, складнішу експедицію.']
];

function visualPart([name, label]) {
  const art = name === 'lamp' ? '<span class="diagram-pixel lamp" aria-hidden="true"></span>' : name === 'piston' ? '<span class="diagram-pixel piston" aria-hidden="true"></span>' : name === 'wall' ? '<span class="diagram-pixel wall" aria-hidden="true"></span>' : name === 'cane' ? '<span class="diagram-pixel cane" aria-hidden="true"></span>' : name === 'plate' ? '<span class="diagram-pixel plate" aria-hidden="true"></span>' : name === 'helmet' ? '<span class="diagram-pixel helmet" aria-hidden="true"></span>' : icon(name, '');
  return `<span class="build-part">${art}<b>${label}</b></span>`;
}

function mechanismBlock(data) {
  if (data.shelf) {
    return `<section class="build-examples" data-checkpoint="build-example"><div class="expansion-heading"><span class="block-icon">⌘</span><div><p class="section-kicker">Маленькі механізми для бази</p><h2>${data.title}</h2></div></div><p class="expansion-intro">${data.intro}</p><div class="mechanism-shelf">${data.shelf.map(item => `<article><img class="mechanism-icon" src="assets/topic-icons/${item.icon}.png" alt=""><h3>${item.title}</h3><p class="mechanism-result">${item.result}</p><div class="mechanism-group need"><h4><i aria-hidden="true"></i>Потрібно</h4><p>${item.parts}</p></div><div class="mechanism-group flow"><h4><i aria-hidden="true"></i>Як працює</h4><p>${item.flow}</p></div></article>`).join('')}</div></section>`;
  }
  const item = data.example;
  return `<section class="build-examples" data-checkpoint="build-example"><div class="expansion-heading"><span class="block-icon">⌘</span><div><p class="section-kicker">Маленький механізм для бази</p><h2>${data.title}</h2></div></div><p class="expansion-intro">${data.intro}</p><article class="build-card"><div><p class="result-label">Що вийде</p><h3>${item.title}</h3><p>${item.result}</p></div><div class="build-flow" aria-label="Схема механізму">${item.parts.map(visualPart).join('<span class="flow-arrow" aria-hidden="true">→</span>')}</div><p class="signal-path"><b>Як працює:</b> ${item.flow}</p><details class="build-details"><summary>Як збудувати за три кроки <span>+</span></summary><ol>${item.steps.map(step => `<li>${step}</li>`).join('')}</ol></details></article></section>`;
}

function checkBlock() {
  const checks = [['1', 'Є сигнал?', 'Ричаг увімкнений або кнопку натиснуто.'], ['2', 'Є шлях?', 'Редстоун має дійти до потрібного блока.'], ['3', 'Правильний бік?', 'Очі спостерігача дивляться на зміну, червона точка — вихід сигналу.'], ['4', 'Є предмет?', 'Роздавачу потрібен предмет, з яким він уміє працювати.']];
  return `<section class="quick-check" data-checkpoint="mechanism-check"><div class="expansion-heading"><span class="block-icon">?</span><div><p class="section-kicker">Коли щось не рухається</p><h2>Не працює? Перевір</h2></div></div><div class="check-grid">${checks.map(([n, title, copy]) => `<article><span>${n}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></section>`;
}

function rareBlock(data) {
  const shelf = data.extra ? `<div class="discoveries-shelf"><h3>Ще варто знайти</h3><div class="discovery-grid">${moreFinds.map(([name, title, where, action]) => `<article>${icon(name, '')}<div><h4>${title}</h4><p>${where}</p><b>${action}</b></div></article>`).join('')}</div></div>` : '';
  return `<section class="rare-actions" data-checkpoint="rare-scenario"><div class="expansion-heading"><span class="block-icon">✦</span><div><p class="section-kicker">Маленький план для пригоди</p><h2>${data.title}</h2></div></div><div class="find-now"><article><span>Де шукати</span><p>${data.where}</p></article><article><span>Що зробити одразу</span><p>${data.now}</p></article></div>${shelf}</section>`;
}

const topicCard = document.querySelector('.topic-card');
if (topicCard && mechanismExamples[topicId]) topicCard.querySelector('.important').insertAdjacentHTML('beforebegin', mechanismBlock(mechanismExamples[topicId]) + checkBlock());
if (topicCard && rareScenarios[topicId]) topicCard.querySelector('.important').insertAdjacentHTML('beforebegin', rareBlock(rareScenarios[topicId]));
