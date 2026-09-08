const INAT_PROJECT = 'bios-27723-woods-hole-biodiversity';

async function fetchINatObservations(params) {
  params = params || {};
  const url = new URL('https://api.inaturalist.org/v1/observations');
  url.searchParams.set('project_id', INAT_PROJECT);
  url.searchParams.set('per_page', params.per_page || 24);
  url.searchParams.set('order_by', 'observed_on');
  url.searchParams.set('order', 'desc');
  if (params.photos !== false) url.searchParams.set('photos', 'true');
  if (params.taxon_name) url.searchParams.set('taxon_name', params.taxon_name);
  if (params.user_id) url.searchParams.set('user_id', params.user_id);
  if (params.page) url.searchParams.set('page', params.page);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('iNaturalist request failed: ' + res.status);
  return res.json();
}

async function fetchAllINatObservations(params, onProgress) {
  params = { ...(params || {}), per_page: 200 };
  const first = await fetchINatObservations({ ...params, page: 1 });
  const total = first.total_results || first.results.length;
  const pages = Math.max(1, Math.ceil(total / params.per_page));
  onProgress?.(first.results.length, total);
  if (pages === 1) return first;
  const remaining = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => fetchINatObservations({ ...params, page: index + 2 }))
  );
  const results = [...first.results];
  remaining.forEach(page => {
    results.push(...page.results);
    onProgress?.(results.length, total);
  });
  return { total_results: total, results };
}

function obsCardHTML(o) {
  const photo = o.photos && o.photos[0] ? o.photos[0].url.replace('square', 'medium') : '';
  const name = (o.taxon && (o.taxon.preferred_common_name || o.taxon.name)) || 'Unidentified';
  const sci = o.taxon ? o.taxon.name : '';
  const observer = o.user ? (o.user.name || o.user.login) : 'unknown';
  const date = o.observed_on || ',';
  const place = o.place_guess || 'Woods Hole, MA';
  return `<a class="obs-card" href="${o.uri}" target="_blank" rel="noopener">
    <div class="obs-photo">${photo ? `<img src="${photo}" alt="${name}" loading="lazy">` : `<div class="obs-photo-empty">no photo</div>`}</div>
    <div class="obs-meta">
      <b>${name}</b>${sci ? `<span class="obs-sci">${sci}</span>` : ''}
      <span class="obs-sub">${observer} · ${date}</span>
      <span class="obs-sub">${place}</span>
    </div>
  </a>`;
}
