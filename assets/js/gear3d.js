/*
  Modèles 3D du matériel (section « Matériel » de l'accueil).
  Modèles construits en code (three.js) : Phantom Flex4K, bras Colossus, bras Evo.
*/
window.initGear = (root) => {
  const T = window.THREE;
  if (!T) return;
  const reduced = document.documentElement.classList.contains("reduced");

  /* ---------- Matériaux ---------- */

  const M = {
    body: new T.MeshStandardMaterial({ color: 0x0b0b0c, metalness: 0.3, roughness: 0.4, envMapIntensity: 0.22 }),
    dark: new T.MeshStandardMaterial({ color: 0x18191b, metalness: 0.4, roughness: 0.36, envMapIntensity: 0.3 }),
    satin: new T.MeshStandardMaterial({ color: 0x070708, metalness: 0.1, roughness: 0.62, envMapIntensity: 0.2 }),
    silver: new T.MeshStandardMaterial({ color: 0x7d7f83, metalness: 1, roughness: 0.3, envMapIntensity: 0.45 }),
    grey: new T.MeshStandardMaterial({ color: 0x3a3c40, metalness: 0.7, roughness: 0.32, envMapIntensity: 0.35 }),
    rubber: new T.MeshStandardMaterial({ color: 0x070707, metalness: 0, roughness: 0.85, envMapIntensity: 0.4 }),
    glass: new T.MeshStandardMaterial({ color: 0x050a14, metalness: 1, roughness: 0.04 }),
    red: new T.MeshStandardMaterial({ color: 0xff2a1a, emissive: 0xff2a1a, emissiveIntensity: 0.9 }),
    screen: new T.MeshStandardMaterial({ color: 0x0d1820, emissive: 0x2a4a5c, emissiveIntensity: 0.55, roughness: 0.2 }),
  };

  /* ---------- Outils de construction ---------- */

  function rbox(w, h, d, r, mat) {
    const s = new T.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const b = Math.min(r * 0.5, d * 0.2);
    const g = new T.ExtrudeGeometry(s, { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b * 0.8, bevelSegments: 3, curveSegments: 6 });
    g.translate(0, 0, -(d - 2 * b) / 2);
    return new T.Mesh(g, mat);
  }

  function box(w, h, d, mat) {
    return new T.Mesh(new T.BoxGeometry(w, h, d), mat);
  }

  // Cylindre orienté selon un axe ("x", "y" ou "z")
  function cyl(r, h, mat, axis = "y", rTop = r, seg = 40) {
    const m = new T.Mesh(new T.CylinderGeometry(rTop, r, h, seg), mat);
    if (axis === "x") m.rotation.z = Math.PI / 2;
    if (axis === "z") m.rotation.x = Math.PI / 2;
    return m;
  }

  function at(mesh, x, y, z) {
    mesh.position.set(x, y, z);
    return mesh;
  }

  function textTexture(text, { color = "#e9e7e1", stroke = false, size = 150, w = 1024, h = 220, spacing = 0 } = {}) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.font = `800 ${size}px Archivo, Arial, sans-serif`;
    if ("fontStretch" in ctx) ctx.fontStretch = "expanded";
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (stroke) {
      ctx.lineWidth = 7;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.strokeText(text, w / 2, h / 2);
    } else {
      ctx.fillStyle = color;
      ctx.fillText(text, w / 2, h / 2);
    }
    const tex = new T.CanvasTexture(c);
    tex.anisotropy = 8;
    if (T.sRGBEncoding) tex.encoding = T.sRGBEncoding;
    return tex;
  }

  function label(text, width, height, opts) {
    const mat = new T.MeshBasicMaterial({ map: textTexture(text, opts), transparent: true, depthWrite: false, toneMapped: false });
    return new T.Mesh(new T.PlaneGeometry(width, height), mat);
  }

  /* ---------- Phantom Flex4K ---------- */

  function buildFlex() {
    const g = new T.Group();
    const L = 0.3; // longueur du boîtier (axe z, optique vers +z)

    g.add(rbox(0.15, 0.17, L, 0.014, M.body));
    g.add(at(rbox(0.162, 0.182, 0.022, 0.012, M.dark), 0, 0, L / 2 + 0.008));

    // Monture et optique
    const lens = new T.Group();
    lens.add(at(cyl(0.056, 0.026, M.silver, "z"), 0, 0, 0));
    lens.add(at(cyl(0.047, 0.17, M.satin, "z"), 0, 0, 0.098));
    lens.add(at(cyl(0.052, 0.03, M.grey, "z", 0.052, 64), 0, 0, 0.06));
    lens.add(at(cyl(0.052, 0.022, M.grey, "z", 0.052, 64), 0, 0, 0.125));
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const tooth = box(0.004, 0.006, 0.03, M.dark);
      tooth.position.set(Math.cos(a) * 0.054, Math.sin(a) * 0.054, 0.06);
      tooth.rotation.z = a;
      lens.add(tooth);
    }
    lens.add(at(cyl(0.056, 0.03, M.satin, "z", 0.06), 0, 0, 0.196));
    lens.add(at(cyl(0.042, 0.004, M.glass, "z"), 0, 0, 0.212));
    lens.add(at(cyl(0.0425, 0.003, M.silver, "z"), 0, 0, 0.209));
    lens.position.z = L / 2 + 0.03;
    g.add(lens);

    // Poignée supérieure
    g.add(at(box(0.026, 0.045, 0.026, M.dark), 0, 0.107, 0.09));
    g.add(at(box(0.026, 0.045, 0.026, M.dark), 0, 0.107, -0.09));
    g.add(at(rbox(0.034, 0.028, 0.29, 0.012, M.rubber), 0, 0.142, 0.01));

    // Plaque inférieure et dos (batterie)
    g.add(at(box(0.12, 0.012, 0.24, M.dark), 0, -0.094, 0));
    g.add(at(rbox(0.13, 0.15, 0.036, 0.01, M.dark), 0, -0.004, -L / 2 - 0.016));
    g.add(at(box(0.09, 0.02, 0.01, M.grey), 0, 0.045, -L / 2 - 0.036));

    // Panneau latéral (côté opérateur)
    const side = new T.Group();
    side.add(at(box(0.004, 0.13, 0.24, M.satin), 0, 0, 0));
    const name = label("PHANTOM", 0.12, 0.026, { size: 150 });
    name.rotation.set(0, Math.PI / 2, Math.PI / 2);
    side.add(at(name, 0.0035, 0.005, -0.1));
    side.add(at(box(0.003, 0.046, 0.08, M.screen), 0.002, 0.028, 0.025));
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        side.add(at(cyl(0.0062, 0.006, M.grey, "x"), 0.004, -0.022 - row * 0.022, -0.01 + col * 0.022));
      }
    }
    side.add(at(cyl(0.0095, 0.008, M.red, "x"), 0.005, -0.033, 0.086));
    side.add(at(cyl(0.012, 0.004, M.dark, "x"), 0.003, -0.033, 0.086));
    side.position.x = 0.079;
    g.add(side);

    // Ouïes de ventilation (côté opposé)
    for (let i = 0; i < 9; i++) g.add(at(box(0.004, 0.006, 0.16, M.satin), -0.078, -0.045 + i * 0.012, -0.02));
    g.add(at(label("FLEX 4K", 0.07, 0.016, { size: 140, color: "#9a9a9a" }), 0, 0.05, L / 2 + 0.0205));

    g.position.z = -0.06;
    const wrap = new T.Group();
    wrap.add(g);
    wrap.position.y = 0.11;
    return { model: wrap, animate: null, height: 0.36, spin: true, view: { y: 0.12, dist: 1.5, tilt: 0.3 } };
  }

  /* ---------- Colossus (grand bras robotique) ---------- */

  function buildColossus() {
    const g = new T.Group();
    const green = { color: "#2fe06a", stroke: true, size: 118, spacing: 4 };

    // Socle sur roues
    g.add(at(cyl(0.5, 0.05, M.dark), 0, 0.025, 0));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      g.add(at(cyl(0.07, 0.06, M.rubber, "x"), Math.cos(a) * 0.42, 0.07, Math.sin(a) * 0.42));
    }
    g.add(at(cyl(0.34, 0.26, M.body, "y", 0.3), 0, 0.18, 0));

    const j1 = at(new T.Group(), 0, 0.31, 0);
    g.add(j1);
    j1.add(at(cyl(0.27, 0.3, M.body), 0, 0.15, 0));
    j1.add(at(cyl(0.275, 0.03, M.grey), 0, 0.02, 0));
    j1.add(at(rbox(0.22, 0.26, 0.2, 0.04, M.body), -0.18, 0.2, 0));

    const j2 = at(new T.Group(), 0.04, 0.46, 0);
    j1.add(j2);
    j2.add(cyl(0.19, 0.42, M.body, "z"));
    j2.add(at(cyl(0.12, 0.44, M.grey, "z"), 0, 0, 0));
    const L1 = 1.15;
    const upper = rbox(0.17, L1, 0.2, 0.06, M.body);
    upper.position.y = L1 / 2;
    j2.add(upper);
    const t1 = label("ROBOT 3100", L1 * 0.62, 0.095, green);
    t1.rotation.z = Math.PI / 2;
    j2.add(at(t1, 0, L1 * 0.52, 0.107));
    const t1b = t1.clone();
    t1b.rotation.y = Math.PI;
    j2.add(at(t1b, 0, L1 * 0.52, -0.107));

    const j3 = at(new T.Group(), 0, L1, 0);
    j2.add(j3);
    j3.add(cyl(0.15, 0.34, M.body, "z"));
    j3.add(at(cyl(0.09, 0.36, M.grey, "z"), 0, 0, 0));
    const L2 = 1.0;
    const fore = rbox(0.12, L2, 0.14, 0.045, M.body);
    fore.position.y = L2 / 2;
    j3.add(fore);
    const t2 = label("ROBOT 3100", L2 * 0.6, 0.07, green);
    t2.rotation.z = Math.PI / 2;
    j3.add(at(t2, 0, L2 * 0.5, 0.077));
    const t2b = t2.clone();
    t2b.rotation.y = Math.PI;
    j3.add(at(t2b, 0, L2 * 0.5, -0.077));

    const j4 = at(new T.Group(), 0, L2, 0);
    j3.add(j4);
    j4.add(at(cyl(0.075, 0.1, M.dark), 0, 0.05, 0));
    const j5 = at(new T.Group(), 0, 0.13, 0);
    j4.add(j5);
    j5.add(cyl(0.07, 0.16, M.body, "z"));
    const j6 = at(new T.Group(), 0, 0.09, 0);
    j5.add(j6);
    j6.add(at(cyl(0.055, 0.05, M.silver), 0, 0.02, 0));

    // Caméra en bout de bras
    const cam = new T.Group();
    cam.add(rbox(0.13, 0.14, 0.24, 0.012, M.satin));
    cam.add(at(cyl(0.05, 0.14, M.dark, "z"), 0, 0, 0.18));
    cam.add(at(cyl(0.036, 0.004, M.glass, "z"), 0, 0, 0.251));
    cam.position.set(0, 0.12, 0);
    cam.rotation.x = -Math.PI / 2;
    j6.add(cam);

    const rest = { j1: 0.5, j2: 0.55, j3: -2.05, j4: 0, j5: -0.5, j6: 0 };
    const animate = (t) => {
      // Mouvement programmé, répété à l'identique
      const p = (t % 12) / 12;
      const s = Math.sin(p * Math.PI * 2);
      const c = Math.cos(p * Math.PI * 2);
      j1.rotation.y = rest.j1 + 0.75 * s;
      j2.rotation.z = rest.j2 + 0.22 * c;
      j3.rotation.z = rest.j3 + 0.3 * Math.sin(p * Math.PI * 4);
      j4.rotation.y = rest.j4 + 0.5 * s;
      j5.rotation.z = rest.j5 - 0.35 * c;
      j6.rotation.y = rest.j6 + 0.6 * s;
    };
    animate(0);
    return { model: g, animate, height: 2.4, spin: false, view: { y: 1.05, dist: 5.9, tilt: 0.12 } };
  }

  /* ---------- Evo (bras compact sur trépied) ---------- */

  function buildEvo() {
    const g = new T.Group();

    // Trépied
    const top = 0.78;
    g.add(at(cyl(0.024, top, M.silver), 0, top / 2, 0));
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const fx = Math.cos(a) * 0.5;
      const fz = Math.sin(a) * 0.5;
      const from = new T.Vector3(0, top - 0.05, 0);
      const to = new T.Vector3(fx, 0.01, fz);
      const len = from.distanceTo(to);
      const leg = cyl(0.016, len, M.silver);
      leg.position.copy(from.clone().add(to).multiplyScalar(0.5));
      leg.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), to.clone().sub(from).normalize());
      g.add(leg);
      g.add(at(cyl(0.028, 0.02, M.rubber), fx, 0.01, fz));
      const brace = cyl(0.008, 0.26, M.grey);
      brace.position.set(fx * 0.25, 0.3, fz * 0.25);
      brace.rotation.set(0, -a, Math.PI / 2);
      g.add(brace);
    }
    g.add(at(cyl(0.1, 0.05, M.dark), 0, top + 0.02, 0));

    const joint = (r, h, axis) => {
      const grp = new T.Group();
      grp.add(cyl(r, h, M.body, axis));
      const cap1 = cyl(r * 1.02, 0.012, M.grey, axis);
      const cap2 = cap1.clone();
      const off = h / 2 - 0.004;
      if (axis === "z") {
        cap1.position.z = off;
        cap2.position.z = -off;
      } else {
        cap1.position.y = off;
        cap2.position.y = -off;
      }
      grp.add(cap1, cap2);
      return grp;
    };

    const j1 = at(new T.Group(), 0, top + 0.05, 0);
    g.add(j1);
    j1.add(at(joint(0.065, 0.13, "y"), 0, 0.065, 0));
    const j2 = at(new T.Group(), 0, 0.17, 0);
    j1.add(j2);
    j2.add(joint(0.062, 0.14, "z"));
    const A = 0.42;
    j2.add(at(cyl(0.04, A, M.body), 0, A / 2, 0.0));
    j2.add(at(label("850", 0.16, 0.05, { size: 160, color: "#d8d6d0" }), 0, A * 0.55, 0.041).rotateZ(Math.PI / 2));

    const j3 = at(new T.Group(), 0, A, 0);
    j2.add(j3);
    j3.add(joint(0.055, 0.12, "z"));
    const B = 0.36;
    j3.add(at(cyl(0.034, B, M.body), 0, B / 2, 0));

    const j4 = at(new T.Group(), 0, B, 0);
    j3.add(j4);
    j4.add(joint(0.045, 0.1, "z"));
    const j5 = at(new T.Group(), 0, 0.08, 0);
    j4.add(j5);
    j5.add(at(joint(0.042, 0.09, "y"), 0, 0.02, 0));
    const j6 = at(new T.Group(), 0, 0.08, 0);
    j5.add(j6);
    j6.add(joint(0.038, 0.08, "z"));

    const cam = new T.Group();
    cam.add(rbox(0.09, 0.09, 0.15, 0.01, M.satin));
    cam.add(at(cyl(0.034, 0.1, M.dark, "z"), 0, 0, 0.12));
    cam.add(at(cyl(0.025, 0.004, M.glass, "z"), 0, 0, 0.171));
    cam.position.set(0, 0.08, 0);
    cam.rotation.x = -Math.PI / 2;
    j6.add(cam);

    const rest = { j1: -0.4, j2: 0.35, j3: -1.6, j4: -0.9, j5: 0, j6: 0 };
    const animate = (t) => {
      const p = (t % 9) / 9;
      const s = Math.sin(p * Math.PI * 2);
      const c = Math.cos(p * Math.PI * 2);
      j1.rotation.y = rest.j1 + 0.9 * s;
      j2.rotation.z = rest.j2 + 0.25 * c;
      j3.rotation.z = rest.j3 + 0.35 * s;
      j4.rotation.z = rest.j4 - 0.3 * c;
      j5.rotation.y = rest.j5 + 0.8 * s;
      j6.rotation.z = rest.j6 + 0.2 * c;
    };
    animate(0);
    return { model: g, animate, height: 1.55, spin: false, view: { y: 0.82, dist: 3.95, tilt: 0.16 } };
  }


  /* ---------- Modèles officiels (fichiers .glb) ---------- */

  const gltfLoader = T.GLTFLoader ? new T.GLTFLoader() : null;
  const loadGLB = (url) => new Promise((resolve, reject) => gltfLoader.load((window.SITE_BASE || "/") + url.replace(/^\//, ""), (g) => resolve(g.scene), undefined, reject));

  // Pose les objets au sol et centrés
  function ground(obj, pivot) {
    obj.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(obj);
    const c = pivot ? pivot.getWorldPosition(new T.Vector3()) : box.getCenter(new T.Vector3());
    obj.position.x -= c.x;
    obj.position.z -= c.z;
    obj.position.y -= box.min.y;
    return box.getSize(new T.Vector3());
  }

  // Articulation : rotation autour d'un axe, avec un pivot éventuel (modèle exporté sans pivots)
  function joint(root, name, axis, amp, speed, phase, offset = 0, pivot = null) {
    const node = root.getObjectByName(name);
    if (!node) return null;
    const restQ = node.quaternion.clone();
    const restP = node.position.clone();
    const ax = new T.Vector3(axis === "x" ? 1 : 0, axis === "y" ? 1 : 0, axis === "z" ? 1 : 0);
    const p = pivot ? new T.Vector3(...pivot) : null;
    const q = new T.Quaternion();
    return (t) => {
      const a = offset + amp * Math.sin(t * speed + phase);
      q.setFromAxisAngle(ax, a);
      if (p) {
        node.quaternion.copy(q);
        node.position.copy(p).sub(p.clone().applyQuaternion(q));
      } else {
        node.quaternion.copy(restQ).multiply(q);
        node.position.copy(restP);
      }
    };
  }

  function tune(root) {
    root.traverse((o) => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        if ("envMapIntensity" in m) m.envMapIntensity = m.metalness > 0.6 ? 0.28 : 0.45;
      });
    });
  }

  const OFFICIAL = {
    async flex() {
      const cam = await loadGLB("/assets/models/phantom-flex4k.glb?v=2");
      tune(cam);
      const size = ground(cam);
      const g = new T.Group();
      g.add(cam);
      const h = Math.max(size.x, size.y, size.z);
      return { model: g, animate: null, height: h, spin: true, view: { y: size.y / 2, dist: h * 3.0, tilt: 0.3 } };
    },
    async colossus() {
      const arm = await loadGLB("/assets/models/colossus.glb?v=3");
      tune(arm);
      const moves = [
        joint(arm, "A_1", "y", 0.7, 0.45, 0),
        joint(arm, "A_2", "x", 0.22, 0.6, 1.2),
        joint(arm, "A_3", "x", 0.28, 0.5, 2.1),
        joint(arm, "A_4", "z", 0.6, 0.4, 0.5),
        joint(arm, "A_5", "x", 0.45, 0.7, 1.7),
        joint(arm, "A_6", "y", 0.8, 0.55, 0.3),
      ].filter(Boolean);
      const size = ground(arm, arm.getObjectByName("A_1"));
      const g = new T.Group();
      g.add(arm);
      const h = Math.max(size.x, size.y, size.z);
      return { model: g, animate: (t) => moves.forEach((m) => m(t)), height: h, spin: false, view: { y: size.y * 0.5, dist: h * 4.7, tilt: 0.14 } };
    },
    async evo() {
      const [arm, tripod] = await Promise.all([loadGLB("/assets/models/evo.glb?v=3"), loadGLB("/assets/models/evo-tripod.glb?v=2")]);
      tune(arm);
      tune(tripod);
      const moves = [
        // Posture « dépliée » (bras levé, avant-bras tendu) comme le Colossus, loin de la base
        joint(arm, "A_1", "y", 0.8, 0.45, 0),
        joint(arm, "A_4", "y", 0.25, 0.4, 0.5),
        joint(arm, "A_6", "y", 0.8, 0.55, 0.3),
      ].filter(Boolean);
      const pitch = (name) => {
        const node = arm.getObjectByName(name);
        const rest = node ? node.quaternion.clone() : null;
        const q = new T.Quaternion();
        const X = new T.Vector3(1, 0, 0);
        return (a) => node && node.quaternion.copy(rest).multiply(q.setFromAxisAngle(X, a));
      };
      const a2 = pitch("A_2");
      const a3 = pitch("A_3");
      const a5 = pitch("A_5");
      moves.push((t) => {
        const s2 = -0.25 + 0.3 * Math.sin(t * 0.6 + 1.2);
        const s3 = -1.45 + 0.3 * Math.sin(t * 0.5 + 2.1);
        a2(s2);
        a3(s3);
        a5(-0.1 - s2 - s3 + 0.12 * Math.sin(t * 0.7 + 1.7)); // sortie de l'axe 6 vers le bas, comme une caméra
      });
      moves.forEach((m) => m(0));
      ground(tripod);
      tripod.updateMatrixWorld(true);
      // Le bras se fixe sur la platine de montage du trépied
      const plate = tripod.getObjectByName("SM_Evo_Mount");
      const mount = new T.Box3().setFromObject(plate || tripod);
      const top = mount.max.y;
      const mc = mount.getCenter(new T.Vector3());
      const g = new T.Group();
      g.add(tripod);
      const armWrap = new T.Group();
      armWrap.add(arm);
      armWrap.position.set(mc.x, top, mc.z);
      g.add(armWrap);
      const size = ground(g, arm.getObjectByName("A_1"));
      const h = Math.max(size.x, size.y, size.z);
      return { model: g, animate: (t) => moves.forEach((m) => m(t)), height: h, spin: false, view: { y: size.y * 0.52, dist: h * 3.1, tilt: 0.16 } };
    },
  };

  /* ---------- Scène ---------- */

  const BUILDERS = { flex: buildFlex, colossus: buildColossus, evo: buildEvo };
  const scenes = [];

  function makeEnv(renderer) {
    const pm = new T.PMREMGenerator(renderer);
    const s = new T.Scene();
    s.background = new T.Color(0x030303);
    const panel = (w, h, pos, rot, c) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide }));
      m.position.set(...pos);
      m.rotation.set(...rot);
      s.add(m);
    };
    panel(8, 3, [0, 6, 0], [Math.PI / 2, 0, 0], 0xffffff);
    panel(3, 5, [-6, 1.5, 1], [0, Math.PI / 2, 0], 0xcfcfcf);
    panel(2, 5, [6, 1.5, -2], [0, -Math.PI / 2, 0], 0x8a8a8a);
    panel(6, 0.6, [0, 0.5, -6], [0, 0, 0], 0x555555);
    const tex = pm.fromScene(s, 0.04).texture;
    pm.dispose();
    return tex;
  }

  function shadowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(0,0,0,0.75)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 256);
    return new T.CanvasTexture(c);
  }

  root.querySelectorAll("[data-model]").forEach(async (item) => {
    const build = BUILDERS[item.dataset.model];
    const canvas = item.querySelector("canvas");
    if (!build || !canvas) return;

    let renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      item.classList.add("no-webgl");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new T.Scene();
    scene.environment = makeEnv(renderer);
    scene.add(new T.HemisphereLight(0xffffff, 0x101010, 0.2));
    const key = new T.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new T.DirectionalLight(0xffffff, 2.2);
    rim.position.set(-4, 3, -4);
    scene.add(rim);
    const accent = new T.PointLight(0xff3d1f, 1.6, 0, 2);
    scene.add(accent);

    let built;
    try {
      if (!gltfLoader || !OFFICIAL[item.dataset.model]) throw new Error("modèle officiel indisponible");
      built = await OFFICIAL[item.dataset.model]();
    } catch {
      built = build();
    }
    const { model, animate, height, spin, view } = built;
    const pivot = new T.Group();
    pivot.add(model);
    scene.add(pivot);

    const floorSize = height * 1.6;
    const grid = new T.GridHelper(floorSize, 12, 0xffffff, 0xffffff);
    grid.material.transparent = true;
    grid.material.opacity = 0.07;
    scene.add(grid);
    const shadow = new T.Mesh(new T.PlaneGeometry(floorSize * 0.55, floorSize * 0.55), new T.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.001;
    scene.add(shadow);

    const camera = new T.PerspectiveCamera(30, 1, 0.01, 100);
    accent.position.set(view.dist * 0.5, view.y, -view.dist * 0.4);

    const state = { item, renderer, scene, camera, pivot, animate, spin, view, visible: false, yaw: spin ? -1.0 : -0.35, vel: 0, dragging: false, t0: performance.now() };

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Recule la caméra sur les formats étroits (mobile)
      const k = Math.max(1, 0.8 / camera.aspect);
      camera.position.set(0, view.y + view.dist * k * Math.sin(view.tilt), view.dist * k * Math.cos(view.tilt));
      camera.lookAt(0, view.y, 0);
      camera.updateProjectionMatrix();
      render(state, performance.now());
    }
    new ResizeObserver(resize).observe(canvas);

    // Rotation à la souris / au doigt (glisser horizontalement)
    let lastX = 0;
    canvas.addEventListener("pointerdown", (e) => {
      state.dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      item.classList.add("is-grabbing");
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!state.dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      state.yaw += dx * 0.01;
      state.vel = dx * 0.01;
    });
    const release = () => {
      state.dragging = false;
      item.classList.remove("is-grabbing");
    };
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    new IntersectionObserver(([entry]) => (state.visible = entry.isIntersecting), { rootMargin: "100px" }).observe(item);
    scenes.push(state);
    resize();
  });

  function render(s, now) {
    const t = (now - s.t0) / 1000;
    if (!reduced) {
      if (!s.dragging) {
        s.vel *= 0.94;
        // Rotation automatique lente, identique pour la caméra et les robots
        s.yaw += s.vel + 0.0012;
      }
      if (s.animate) s.animate(t);
    }
    s.pivot.rotation.y = s.yaw;
    s.renderer.render(s.scene, s.camera);
  }

  function loop(now) {
    if (!document.hidden) scenes.forEach((s) => s.visible && render(s, now));
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
