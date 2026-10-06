(() => {
  // Racine du site, déduite de l'emplacement de ce script (assets/js/app.js) : le site marche dans un sous-dossier
  const BASE = new URL("../../", document.currentScript.src).href;
  window.SITE_BASE = BASE;
  const html = document.documentElement;
  const page = html.dataset.page;
  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
  if (!hasGsap) html.classList.add("reduced");
  if (!hasGsap) html.classList.remove("is-first", "is-entering");
  const reduced = html.classList.contains("reduced");
  const animate = !reduced;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobileMQ = window.matchMedia("(max-width: 767px)");
  const PROJECTS = window.PROJECTS || [];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pad = (n, size = 2) => String(n).padStart(size, "0");
  const thumb = (p) => `${BASE}assets/img/videos/${p.id}.jpg`;

  const ICON = {
    play: '<svg viewBox="0 0 14 16" aria-hidden="true"><path fill="currentColor" d="M0 0l14 8-14 8z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 4l16 16M20 4 4 20"/></svg>',
  };

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === false || value == null) continue;
      if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else if (key === "html") node.innerHTML = value;
      else node.setAttribute(key, value === true ? "" : value);
    }
    node.append(...children.filter((c) => c != null));
    return node;
  }

  function toast(message) {
    const node = el("div", { class: "toast", role: "status" }, message);
    document.body.append(node);
    setTimeout(() => node.remove(), 2300);
  }

  function loadVideo(video) {
    if (!video) return;
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
    const playing = video.play();
    if (playing) playing.catch(() => {});
  }

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (animate) html.classList.add("anim");

  /* ---------- Défilement fluide ---------- */

  let lenis = null;
  if (animate && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  function lockScroll(lock) {
    document.body.classList.toggle("no-scroll", lock);
    if (lenis) lock ? lenis.stop() : lenis.start();
  }

  /* ---------- Découpage des titres ---------- */

  function split(node) {
    if (node._chars) return node._chars;
    const lines = [[]];
    node.childNodes.forEach((child) => {
      if (child.nodeName === "BR") lines.push([]);
      else lines[lines.length - 1].push(child.textContent);
    });
    const label = lines.map((l) => l.join("")).join(" ").replace(/[ \t\n\r]+/g, " ").trim();
    node.textContent = "";
    node.setAttribute("aria-label", label);
    const chars = [];
    lines.forEach((parts) => {
      const text = parts.join("").replace(/[ \t\n\r]+/g, " ").trim();
      const line = el("span", { class: "split-line", "aria-hidden": "true" });
      text.split(" ").forEach((word, i, words) => {
        const w = el("span", { class: "split-word" });
        for (const ch of word) {
          const c = el("span", { class: "split-char" }, ch);
          w.append(c);
          chars.push(c);
        }
        line.append(w);
        if (i < words.length - 1) line.append(" ");
      });
      node.append(line);
    });
    node._chars = chars;
    return chars;
  }

  /* Titre ajusté à la largeur (pages catégories) */
  function fitTitles() {
    $$("[data-fit]").forEach((node) => {
      if (!node.dataset.text) node.dataset.text = node.textContent.trim();
      const words = node.dataset.text.split(" ");
      const stacked = mobileMQ.matches && words.length > 1;
      const key = stacked ? "stacked" : "line";
      if (node.dataset.layout !== key) {
        node.dataset.layout = key;
        node._chars = null;
        node.innerHTML = stacked ? words.join("<br>") : node.dataset.text;
        split(node);
      }
      node.style.setProperty("--title-size", "100px");
      const available = node.clientWidth;
      const width =
        Math.max(
          ...$$(".split-line", node).map((line) => {
            const words = $$(".split-word", line);
            const last = words[words.length - 1];
            return last ? last.offsetLeft + last.offsetWidth - words[0].offsetLeft : 0;
          })
        ) || 1;
      const max = Math.max(window.innerHeight * 0.34, 64);
      node.style.setProperty("--title-size", `${Math.min((100 * available) / width, max).toFixed(2)}px`);
    });
  }

  /* ---------- Horloge Paris & timecode ---------- */

  const clockFormat = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const clocks = $$("[data-clock]");
  const tickClock = () => {
    const text = `PARIS ${clockFormat.format(new Date())}`;
    clocks.forEach((c) => (c.textContent = text));
  };
  tickClock();
  setInterval(tickClock, 1000);

  $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));

  const timecode = $("[data-timecode]");
  if (timecode) {
    const start = performance.now();
    let last = -1;
    const tick = (now) => {
      const frames = Math.floor(((now - start) / 1000) * 25);
      if (frames !== last) {
        last = frames;
        const ff = frames % 25;
        const s = Math.floor(frames / 25);
        timecode.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- En-tête & menu ---------- */

  const header = $(".hdr");
  const burger = $(".burger");
  const menu = $("#menu");
  let menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menu.classList.toggle("is-open", open);
    header.classList.remove("is-hidden");
    lockScroll(open);
  }

  burger.addEventListener("click", () => setMenu(!menuOpen));
  document.addEventListener("keydown", (e) => e.key === "Escape" && menuOpen && setMenu(false));
  mobileMQ.addEventListener("change", () => menuOpen && setMenu(false));

  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (!menuOpen && !document.body.classList.contains("no-scroll")) header.classList.toggle("is-hidden", y > 160 && y > lastY);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Curseur ---------- */

  if (fine && hasGsap) {
    const cursor = $(".cursor");
    const dot = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);
    const label = $(".cursor__label", cursor);
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    gsap.set(cursor, { autoAlpha: 0 });

    window.addEventListener("pointermove", (e) => {
      gsap.to(cursor, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    });
    document.documentElement.addEventListener("pointerleave", () => gsap.to(cursor, { autoAlpha: 0, duration: 0.3 }));

    document.addEventListener("pointerover", (e) => {
      const target = e.target.closest("[data-cursor], a, button");
      const text = target && target.dataset.cursor;
      cursor.classList.toggle("is-label", Boolean(text));
      cursor.classList.toggle("is-hover", Boolean(target) && !text);
      if (text) label.textContent = text;
    });
  }

  /* ---------- Transitions entre pages ---------- */

  const curtain = $(".curtain");
  const curtainLabel = $(".curtain__label span");
  const PAGE_NAMES = { "": "Accueil", "phantom/": "Phantom", "motion-control/": "Motion control", "autres-projets/": "Autres projets" };

  function leaveTo(url) {
    const name = PAGE_NAMES[url.href.split("#")[0].replace(BASE, "").replace(/index\.html$/, "")] || "Charles Dupont";
    try {
      sessionStorage.setItem("cd-nav", "1");
      sessionStorage.setItem("cd-label", name);
    } catch {
      /* stockage indisponible */
    }
    curtainLabel.textContent = name;
    gsap.timeline({ onComplete: () => (window.location.href = url.href) })
      .fromTo(curtain, { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 0.75, ease: "power4.inOut" })
      .fromTo(curtainLabel, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "power3.out" }, 0.3);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.protocol === "mailto:") return;

    if (url.pathname === window.location.pathname) {
      e.preventDefault();
      if (menuOpen) setMenu(false);
      const target = url.hash ? $(url.hash) : null;
      scrollToTarget(target || 0);
      return;
    }
    if (!animate) return;
    e.preventDefault();
    if (menuOpen) setMenu(false);
    leaveTo(url);
  });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted && hasGsap) {
      gsap.set(curtain, { scaleY: 0 });
      html.classList.remove("is-entering");
    }
  });

  /* ---------- Révélations au défilement ---------- */

  let introDelay = 0;

  function revealChars(node, delay) {
    const chars = split(node);
    node.style.visibility = "visible";
    const inView = node.getBoundingClientRect().top < window.innerHeight;
    return gsap.fromTo(
      chars,
      { yPercent: 115, rotate: 6 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.025,
        delay: delay ?? (inView ? introDelay : 0),
        scrollTrigger: inView ? null : { trigger: node, start: "top 88%" },
      }
    );
  }

  function setupReveals() {
    $$("[data-split]").forEach((node) => {
      if (node.hasAttribute("data-fit")) return;
      revealChars(node);
    });

    $$("[data-reveal]").forEach((node) => {
      const inView = node.getBoundingClientRect().top < window.innerHeight;
      gsap.to(node, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: inView ? introDelay + 0.3 : 0,
        scrollTrigger: inView ? null : { trigger: node, start: "top 90%" },
      });
    });

    const about = $("[data-words-reveal]");
    if (about) {
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              frag.append(/^\s+$/.test(part) ? part : el("span", { class: "w" }, part));
            });
            child.replaceWith(frag);
          } else walk(child);
        });
      };
      walk(about);
      gsap.to($$(".w", about), {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: about, start: "top 78%", end: "bottom 50%", scrub: true },
      });
    }
  }

  /* ---------- Bandeau défilant ---------- */

  function setupMarquee() {
    $$(".marquee__track").forEach((track) => {
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      let direction = 1;
      if (lenis) {
        lenis.on("scroll", ({ velocity }) => {
          if (velocity) direction = velocity > 0 ? 1 : -1;
          const speed = direction * (1 + Math.min(Math.abs(velocity) * 0.25, 6));
          gsap.to(loop, { timeScale: speed, duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.3, ease: "power2.out", overwrite: false });
        });
      }
      gsap.to(track, {
        skewX: -4,
        ease: "none",
        scrollTrigger: { trigger: track.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  /* ---------- Lecteur vidéo ---------- */

  const player = (() => {
    const count = el("span", { class: "player__count mono" });
    const closeBtn = el("button", { class: "player__close mono", type: "button", html: `<span>Fermer</span>${ICON.close}` });
    const frame = el("div", { class: "player__frame" });
    const title = el("h2", { class: "player__title" });
    const meta = el("p", { class: "player__meta mono" });
    const prev = el("button", { class: "player__nav", type: "button", "aria-label": "Vidéo précédente", html: ICON.prev });
    const next = el("button", { class: "player__nav", type: "button", "aria-label": "Vidéo suivante", html: ICON.next });
    const root = el(
      "div",
      { class: "player", role: "dialog", "aria-modal": "true", "aria-label": "Lecteur vidéo", "aria-hidden": "true" },
      el("div", { class: "player__top" }, count, closeBtn),
      el("div", { class: "player__stage" }, frame),
      el("div", { class: "player__bottom" }, el("div", { class: "player__info" }, title, meta), el("div", { class: "player__navs" }, prev, next))
    );
    document.body.append(root);

    let list = null;
    let index = 0;
    let lastFocus = null;

    function render() {
      const p = list[index];
      frame.replaceChildren();
      frame.style.removeProperty("--ratio");
      if (p.type === "youtube") {
        frame.append(
          el("iframe", {
            src: `https://www.youtube-nocookie.com/embed/${p.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
            title: p.title,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
            allowfullscreen: true,
          })
        );
      } else {
        const video = el("video", { src: `${BASE}assets/video/portfolio/${p.file}`, poster: thumb(p), controls: true, autoplay: true, playsinline: true });
        // Le cadre prend le format de la vidéo (verticale, 4:5, 4:3...)
        video.addEventListener("loadedmetadata", () => {
          if (video.videoWidth && video.videoHeight) frame.style.setProperty("--ratio", (video.videoWidth / video.videoHeight).toFixed(4));
        });
        video.addEventListener("error", () => {
          frame.replaceChildren(
            el("div", { class: "player__missing", style: `background-image:url('${thumb(p)}')` }, el("span", { class: "mono" }, "Vidéo bientôt disponible"))
          );
        });
        frame.append(video);
      }
      title.textContent = p.title;
      meta.textContent = [p.client, p.tag, p.duration].filter(Boolean).join("  ·  ");
      count.textContent = `${pad(index + 1)} / ${pad(list.length)}`;
      prev.disabled = index === 0;
      next.disabled = index === list.length - 1;
      if (hasGsap && animate) gsap.fromTo([title, meta], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" });
    }

    function go(i) {
      if (i < 0 || i >= list.length) return;
      index = i;
      render();
    }

    function open(items, i) {
      lastFocus = document.activeElement;
      list = items;
      index = i;
      root.classList.add("is-open");
      root.setAttribute("aria-hidden", "false");
      lockScroll(true);
      render();
      closeBtn.focus({ preventScroll: true });
    }

    function close() {
      if (!list) return;
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      list = null;
      lockScroll(false);
      setTimeout(() => !list && frame.replaceChildren(), 800);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    closeBtn.addEventListener("click", close);
    prev.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));
    document.addEventListener("keydown", (e) => {
      if (!list) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "Tab") {
        const items = $$("button:not(:disabled), iframe, video", root);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    return { open };
  })();

  /* ---------- Accueil ---------- */

  function countProjects() {
    $$("[data-count]").forEach((n) => {
      n.textContent = pad(PROJECTS.filter((p) => p.category === n.dataset.count).length);
    });
  }

  function setupDisciplines() {
    $$(".disc__panel").forEach((panel) => {
      const video = $("video", panel);
      if (fine) {
        panel.addEventListener("mouseenter", () => loadVideo(video));
        panel.addEventListener("mouseleave", () => video.pause());
      } else if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          ([entry]) => {
            panel.classList.toggle("is-playing", entry.isIntersecting);
            entry.isIntersecting ? loadVideo(video) : video.pause();
          },
          { threshold: 0.6 }
        ).observe(panel);
      }
    });
  }

  function setupReel() {
    const track = $("[data-reel-track]");
    if (!track) return;
    const featured = PROJECTS.filter((p) => p.featured);
    track.append(
      ...featured.map((p, i) =>
        el(
          "button",
          { class: "reel__card", type: "button", "data-cursor": "Lire", onclick: () => player.open(featured, i) },
          el("span", { class: "reel__thumb" }, el("img", { src: thumb(p), alt: "", loading: "lazy" })),
          el(
            "span",
            { class: "reel__info" },
            el("span", { class: "reel__name" }, p.title, el("small", {}, p.client)),
            el("span", { class: "reel__num mono" }, pad(i + 1))
          )
        )
      )
    );
    if (!animate) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const section = $("[data-reel]");
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      $$(".reel__thumb img", track).forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        });
      });
    });
  }

  /* Modèles 3D du matériel : three.js chargé seulement à l'approche de la section */
  function setupGear() {
    const section = $("[data-gear]");
    if (!section || !("IntersectionObserver" in window)) return;
    const load = (src) =>
      new Promise((resolve, reject) => {
        const s = el("script", { src });
        s.onload = resolve;
        s.onerror = reject;
        document.head.append(s);
      });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        load(`${BASE}assets/js/vendor/three.min.js?v=9`)
          .then(() => load(`${BASE}assets/js/vendor/GLTFLoader.js?v=9`))
          .then(() => load(`${BASE}assets/js/gear3d.js?v=23`))
          .then(() => document.fonts.ready)
          .then(() => window.initGear && window.initGear(section))
          .catch(() => section.classList.add("no-webgl"));
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(section);
  }

  function setupHome() {
    countProjects();
    setupGear();
    setupDisciplines();
    if (!animate) return setupReel();

    const hero = $(".hero");
    const media = $("[data-hero-media]");
    const heroVideo = $("video", media);
    const title = $("[data-hero-title]");
    const subs = $$("[data-hero-sub]");
    const chars = split(title);
    title.style.visibility = "visible";
    gsap.set(chars, { yPercent: 115 });
    gsap.set(subs, { autoAlpha: 0, y: 24 });
    gsap.set(".hud", { autoAlpha: 0 });

    const intro = () =>
      gsap.timeline()
        .fromTo(heroVideo, { scale: 1.35 }, { scale: 1, duration: 2.4, ease: "expo.out" }, 0)
        .to(chars, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.035 }, 0.1)
        .to(subs, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 0.7)
        .to(".hud", { autoAlpha: 1, duration: 1.2 }, 0.9);

    // Sortie du hero au défilement : l'image se recadre comme un viseur
    gsap.to(media, {
      clipPath: "inset(7% 5% 7% 5%)",
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__content", {
      yPercent: -40,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });

    // Mots épinglés
    const words = $("[data-words]");
    const items = $$(".words__item", words);
    const videos = $$("video", words);
    const frames = $("[data-frames]", words);
    const bar = $("[data-words-bar]", words);
    ScrollTrigger.create({ trigger: words, start: "top bottom", onEnter: () => loadVideo(videos[0]) });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: words,
        start: "top top",
        end: () => `+=${items.length * window.innerHeight * 0.9}`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          frames.textContent = pad(Math.round(self.progress * 2400), 4);
          if (self.progress > 0.25) loadVideo(videos[1]);
        },
      },
    });
    items.forEach((item, i) => {
      if (i === 2) tl.to(videos[1], { opacity: 1, duration: 0.8 }, "<");
      tl.fromTo(
        item,
        { opacity: 0, yPercent: 30, scale: 0.9, filter: "blur(14px)" },
        { opacity: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1, ease: "power3.out" }
      );
      if (i < items.length - 1) {
        tl.to(item, { opacity: 0, yPercent: -30, scale: 1.06, filter: "blur(14px)", duration: 1, ease: "power3.in" }, "+=0.5");
      } else {
        tl.to({}, { duration: 0.6 });
      }
    });
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);

    // Sélection horizontale (créée après les mots épinglés, plus haut dans la page)
    setupReel();

    if (html.classList.contains("is-first")) runLoader(heroVideo).then(intro);
    else intro().delay(introDelay);
  }

  function runLoader(video) {
    return new Promise((resolve) => {
      const loader = $(".loader");
      const num = $("[data-loader-num]");
      const bar = $("[data-loader-bar]");
      const counter = { v: 0 };
      lockScroll(true);
      const ready = new Promise((r) => {
        if (video.readyState >= 3) r();
        video.addEventListener("canplay", r, { once: true });
        setTimeout(r, 3500);
      });
      const count = gsap.to(counter, {
        v: 1000,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          num.textContent = pad(Math.round(counter.v), 4);
          bar.style.transform = `scaleX(${counter.v / 1000})`;
        },
      });
      Promise.all([ready, count.then()]).then(() => {
        gsap.timeline({
          onComplete: () => {
            loader.remove();
            html.classList.remove("is-first");
          },
        })
          .to(".loader__inner, .loader__top", { y: -40, opacity: 0, duration: 0.5, ease: "power3.in" })
          .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut" }, 0.3)
          .add(() => {
            lockScroll(false);
            resolve();
          }, 0.55);
      });
    });
  }

  /* ---------- Pages catégories ---------- */

  function setupCategory() {
    countProjects();
    const root = $("[data-projects]");
    const category = root.dataset.category;
    const all = PROJECTS.filter((p) => p.category === category);
    const filtersRoot = $("[data-filters]");
    const viewButtons = $$("[data-view]");
    let filter = "all";
    let view = "list";
    try {
      view = localStorage.getItem("cd-view") || "list";
    } catch {
      /* stockage indisponible */
    }

    const tags = [...new Set(all.map((p) => p.tag))];
    if (tags.length > 1) {
      const chip = (value, label) =>
        el("button", { class: "chip", type: "button", "aria-pressed": String(value === filter), "data-filter": value }, label);
      filtersRoot.append(chip("all", "Tout"), ...tags.map((t) => chip(t, t)));
      filtersRoot.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter]");
        if (!btn || btn.dataset.filter === filter) return;
        filter = btn.dataset.filter;
        $$("[data-filter]", filtersRoot).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        render(true);
      });
    }

    viewButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        if (btn.dataset.view === view) return;
        view = btn.dataset.view;
        try {
          localStorage.setItem("cd-view", view);
        } catch {
          /* stockage indisponible */
        }
        render(true);
      })
    );

    // Aperçu flottant (liste, souris uniquement)
    const preview = fine ? el("div", { class: "preview", "aria-hidden": "true" }) : null;
    let moveX = null;
    let moveY = null;
    if (preview) {
      document.body.append(preview);
      if (hasGsap) {
        moveX = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
        moveY = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
      }
      window.addEventListener("pointermove", (e) => {
        const w = preview.offsetWidth;
        const h = preview.offsetHeight;
        let x = e.clientX + 32;
        if (x + w > window.innerWidth - 16) x = e.clientX - w - 32;
        const y = Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16);
        if (moveX) {
          moveX(x);
          moveY(y);
        } else preview.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    function showPreview(p) {
      if (!preview) return;
      preview.classList.add("is-visible");
      const img = el("img", { src: thumb(p), alt: "" });
      preview.append(img);
      if (hasGsap && animate) {
        gsap.fromTo(img, { clipPath: "inset(100% 0 0 0)", scale: 1.25 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.7, ease: "power4.out" });
      }
      while (preview.children.length > 3) preview.firstChild.remove();
    }

    function hidePreview() {
      if (preview) preview.classList.remove("is-visible");
    }

    function row(p, i, list) {
      const btn = el(
        "button",
        { class: "prow__btn", type: "button", "data-cursor": "Lire", onclick: () => player.open(list, i) },
        el("span", { class: "prow__thumb" }, el("img", { src: thumb(p), alt: "", loading: "lazy" }), el("span", { class: "pcard__tag mono" }, p.tag)),
        el("span", { class: "prow__num mono" }, pad(i + 1)),
        el("span", { class: "prow__title" }, p.title),
        el("span", { class: "prow__client prow__muted" }, p.client),
        el("span", { class: "prow__tag prow__muted mono" }, p.tag),
        el("span", { class: "prow__dur prow__muted mono" }, p.duration)
      );
      btn.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && showPreview(p));
      return el("li", { class: "prow" }, btn);
    }

    function card(p, i, list) {
      return el(
        "li",
        { class: "pcard" },
        el(
          "button",
          { class: "pcard__btn", type: "button", "data-cursor": "Lire", onclick: () => player.open(list, i) },
          el(
            "span",
            { class: "pcard__thumb" },
            el("img", { src: thumb(p), alt: "", loading: "lazy" }),
            el("span", { class: "pcard__tag mono" }, p.tag),
            el("span", { class: "pcard__dur mono" }, p.duration),
            el("span", { class: "pcard__play", html: ICON.play })
          ),
          el(
            "span",
            { class: "pcard__info" },
            el("span", { class: "pcard__num mono" }, pad(i + 1)),
            el("span", {}, el("span", { class: "pcard__title" }, p.title), el("span", { class: "pcard__client" }, p.client))
          )
        )
      );
    }

    function render(animated) {
      const list = filter === "all" ? all : all.filter((p) => p.tag === filter);
      viewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
      hidePreview();
      let container;
      if (!list.length) container = el("p", { class: "works__empty mono" }, "Projets à venir.");
      else if (view === "grid") container = el("ul", { class: "pgrid" }, ...list.map((p, i) => card(p, i, list)));
      else {
        container = el("ul", { class: "plist" }, ...list.map((p, i) => row(p, i, list)));
        container.addEventListener("pointerleave", hidePreview);
      }
      root.replaceChildren(container);

      if (!hasGsap || !animate) return;
      const items = [...container.children];
      if (animated) {
        gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.04 });
      } else {
        gsap.set(items, { y: 50, opacity: 0 });
        ScrollTrigger.batch(items, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07 }),
        });
      }
      ScrollTrigger.refresh();
    }

    render(false);

    // Titre ajusté puis révélé
    fitTitles();
    const title = $(".phero__title");
    if (animate) {
      revealChars(title, introDelay + 0.05);
      gsap.fromTo("[data-phero-media] video", { scale: 1.3 }, { scale: 1, duration: 2.4, ease: "expo.out", delay: introDelay });
      gsap.to("[data-phero-media]", {
        yPercent: 25,
        ease: "none",
        scrollTrigger: { trigger: ".phero", start: "top top", end: "bottom top", scrub: true },
      });
    }

    const next = $(".next");
    if (next) {
      const video = $("video", next);
      next.addEventListener("mouseenter", () => loadVideo(video));
      next.addEventListener("mouseleave", () => video.pause());
    }
  }

  /* ---------- Pied de page ---------- */

  function setupFooter() {
    $$("[data-copy]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          toast("Adresse copiée");
        } catch {
          window.prompt("Copiez cette adresse :", btn.dataset.copy);
        }
      })
    );
    $$("[data-top]").forEach((btn) => btn.addEventListener("click", () => scrollToTarget(0)));
    if (animate) {
      gsap.fromTo(".ftr__giant", { yPercent: 60 }, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: ".ftr", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    }
  }

  /* ---------- Démarrage ---------- */

  function enter() {
    if (!html.classList.contains("is-entering")) return;
    let name = "";
    try {
      name = sessionStorage.getItem("cd-label") || "";
    } catch {
      /* stockage indisponible */
    }
    curtainLabel.textContent = name;
    introDelay = 0.55;
    gsap.timeline({
      onComplete: () => {
        html.classList.remove("is-entering");
        gsap.set(curtain, { clearProps: "transform" });
      },
    })
      .set(curtain, { scaleY: 1 })
      .to(curtainLabel, { yPercent: -110, duration: 0.5, ease: "power3.in" }, 0.1)
      .to(curtain, { scaleY: 0, transformOrigin: "top", duration: 0.9, ease: "power4.inOut" }, 0.25);
  }

  function start() {
    if (hasGsap) enter();
    if (page === "home") setupHome();
    else if (page === "phantom" || page === "motion" || page === "autres") setupCategory();
    if (animate) {
      setupReveals();
      setupMarquee();
    }
    setupFooter();
    if (animate) {
      document.fonts.ready.then(() => {
        fitTitles();
        ScrollTrigger.refresh();
      });
      let width = window.innerWidth;
      window.addEventListener("resize", () => {
        if (window.innerWidth === width) return;
        width = window.innerWidth;
        fitTitles();
      });
    } else {
      fitTitles();
      document.fonts.ready.then(fitTitles);
      window.addEventListener("resize", fitTitles);
    }
  }

  start();
})();
