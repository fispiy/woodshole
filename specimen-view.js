(() => {
  const script = document.currentScript;
  const rootPath = script?.dataset.root || '.';
  const colors = { crab: '#b85338', shrimp: '#e98a68', mussel: '#536f6c', algae: '#687b4f', fish: '#53757f', horseshoe: '#8d6d58' };
  const labels = { crab: 'Crab', shrimp: 'Shrimp', mussel: 'Mussel', algae: 'Sea lettuce', fish: 'Fish', horseshoe: 'Horseshoe crab' };
  let dialog;
  let content;
  let returnFocus;

  const assetUrl = path => `${rootPath}/${path}`.replace('/./', '/');
  const specimenUrl = id => `${rootPath}/species.html?id=${encodeURIComponent(id)}`;
  const groupUrl = group => `${rootPath}/groups/${group}.html`;
  const ecologyReport = specimen => {
    const points = specimen.ecologyReport?.length ? specimen.ecologyReport : [specimen.eco];
    return `<ol class="sv-ecology-report">${points.map(point => `<li>${point}</li>`).join('')}</ol>`;
  };

  function createView() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'sv-dialog';
    dialog.setAttribute('aria-label', 'Specimen record');
    dialog.innerHTML = '<button class="sv-close" type="button" aria-label="Close specimen record"><span>Close</span><b aria-hidden="true">×</b></button><div class="sv-content"></div>';
    document.body.append(dialog);
    content = dialog.querySelector('.sv-content');
    dialog.querySelector('.sv-close').addEventListener('click', close);
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('sv-open');
      returnFocus?.focus?.({ preventScroll: true });
    });
  }

  function close() {
    if (dialog?.open) dialog.close();
  }

  function open(id) {
    const catalog = typeof ALL_SPECIES !== 'undefined' ? ALL_SPECIES : (typeof SPECIES !== 'undefined' ? SPECIES : []);
    const specimen = catalog.find(item => item.id === id);
    if (!specimen) return false;
    createView();
    returnFocus = document.activeElement;
    dialog.classList.toggle('sv-shrimpina', specimen.groupProject === 'shrimpina');
    const accent = colors[specimen.group] || '#536f6c';
    const visual = specimen.heroPhoto
      ? `<div class="sv-image-frame"><img class="sv-photo" src="${assetUrl(specimen.heroPhoto)}" alt="${specimen.common} specimen"></div>`
      : `<div class="sv-image-frame"><div class="sv-placeholder" aria-label="No specimen photograph catalogued">
          <strong>${GROUP_LABEL[specimen.group]}</strong><span>${specimen.code}</span>
          <small>Image not yet catalogued</small>
        </div></div>`;
    const projectLink = specimen.groupProject
      ? `<a href="${groupUrl(specimen.groupProject)}">View ${specimen.groupProject} project</a>`
      : '';
    content.innerHTML = `<article class="sv-record" style="--sv-accent:${accent}">
      <div class="sv-visual">
        ${visual}
        <p class="sv-plate-footer"><span>${specimen.code}</span><span>${labels[specimen.group] || specimen.group} · Woods Hole collection</span></p>
      </div>
      <div class="sv-copy">
        <header class="sv-identity"><p class="sv-overline">Specimen ${specimen.code}</p><h2>${specimen.common}</h2><p class="sv-scientific">${specimen.sci}</p><p class="sv-status">${specimen.status}</p></header>
        <div class="sv-taxonomy" aria-label="Taxonomy">
          <div><span>Phylum</span><b>${specimen.phylum}</b></div><div><span>Class</span><b>${specimen.cls}</b></div>
          <div><span>Order</span><b>${specimen.order}</b></div><div><span>Family</span><b>${specimen.family}</b></div>
        </div>
        <div class="sv-notes">
          <section class="sv-morphology"><h3>Morphology</h3><p>${specimen.morph}</p></section>
          <section class="sv-ecology"><h3>Ecology report</h3>${ecologyReport(specimen)}</section>
        </div>
        <footer><p>Collection record · Woods Hole biodiversity survey</p><nav><a class="sv-primary" data-specimen-page href="${specimenUrl(specimen.id)}">Full specimen record</a>${projectLink}</nav></footer>
      </div>
    </article>`;
    document.body.classList.add('sv-open');
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.sv-close').focus({ preventScroll: true });
    return true;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href*="species.html?id="]');
    if (!link || link.hasAttribute('data-specimen-page') || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const id = new URL(link.href, location.href).searchParams.get('id');
    if (id && open(id)) event.preventDefault();
  });

  window.SpecimenView = { open, close };
})();
