(() => {
  const GROUPS = {
    shrimpina: { label: 'Shrimpina', observations: new Set((typeof SHRIMPINA_INAT_MEDIA === 'undefined' ? [] : SHRIMPINA_INAT_MEDIA).map(record => Number(record.observation))) }
  };
  const elements = {
    search: document.querySelector('#collectionSearch'), group: document.querySelector('#groupFilter'),
    taxon: document.querySelector('#taxonFilter'), sort: document.querySelector('#sortControl'),
    status: document.querySelector('#collectionStatus'), observations: document.querySelector('#observationTotal'),
    taxa: document.querySelector('#taxonTotal'), observers: document.querySelector('#observerTotal'),
    count: document.querySelector('#resultCount'), grid: document.querySelector('#taxonGrid'), empty: document.querySelector('#emptyState')
  };
  let observations = [];

  const escapeHTML = value => String(value || '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
  const photoURL = observation => {
    const photo = observation.photos?.[0]?.url || observation.taxon?.default_photo?.medium_url || '';
    return photo.replace('square', 'medium');
  };
  const belongsToGroup = (observation, group) => group === 'all' || GROUPS[group]?.observations.has(Number(observation.id));

  function aggregate(source) {
    const records = new Map();
    source.forEach(observation => {
      const taxon = observation.taxon;
      const name = taxon?.name || observation.species_guess || 'Unidentified';
      const key = taxon?.id ? `taxon-${taxon.id}` : `unidentified-${name.toLowerCase()}`;
      if (!records.has(key)) records.set(key, {
        id: taxon?.id || null,
        common: taxon?.preferred_common_name || observation.species_guess || name,
        scientific: taxon?.name || '', rank: taxon?.rank || 'unidentified',
        iconic: taxon?.iconic_taxon_name || 'Unidentified', count: 0,
        observers: new Set(), recent: '', first: '', photo: '', observationURI: observation.uri
      });
      const record = records.get(key);
      record.count += 1;
      if (observation.user?.login) record.observers.add(observation.user.login);
      const date = observation.observed_on || '';
      if (date && (!record.recent || date > record.recent)) record.recent = date;
      if (date && (!record.first || date < record.first)) record.first = date;
      if (!record.photo) record.photo = photoURL(observation);
    });
    return [...records.values()];
  }

  const shrimpinaObservations = () => (typeof SHRIMPINA_INAT_MEDIA === 'undefined' ? [] : SHRIMPINA_INAT_MEDIA).map(media => {
    const live = observations.find(observation => Number(observation.id) === Number(media.observation));
    if (live) return live;
    const matchingTaxon = observations.find(observation => observation.taxon?.name === media.taxon)?.taxon;
    return {
      id: media.observation, uri: media.url, observed_on: media.observed,
      photos: media.photo ? [{ url: media.photo }] : [],
      user: { login: media.observer },
      taxon: matchingTaxon || { name: media.taxon, preferred_common_name: media.common, rank: 'species', iconic_taxon_name: 'Animalia' }
    };
  });
  const activeObservations = () => elements.group.value === 'shrimpina' ? shrimpinaObservations() : observations;

  function render() {
    const source = activeObservations();
    const allTaxa = aggregate(source);
    const query = elements.search.value.trim().toLowerCase();
    const taxon = elements.taxon.value;
    const visible = allTaxa.filter(record =>
      (taxon === 'all' || record.iconic === taxon) &&
      (!query || `${record.common} ${record.scientific} ${record.iconic} ${record.rank}`.toLowerCase().includes(query))
    );
    const sorters = {
      common: (a,b) => a.common.localeCompare(b.common),
      scientific: (a,b) => (a.scientific || a.common).localeCompare(b.scientific || b.common),
      count: (a,b) => b.count - a.count || a.common.localeCompare(b.common),
      recent: (a,b) => b.recent.localeCompare(a.recent) || a.common.localeCompare(b.common),
      taxon: (a,b) => a.iconic.localeCompare(b.iconic) || a.common.localeCompare(b.common)
    };
    visible.sort(sorters[elements.sort.value]);
    elements.observations.textContent = source.length.toLocaleString();
    elements.taxa.textContent = allTaxa.length.toLocaleString();
    elements.observers.textContent = new Set(source.map(item => item.user?.login).filter(Boolean)).size.toLocaleString();
    elements.count.textContent = `${visible.length.toLocaleString()} shown`;
    elements.status.textContent = elements.group.value === 'all' ? 'Full iNaturalist project' : GROUPS[elements.group.value].label;
    elements.empty.hidden = visible.length !== 0;
    elements.grid.innerHTML = visible.map(record => {
      const href = record.id ? `https://www.inaturalist.org/taxa/${record.id}` : record.observationURI;
      const dateText = record.first === record.recent ? record.recent : `${record.first} to ${record.recent}`;
      return `<a class="taxon-card" href="${escapeHTML(href)}" target="_blank" rel="noopener">
        ${record.photo ? `<div class="taxon-image"><img src="${escapeHTML(record.photo)}" alt="${escapeHTML(record.common)}" loading="lazy"></div>` : '<div class="taxon-image empty">No photograph</div>'}
        <div class="taxon-copy"><h3>${escapeHTML(record.common)}</h3><span class="count">${record.count} record${record.count === 1 ? '' : 's'}</span>
          ${record.scientific ? `<p class="scientific">${escapeHTML(record.scientific)}</p>` : ''}
          <p class="meta">${escapeHTML(record.iconic)} · ${escapeHTML(record.rank)} · ${record.observers.size} observer${record.observers.size === 1 ? '' : 's'} · ${escapeHTML(dateText)}</p>
        </div></a>`;
    }).join('');
  }

  async function load() {
    try {
      const data = await fetchAllINatObservations({ photos: false }, (loaded, total) => {
        elements.status.textContent = `Loading ${loaded.toLocaleString()} of ${total.toLocaleString()} observations`;
      });
      observations = data.results;
      const iconicTaxa = [...new Set(observations.map(item => item.taxon?.iconic_taxon_name || 'Unidentified'))].sort();
      elements.taxon.insertAdjacentHTML('beforeend', iconicTaxa.map(name => `<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join(''));
      const requestedGroup = new URLSearchParams(location.search).get('group');
      if (requestedGroup && GROUPS[requestedGroup]) elements.group.value = requestedGroup;
      render();
    } catch (error) {
      elements.status.textContent = 'The iNaturalist collection could not be loaded.';
      elements.grid.innerHTML = '<p class="load-error">Reload the page or open the iNaturalist project directly.</p>';
    }
  }

  elements.search.addEventListener('input', render);
  [elements.group, elements.taxon, elements.sort].forEach(control => control.addEventListener('change', render));
  load();
})();
