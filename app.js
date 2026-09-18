/* 3rd Module · app.js · no library, no tracker */
(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  document.body.classList.add('loading');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Loader: the 3 turns into an M ---------- */
  const loader = $('#loader');
  const t0 = performance.now();
  const MIN = reduce ? 0 : 1600;
  let loaded = false;
  const finish = () => {
    if (loaded) return; loaded = true;
    const wait = Math.max(0, MIN - (performance.now() - t0));
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      doc.classList.add('ready');
      setTimeout(() => loader.remove(), 700);
    }, wait);
  };
  addEventListener('load', finish);
  setTimeout(finish, 4000); // never block the site

  /* ---------- i18n ---------- */
  const FR = {
    'skip': 'Aller au contenu',
    'nav.work': 'Réalisations', 'nav.services': 'Ce que je fais', 'nav.process': 'Comment ça marche', 'nav.play': 'Playground', 'nav.cta': 'Contact',
    'hero.status': 'Ouvert aux nouvelles collaborations',
    'hero.l1': 'Ton site,', 'hero.l2': 'en ligne sur',
    'hero.sub': "Créateur de sites pour artistes, creators et petites entreprises. Envoie-moi ton nom de domaine, ou simplement l'idée derrière ton site. Je le conceptualise, je le construis puis je le mets en ligne pour toi.",
    'hero.cta1': 'Lancer un projet', 'hero.cta2': "Voir ce que j'ai fait",
    'work.kicker': 'Réalisations', 'work.title': "Mes dernières réalisations",
    'work.lead': "Voici mes cinq dernières réalisations : mon label, et des sites faits en collaboration avec plusieurs artistes.",
    'w1.desc': "Le site de mon label. Les sorties, les artistes, un formulaire pour envoyer ses démos, un vinyle à scratcher et un mini-jeu caché.",
    'w2.desc': "Un beat store fait en collaboration avec anbuu. Player, système de licences, panier, et une multitude de langues.",
    'w3.desc': "Un beat & kits store fait en collaboration avec Swink. Player, et système de paiement via Gumroad.",
    'w4.desc': "Un site d'une page pour une artiste indie-pop, avec pour objectif de mettre en avant sa dernière sortie.",
    'w5.desc': "Mon portfolio de compositeur et ingénieur du son. Showreel, playlist avec player, projets et formulaire de contact.",
    't.label': 'Label', 't.multi': 'Multi-pages', 't.form': 'Formulaires', 't.audio': 'Audio web', 't.shop': 'Beat store', 't.lang7': '7 langues',
    't.digital': 'Produits numériques', 't.onepage': 'Une page', 't.artist': 'Artiste', 't.video': 'Vidéo & audio',
    'svc.kicker': 'Ce que je fais', 'svc.title': 'Choisis ton format',
    'svc.lead': "Chaque site est sur-mesure, compatible téléphone, et mis en ligne sur le nom de domaine que tu as choisi. On établit ensemble le cahier des charges et je t'envoie une démo sous cinq jours.",
    's1.t': 'Page de lancement', 's1.d': "Une page qui peut dire qui tu es, présenter un projet, teaser une sortie ou servir de portfolio.", 's1.m': '1 page',
    's2.t': 'Petit site', 's2.d': "Quelques pages pour une marque ou un indépendant. Accueil, à propos, réalisations, contact, avec un formulaire de contact.", 's2.m': "Jusqu'à 4 pages",
    's3.t': 'Site complet', 's3.d': "Un site riche. Plus de pages, de la musique et des vidéos intégrées, et une bonne base SEO (référencement Google).", 's3.m': "Jusqu'à 7 pages",
    's4.t': 'Suivi du site', 's4.d': "Une fois ton site en ligne, je vérifie chaque semaine qu'il fonctionne bien. Je fais les petites modifications : changer une date, ajouter une sortie, remplacer des médias, etc.", 's4.m': 'Au mois',
    'x1': 'Deuxième langue', 'x2': 'Branchement du domaine', 'x3': 'Formulaires de contact', 'x4': 'Spotify & YouTube', 'x5': 'Petite boutique', 'x6': 'Refonte', 'x7': 'Bases SEO',
    'pr.kicker': 'Comment ça marche', 'pr.title': "D'une idée à un site abouti",
    'p1.t': 'Tu expliques ton idée', 'p1.d': "Ce que tu fais, pour qui, et ce que tu veux que les gens fassent sur le site. Envoie tes textes, photos et logo si tu en as.",
    'p2.t': "Je t'envoie une première version", 'p2.d': "Une vraie page que tu ouvres sur ton téléphone ou ton PC. Tu vois tout de suite où on va.",
    'p3.t': 'On ajuste', 'p3.d': "Tu me dis ce qu'il faut changer. On corrige ensemble jusqu'à ce que ça te ressemble.",
    'p4.t': 'On le met en ligne', 'p4.d': "Je l'incorpore à ton domaine et je le mets en ligne. Tu as le lien, et il est à toi.",
    'pl.title': "Un exemple de ce qu'on peut imaginer", 'pl.lead': "Voilà une petite boîte à rythmes. Elle fonctionne directement dans ton navigateur, tu n'as rien à installer.",
    'pl.play': 'Lecture', 'pl.stop': 'Stop', 'pl.clear': 'Effacer', 'pl.rand': 'Surprends-moi',
    'fq.title': 'Les questions fréquentes',
    'f1.q': "Je n'ai pas encore de nom de domaine, c'est grave ?", 'f1.a': "Pas du tout. Je te dis où l'acheter (entre 10 et 20 € par an environ). Il est à ton nom, donc il reste à toi.",
    'f2.q': 'Le site m’appartient ?', 'f2.a': "Oui, il est à toi. C'est ton domaine, ton contenu, ton site. Si un jour tu veux travailler dessus avec quelqu'un d'autre, tu peux.",
    'f3.q': 'Je peux le modifier moi-même ?', 'f3.a': "Par défaut, c'est moi qui fais les changements, c'est à ça que sert le suivi. Si tu veux vraiment modifier des choses toi-même, dis-le moi au départ et on le prévoit.",
    'f4.q': 'Ça prend combien de temps ?', 'f4.a': "En général une à deux semaines, selon la taille du site et la vitesse à laquelle je reçois ton contenu.",
    'f5.q': 'Tu fais les grosses boutiques en ligne ?', 'f5.a': "Non. Je peux monter une petite boutique pour quelques produits ou des téléchargements. Pour une grosse boutique avec stock et livraisons, il te faut un spécialiste, et je te le dirai franchement.",
    'ct.title': 'Parle-moi de ton projet', 'ct.lead': "Quelques lignes suffisent. Je lis tout moi-même et je réponds en français ou en anglais.", 'ct.copy': "Copier l'email",
    'fm.name': 'Ton nom', 'fm.email': 'Ton email', 'fm.domain': "Ton domaine (si tu en as un)", 'fm.need': "De quoi tu as besoin ?", 'fm.unsure': 'Je ne sais pas encore',
    'fm.msg': 'Ton projet, en quelques mots', 'fm.send': 'Envoyer', 'fm.note': 'Je me sers de tes infos uniquement pour te répondre. Pas de newsletter, pas de partage. <a href="legal.html">Mentions légales</a>',
    'ba.kicker': 'Refonte', 'ba.title': 'Ton site, mais en mieux.', 'ba.lead': "Fais glisser le séparateur. Même artiste, mêmes infos, mais plus adapté à l'internet d'aujourd'hui. Cet avant-après est fictif mais représente mon travail réel.", 'ba.before': 'Avant', 'ba.after': 'Après',
    'ft.family': 'Fait partie de la famille 3rd, avec <a href="https://3rdrecords.com" target="_blank" rel="noopener">3rd Records</a>', 'ft.legal': 'Mentions légales'
  };
  const MSG = {
    en: { sending: 'Sending…', ok: "Got it. I'll get back to you soon.", err: "That didn't go through. Email me directly, it works too.", check: 'Check the fields in red.', copied: 'Copied ✓', play: 'Play', stop: 'Stop', langBtn: 'FR', langLabel: 'Passer en français' },
    fr: { sending: 'Envoi…', ok: "C'est reçu. Je te réponds vite.", err: "Ça n'est pas passé. Écris-moi directement par email, ça marche aussi.", check: 'Vérifie les champs en rouge.', copied: 'Copié ✓', play: 'Lecture', stop: 'Stop', langBtn: 'EN', langLabel: 'Switch to English' }
  };
  const EN = {};
  $$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });
  let lang = 'en';
  try { const s = localStorage.getItem('3m-lang'); if (s === 'fr' || s === 'en') lang = s; else if ((navigator.language || '').startsWith('fr')) lang = 'fr'; } catch (e) {}
  const applyLang = (l) => {
    lang = l; doc.lang = l;
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; const v = l === 'fr' ? FR[k] : EN[k]; if (v != null) el.innerHTML = v; });
    const b = $('#lang'); b.textContent = MSG[l].langBtn; b.setAttribute('aria-label', MSG[l].langLabel);
    const play = $('#seq-play'); if (play) play.textContent = seqPlaying ? MSG[l].stop : MSG[l].play;
    try { localStorage.setItem('3m-lang', l); } catch (e) {}
  };
  let seqPlaying = false;
  $('#lang').addEventListener('click', () => applyLang(lang === 'en' ? 'fr' : 'en'));
  if (lang === 'fr') applyLang('fr');

  /* ---------- Hero: typing domains ---------- */
  const swap = $('#swap');
  const domains = ['yourname.com', 'yourband.com', 'yourbrand.shop', 'yourlabel.fr', 'yourstudio.co', 'yourdomain.com'];
  if (!reduce) {
    let i = 0;
    const type = async () => {
      const next = domains[(++i) % domains.length];
      let cur = swap.textContent;
      while (cur.length) { cur = cur.slice(0, -1); swap.textContent = cur || '​'; await new Promise(r => setTimeout(r, 38)); }
      for (let c = 1; c <= next.length; c++) { swap.textContent = next.slice(0, c); await new Promise(r => setTimeout(r, 70)); }
      setTimeout(type, 2200);
    };
    setTimeout(type, 3200);
  }

  /* ---------- Hero: module pads ---------- */
  const pads = $('#pads');
  let cols = 0, rows = 0, cells = [];
  const buildPads = () => {
    const size = innerWidth < 600 ? 44 : 64;
    cols = Math.ceil(innerWidth / size); rows = Math.ceil(pads.offsetHeight / size);
    pads.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    pads.style.gridTemplateRows = `repeat(${rows},1fr)`;
    pads.innerHTML = '';
    const frag = document.createDocumentFragment();
    cells = [];
    for (let n = 0; n < cols * rows; n++) { const d = document.createElement('div'); d.className = 'pad'; frag.appendChild(d); cells.push(d); }
    pads.appendChild(frag);
  };
  const light = (el, blue) => {
    if (!el) return;
    el.classList.add('on'); if (blue) el.classList.add('blue');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('on', 'blue'), 60);
  };
  buildPads();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(buildPads, 200); });
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => {
    const r = pads.getBoundingClientRect();
    const c = Math.floor((e.clientX - r.left) / (r.width / cols));
    const w = Math.floor((e.clientY - r.top) / (r.height / rows));
    light(cells[w * cols + c]);
  });
  if (!reduce) {
    // idle "sequencer" sweep across the grid
    let col = 0;
    setInterval(() => {
      if (document.hidden || !cells.length) return;
      for (let rr = 0; rr < rows; rr++) if (Math.random() < 0.12) light(cells[rr * cols + col], Math.random() < 0.2);
      col = (col + 1) % cols;
    }, 140);
  }

  /* ---------- Hide broken project images (keeps the card color) ---------- */
  $$('.card-media img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }));

  /* ---------- Marquee: duplicate for a seamless loop ---------- */
  const mq = $('#marquee'); mq.innerHTML += mq.innerHTML;

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .step').forEach(el => io.observe(el));

  /* ---------- Nav hides on scroll down ---------- */
  const nav = $('#nav'); let lastY = scrollY;
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > lastY && y > 300); lastY = y; }, { passive: true });

  /* ---------- Card tilt + cursor ---------- */
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduce) {
    $$('.card').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
    const cur = document.createElement('div'); cur.className = 'cursor'; document.body.appendChild(cur);
    let cx = 0, cy = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; });
    document.addEventListener('pointerleave', () => { cur.style.opacity = 0; });
    const loop = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,summary,label,.step-btn')));
  }

  /* ---------- Playground: drum machine (Web Audio) ---------- */
  const ROWS = [{ k: 'kick', l: 'Kick' }, { k: 'snare', l: 'Snare' }, { k: 'hat', l: 'Hat' }, { k: 'bells', l: 'Bells' }];
  const STEPS = 16;
  const pattern = [
    [1,0,0,0, 0,0,0,0, 1,0,1,0, 0,0,0,0],
    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1],
    [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0]
  ];
  const grid = $('#seq-grid'); const btns = [];
  ROWS.forEach((row, r) => {
    const lab = document.createElement('span'); lab.className = 'seq-label'; lab.textContent = row.l; grid.appendChild(lab);
    btns[r] = [];
    for (let s = 0; s < STEPS; s++) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'step-btn row-' + r;
      b.setAttribute('aria-label', `${row.l} step ${s + 1}`); b.setAttribute('aria-pressed', pattern[r][s] ? 'true' : 'false');
      b.addEventListener('click', () => { pattern[r][s] ^= 1; b.setAttribute('aria-pressed', pattern[r][s] ? 'true' : 'false'); if (pattern[r][s]) { ensureCtx(); voice(r, ctx.currentTime, s); } });
      grid.appendChild(b); btns[r][s] = b;
    }
  });
  let ctx, master, noiseBuf, bellBus;
  // Drop your own one-shots here (e.g. { 0: 'sounds/kick.wav', 1: 'sounds/snare.wav', 2: 'sounds/hat.wav' }); synth is the fallback.
  const SAMPLE_FILES = {};
  const samples = {};
  const ensureCtx = () => {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = .8;
    const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // bells go through a soft stereo delay + long reverb
    bellBus = ctx.createGain(); bellBus.gain.value = 1; bellBus.connect(master);
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    const verb = ctx.createConvolver(); verb.buffer = ir; const wet = ctx.createGain(); wet.gain.value = .55;
    bellBus.connect(verb); verb.connect(wet); wet.connect(master);
    const dl = ctx.createDelay(1), fb = ctx.createGain(), dlf = ctx.createBiquadFilter(), dwet = ctx.createGain();
    dl.delayTime.value = .36; fb.gain.value = .32; dlf.type = 'lowpass'; dlf.frequency.value = 2600; dwet.gain.value = .28;
    bellBus.connect(dl); dl.connect(dlf); dlf.connect(fb); fb.connect(dl); dlf.connect(dwet); dwet.connect(verb); dwet.connect(master);
    Object.entries(SAMPLE_FILES).forEach(([r, url]) => {
      fetch(url).then(res => res.ok ? res.arrayBuffer() : Promise.reject()).then(b => ctx.decodeAudioData(b)).then(buf => { samples[r] = buf; }).catch(() => {});
    });
  };
  const ARP = [440, 554.37, 659.25, 783.99, 880, 1108.73, 1318.51, 1567.98]; // A7: A C# E G, rising
  const voice = (r, t, s) => {
    if (samples[r]) { const b = ctx.createBufferSource(); b.buffer = samples[r]; b.connect(master); b.start(t); return; }
    if (r === 0) { // kick
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .18);
      g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(.001, t + .45);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + .5);
    } else if (r === 1 || r === 2) { // snare / hat
      const n = ctx.createBufferSource(); n.buffer = noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = r === 1 ? 'bandpass' : 'highpass'; f.frequency.value = r === 1 ? 1800 : 7000;
      const g = ctx.createGain(); const len = r === 1 ? .2 : .05;
      g.gain.setValueAtTime(r === 1 ? .7 : .35, t); g.gain.exponentialRampToValueAtTime(.001, t + len);
      n.connect(f); f.connect(g); g.connect(master); n.start(t); n.stop(t + len + .02);
      if (r === 1) { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 190; og.gain.setValueAtTime(.35, t); og.gain.exponentialRampToValueAtTime(.001, t + .1); o.connect(og); og.connect(master); o.start(t); o.stop(t + .12); }
    } else { // bells: glassy FM tone with a long tail, A7 arpeggio going up
      let n = 0; for (let i = 0; i < s; i++) if (pattern[3][i]) n++;
      const hz = ARP[n % ARP.length];
      const out = ctx.createGain(); out.connect(bellBus);
      out.gain.setValueAtTime(.0001, t); out.gain.exponentialRampToValueAtTime(.2, t + .006); out.gain.exponentialRampToValueAtTime(.0001, t + 3.2);
      const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain();
      car.frequency.value = hz; mod.frequency.value = hz * 3.5;
      mg.gain.setValueAtTime(hz * 2.2, t); mg.gain.exponentialRampToValueAtTime(hz * .05, t + 1.4);
      mod.connect(mg); mg.connect(car.frequency); car.connect(out);
      [[2.001, .1, 1.6], [4.07, .04, .5], [1.0015, .12, 3]].forEach(([m, v, d]) => {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = hz * m;
        g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(out); o.start(t); o.stop(t + d + .05);
      });
      car.start(t); mod.start(t); car.stop(t + 3.3); mod.stop(t + 3.3);
    }
  };
  let bpm = 92, step = 0, nextT = 0, timer = null;
  const drawQueue = [];
  const schedule = () => {
    while (nextT < ctx.currentTime + .1) {
      for (let r = 0; r < ROWS.length; r++) if (pattern[r][step]) voice(r, nextT, step);
      drawQueue.push({ step, t: nextT });
      nextT += 60 / bpm / 4; step = (step + 1) % STEPS;
    }
  };
  let lastDrawn = -1;
  const draw = () => {
    if (!seqPlaying) return;
    while (drawQueue.length && drawQueue[0].t <= ctx.currentTime) {
      const { step: s } = drawQueue.shift();
      if (lastDrawn >= 0) btns.forEach(row => row[lastDrawn].classList.remove('now'));
      btns.forEach(row => row[s].classList.add('now')); lastDrawn = s;
    }
    requestAnimationFrame(draw);
  };
  const playBtn = $('#seq-play');
  const stop = () => { seqPlaying = false; clearInterval(timer); if (lastDrawn >= 0) btns.forEach(row => row[lastDrawn].classList.remove('now')); lastDrawn = -1; drawQueue.length = 0; playBtn.textContent = MSG[lang].play; };
  playBtn.addEventListener('click', () => {
    ensureCtx();
    if (seqPlaying) return stop();
    seqPlaying = true; step = 0; nextT = ctx.currentTime + .05; timer = setInterval(schedule, 25); schedule(); draw();
    playBtn.textContent = MSG[lang].stop;
  });
  $('#seq-clear').addEventListener('click', () => { pattern.forEach((row, r) => row.forEach((_, s) => { row[s] = 0; btns[r][s].setAttribute('aria-pressed', 'false'); })); });
  $('#seq-rand').addEventListener('click', () => {
    const p = [.35, .2, .6, .25];
    pattern.forEach((row, r) => row.forEach((_, s) => { let v = Math.random() < p[r] ? 1 : 0; if (r === 0 && s % 8 === 0) v = 1; if (r === 1) v = (s % 8 === 4) ? 1 : (Math.random() < .08 ? 1 : 0); row[s] = v; btns[r][s].setAttribute('aria-pressed', v ? 'true' : 'false'); }));
  });
  const bpmIn = $('#seq-bpm'), bpmOut = $('#seq-bpm-out');
  bpmIn.addEventListener('input', () => { bpm = +bpmIn.value; bpmOut.textContent = bpm; });
  document.addEventListener('visibilitychange', () => { if (document.hidden && seqPlaying) stop(); });


  /* ---------- Before / After ---------- */
  const ba = $('#ba'), baR = $('#ba-range');
  if (ba) {
    const setPos = v => { ba.style.setProperty('--pos', v + '%'); };
    baR.addEventListener('input', () => setPos(baR.value));
    // small hint animation when it comes into view
    if (!reduce) {
      const hint = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; hint.disconnect();
        let t = 0; const from = 50;
        const run = () => { t += 1 / 60; const v = from + Math.sin(t * Math.PI * 1.2) * 18 * Math.max(0, 1 - t / 1.6); setPos(v); baR.value = v; if (t < 1.6) requestAnimationFrame(run); else { setPos(50); baR.value = 50; } };
        setTimeout(run, 400);
      }), { threshold: .5 });
      hint.observe(ba);
    }
  }

  /* ---------- UI sounds (the site makes small sounds, you can turn them off) ---------- */
  const snd = $('#snd');
  let soundOn = true, armed = false;
  try { if (localStorage.getItem('3m-sound') === 'off') soundOn = false; } catch (e) {}
  const paintSnd = () => { snd.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); snd.setAttribute('aria-label', soundOn ? 'Sound on' : 'Sound off'); };
  paintSnd();
  snd.addEventListener('click', () => { soundOn = !soundOn; paintSnd(); try { localStorage.setItem('3m-sound', soundOn ? 'on' : 'off'); } catch (e) {} if (soundOn) { ensureCtx(); blip(660, .06, .08); } });
  // audio can only start after the visitor clicks or presses a key somewhere
  const arm = () => { armed = true; };
  addEventListener('pointerdown', arm, { once: true }); addEventListener('keydown', arm, { once: true });
  const blip = (hz, len, vol, type = 'sine') => {
    if (!ctx) return; const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(hz, t); o.frequency.exponentialRampToValueAtTime(hz * 1.5, t + len);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + len + .02);
  };
  const NOTES = [523.25, 587.33, 659.25, 783.99, 880];
  let lastHover = null, lastHoverT = 0;
  document.addEventListener('pointerover', e => {
    if (!soundOn || !armed) return;
    const el = e.target.closest('a,button,summary,.chips span,.card,.svc');
    if (!el || el === lastHover || performance.now() - lastHoverT < 60) return;
    lastHover = el; lastHoverT = performance.now();
    ensureCtx(); blip(NOTES[Math.floor(Math.random() * NOTES.length)] * 2, .04, .025);
  });
  document.addEventListener('click', e => {
    if (!soundOn) return;
    const el = e.target.closest('a,button,summary,.chips label');
    if (!el || el.closest('#seq-grid') || el.id === 'snd') return;
    ensureCtx(); blip(392, .09, .06, 'triangle');
  });
  // pads in the hero play a note on hover, once sound is armed
  hero.addEventListener('pointermove', e => {
    if (!soundOn || !armed || !ctx) return;
    const now = performance.now(); if (now - (hero._t || 0) < 90) return; hero._t = now;
    const i = Math.floor((1 - e.clientY / innerHeight) * NOTES.length);
    blip(NOTES[Math.max(0, Math.min(NOTES.length - 1, i))], .12, .02, 'triangle');
  });

  /* ---------- Contact form ---------- */
  const form = $('#form'), status = $('#f-status'), send = $('#f-send');
  const setStatus = (t, cls) => { status.textContent = t; status.className = 'form-status ' + (cls || ''); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    ['#f-name', '#f-email', '#f-msg'].forEach(id => {
      const el = $(id); const bad = !el.value.trim() || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
      el.closest('.field').classList.toggle('bad', bad); el.setAttribute('aria-invalid', bad ? 'true' : 'false'); if (bad) ok = false;
    });
    if (!ok) return setStatus(MSG[lang].check, 'err');
    send.disabled = true; setStatus(MSG[lang].sending);
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && String(j.success) !== 'false') { form.reset(); setStatus(MSG[lang].ok, 'ok'); }
      else throw new Error('fail');
    } catch (err) { setStatus(MSG[lang].err, 'err'); }
    send.disabled = false;
  });
  $('#copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('3rdmodule@gmail.com'); const b = $('#copy'); const o = b.innerHTML; b.textContent = MSG[lang].copied; setTimeout(() => { b.innerHTML = lang === 'fr' ? FR['ct.copy'] : EN['ct.copy']; }, 1600); } catch (e) {}
  });
})();
