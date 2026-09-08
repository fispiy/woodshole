(() => {
  class SiteIndex extends HTMLElement {
    connectedCallback() {
      const root = this.dataset.root || '.';
      const path = location.pathname.toLowerCase();
      const params = new URLSearchParams(location.search);
      const isSample = path.endsWith('/species.html') && params.has('sample');
      const isShrimpinaRoute = path.includes('/groups/shrimpina') || path.endsWith('/research.html') || path.endsWith('/journal.html') || path.endsWith('/conditions.html') || path.endsWith('/lab.html') || isSample;
      const current = path.endsWith('/map.html') ? 'map'
        : path.endsWith('/observations.html') ? 'observations'
        : isSample ? 'archive'
        : path.includes('/groups/shrimpina') && location.hash === '#g-species' ? 'archive'
        : path.endsWith('/journal.html') ? 'journal'
        : path.endsWith('/conditions.html') ? 'conditions'
        : path.endsWith('/research.html') ? 'research'
        : path.endsWith('/lab.html') ? 'lab'
        : isShrimpinaRoute ? 'shrimpina'
        : path.endsWith('/species.html') ? 'map'
        : 'home';
      const href = value => root === '.' ? value : `${root}/${value}`;
      const link = (key, value, label) => `<a data-nav-key="${key}" href="${href(value)}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
      const navGroup = (key, value, label, children = []) => `<div class="site-nav-group">
        ${link(key, value, label)}
        ${children.length ? `<div class="site-nav-dropdown">${children.map(item => `<a href="${item.external ? item.value : href(item.value)}"${item.external ? ' target="_blank" rel="noopener"' : ''}>${item.label}</a>`).join('')}</div>` : ''}
      </div>`;
      const primaryNavigation = `${navGroup('home', 'index.html', 'MBL', [
            { value:'index.html#about-mbl', label:'What is the MBL?' },
            { value:'index.html#field-map', label:'Course collection' }
          ])}
          ${navGroup('map', 'map.html', 'Collection Map', [
            { value:'map.html#explorerMap', label:'Interactive map' },
            { value:'map.html#resultsHeading', label:'Specimen list' }
          ])}
          ${navGroup('observations', 'observations.html', 'Observations', [
            { value:'observations.html#obsGrid', label:'Browse observations' },
            { value:'https://www.inaturalist.org/projects/bios-27723-woods-hole-biodiversity', label:'Open in iNaturalist', external:true }
          ])}
          ${navGroup('shrimpina', 'groups/shrimpina.html', 'Shrimpina', [
            { value:'groups/shrimpina.html', label:'Project overview' },
            { value:'groups/shrimpina.html#g-species', label:'Specimen archive' },
            { value:'journal.html', label:'Field journal' },
            { value:'conditions.html', label:'Field conditions' },
            { value:'lab.html', label:'Laboratory' }
          ])}`;

      this.classList.toggle('is-shrimpina', isShrimpinaRoute);
      document.body.classList.toggle('shrimpina-cursor', isShrimpinaRoute);
      this.innerHTML = `<header class="site-masthead">
        <div class="site-masthead-inner">
          <a class="site-masthead-brand" href="${href('index.html')}" aria-label="Woods Hole Biodiversity Survey home">
            <img src="${href('assets/mbl-logo.png')}" alt="The University of Chicago Marine Biological Laboratory">
          </a>
          <nav class="site-masthead-primary" aria-label="Primary navigation">
            ${primaryNavigation}
          </nav>
          <details class="site-masthead-menu">
            <summary><span class="menu-open-label">Menu</span><span class="menu-close-label">Close</span><i aria-hidden="true"></i></summary>
            <div class="site-masthead-panel">
              <p>Woods Hole Biodiversity Survey</p>
              <nav aria-label="All pages">
                ${link('home', 'index.html', 'MBL overview')}
                ${link('map', 'map.html', 'Collection map')}
                ${link('observations', 'observations.html', 'Observations')}
                ${link('shrimpina', 'groups/shrimpina.html', 'Shrimpina project')}
                ${link('archive', 'groups/shrimpina.html#g-species', 'Specimen archive')}
                ${link('journal', 'journal.html', 'Field journal')}
                ${link('conditions', 'conditions.html', 'Field conditions')}
                ${link('lab', 'lab.html', 'Laboratory')}
              </nav>
              <small>Marine Biological Laboratory · 2026</small>
            </div>
          </details>
        </div>
      </header>`;

      if (isShrimpinaRoute) {
        this.querySelectorAll('.site-masthead-primary a[aria-current="page"]').forEach(anchor => anchor.removeAttribute('aria-current'));
        this.querySelector('.site-masthead-primary a[data-nav-key="shrimpina"]')?.setAttribute('aria-current', 'page');
      }

      const menu = this.querySelector('.site-masthead-menu');
      document.addEventListener('pointerdown', event => {
        if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') menu.removeAttribute('open');
      });
      if (path.includes('/groups/shrimpina')) {
        addEventListener('hashchange', () => {
          this.querySelectorAll('.site-masthead-primary a').forEach(anchor => anchor.removeAttribute('aria-current'));
          this.querySelector('.site-masthead-primary a[data-nav-key="shrimpina"]')?.setAttribute('aria-current', 'page');
        });
      }
    }
  }

  customElements.define('site-index', SiteIndex);
})();
