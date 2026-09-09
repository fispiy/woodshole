function renderCallouts(s) {
  if (!s.heroPhoto || !s.callouts) {
    const parts = GROUP_PARTS[s.group] || [];
    return `<div class="placeholder-labels">${parts.map(p=>`<span class="tag tag-outline" style="background:color-mix(in srgb, var(--color-bg) 80%, transparent)">${p}</span>`).join('')}</div>`;
  }
  return s.callouts.map(c => {
    const lineLen = 60, angle = c.x > 50 ? 0 : 180;
    return `<div class="callout-dot" style="left:${c.x}%;top:${c.y}%"></div>
      <div class="callout-line" style="left:${c.x}%;top:${c.y}%;width:${lineLen}px;transform:translateY(-50%) rotate(${angle===0?-8:188}deg)"></div>
      <div class="callout-label" style="left:calc(${c.x}% ${c.x>50?'+ '+(lineLen+8)+'px':'- '+(lineLen+8)+'px'});top:${c.y}%;${c.x>50?'':'transform:translate(-100%,-50%)'}">${c.label}</div>`;
  }).join('');
}

function renderDna(s) {
  const analysis = typeof SHRIMPINA_RESEARCH !== 'undefined' ? SHRIMPINA_RESEARCH.dnaBySample[s.code] : null;
  if (!analysis) return `<div class="research-empty"><p>No DNA analysis appears in the supplied project document.</p><a href="lab.html">Open the Laboratory page</a></div>`;
  return `<article class="specimen-dna-source">
    <header><div><span>Project DNA analysis</span><strong>${analysis.code}</strong></div><a href="lab.html?sample=${analysis.code}#dna-${analysis.code}">Expanded Laboratory entry →</a></header>
    <div class="research-text-block" data-research-kind="dna" data-research-pages="${analysis.pages.join(',')}"><p>Loading the verbatim project analysis…</p></div>
  </article>`;
}

function escapeResearchText(value) {
  return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}

function renderResearchSpeciesSource(s, section) {
  const note = typeof SHRIMPINA_RESEARCH !== 'undefined' ? SHRIMPINA_RESEARCH.speciesNotes[s.sci] : null;
  if (!note) return '';
  return `<div class="research-text-block species-source" data-research-kind="species" data-research-section="${section}" data-research-pages="${note.pages.join(',')}"><p>Loading the verbatim species notes…</p></div>`;
}

function researchGuideHref(s) {
  const note = typeof SHRIMPINA_RESEARCH !== 'undefined' ? SHRIMPINA_RESEARCH.speciesNotes[s.sci] : null;
  return note ? `research.html#species-${s.sci.replace(/\W+/g, '-')}` : '';
}

async function loadResearchPages(pages) {
  return Promise.all(pages.map(async page => {
    const path = `assets/shrimpina-research/text/page-${String(page).padStart(3, '0')}.txt`;
    const response = await fetch(SHRIMPINA_RESEARCH.assetUrl(path));
    if (!response.ok) throw new Error(`Unable to load source page ${page}`);
    return { page, text:(await response.text()).replace(/\f/g, '').trim() };
  }));
}

function parseSpeciesSource(text) {
  const lines = text.split(/\r?\n/);
  const knownHeadings = new Set(['Description','Location','POPULATION:','Population','Notes','Seasonality:']);
  const result = { title:'', sections:{}, order:[] };
  let heading = '';
  let item = '';
  const pushItem = () => {
    const value = item.trim();
    if (value && heading) (result.sections[heading] ||= []).push(value);
    item = '';
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const clean = line.replace(/^[●○]\s*[\u200b\u200d\ufeff]*/u, '').trim();
    if (!heading && !/^[●○]/u.test(line)) { result.title += `${result.title ? ' ' : ''}${clean}`; continue; }
    if (/^●/u.test(line) && knownHeadings.has(clean)) {
      pushItem(); heading = clean.replace(/:$/, '');
      if (!result.sections[heading]) { result.sections[heading] = []; result.order.push(heading); }
      continue;
    }
    if (/^[○●]/u.test(line)) { pushItem(); item = clean; }
    else item += `${item ? ' ' : ''}${clean}`;
  }
  pushItem();
  return result;
}

function renderParsedSpecies(parsed, requestedSection) {
  const wanted = requestedSection === 'description'
    ? parsed.order.filter(name => name === 'Description')
    : parsed.order.filter(name => name !== 'Description');
  if (!wanted.length) return requestedSection === 'description' ? '' : '<p>No additional source notes appear under this heading.</p>';
  return `${requestedSection === 'description' ? `<p class="research-source-title">${escapeResearchText(parsed.title)}</p>` : ''}${wanted.map(name => `
    <section class="research-note-section"><h4>${escapeResearchText(name)}</h4><ul>${parsed.sections[name].map(item => `<li>${escapeResearchText(item)}</li>`).join('')}</ul></section>`).join('')}`;
}

function figuresForResearchPages(pages) {
  const all = [
    ...Object.values(SHRIMPINA_RESEARCH.dnaBySample),
    SHRIMPINA_RESEARCH.dnaConclusions,
    SHRIMPINA_RESEARCH.comparisonFigures
  ];
  return all.flatMap(entry => entry.figures || []).filter(src => pages.some(page => src.includes(`page-${String(page).padStart(3, '0')}-`)));
}

async function initResearchBlocks(root) {
  if (typeof SHRIMPINA_RESEARCH === 'undefined') return;
  const blocks = [...root.querySelectorAll('.research-text-block')];
  await Promise.all(blocks.map(async block => {
    const pages = block.dataset.researchPages.split(',').map(Number);
    try {
      const sourcePages = await loadResearchPages(pages);
      if (block.dataset.researchKind === 'species') {
        const parsed = parseSpeciesSource(sourcePages.map(item => item.text).join('\n'));
        block.innerHTML = renderParsedSpecies(parsed, block.dataset.researchSection);
      } else {
        const figures = figuresForResearchPages(pages);
        block.innerHTML = `<div class="dna-source-pages">${sourcePages.map(item => `<section><span>PDF page ${item.page}</span><pre>${escapeResearchText(item.text)}</pre></section>`).join('')}</div>
          <div class="dna-figure-grid">${figures.map((src, index) => `<figure><img src="${SHRIMPINA_RESEARCH.assetUrl(src)}" alt="Original genetic analysis figure ${index + 1} for PDF pages ${pages.join('–')}" loading="lazy"><figcaption>Original project figure · PDF page ${src.match(/page-(\d+)/)?.[1].replace(/^0+/, '')}</figcaption></figure>`).join('')}</div>`;
      }
    } catch (error) {
      block.innerHTML = `<p>Source text could not be loaded. <a href="${SHRIMPINA_RESEARCH.assetUrl(SHRIMPINA_RESEARCH.source.manifest)}">Open the extraction manifest</a>.</p>`;
    }
  }));
}

function renderGallery(s) {
  const slots = [s.heroPhoto, ...s.photos.filter(p=>p!==s.heroPhoto)].filter(Boolean);
  if (s.groupProject === 'shrimpina' && slots.length) {
    const labels = s.photoLabels || [];
    return slots.map((src, index) => `<figure class="specimen-photo-view">
      <image-slot id="gal-${s.id}-${index}" shape="rect" src="${src}"></image-slot>
      <figcaption><span>${s.code}</span>${labels[index] || `View ${index + 1}`}</figcaption>
    </figure>`).join('');
  }
  const cells = [];
  for (let i=0;i<4;i++) {
    if (slots[i]) cells.push(`<image-slot id="gal-${s.id}-${i}" shape="rect" src="${slots[i]}"></image-slot>`);
    else cells.push(`<image-slot id="gal-${s.id}-${i}" shape="rect" placeholder="Add a photo"></image-slot>`);
  }
  return cells.join('');
}

function renderEcologyReport(s) {
  const points = s.ecologyReport && s.ecologyReport.length ? s.ecologyReport : [s.eco];
  return `<ol class="profile-ecology-report">${points.map(point => `<li>${point}</li>`).join('')}</ol>`;
}

function renderExtendedMorphology(s) {
  const notes = Array.isArray(s.morphologyExtended) ? s.morphologyExtended : (s.morphologyExtended ? [s.morphologyExtended] : []);
  if (!notes.length) return '';
  return `<div class="extended-morphology"><h4>Extended morphology</h4>${notes.map(note => `<p>${note}</p>`).join('')}</div>`;
}

function renderMorphologyPins(callouts) {
  return (callouts || []).map((callout, index) => `
    <span class="morphology-pin" style="left:${callout.x}%;top:${callout.y}%" aria-hidden="true">${index + 1}</span>
  `).join('');
}

function renderMorphologyKey(callouts) {
  if (!callouts || !callouts.length) return '';
  return `<ol class="morphology-key">${callouts.map((callout, index) => `
    <li><span>${index + 1}</span>${callout.label}</li>
  `).join('')}</ol>`;
}

function renderMorphologyViewer(s) {
  const views = s.morphologyViews || [];
  const first = views[0];
  if (!first) return '';
  return `<section class="morphology-viewer" aria-label="${s.common} morphology views">
    <header class="morphology-viewer-head">
      <div><span>Labeled species view</span><strong>${first.sourceLabel || first.sourceSample || s.code}</strong></div>
      ${first.sourceSlide ? `<small>Student source · slide ${first.sourceSlide}</small>` : (first.sourcePage ? `<small>Original labeled plate · page ${first.sourcePage}</small>` : '')}
    </header>
    <div class="morphology-viewer-stage">
      <div class="morphology-tabs" role="tablist" aria-label="Photographic view">
        ${views.map((view, index) => `<button type="button" role="tab" aria-selected="${index === 0}" data-view-index="${index}">${view.label}</button>`).join('')}
      </div>
      <figure class="morphology-figure">
        <div class="morphology-image-wrap">
          <div class="morphology-image-canvas">
            <img src="${first.src}" alt="${first.alt || `${s.common}, ${first.label.toLowerCase()} view`}">
            <div class="morphology-pins">${renderMorphologyPins(first.callouts)}</div>
          </div>
        </div>
        <figcaption><strong>${first.label}</strong><span>${first.measurement || first.caption || ''}</span></figcaption>
      </figure>
      <aside class="morphology-key-wrap" aria-live="polite" ${first.callouts && first.callouts.length ? '' : 'hidden'}>
        <span class="morphology-key-title">Visible structures</span>
        ${renderMorphologyKey(first.callouts) || '<p class="morphology-plate-note">Labels are embedded in this study plate.</p>'}
      </aside>
    </div>
  </section>`;
}

function initMorphologyViewer(root, s) {
  if (!root || !s.morphologyViews || !s.morphologyViews.length) return;
  const viewer = root.querySelector('.morphology-viewer');
  if (!viewer) return;
  const image = viewer.querySelector('.morphology-image-wrap img');
  const pins = viewer.querySelector('.morphology-pins');
  const captionTitle = viewer.querySelector('.morphology-figure figcaption strong');
  const captionText = viewer.querySelector('.morphology-figure figcaption span');
  const keyWrap = viewer.querySelector('.morphology-key-wrap');
  const buttons = [...viewer.querySelectorAll('.morphology-tabs button')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.viewIndex);
    const view = s.morphologyViews[index];
    if (!view) return;
    buttons.forEach(item => item.setAttribute('aria-selected', String(item === button)));
    image.src = view.src;
    image.alt = view.alt || `${s.common}, ${view.label.toLowerCase()} view`;
    pins.innerHTML = renderMorphologyPins(view.callouts);
    captionTitle.textContent = view.label;
    captionText.textContent = view.measurement || view.caption || '';
    keyWrap.innerHTML = `<span class="morphology-key-title">Visible structures</span>${renderMorphologyKey(view.callouts) || '<p class="morphology-plate-note">Labels are embedded in this study plate.</p>'}`;
    keyWrap.hidden = !(view.callouts && view.callouts.length);
  }));
}

function buildProfileHero(s) {
  if (s.morphologyViews && s.morphologyViews.length) return renderMorphologyViewer(s);
  if (!s.heroPhoto) return `<div class="profile-photo-unavailable" role="status">
    <span>Specimen media · ${s.code}</span>
    <strong>No verified specimen photograph is available.</strong>
    <p>This record remains in the archive without borrowing imagery from another specimen.</p>
  </div>`;
  return `
    <image-slot id="hero-${s.id}" shape="rect" src="${s.heroPhoto}" style="width:100%;height:100%"></image-slot>
    <span class="tape tl"></span><span class="tape tr"></span>
    ${s.groupProject === 'shrimpina' ? '' : renderCallouts(s)}
  `;
}

function buildProfileHeader(s, opts) {
  opts = opts || {};
  const linkOut = opts.linkToSpeciesPage
    ? `<a class="tag tag-outline" href="species.html?id=${s.id}">Open full page ↗</a>`
    : '';
  return `
      <div class="id-strip"><span class="specimen-id">${s.code}</span><span class="text-muted" style="font-size:12px">· collected by Team Shrimpina</span>${linkOut}</div>
      <h1>${s.common}</h1>
      <p class="sci-name">${s.sci}</p>
      <div class="class-tags">
        <span class="tag tag-accent"><small>Phylum</small><b>${s.phylum}</b></span>
        <span class="tag tag-accent-2"><small>Class</small><b>${s.cls}</b></span>
        <span class="tag tag-neutral"><small>Order</small><b>${s.order}</b></span>
        <span class="tag tag-outline"><small>Family</small><b>${s.family}</b></span>
      </div>
  `;
}

function buildProfileSections(s) {
  const isShrimpina = s.groupProject === 'shrimpina';
  const statusColor = STATUS_COLOR[s.status] || 'var(--color-neutral-500)';
  const showGallery = s.groupProject === 'shrimpina' ? Boolean((s.photos || []).length) : (s.photos || []).length > 1;
  return `
      ${showGallery ? `<div class="reveal-sec" id="record-photos">
        <div class="sec-label"><span class="n">01</span><h3>Individual specimen photos</h3></div>
        <div class="gallery-grid">${renderGallery(s)}</div>
      </div>` : ''}

      <div class="stitch-divider"><span>what it looks like →</span></div>

      <div class="reveal-sec" id="record-morphology">
        <div class="sec-label"><span class="n">02</span><h3>Morphology</h3></div>
        ${renderResearchSpeciesSource(s, 'description') || `<p class="desc-text">${s.morph}</p>${renderExtendedMorphology(s)}`}
        ${researchGuideHref(s) ? `<p class="research-guide-link"><a href="${researchGuideHref(s)}">Open this species in the Research Guide <span aria-hidden="true">→</span></a></p>` : ''}
      </div>

      <div class="reveal-sec" id="record-ecology">
        <div class="sec-label"><span class="n">03</span><h3>Ecology report</h3></div>
        ${renderResearchSpeciesSource(s, 'ecology') || renderEcologyReport(s)}
      </div>

      <div class="stitch-divider"><span>← genetic ID</span></div>

      <div class="reveal-sec" id="record-dna">
        <div class="sec-label"><span class="n">04</span><h3>DNA analysis</h3></div>
        ${renderDna(s)}
      </div>

      ${isShrimpina ? '' : `<div class="reveal-sec" id="record-counts">
        <div class="sec-label"><span class="n">05</span><h3>Survey counts</h3></div>
        <table class="table pop-table">
          <thead><tr><th>Year</th>${s.pop.map(p=>`<th>${p[0]}</th>`).join('')}</tr></thead>
          <tbody><tr><td>Individuals logged</td>${s.pop.map(p=>`<td>${p[1]}</td>`).join('')}</tr></tbody>
        </table>
      </div>`}

      <div class="reveal-sec" id="record-status">
        <div class="sec-label"><span class="n">${isShrimpina ? '05' : '06'}</span><h3>Conservation status</h3></div>
        <span class="status-badge blueprint" style="border-color:${statusColor}">${s.status}</span>
      </div>

      <div class="reveal-sec" id="record-references">
        <div class="sec-label"><span class="n">${isShrimpina ? '06' : '07'}</span><h3>References</h3></div>
        <ul class="ref-list">${s.refs.map(r=>`<li>${r}</li>`).join('')}</ul>
      </div>
  `;
}

function buildProfileBody(s, opts) {
  return `${buildProfileHeader(s, opts)}${buildProfileSections(s)}`;
}
