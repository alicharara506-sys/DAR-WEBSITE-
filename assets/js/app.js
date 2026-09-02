(function(){
  var pages = document.querySelectorAll('.page');
  var buttons = document.querySelectorAll('[data-lang-btn]');
  var STORAGE_KEY = 'dar-lang';
  var SUPPORTED_LANGS = ['en', 'ar', 'fr'];
  var META = {
    en: {
      title: 'DAR Trading & Contracting | Construction in Beirut',
      description: 'Results first, payment follows. Full-service construction, finishing and trades in Beirut, Lebanon.'
    },
    ar: {
      title: 'دار للتجارة والمقاولات | مقاولات وتشطيبات في بيروت',
      description: 'النتيجة أولاً والدفع لاحقاً. خدمات متكاملة للمقاولات والتشطيبات والأعمال الحرفية في بيروت، لبنان.'
    },
    fr: {
      title: 'DAR Trading & Contracting | Construction à Beyrouth',
      description: 'Le résultat d’abord, le paiement suit. Construction, finitions et corps de métier à Beyrouth, Liban.'
    }
  };

  function setLang(lang, updateUrl){
    if(SUPPORTED_LANGS.indexOf(lang) === -1) lang = 'en';
    pages.forEach(function(p){
      if(p.getAttribute('data-lang') === lang){ p.hidden = false; }
      else{ p.hidden = true; }
    });
    buttons.forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn') === lang ? 'true' : 'false');
    });
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.title = META[lang].title;
    var description = document.querySelector('meta[name="description"]');
    if(description) description.setAttribute('content', META[lang].description);
    if(updateUrl !== false){
      var url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url.pathname + url.search);
    }
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){}
  }

  buttons.forEach(function(b){
    b.addEventListener('click', function(){ setLang(b.getAttribute('data-lang-btn'), true); });
  });

  var saved = null;
  try{ saved = localStorage.getItem(STORAGE_KEY); }catch(e){}
  var requested = new URLSearchParams(window.location.search).get('lang');
  setLang(requested || saved || 'en', false);

  document.querySelectorAll('[data-current-year]').forEach(function(el){
    el.textContent = String(new Date().getFullYear());
  });

  var THEME_KEY = 'dar-theme';
  var themeToggle = document.getElementById('theme-toggle');
  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    if(themeToggle){ themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false'); }
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
  }
  var savedTheme = null;
  try{ savedTheme = localStorage.getItem(THEME_KEY); }catch(e){}
  if(!savedTheme){
    savedTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  setTheme(savedTheme);
  if(themeToggle){
    themeToggle.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  document.querySelectorAll('.nav-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var links = btn.closest('.nav-inner').querySelector('.nav-links');
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.querySelectorAll('.nav-links a, .nav-cta[href^="#"], .nav-mark, .footer-nav a, .footer-bottom a').forEach(function(a){
    a.addEventListener('click', function(e){
      var links = a.closest('.nav-links');
      if(links){
        links.classList.remove('open');
        links.closest('.nav-inner').querySelector('.nav-toggle').setAttribute('aria-expanded','false');
      }

      var href = a.getAttribute('href') || '';
      if(href.charAt(0) !== '#') return;
      var target = document.getElementById(href.slice(1));
      if(!target) return;
      e.preventDefault();
      requestAnimationFrame(function(){
        var langBar = document.querySelector('.lang-bar');
        var page = target.closest('.page');
        var nav = page ? page.querySelector('.nav') : null;
        var headerH = (langBar ? langBar.getBoundingClientRect().height : 0) + (nav ? nav.getBoundingClientRect().height : 0);
        var y = target.getBoundingClientRect().top + window.scrollY - headerH;
        var htmlEl = document.documentElement;
        var prevBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = 'auto';
        window.scrollTo({ top:Math.max(0,Math.round(y)), left:0, behavior:'auto' });
        history.replaceState(null, '', href);
        requestAnimationFrame(function(){ htmlEl.style.scrollBehavior = prevBehavior; });
      });
    });
  });

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        entry.target.classList.toggle('in', entry.isIntersecting);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, .stagger').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- first-page brand pattern: cursor/touch-reveal in dark theme ---------- */
  (function(){
    function setSpot(hero, clientX, clientY){
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (clientX - r.left) + 'px');
      hero.style.setProperty('--my', (clientY - r.top) + 'px');
    }
    document.querySelectorAll('.hero, .contact, .usp-block').forEach(function(hero){
      hero.addEventListener('mousemove', function(e){ setSpot(hero, e.clientX, e.clientY); });
      hero.addEventListener('mouseenter', function(){ hero.classList.add('is-pattern-live'); });
      hero.addEventListener('mouseleave', function(){ hero.classList.remove('is-pattern-live'); });

      hero.addEventListener('touchstart', function(e){
        var t = e.touches[0];
        setSpot(hero, t.clientX, t.clientY);
        hero.classList.add('is-pattern-live');
      }, { passive: true });
      hero.addEventListener('touchmove', function(e){
        var t = e.touches[0];
        setSpot(hero, t.clientX, t.clientY);
      }, { passive: true });
      hero.addEventListener('touchend', function(){ hero.classList.remove('is-pattern-live'); });
      hero.addEventListener('touchcancel', function(){ hero.classList.remove('is-pattern-live'); });
    });
  })();

  /* ---------- hero stat count-up (animates only on first entering the viewport) ---------- */
  (function(){
    var reduceMotionStats = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotionStats || !('IntersectionObserver' in window)) return;
    var arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';
    function leadingNumber(str){
      var m = str.match(/^([0-9٠-٩]+)/);
      if(!m) return null;
      var normalized = m[1].replace(/[٠-٩]/g, function(ch){ return String(arabicIndicDigits.indexOf(ch)); });
      return parseInt(normalized, 10);
    }
    var statIO = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.querySelectorAll('.hero-stat b').forEach(function(el){
          var target = leadingNumber(el.textContent);
          if(target === null) return;
          var original = el.textContent;
          var start = performance.now();
          var duration = 900;
          function frame(now){
            var t = Math.min(1, (now - start) / duration);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased);
            if(t < 1){ requestAnimationFrame(frame); } else { el.textContent = original; }
          }
          requestAnimationFrame(frame);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('.hero-stats').forEach(function(el){ statIO.observe(el); });
  })();

  var railLinks = document.querySelectorAll('.chapter-rail a');
  if('IntersectionObserver' in window && railLinks.length){
    var railMap = {};
    railLinks.forEach(function(a){
      var id = a.getAttribute('data-rail-target');
      var el = document.getElementById(id);
      if(el){ railMap[id] = a; }
    });
    var railIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var link = railMap[entry.target.id];
        if(!link) return;
        document.querySelectorAll('.chapter-rail a.active').forEach(function(x){ x.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    Object.keys(railMap).forEach(function(id){ railIO.observe(document.getElementById(id)); });
  }

  /* ---------- sitewide 3D hover-tilt (photo cards + major card grids) ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if(!reduceMotion && hasFinePointer){
    document.querySelectorAll('.tc, .tilt3d').forEach(function(card){
      var maxTilt = card.classList.contains('tc') ? 12 : 8;
      function onMove(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rotY = (px - 0.5) * maxTilt * 2;
        var rotX = (0.5 - py) * maxTilt * 2;
        card.style.transform = 'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale3d(1.04,1.04,1.04)';
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      }
      card.addEventListener('mouseenter', function(){ card.classList.add('is-tilting'); });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', function(){
        card.classList.remove('is-tilting');
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  /* ---------- sitewide interactive 3D popup (click a card to expand; click outside or Esc to dismiss) ---------- */
  var modal = document.createElement('div');
  modal.className = 'site-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Expanded card details');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="site-modal-panel" tabindex="-1">' +
      '<button class="site-modal-close" type="button" aria-label="Close dialog">&times;</button>' +
      '<div class="site-modal-content"></div>' +
    '</div>';
  document.body.appendChild(modal);
  var modalPanel = modal.querySelector('.site-modal-panel');
  var modalContent = modal.querySelector('.site-modal-content');
  var modalClose = modal.querySelector('.site-modal-close');
  var previousFocus = null;

  function renderModalCard(el){
    modalContent.innerHTML = '';
    var clone = el.cloneNode(true);
    clone.classList.add('modal-card-inner');
    clone.removeAttribute('style');
    modalContent.appendChild(clone);
    var langRoot = el.closest('[data-lang]');
    modalPanel.dir = (langRoot && langRoot.getAttribute('data-lang') === 'ar') ? 'rtl' : 'ltr';
  }

  function openModal(el){
    previousFocus = document.activeElement;
    renderModalCard(el);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    modalPanel.style.transform = '';
    if(previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  document.querySelectorAll('.tilt3d').forEach(function(el){
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-haspopup', 'dialog');
    el.addEventListener('click', function(){ openModal(el); });
    el.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(el); }
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e){
    if(!modal.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeModal();
    if(e.key === 'Tab'){
      var focusable = modalPanel.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])');
      if(!focusable.length){ e.preventDefault(); modalPanel.focus(); return; }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  if(!reduceMotion && hasFinePointer){
    modalPanel.addEventListener('mousemove', function(e){
      var r = modalPanel.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rotY = (px - 0.5) * 10;
      var rotX = (0.5 - py) * 10;
      modalPanel.style.transform = 'perspective(1400px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
    });
    modalPanel.addEventListener('mouseleave', function(){ modalPanel.style.transform = ''; });
  }
})();

/* ---------- hero 3D architectural visualization (progressive enhancement) ----------
   Loads Three.js only when a hero-visual container is actually visible and laid out
   (mobile hides .hero-visual entirely below 960px, so this never fetches on mobile).
   Skips entirely on prefers-reduced-motion or missing WebGL — the existing CSS ring
   fallback already markup'd in .hero-visual stays visible and is the permanent fallback. */
(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion) return;

  function hasWebGL(){
    try{
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    }catch(e){ return false; }
  }
  if(!hasWebGL()) return;

  var current = null; // { dispose() }

  function initOn(canvas){
    var container = canvas.closest('.hero-visual');
    if(!container || !container.offsetWidth || !container.offsetHeight) return;

    import(new URL('assets/vendor/three.module.js', document.baseURI).href).then(function(THREE){
      if(current) current.dispose();

      var isNarrow = window.innerWidth < 1280;
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(2.4, 1.6, 3.4);
      camera.lookAt(0, 0, 0);

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isNarrow });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isNarrow ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;

      var ambient = new THREE.AmbientLight(0xffffff, 0.75);
      var key = new THREE.DirectionalLight(0xffffff, 1.3);
      key.position.set(3, 4, 2);
      var fill = new THREE.DirectionalLight(0xffffff, 0.35);
      fill.position.set(-2, 0.5, 3);
      var accent = new THREE.DirectionalLight(0xd94f1e, 1.2);
      accent.position.set(-3, 1, -2);
      scene.add(ambient, key, fill, accent);

      /* DAR mark, extruded into 3D: the ring + vertical line from the brand's own
         logo (see .mark/.circle/.vline in the CSS), not an abstract shape */
      var group = new THREE.Group();
      /* Unlit material preserves the exact brand orange (#D94F1E) on every face. */
      var markMat = new THREE.MeshBasicMaterial({ color: 0xd94f1e });

      /* proportions taken directly from .hero-big-mark: circle 110px diameter,
         margin-right 26px gap, vline 18px wide x 320px tall -- so the circle
         and line sit clearly apart, exactly like the flat logo beside it */
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 24, 48), markMat);
      ring.position.set(-0.736, 1.0, 0);
      group.add(ring);

      var vline = new THREE.Mesh(new THREE.BoxGeometry(0.164, 2.909, 0.164), markMat);
      vline.position.set(0.082, 0.0455, 0);
      group.add(vline);

      /* normalize so the assembly is centered at the origin and a fixed
         apparent size, regardless of the hand-placed block coordinates above */
      var box = new THREE.Box3().setFromObject(group);
      var center = box.getCenter(new THREE.Vector3());
      var size = box.getSize(new THREE.Vector3());
      var normalizeScale = 2.1 / Math.max(size.x, size.y, size.z, 0.001);
      group.children.forEach(function(m){ m.position.sub(center); });
      group.scale.setScalar(normalizeScale);
      group.rotation.y = 0.4;
      scene.add(group);

      var mounted = true;
      var pointerX = 0, pointerY = 0;
      var hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

      function onPointerMove(e){
        var r = container.getBoundingClientRect();
        pointerX = ((e.clientX - r.left) / r.width - 0.5) * 2;
        pointerY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }
      if(hasFinePointer){ container.addEventListener('mousemove', onPointerMove); }

      function resize(){
        var w = container.clientWidth, h = container.clientHeight;
        if(!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      var ro = null;
      if('ResizeObserver' in window){
        ro = new ResizeObserver(resize);
        ro.observe(container);
      } else {
        window.addEventListener('resize', resize);
      }

      var raf = null;
      function tick(){
        if(!mounted) return;
        group.rotation.y += 0.0105;
        group.rotation.x += (pointerY * 0.12 - group.rotation.x) * 0.04;
        group.rotation.z += ((-pointerX * 0.08) - group.rotation.z) * 0.04;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      }
      tick();
      canvas.classList.add('is-ready');
      container.classList.add('has-3d');

      current = {
        canvas: canvas,
        dispose: function(){
          mounted = false;
          if(raf) cancelAnimationFrame(raf);
          if(ro) ro.disconnect(); else window.removeEventListener('resize', resize);
          if(hasFinePointer) container.removeEventListener('mousemove', onPointerMove);
          canvas.classList.remove('is-ready');
          container.classList.remove('has-3d');
          renderer.dispose();
        }
      };
    }).catch(function(){ /* network/module failure: fallback rings stay visible */ });
  }

  function activeCanvas(){
    var main = document.querySelector('main.page:not([hidden])');
    return main ? main.querySelector('.hero-3d-canvas') : null;
  }

  var startCanvas = activeCanvas();
  if(startCanvas){
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries, obs){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ initOn(entry.target.querySelector('.hero-3d-canvas') || startCanvas); obs.disconnect(); }
        });
      }, { threshold: 0.1 });
      io.observe(startCanvas.closest('.hero-visual'));
    } else {
      initOn(startCanvas);
    }
  }

  /* re-anchor to the newly visible language's hero-visual on language switch */
  var pages = document.querySelectorAll('main.page');
  if(pages.length && 'MutationObserver' in window){
    var mo = new MutationObserver(function(){
      var c = activeCanvas();
      if(c && (!current || c !== (current.canvas))) {
        initOn(c);
      }
    });
    pages.forEach(function(p){ mo.observe(p, { attributes: true, attributeFilter: ['hidden'] }); });
  }
})();
