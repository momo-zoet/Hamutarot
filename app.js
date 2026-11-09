(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  const ICON = { major: '🌟', wands: '🔥', cups: '🍵', swords: '⚔️', pentacles: '🥜' };
  const SUIT_NAME = { major: '大阿爾克那', wands: '權杖', cups: '聖杯', swords: '寶劍', pentacles: '錢幣' };
  const REVERSED_CHANCE = 1 / 2; // 逆位出現機率
  const SNACKS = ['葵花子', '南瓜子', '花生', '起司丁', '小黃瓜片', '蘋果片', '燕麥片', '胡蘿蔔', '玉米粒', '核桃'];

  const DAILY_TIPS = {
    up: [
      '今天適合行動，先從最小的一步開始。',
      '把今天的開心事記下來，晚上再回味一次。',
      '對身邊的人說句好話，好運會繞一圈回來。',
      '相信自己的直覺，今天的你比想像中靠譜。'
    ],
    rev: [
      '今天放慢一點，留點餘裕給自己。',
      '遇到卡卡的事先深呼吸，喝口水再處理。',
      '不用逼自己一次做完，小步前進就很棒。',
      '早點回窩休息，明天再繼續。'
    ]
  };

  // 主題解讀範本：{0}{1}{2} 會換成該牌的關鍵字
  const TOPICS = {
    love: {
      name: '愛情', icon: '💕',
      up: [
        '感情裡，「{0}」是你這陣子的主旋律，也別忽略「{1}」帶來的感受。',
        '談到愛情，這張牌提醒你留意「{0}」與「{2}」，用真心去感受就對了。',
        '不管單身或有伴，「{0}」都是值得珍惜的能量。'
      ],
      rev: [
        '感情裡先留意「{0}」的狀況，這是目前需要調整的地方。',
        '關係中可能出現「{0}」或「{1}」，不用慌，看見就是改變的開始。',
        '愛情上「{2}」是個小提醒，多一點溝通與耐心會有幫助。'
      ],
      tipUp: ['放膽表達心意，鼠鼠也要勇敢地把葵花子分給喜歡的人。', '今天對在乎的人說句溫暖的話吧。'],
      tipRev: ['先好好愛自己，再回頭處理關係，一步一步來。', '把想說的話整理好再開口，會更順利。']
    },
    career: {
      name: '事業', icon: '💼',
      up: [
        '工作上，「{0}」會是你的助力，善用「{1}」讓進度更順。',
        '事業方面，這張牌帶來「{0}」與「{2}」的能量，適合主動出擊。',
        '職場中「{0}」值得你放在心上，好好把握眼前的節奏。'
      ],
      rev: [
        '工作上先留意「{0}」，這可能是目前卡住你的地方。',
        '事業上要小心「{0}」或「{1}」，先整理再前進。',
        '職場裡「{2}」是個提醒，調整做法會比硬撐有效。'
      ],
      tipUp: ['列出今天最重要的一件事，專心把它做完。', '把想法寫下來並開始第一步，鼠鼠行動派最可愛。'],
      tipRev: ['別硬撐，累了就休息，換個方法再試。', '先確認優先順序，一次只推一件事。']
    },
    study: {
      name: '學業', icon: '📚',
      up: [
        '學習上，「{0}」是你的優勢，也記得運用「{1}」來幫助理解。',
        '學業方面，這張牌帶來「{0}」與「{2}」，是穩定吸收知識的好時機。',
        '讀書時抓住「{0}」的感覺，效率會明顯提升。'
      ],
      rev: [
        '學習上先留意「{0}」，可能是目前效率不彰的原因。',
        '學業上小心「{0}」或「{1}」，換個方式複習會更有效。',
        '讀書時「{2}」是個提醒，把目標拆小一點就不會那麼有壓力。'
      ],
      tipUp: ['今天讀書記得分段休息，每 25 分鐘喝口水。', '把今天要學的整理成小卡，睡前再看一遍。'],
      tipRev: ['先從最簡單的一小段開始，累積小成就感。', '不懂的地方先標起來，別一個人悶著。']
    },
    money: {
      name: '財運', icon: '💰',
      up: [
        '財運上，「{0}」是你的關鍵，也留意「{1}」帶來的機會。',
        '金錢方面，這張牌顯示「{0}」與「{2}」，適合穩健規劃。',
        '談到財務，「{0}」的能量在你這邊，好好運用。'
      ],
      rev: [
        '財務上先留意「{0}」，這是目前需要修正的地方。',
        '金錢方面要小心「{0}」或「{1}」，花錢前多想一下。',
        '財運裡「{2}」是個提醒，先守住基本再談增加。'
      ],
      tipUp: ['穩穩存一點，鼠鼠的冬糧也是這樣囤起來的。', '記帳一下，看清楚錢流向哪裡。'],
      tipRev: ['這陣子避免衝動消費，先觀察三天再決定。', '檢查固定支出，把不必要的收掉。']
    },
    health: {
      name: '身心', icon: '🌿',
      up: [
        '身心狀態上，「{0}」帶來好能量，也試著培養「{1}」的感覺。',
        '這張牌強調「{0}」與「{2}」，順著身體的節奏就好。',
        '狀態上「{0}」是你的資源，好好照顧它。'
      ],
      rev: [
        '身心上先留意「{0}」，身體和心情都在給你訊號。',
        '要小心「{0}」或「{1}」，別再忍耐。',
        '狀態裡「{2}」是個提醒，睡飽吃好最重要。'
      ],
      tipUp: ['今天出去走走，像鼠鼠跑輪一樣動一動。', '多喝水、早點睡，簡單就是最好的保養。'],
      tipRev: ['累了就休息，真的不舒服請找專業醫師。', '放慢腳步，給自己一個安靜的夜晚。']
    },
    relation: {
      name: '人際', icon: '🤝',
      up: [
        '人際上，「{0}」是你的魅力，也試著展現「{1}」的一面。',
        '與人相處時，這張牌帶來「{0}」與「{2}」，適合真誠交流。',
        '人際裡「{0}」會讓你和身邊的人更靠近。'
      ],
      rev: [
        '人際上先留意「{0}」，可能有些小誤會在累積。',
        '與人相處要小心「{0}」或「{1}」，說話前先停一秒。',
        '人際裡「{2}」是個提醒，保持界線也保持溫柔。'
      ],
      tipUp: ['主動傳訊息問候一位朋友，很小但很溫暖。', '今天多聽少說，對方會感受到你的真心。'],
      tipRev: ['先不急著回應，冷靜後再溝通更順暢。', '別把話藏在心裡，用溫和的方式說出來。']
    }
  };

  const fill = (t, k) => t.replace(/\{(\d)\}/g, (_, i) => k[Number(i)]);
  const pickOne = (arr, n) => arr[n % arr.length];
  // 語氣是否偏順：一般牌正位偏順；沉重的牌（高塔、死神…）正位偏吃力、逆位反而是緩解
  const isGood = (card, rev) => HARD_CARDS.has(card.en) ? rev : !rev;

  /* ---------- 工具 ---------- */
  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    h ^= h >>> 15;
    h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13;
    return h >>> 0;
  }

  let deviceCache = null;
  function deviceId() {
    if (deviceCache) return deviceCache;
    let id = storeGet('tarotarot:device');
    if (!id) {
      id = Array.from(randInts(3)).map(n => n.toString(36)).join('');
      storeSet('tarotarot:device', id);
      if (storeGet('tarotarot:device') !== id) id = 'shared'; // 無法儲存時退回「大家同一張」
    }
    deviceCache = id;
    return id;
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function randInts(n) {
    const a = new Uint32Array(n);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else for (let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 4294967296);
    return a;
  }

  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 忽略 */ }
  }

  /* ---------- 牌面元件 ---------- */
  const backImg = new Image();
  let backReady = false;
  backImg.onload = () => { backReady = true; document.querySelectorAll('.face.back').forEach(applyBack); };
  let backUrl = 'images/back.webp';
  backImg.onerror = () => {
    if (backUrl === 'images/back.webp') { backUrl = 'images/back.png'; backImg.src = backUrl; }
  };
  backImg.src = backUrl;

  function applyBack(node) {
    if (!backReady) return;
    node.style.backgroundImage = 'url("' + backUrl + '")';
    node.textContent = '';
  }

  function cardNode(card, rev, flipped, lazy) {
    const wrap = el('div', 'card' + (flipped ? ' flipped' : ''));
    const back = el('div', 'face back', '🐹');
    applyBack(back);
    const front = el('div', 'face front');
    const inner = el('div', 'inner' + (rev ? ' rev' : ''));
    const ph = el('div', 'ph',
      '<div class="ph-ico">' + ICON[card.arcana] + '</div>' +
      '<div class="ph-zh">' + card.zh + '</div>' +
      '<div class="ph-en">' + card.en + '</div>');
    inner.appendChild(ph);
    const img = new Image();
    img.alt = card.zh + '（' + card.en + '）';
    img.decoding = 'async';
    if (lazy) img.loading = 'lazy';
    let done;
    const ready = new Promise(r => { done = r; });
    // 圖片來源依序嘗試：WebP（牌庫用縮圖）→ 原本的 PNG
    const base = 'images/' + card.en;
    const srcs = lazy ? ['images/thumb/' + card.en + '.webp', base + '.webp', base + '.png'] : [base + '.webp', base + '.png'];
    let k = 0;
    img.onload = () => { ph.style.display = 'none'; done(); };
    img.onerror = () => {
      k++;
      if (k < srcs.length) img.src = encodeURI(srcs[k]);
      else { img.remove(); done(); }
    };
    img.src = encodeURI(srcs[0]);
    inner.appendChild(img);
    front.appendChild(inner);
    wrap.append(back, front);
    wrap.ready = ready;
    return wrap;
  }

  function captionHTML(card, rev) {
    return '<b>' + card.zh + '</b><span>' + card.en + '</span>' +
      '<span class="tag' + (rev ? ' rev' : '') + '">' + (rev ? '逆位' : '正位') + '</span>';
  }

  // 等圖片載好再翻牌（最多等 ms 毫秒，避免網路太慢卡住）
  const whenReady = (nodes, ms) => Promise.race([
    Promise.all(nodes.map(n => n.ready)),
    new Promise(r => setTimeout(r, ms))
  ]);

  const chips = (kw) => '<div class="chips">' + kw.map(k => '<span class="chip">' + k + '</span>').join('') + '</div>';

  /* ---------- 分頁 ---------- */
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ---------- 今日運勢 ---------- */
  function dailyDraw(key) {
    const rev = hash('rev:' + key) % 2 === 0;
    const luckBase = hash('luck:' + key) % 3;
    return {
      card: CARDS[hash('tarotarot:' + key) % CARDS.length],
      rev,
      snack: SNACKS[hash('snack:' + key) % SNACKS.length],
      luck: isGood(CARDS[hash('tarotarot:' + key) % CARDS.length], rev) ? 3 + luckBase : 1 + luckBase,
      tipIdx: hash('tip:' + key)
    };
  }

  function initDaily() {
    const key = todayKey();
    const d = new Date();
    $('#daily-date').textContent = d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日　今天鼠鼠為你抽的牌';

    const draw = dailyDraw(key + ':' + deviceId());
    const stage = $('#daily-stage');
    const result = $('#daily-result');
    const wrap = el('div', 'card-wrap');
    const btn = el('button', 'flip-btn');
    btn.setAttribute('aria-label', '翻開今日牌');
    const node = cardNode(draw.card, draw.rev, false);
    btn.appendChild(node);
    wrap.appendChild(btn);
    stage.appendChild(wrap);
    const hint = el('p', 'hint', '點一下牌，翻開今天的運勢 ✨');
    stage.parentNode.insertBefore(hint, result);

    function reveal(instant) {
      if (instant) node.classList.add('flipped');
      else whenReady([node], 4000).then(() => node.classList.add('flipped'));
      hint.hidden = true;
      btn.disabled = true;
      storeSet('tarotarot:daily:' + key, '1');
      const kw = draw.rev ? draw.card.rev : draw.card.up;
      const line = draw.rev ? draw.card.revLine : draw.card.upLine;
      const tip = pickOne(isGood(draw.card, draw.rev) ? DAILY_TIPS.up : DAILY_TIPS.rev, draw.tipIdx);
      const act = draw.rev ? draw.card.actRev : draw.card.actUp;
      const stars = '🌻'.repeat(draw.luck) + '▫️'.repeat(5 - draw.luck);
      result.innerHTML =
        '<div class="caption" style="margin:0 0 6px">' + captionHTML(draw.card, draw.rev) + '</div>' +
        chips(kw) +
        '<p>' + line + '</p>' +
        '<div class="tip">🐹 今日行動：' + act + '<br>鼠鼠叮嚀：' + tip + '</div>' +
        '<div class="meta"><span>今日幸運指數　' + stars + '</span><span>幸運零食　' + draw.snack + '</span></div>' +
        '<div class="actions"><button class="ghost" id="daily-copy">複製今日結果</button></div>';
      result.hidden = false;
      $('#daily-copy').addEventListener('click', () => copyText(
        '【鼠鼠占卜・今日運勢】' + draw.card.zh + '（' + draw.card.en + '）' + (draw.rev ? '逆位' : '正位') + '\n' +
        kw.join('、') + '\n' + line + '\n今日行動：' + act + '\n鼠鼠叮嚀：' + tip + '\n幸運指數：' + draw.luck + '/5　幸運零食：' + draw.snack,
        $('#daily-copy')));
    }

    btn.addEventListener('click', () => reveal(false));
    if (storeGet('tarotarot:daily:' + key)) {
      node.style.transition = 'none';
      reveal(true);
      requestAnimationFrame(() => { node.style.transition = ''; });
    }
  }

  function copyText(text, btn) {
    const done = () => { const o = btn.textContent; btn.textContent = '已複製 ✓'; setTimeout(() => { btn.textContent = o; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* 忽略 */ }
      ta.remove();
    }
  }

  /* ---------- 一張牌占卜 ---------- */
  let currentTopic = null;

  function initReading() {
    const box = $('#topics');
    Object.keys(TOPICS).forEach(key => {
      const t = TOPICS[key];
      const b = el('button', 'topic', '<span class="ico">' + t.icon + '</span><span class="name">' + t.name + '</span>');
      b.addEventListener('click', () => startDeck(key));
      box.appendChild(b);
    });
    $('#deck-back').addEventListener('click', showTopics);
  }

  function showTopics() {
    $('#topic-step').hidden = false;
    $('#deck-step').hidden = true;
    $('#result-step').hidden = true;
  }

  function startDeck(key) {
    currentTopic = key;
    $('#topic-step').hidden = true;
    $('#result-step').hidden = true;
    $('#deck-step').hidden = false;
    $('#deck-hint').textContent = '心裡想著「' + TOPICS[key].name + '」的問題，憑直覺選一張牌 🐹';
    const deck = $('#deck');
    deck.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const b = el('button', 'deck-card');
      b.setAttribute('aria-label', '抽牌');
      const wrap = el('div', 'card');
      const back = el('div', 'face back', '🐹');
      applyBack(back);
      wrap.appendChild(back);
      b.appendChild(wrap);
      b.addEventListener('click', drawForTopic);
      deck.appendChild(b);
    }
  }

  function drawForTopic() {
    const key = currentTopic;
    const r = randInts(3);
    const card = CARDS[r[0] % CARDS.length];
    const rev = (r[1] / 4294967296) < REVERSED_CHANCE;
    const variant = r[2];
    const t = TOPICS[key];
    const kw = rev ? card.rev : card.up;
    const line = rev ? card.revLine : card.upLine;
    const good = isGood(card, rev);
    const bridge = fill(pickOne(good ? t.up : t.rev, variant), kw);
    const tip = pickOne(good ? t.tipUp : t.tipRev, variant >>> 3);
    const lens = LENS[key][card.arcana][rev ? 'rev' : 'up'];
    const act = rev ? card.actRev : card.actUp;

    $('#deck-step').hidden = true;
    $('#result-step').hidden = false;

    const stage = $('#reading-stage');
    stage.innerHTML = '';
    const wrap = el('div', 'card-wrap');
    const node = cardNode(card, rev, false);
    wrap.appendChild(node);
    stage.appendChild(wrap);
    whenReady([node], 4000).then(() => setTimeout(() => node.classList.add('flipped'), 60));

    const result = $('#reading-result');
    result.innerHTML =
      '<div class="caption" style="margin:0 0 6px">' + captionHTML(card, rev) + '</div>' +
      '<h3>' + t.icon + ' ' + t.name + '</h3>' +
      chips(kw) +
      '<p>' + line + '</p>' +
      '<p>' + bridge + '</p>' +
      '<p>' + lens + '</p>' +
      '<div class="tip">🐹 具體做法：' + act + '<br>鼠鼠小叮嚀：' + tip + '</div>' +
      '<div class="actions">' +
      '<button class="primary" id="again">再問一次</button>' +
      '<button class="ghost" id="other">換個主題</button>' +
      '<button class="ghost" id="copy">複製結果</button></div>';
    $('#again').addEventListener('click', () => startDeck(key));
    $('#other').addEventListener('click', showTopics);
    $('#copy').addEventListener('click', () => copyText(
      '【鼠鼠占卜・' + t.name + '】' + card.zh + '（' + card.en + '）' + (rev ? '逆位' : '正位') + '\n' +
      kw.join('、') + '\n' + line + '\n' + bridge + '\n' + lens + '\n具體做法：' + act + '\n鼠鼠小叮嚀：' + tip,
      $('#copy')));
  }

  /* ---------- 牌庫 ---------- */
  function initLibrary() {
    const filters = $('#filters');
    const grid = $('#grid');
    const groups = [['all', '全部']].concat(Object.keys(SUIT_NAME).map(k => [k, SUIT_NAME[k]]));
    let active = 'all';

    function render() {
      grid.innerHTML = '';
      CARDS.filter(c => active === 'all' || c.arcana === active).forEach(card => {
        const b = el('button', 'thumb');
        const wrap = el('div', 'card flipped');
        const n = cardNode(card, false, true, true);
        n.style.transition = 'none';
        b.appendChild(n);
        b.appendChild(el('div', 't-name', card.zh));
        b.addEventListener('click', () => openModal(card));
        grid.appendChild(b);
      });
    }

    groups.forEach(([key, name]) => {
      const b = el('button', key === 'all' ? 'active' : '', name);
      b.addEventListener('click', () => {
        active = key;
        filters.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
        render();
      });
      filters.appendChild(b);
    });
    render();
  }

  function openModal(card) {
    const c = $('#modal-content');
    c.innerHTML = '';
    const wrap = el('div', 'card-wrap');
    const n = cardNode(card, false, true);
    n.style.transition = 'none';
    wrap.appendChild(n);
    c.appendChild(wrap);
    c.appendChild(el('div', 'caption', '<b>' + card.zh + '</b><span>' + card.en + '</span>'));
    c.appendChild(el('div', 'result',
      '<h3>正位 ' + '</h3>' + chips(card.up) + '<p>' + card.upLine + '</p>' +
      '<h3>逆位</h3>' + chips(card.rev) + '<p>' + card.revLine + '</p>'));
    $('#modal').hidden = false;
  }

  $('#modal-close').addEventListener('click', () => { $('#modal').hidden = true; });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#modal').hidden = true; });


  /* ---------- 時間之流（過去・現在・未來） ---------- */
  const GENERAL = {
    name: '整體', icon: '🔮',
    up: [], rev: [], tipUp: [], tipRev: []
  };
  const KEYWORDS = {
    love: /愛|喜歡|感情|對方|前任|復合|正緣|暗戀|告白|交往|分手|曖昧|老公|老婆|男友|女友|另一半|結婚|桃花|脫單|單身/g,
    career: /工作|事業|職場|升遷|面試|轉職|離職|老闆|同事|創業|跳槽|公司|客戶|專案|副業/g,
    study: /學業|考試|讀書|學習|成績|升學|報考|論文|學校|證照|作業|申請|留學/g,
    money: /錢|財運|投資|薪水|收入|存款|股票|理財|買房|負債|加薪|財務|賺/g,
    health: /健康|身體|睡眠|失眠|情緒|壓力|焦慮|心情|減肥|運動|生病|疲累|憂鬱/g,
    relation: /朋友|人際|家人|父母|同學|相處|吵架|室友|關係|社交|孤單|合作/g
  };
  const SAMPLES = [
    '對方對我到底是什麼感覺？',
    '我跟前任還有機會復合嗎？',
    '現在的工作適合我長期發展嗎？',
    '這次考試我該怎麼準備比較好？'
  ];
  const POS = [
    { key: 'past', label: '過去', sub: '事情的根源' },
    { key: 'present', label: '現在', sub: '目前的狀態' },
    { key: 'future', label: '未來', sub: '接下來的走向' }
  ];
  const POS_TPL = {
    past: {
      up: ['{t}方面，過去的「{0}」替你打好了基礎，也帶來「{1}」的經驗。', '回頭看{t}，「{0}」是你一路走來的助力。'],
      rev: ['{t}方面，過去留下了「{0}」的痕跡，這是目前還需要消化的地方。', '回頭看{t}，「{0}」或「{1}」可能是事情卡住的源頭。']
    },
    present: {
      up: ['此刻{t}的狀態是「{0}」，順著這股能量走就好。', '現在的{t}處在「{0}」與「{2}」的氛圍裡，可以放心把握。'],
      rev: ['此刻{t}正面臨「{0}」，先看見它再調整。', '現在的{t}需要留意「{0}」與「{1}」，慢一點沒關係。']
    },
    future: {
      up: ['接下來{t}會朝「{0}」發展，保持這個方向。', '未來{t}有「{0}」與「{2}」的能量在等你。'],
      rev: ['接下來{t}要小心「{0}」，提早調整就能避開。', '未來{t}可能遇到「{0}」或「{1}」，現在先做好準備。']
    }
  };
  const SUMMARY = {
    3: '三張牌的走向都偏順，整體是順風局，踏實往前走就會有好結果。',
    2: '三張牌大多偏順，整體不錯，留意比較吃力的那張所提醒的地方就好。',
    1: '三張牌裡只有一張偏順，這段時間需要多一點耐心與調整。',
    0: '三張牌都偏吃力，代表現在是重新整理的階段，先放慢，把事情看清楚再行動。'
  };

  function detectTopic(q) {
    let best = null, bestN = 0;
    Object.keys(KEYWORDS).forEach(k => {
      const m = q.match(KEYWORDS[k]);
      const n = m ? m.length : 0;
      if (n > bestN) { best = k; bestN = n; }
    });
    return best || 'general';
  }

  // 擴充關鍵字，讓主題判斷更準
  KEYWORDS.love = new RegExp(KEYWORDS.love.source + '|心意|在意|挽回|對象|新戀情', 'g');
  KEYWORDS.career = new RegExp(KEYWORDS.career.source + '|求職|應徵|找工作|履歷|轉行|辭職', 'g');
  KEYWORDS.study = new RegExp(KEYWORDS.study.source + '|研究所|推甄|選系|測驗|複習', 'g');
  KEYWORDS.money = new RegExp(KEYWORDS.money.source + '|基金|買車|存錢|接案|加密', 'g');

  function detectScenario(topicKey, q) {
    const list = SCEN[topicKey];
    if (!list || !q) return null;
    let best = null, bestN = 0;
    list.forEach(s => {
      const m = q.match(new RegExp(s.re, 'g'));
      const n = m ? m.length : 0;
      if (n > bestN) { best = s; bestN = n; }
    });
    return best;
  }

  // 正位 +1、逆位 -1；沉重的牌正位 -1、逆位 0；未來那張權重加倍
  function tone(p) {
    const hard = HARD_CARDS.has(p.card.en);
    return hard ? (p.rev ? 0 : -1) : (p.rev ? -1 : 1);
  }
  function flowLevel(picks) {
    const s = tone(picks[0]) + tone(picks[1]) + 2 * tone(picks[2]);
    return s >= 2 ? 'hi' : (s <= -1 ? 'lo' : 'mid');
  }

  function drawThree() {
    const pool = CARDS.slice();
    const r = randInts(6);
    const out = [];
    for (let i = 0; i < 3; i++) {
      const card = pool.splice(r[i] % pool.length, 1)[0];
      out.push({ card, rev: (r[i + 3] / 4294967296) < REVERSED_CHANCE, v: r[i] >>> 4 });
    }
    return out;
  }

  function initFlow() {
    const q = $('#flow-q');
    const count = $('#flow-count');
    const sel = $('#flow-topic');
    const box = $('#flow-samples');
    const out = $('#flow-out');
    const ask = $('#flow-ask');

    sel.appendChild(new Option('讓鼠鼠自動判斷', 'auto'));
    Object.keys(TOPICS).forEach(k => sel.appendChild(new Option(TOPICS[k].name, k)));
    sel.appendChild(new Option('整體運勢', 'general'));

    q.addEventListener('input', () => { count.textContent = q.value.length; });
    SAMPLES.forEach(s => {
      const b = el('button', 'sample');
      b.textContent = s;
      b.addEventListener('click', () => { q.value = s; count.textContent = s.length; q.focus(); });
      box.appendChild(b);
    });

    $('#flow-go').addEventListener('click', () => {
      const question = q.value.trim();
      const topicKey = sel.value === 'auto' ? detectTopic(question) : sel.value;
      showFlow(question, topicKey);
    });

    function showFlow(question, topicKey) {
      const t = topicKey === 'general' ? GENERAL : TOPICS[topicKey];
      const picks = drawThree();
      const scen = detectScenario(topicKey, question);
      ask.hidden = true;
      out.hidden = false;
      out.innerHTML = '';

      const echo = el('div', 'q-echo',
        (question ? '你的問題：<b></b>' : '<b>整體運勢</b>') + '<br>鼠鼠判斷類型：' + t.icon + ' ' + t.name + (scen ? '・' + scen.name : ''));
      if (question) echo.querySelector('b').textContent = question;
      out.appendChild(echo);

      const row = el('div', 'flow-cards');
      const nodes = [];
      picks.forEach((p, i) => {
        const col = el('div', 'flow-col');
        col.appendChild(el('div', 'flow-label', POS[i].label));
        const wrap = el('div', 'card-wrap');
        const node = cardNode(p.card, p.rev, false);
        wrap.appendChild(node);
        col.appendChild(wrap);
        col.appendChild(el('div', 'caption', captionHTML(p.card, p.rev)));
        row.appendChild(col);
        nodes.push(node);
      });
      out.appendChild(row);
      whenReady(nodes, 5000).then(() => {
        nodes.forEach((n, i) => setTimeout(() => n.classList.add('flipped'), 200 + i * 600));
      });

      const textLines = [];
      picks.forEach((p, i) => {
        const pos = POS[i];
        const kw = p.rev ? p.card.rev : p.card.up;
        const line = p.rev ? p.card.revLine : p.card.upLine;
        const frame = scen
          ? fill(scen[pos.key][isGood(p.card, p.rev) ? 'up' : 'rev'], kw)
          : fill(pickOne(POS_TPL[pos.key][isGood(p.card, p.rev) ? 'up' : 'rev'], p.v), kw).replace(/\{t\}/g, t.name);
        const lens = LENS[topicKey][p.card.arcana][p.rev ? 'rev' : 'up'];
        const act = p.rev ? p.card.actRev : p.card.actUp;
        const box = el('div', 'result pos-result',
          '<h3>' + pos.label + '・' + pos.sub + '</h3>' +
          '<div class="caption" style="text-align:left;margin:0 0 4px">' + captionHTML(p.card, p.rev) + '</div>' +
          chips(kw) + '<p>' + frame + '</p><p>' + line + '</p><p>' + lens + '</p>' +
          '<div class="tip">具體做法：' + act + '</div>');
        out.appendChild(box);
        textLines.push(pos.label + '：' + p.card.zh + (p.rev ? '逆位' : '正位') + '\n' + frame + line + lens + '\n具體做法：' + act);
      });

      const ups = picks.filter(p => isGood(p.card, p.rev)).length;
      let trend = '';
      if (!isGood(picks[0].card, picks[0].rev) && isGood(picks[2].card, picks[2].rev)) trend = '從過去走向未來有明顯好轉的趨勢，時間站在你這邊。';
      else if (isGood(picks[0].card, picks[0].rev) && !isGood(picks[2].card, picks[2].rev)) trend = '目前的順利是基礎，但別鬆懈，未來有需要留意的地方。';
      const last = picks[2];
      const tipPool = isGood(last.card, last.rev) ? t.tipUp : t.tipRev;
      const tip = tipPool && tipPool.length ? pickOne(tipPool, last.v >>> 3) : pickOne(isGood(last.card, last.rev) ? DAILY_TIPS.up : DAILY_TIPS.rev, last.v >>> 3);
      let sum;
      if (scen) sum = '針對「' + scen.name + '」，鼠鼠的看法是：' + scen.verdict[flowLevel(picks)] + trend;
      else sum = SUMMARY[ups] + (ups === 1 || ups === 2 ? trend : '');
      const nextStep = last.rev ? last.card.actRev : last.card.actUp;
      const sumBox = el('div', 'result summary',
        '<h3>鼠鼠總結</h3><p>' + sum + '</p><div class="tip">🐹 下一步：' + nextStep + '<br>小叮嚀：' + tip + '</div>' +
        '<div class="actions"><button class="primary" id="flow-again">再占卜一次</button>' +
        '<button class="ghost" id="flow-copy">複製結果</button></div>');
      out.appendChild(sumBox);

      $('#flow-again').addEventListener('click', () => { out.hidden = true; ask.hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); });
      $('#flow-copy').addEventListener('click', () => copyText(
        '【鼠鼠占卜・時間之流】' + (question ? '\n問題：' + question : '') + '\n' + textLines.join('\n\n') + '\n\n總結：' + sum + '\n下一步：' + nextStep + '\n小叮嚀：' + tip,
        $('#flow-copy')));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  initDaily();
  initReading();
  initFlow();
  initLibrary();
})();
