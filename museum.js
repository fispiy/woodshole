(() => {
  const root = document.documentElement;
  const masthead = document.querySelector('.masthead');
  const menuButton = document.querySelector('.menu-button');
  const menu = masthead?.querySelector('nav');
  const color = { crab: '#b85338', shrimp: '#e98a68', mussel: '#536f6c', algae: '#687b4f' };

  function onScroll() {
    const hero = document.querySelector('.postcard-stage');
    const progress = Math.max(0, Math.min(1, scrollY / (hero.offsetHeight - innerHeight)));
    const traceOpacity = Math.max(0, Math.min(1, progress / .4, (.84 - progress) / .22));
    root.style.setProperty('--hero-progress', progress.toFixed(3));
    root.style.setProperty('--hero-trace-opacity', traceOpacity.toFixed(3));
    masthead?.classList.toggle('scrolled', scrollY > innerHeight * .75);
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const lifePhotos = [...document.querySelectorAll('.life-photo')];
  const community = document.querySelector('.mbl-community');
  const communityStage = document.querySelector('.community-stage');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const storyLayouts = [
    { x: .43, y: .08, w: .48, r: -.6, start: .02, exit: .18 },
    { x: .68, y: .12, w: .28, r: 1, start: .11, exit: .28 },
    { x: .41, y: .13, w: .25, r: -1.2, start: .20, exit: .37 },
    { x: .69, y: .09, w: .25, r: 1.1, start: .29, exit: .46 },
    { x: .40, y: .08, w: .27, r: -.8, start: .38, exit: .55 },
    { x: .69, y: .13, w: .24, r: 1, start: .47, exit: .64 },
    { x: .41, y: .08, w: .27, r: -.7, start: .56, exit: .72 },
    { x: .69, y: .08, w: .23, r: 1.2, start: .64, exit: .77 },
    { x: .42, y: .06, w: .50, r: .35, start: .72, exit: 1.2 }
  ];
  const collageLayouts = [
    { x: .37, y: .06, w: .34, r: -3.2, z: 1 },
    { x: .73, y: .05, w: .22, r: 3.1, z: 5 },
    { x: .38, y: .46, w: .21, r: -2.2, z: 7 },
    { x: .82, y: .15, w: .17, r: 3.5, z: 6 },
    { x: .68, y: .50, w: .18, r: -2.8, z: 4 },
    { x: .51, y: .55, w: .16, r: 2.2, z: 3 },
    { x: .76, y: .38, w: .19, r: -1.5, z: 8 },
    { x: .47, y: .08, w: .22, r: 2.4, z: 2 },
    { x: .52, y: .18, w: .32, r: .4, z: 9 }
  ];
  const startRotations = [-7, 5, -4, 8, -6, 7, -5, 4, -3];
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => 1 - Math.pow(1 - value, 3);

  function animateLifePhotos() {
    if (!community || !communityStage || !lifePhotos.length) return;
    const desktopStory = innerWidth > 900 && !reducedMotion.matches;
    const rect = community.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    const collageProgress = ease(clamp((progress - .73) / .15));
    community.style.setProperty('--story-progress', progress.toFixed(3));
    communityStage.style.setProperty('--collage-progress', collageProgress.toFixed(3));
    communityStage.style.setProperty('--story-out', clamp((progress - .985) / .015).toFixed(3));
    communityStage.style.setProperty('--intro-out', ease(clamp((progress - .67) / .10)).toFixed(3));
    communityStage.style.setProperty('--closing-in', ease(clamp((progress - .88) / .08)).toFixed(3));

    lifePhotos.forEach((photo, index) => {
      if (!desktopStory) {
        photo.removeAttribute('style');
        return;
      }
      const layout = storyLayouts[index];
      const collage = collageLayouts[index];
      const local = ease(clamp((progress - layout.start) / .14));
      const leaving = ease(clamp((progress - layout.exit) / .09));
      const caption = ease(clamp((progress - layout.start - .045) / .10)) * (1 - leaving) * (1 - collageProgress);
      const startX = innerWidth * .62 - innerWidth * layout.w * .32;
      const startY = innerHeight * .31 + index * 4;
      const endX = innerWidth * layout.x;
      const endY = innerHeight * layout.y;
      const soloX = startX + (endX - startX) * local;
      const soloY = startY + (endY - startY) * local - leaving * 58;
      const soloScale = .64 + .36 * local - leaving * .045;
      const soloRotation = startRotations[index] + (layout.r - startRotations[index]) * local;
      const x = soloX + (innerWidth * collage.x - soloX) * collageProgress;
      const y = soloY + (innerHeight * collage.y - soloY) * collageProgress;
      const scale = soloScale + (1 - soloScale) * collageProgress;
      const rotation = soloRotation + (collage.r - soloRotation) * collageProgress;
      const width = innerWidth * (layout.w + (collage.w - layout.w) * collageProgress);
      photo.style.setProperty('--story-x', `${x.toFixed(1)}px`);
      photo.style.setProperty('--story-y', `${y.toFixed(1)}px`);
      photo.style.setProperty('--story-width', `${width.toFixed(1)}px`);
      photo.style.setProperty('--story-scale', scale.toFixed(3));
      photo.style.setProperty('--story-rotate', `${rotation.toFixed(2)}deg`);
      const soloVisible = clamp(local * 1.8) * (1 - leaving);
      const visible = soloVisible * (1 - collageProgress) + collageProgress;
      photo.style.setProperty('--story-opacity', visible.toFixed(3));
      photo.style.setProperty('--caption-progress', caption.toFixed(3));
      photo.style.setProperty('--story-z', collage.z);
      photo.style.zIndex = String(collage.z);
      photo.style.setProperty('--photo-shift', `${((.5 - local) * 24).toFixed(1)}px`);
      photo.style.setProperty('--story-clip', `${(12 * (1 - local)).toFixed(2)}%`);
      const video = photo.querySelector('video');
      if (video) {
        if (visible > .08 && video.paused) video.play().catch(() => {});
        if (visible <= .08 && !video.paused) video.pause();
      }
    });
  }
  if (lifePhotos.length) {
    addEventListener('scroll', animateLifePhotos, { passive: true });
    addEventListener('resize', animateLifePhotos);
    reducedMotion.addEventListener?.('change', animateLifePhotos);
    animateLifePhotos();
  }
  const storyVideoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (innerWidth > 900) return;
    if (entry.isIntersecting) entry.target.play().catch(() => {});
    else entry.target.pause();
  }), { threshold: .18 });
  document.querySelectorAll('.life-photo video').forEach(video => storyVideoObserver.observe(video));

  if (menuButton && menu) menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });
  if (menu) menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false');
  }));

  const representatives = ['crab-01', 'shrimp-01', 'mussel-01', 'algae-01']
    .map(id => SPECIES.find(s => s.id === id)).filter(Boolean);
  const grid = document.querySelector('#collection-grid');
  if (grid) {
    grid.innerHTML = representatives.map((s, i) => `
      <button class="collection-card reveal" type="button" data-specimen="${s.id}" data-mark="${GROUP_LABEL[s.group]}">
        <span class="card-index">0${i + 1} / ${s.group}</span>
        <h3>${s.common}</h3><p class="latin">${s.sci}</p>
        <span class="card-meta"><span>${s.phylum} · ${s.order}</span><span>Open record →</span></span>
      </button>`).join('');
    grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  function openSpecimen(id) {
    window.SpecimenView?.open(id);
  }
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-specimen]'); if (button) openSpecimen(button.dataset.specimen);
  });

  const markers = [];
  if (window.L) {
    const normalizedSite = site => /wood\s*neck/i.test(site || '') ? 'Wood Neck Beach' : site;
    const groupFor = sample => {
      const text = `${sample.common} ${sample.sci}`.toLowerCase();
      if (/crab|hermit|horseshoe/.test(text)) return 'crab';
      if (/shrimp/.test(text)) return 'shrimp';
      if (/mussel|oyster|clam|quahog|periwinkle|jingle/.test(text)) return 'mussel';
      return 'algae';
    };
    const observations = SHRIMPINA_SAMPLE_REGISTER.map(sample => {
      const location = SHRIMPINA_OBSERVATION_LOCATIONS[sample.code];
      return location && location.accuracy <= 500 ? { ...sample, ...location, site:normalizedSite(sample.site), group:groupFor(sample) } : null;
    }).filter(Boolean);
    const map = L.map('map', { zoomControl: true, attributionControl: true, scrollWheelZoom: false, tap: true })
      .setView([41.5923, -70.6436], 15);
    L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 16, maxZoom: 19, attribution: 'USGS The National Map'
    }).addTo(map);
    ['Little Sippewissett Marsh', 'Wood Neck Beach'].forEach(name => {
      const records = observations.filter(sample => sample.site === name);
      if (!records.length) return;
      const lat = records.reduce((sum, sample) => sum + sample.lat, 0) / records.length;
      const lng = records.reduce((sum, sample) => sum + sample.lng, 0) / records.length;
      L.marker([lat, lng], {
      interactive:false,
      icon:L.divIcon({ className:'collection-site-label', html:`<span>${name}</span>`, iconSize:[190,28], iconAnchor:[95,42] })
      }).addTo(map);
    });
    observations.forEach(s => {
      const icon = L.divIcon({ className: 'specimen-pin', html: `<span style="--pin:${color[s.group]}">${s.code.replace('SSAJ','')}</span>`, iconSize: [38, 38], iconAnchor: [19, 19] });
      const marker = L.marker([s.lat, s.lng], { icon, title: s.common }).addTo(map);
      marker.on('click', () => { location.href = `species.html?sample=${encodeURIComponent(s.code)}`; });
      markers.push({ marker, species: s });
    });
    if (observations.length) map.fitBounds(observations.map(sample => [sample.lat, sample.lng]), { padding:[58,58], maxZoom:17 });
    document.querySelector('#homeMapCount').textContent = observations.length;
    setTimeout(() => map.invalidateSize(), 200);
  }

  document.querySelectorAll('.map-controls button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.map-controls button').forEach(b => b.classList.remove('active')); button.classList.add('active');
    const group = button.dataset.group; let count = 0;
    markers.forEach(({ marker, species }) => {
      const visible = group === 'all' || species.group === group;
      const el = marker.getElement(); if (el) el.style.display = visible ? '' : 'none'; if (visible) count++;
    });
    const visibleCount = document.querySelector('#visible-count');
    if (visibleCount) visibleCount.textContent = count;
  }));
})();
