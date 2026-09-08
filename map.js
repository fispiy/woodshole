(() => {
  const colors = { crab:'#d96646', shrimp:'#f0a078', mussel:'#5c8d88', algae:'#9aae68', other:'#8a8177' };
  const labels = { crab:'Crabs & hermits', shrimp:'Shrimp', mussel:'Mollusks', algae:'Plants & algae', other:'Other' };
  const esc = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const groupFor = sample => {
    const text = `${sample.common} ${sample.sci}`.toLowerCase();
    if (/crab|hermit|horseshoe/.test(text)) return 'crab';
    if (/shrimp/.test(text)) return 'shrimp';
    if (/mussel|oyster|clam|quahog|periwinkle|jingle/.test(text)) return 'mussel';
    if (/lettuce|cord ?grass/.test(text)) return 'algae';
    return 'other';
  };
  const normalizedSite = site => /wood\s*neck/i.test(site || '') ? 'Wood Neck Beach' : site;
  const linked = SHRIMPINA_SAMPLE_REGISTER.map(sample => {
    const location = SHRIMPINA_OBSERVATION_LOCATIONS[sample.code];
    return location ? { ...sample, ...location, site:normalizedSite(sample.site), id:sample.code, group:groupFor(sample) } : null;
  }).filter(Boolean);
  const broadLocations = linked.filter(sample => sample.accuracy > 500);
  const data = linked.filter(sample => sample.accuracy <= 500);
  const spreadsheetLinks = SHRIMPINA_SAMPLE_REGISTER.filter(sample => /inaturalist\.org\/observations\//.test(sample.record || '')).length;
  const unavailableLocations = spreadsheetLinks - linked.length;
  const controls = {
    search: document.querySelector('#searchFilter'), species: document.querySelector('#speciesFilter'), group: document.querySelector('#groupFilter'),
    site: document.querySelector('#siteFilter'), sort: document.querySelector('#sortControl')
  };
  const unique = (key) => [...new Set(data.map(s => s[key]).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  const fill = (control, values, label = v => v) => values.forEach(v => control.insertAdjacentHTML('beforeend', `<option value="${v}">${label(v)}</option>`));
  fill(controls.species, unique('common'));
  fill(controls.group, unique('group'), v=>labels[v]);
  document.querySelector('#locationSource').textContent = `${data.length} precise public coordinates from ${linked.length} available iNaturalist records. ${broadLocations.length} broad-location record${broadLocations.length === 1 ? '' : 's'} and ${unavailableLocations} unavailable record omitted.`;

  let map; let activeBaseLayer; const markers = new Map();
  if (window.L) {
    map = L.map('explorerMap', { zoomControl:true, attributionControl:true, scrollWheelZoom:true }).setView([41.5923,-70.6436],15);
    const baseLayers = {
      atlas: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }),
      aerial: L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom:16, maxZoom:19, attribution:'USGS The National Map' }),
      topographic: L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom:16, maxZoom:19, attribution:'USGS The National Map' })
    };
    activeBaseLayer = baseLayers.aerial.addTo(map);
    document.querySelectorAll('[data-map-style]').forEach(button => {
      if (button.tagName !== 'BUTTON') return;
      button.addEventListener('click', () => {
        const style = button.dataset.mapStyle;
        if (!baseLayers[style] || activeBaseLayer === baseLayers[style]) return;
        map.removeLayer(activeBaseLayer);
        activeBaseLayer = baseLayers[style].addTo(map);
        document.querySelector('.map-area').dataset.mapStyle = style;
        document.querySelectorAll('.map-style-control button').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
      });
    });
    data.forEach(s => {
      const icon=L.divIcon({className:'explorer-pin',html:`<span style="--pin:${colors[s.group]}">${s.code.replace('SSAJ','')}</span>`,iconSize:[38,38],iconAnchor:[19,19]});
      const marker=L.marker([s.lat,s.lng],{icon,title:s.common}).addTo(map).on('click',()=>openRecord(s.id)); markers.set(s.id,marker);
    });
    ['Little Sippewissett Marsh','Wood Neck Beach'].forEach(name => {
      const records = data.filter(sample => sample.site === name);
      if (!records.length) return;
      const lat = records.reduce((sum, sample) => sum + sample.lat, 0) / records.length;
      const lng = records.reduce((sum, sample) => sum + sample.lng, 0) / records.length;
      L.marker([lat,lng], { interactive:false, icon:L.divIcon({ className:'collection-site-label', html:`<span>${name}</span>`, iconSize:[190,28], iconAnchor:[95,45] }) }).addTo(map);
    });
    if (data.length) map.fitBounds(data.map(sample => [sample.lat,sample.lng]), { padding:[62,62], maxZoom:17 });
    const mapFrame = document.querySelector('.map-area');
    const refreshMapSize = () => requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    setTimeout(refreshMapSize, 150);
    addEventListener('load', refreshMapSize, { once: true });
    addEventListener('resize', refreshMapSize, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(refreshMapSize).observe(mapFrame);
  }

  function filtered() {
    const q=controls.search.value.trim().toLowerCase();
    return data.filter(s => (!q || [s.common,s.sci,s.code,s.group,s.site,s.date].join(' ').toLowerCase().includes(q))
      && (!controls.species.value || s.common===controls.species.value) && (!controls.group.value || s.group===controls.group.value)
      && (!controls.site.value || s.site===controls.site.value));
  }
  function render() {
    const visible=filtered(); const ids=new Set(visible.map(s=>s.id));
    markers.forEach((marker,id)=>{const el=marker.getElement(); if(el) el.style.display=ids.has(id)?'':'none'});
    const sort=controls.sort.value; const sortKey={common:'common',scientific:'sci',group:'group',code:'code',site:'site'}[sort];
    visible.sort((a,b)=>String(a[sortKey]).localeCompare(String(b[sortKey])));
    document.querySelector('#mapCount').textContent=visible.length; document.querySelector('#resultCount').textContent=visible.length;
    document.querySelector('#resultList').innerHTML=visible.map(s=>`<button class="result-row" type="button" data-id="${s.id}"><span class="code">${s.code}</span><span class="name">${s.common}</span><span class="scientific">${s.sci || 'Identification pending'}</span><span class="group"><i style="--pin:${colors[s.group]}"></i>${labels[s.group]}</span><span class="site">${s.site}<small>GPS accuracy ±${s.accuracy} m</small></span><span class="row-arrow" aria-hidden="true">→</span></button>`).join('');
    document.querySelector('#emptyState').hidden=visible.length!==0;
    const chips=[]; if(controls.search.value) chips.push(`Search: ${controls.search.value}`);
    Object.entries(controls).forEach(([k,c])=>{if(!['search','sort'].includes(k)&&c.value) chips.push(`${k}: ${c.options[c.selectedIndex].text}`)});
    document.querySelector('#activeFilters').innerHTML=chips.map(c=>`<span class="filter-chip">${esc(c)}</span>`).join('');
  }
  function openRecord(id) {
    location.href = `species.html?sample=${encodeURIComponent(id)}`;
  }
  Object.values(controls).forEach(c=>c.addEventListener(c===controls.search?'input':'change',render));
  document.querySelector('#clearFilters').addEventListener('click',()=>{Object.entries(controls).forEach(([k,c])=>{if(k!=='sort')c.value=''});render()});
  document.querySelector('#resultList').addEventListener('click',e=>{const row=e.target.closest('[data-id]');if(row)openRecord(row.dataset.id)});
  render();
})();
