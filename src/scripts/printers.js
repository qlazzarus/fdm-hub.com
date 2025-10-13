// Client-side script for /[lang]/printers.astro
// Handles filtering, sorting, and pagination dynamically.

(function () {
  const root = document.getElementById('printersKR-root');
  if (!root) return;

  const lang = root.getAttribute('data-lang') || 'ko';
  const isEN = root.getAttribute('data-is-en') === 'true';
  const lastUpdatedLabel = root.getAttribute('data-last-updated-label') || (isEN ? 'Last updated' : '최종 업데이트');
  const detailsLabel = root.getAttribute('data-details-label') || (isEN ? 'Details' : '상세');
  const homepageLabel = root.getAttribute('data-homepage-label') || (isEN ? 'Homepage' : '홈페이지');
  const tagsLabel = root.getAttribute('data-tags-label') || (isEN ? 'Tags' : '태그');
  const featuresLabel = root.getAttribute('data-features-label') || (isEN ? 'Features' : '특징');
  const prosLabel = root.getAttribute('data-pros-label') || (isEN ? 'Pros' : '장점');
  const consLabel = root.getAttribute('data-cons-label') || (isEN ? 'Cons' : '단점');
  const closeLabel = root.getAttribute('data-close-label') || (isEN ? 'Close' : '닫기');

  const PER_PAGE = 15;

  const $q = document.getElementById('q');
  const $brand = document.getElementById('brand');
  const $motion = document.getElementById('motion');
  const $enclosed = document.getElementById('enclosed');
  const $speed = document.getElementById('speed');
  const $volume = document.getElementById('volume');
  const $price = document.getElementById('price');
  const $rows = document.getElementById('rows');
  const $pager = document.getElementById('pager');
  const $modal = document.getElementById('printerModal');
  const $pmTitle = document.getElementById('pm-title');
  const $pmBody = document.getElementById('pm-body');
  const $pmClose = document.getElementById('pm-close');

  function openModal() { if ($modal) $modal.classList.remove('hidden'); }
  function closeModal() { if ($modal) $modal.classList.add('hidden'); }

  if ($pmClose) $pmClose.addEventListener('click', closeModal);
  if ($modal) {
    $modal.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.getAttribute('data-close') === '1') closeModal();
    });
  }
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  let data = [];
  let brands = [];

  let sortKey = 'brand';
  let sortDir = 'asc';

  function speedValue(p) {
    return (p && (p.typicalSpeed || p.maxSpeed)) || 0;
  }

  function volumeValue(p) {
    if (!p || !p.build) return 0;
    const x = Number(p.build.x || 0);
    const y = Number(p.build.y || 0);
    const z = Number(p.build.z || 0);
    return Math.min(x, y, z);
  }

  function priceValue(p) {
    return typeof p?.priceKRW === 'number' ? p.priceKRW : Infinity;
  }

  function text(a) {
    return (a || '').toString().toLowerCase();
  }

  function volCube(v) {
    if (!v) return 0;
    const x = Number(v.x || 0);
    const y = Number(v.y || 0);
    const z = Number(v.z || 0);
    return Math.min(x, y, z);
  }

  function fmtKRW(n) {
    try {
      return Number(n).toLocaleString('ko-KR');
    } catch {
      return n;
    }
  }

  function updateIndicators() {
    document.querySelectorAll('thead .thbtn').forEach((btn) => {
      const k = btn.getAttribute('data-sort');
      const ind = btn.querySelector('.sort-indicator');
      if (!ind) return;
      if (k === sortKey) ind.textContent = sortDir === 'asc' ? '▲' : '▼';
      else ind.textContent = '';
    });
  }

  function updateAriaSort() {
    document.querySelectorAll('thead .thbtn').forEach((btn) => {
      const th = btn.closest('th');
      if (!th) return;
      const k = btn.getAttribute('data-sort');
      if (k === sortKey)
        th.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
      else th.removeAttribute('aria-sort');
    });
  }

  function render(list, page = 1) {
    if (!$rows || !$pager) return;
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageSlice = list.slice(start, end);

    $rows.innerHTML = pageSlice.map((p) => `
      <tr class="border-t border-border">
        <td class="px-3 py-2">
          ${p.image ? `<img class="thumb" src="${p.image}" alt="${(p.brand||'') + ' ' + (p.model||'')}" loading="lazy">` : `<div class="thumb bg-muted"></div>`}
        </td>
        <td class="px-3 py-2">${p.brand || ''}</td>
        <td class="px-3 py-2">${p.model || ''}${p.year ? ` <span class="opacity-60">(${p.year})</span>` : ''}</td>
        <td class="px-3 py-2">${p.motion || ''}</td>
        <td class="px-3 py-2">${p.build ? `${p.build.x}×${p.build.y}×${p.build.z}` : ''}</td>
        <td class="px-3 py-2 text-right">${p.typicalSpeed ? p.typicalSpeed + ' mm/s' : (p.maxSpeed ? '≤ ' + p.maxSpeed + ' mm/s' : '-')}</td>
        <td class="px-3 py-2 text-center">${p.officialUrl ? `<a class="px-2 py-1 rounded bg-brand text-brandFg hover:bg-brand/90 inline-block mr-1 mb-1" href="${p.officialUrl}" target="_blank" rel="nofollow noopener">${homepageLabel}</a>` : ''}</td>
        <td class="px-3 py-2 text-center">
          <button type="button" class="info-btn px-2 py-1 rounded-md border border-border hover:bg-muted text-sm" data-key="${encodeURIComponent((p.brand||'') + '||' + (p.model||'') + '||' + (p.year||''))}">${detailsLabel}</button>
        </td>
      </tr>
    `).join('');

    if (totalPages > 1) {
      $pager.classList.remove('hidden');
      $pager.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(
          (p) => `
        <a href="#" data-page="${p}" class="px-3 py-1 rounded-md border ${
            p === page
              ? 'bg-brand text-brandFg border-brand'
              : 'bg-muted text-mutedFg border-border hover:bg-muted/80'
          }">${p}</a>`
        )
        .join('');
      $pager.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const p = Number(a.getAttribute('data-page') || '1');
          render(list, p);
        });
      });
    } else {
      $pager.classList.add('hidden');
      $pager.innerHTML = '';
    }
  }

  function apply() {
    const q = ($q?.value || '').toLowerCase().trim();
    const brand = $brand?.value || '';
    const motion = $motion?.value || '';
    const enclosed = $enclosed?.value || '';
    const speedMin = Number($speed?.value || 0);
    const volMin = Number($volume?.value || 0);
    const priceMax = Number($price?.value || 0);

    let list = data.filter((p) => {
      const okKR = Array.isArray(p.availability) && p.availability.includes('KR');
      const okQ = !q || `${p.brand} ${p.model}`.toLowerCase().includes(q);
      const okB = !brand || p.brand === brand;
      const okM = !motion || p.motion === motion;
      const okE = !enclosed || String(!!p.enclosed) === enclosed;
      const okS = !speedMin || speedValue(p) >= speedMin;
      const okV = !volMin || volCube(p.build) >= volMin;
      const okP = !priceMax || (p.priceKRW || Number.MAX_SAFE_INTEGER) <= priceMax;
      return okKR && okQ && okB && okM && okE && okS && okV && okP;
    });

    list.sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case 'brand': diff = text(a.brand).localeCompare(text(b.brand)); break;
        case 'model': diff = text(a.model).localeCompare(text(b.model)); break;
        case 'motion': diff = text(a.motion).localeCompare(text(b.motion)); break;
        case 'volume': diff = volumeValue(a) - volumeValue(b); break;
        case 'speed': diff = speedValue(a) - speedValue(b); break;
        case 'price': diff = priceValue(a) - priceValue(b); break;
        case 'rec':
        default: diff = (b.year || 0) - (a.year || 0); break;
      }
      return sortDir === 'asc' ? diff : -diff;
    });

    render(list, 1);
  }

  fetch('/data/printers.json')
    .then((r) => r.json())
    .then((json) => {
      const items = Array.isArray(json) ? json : (json && Array.isArray(json.items) ? json.items : []);
      data = items;
      const lastUpdated = !Array.isArray(json) ? json.lastUpdated : undefined;
      const $lu = document.getElementById('lastUpdated');
      if ($lu && lastUpdated) {
        try {
          const d = new Date(lastUpdated);
          const formatted = isEN ? d.toLocaleDateString('en-US') : d.toLocaleDateString('ko-KR');
          $lu.textContent = `${lastUpdatedLabel}: ${formatted}`;
        } catch {
          $lu.textContent = `${lastUpdatedLabel}: ${lastUpdated}`;
        }
      }
      brands = Array.from(new Set(items.map((p) => p.brand).filter(Boolean))).sort();
      if ($brand) {
        const brandLabel = root.getAttribute('data-brand-label') || (isEN ? 'All brands' : '전체 브랜드');
        $brand.innerHTML = `<option value="">${brandLabel}</option>` + brands.map((b) => `<option value="${b}">${b}</option>`).join('');
      }
      apply();
    })
    .catch(() => {
      data = [];
      apply();
    });

  document.querySelectorAll('thead .thbtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-sort');
      if (!k) return;
      if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      else {
        sortKey = k;
        sortDir = k === 'brand' || k === 'model' || k === 'motion' ? 'asc' : 'desc';
        if (k === 'price') sortDir = 'asc';
      }
      updateIndicators();
      updateAriaSort();
      apply();
    });
  });

  updateIndicators();
  updateAriaSort();

  [$q, $brand, $motion, $enclosed, $speed, $volume, $price].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', apply);
  });

  if ($rows) {
    $rows.addEventListener('click', (e) => {
      const btn = e.target.closest('.info-btn');
      if (!btn) return;
      const key = btn.getAttribute('data-key') || '';
      const [b, m, y] = decodeURIComponent(key).split('||');
      const item = data.find((x) => (x.brand||'') === b && (x.model||'') === m && String(x.year||'') === (y||''));
      if (!item) return;

      if ($pmTitle) $pmTitle.textContent = `${item.brand||''} ${item.model||''}`.trim();

      const tagChips = Array.isArray(item.tags) && item.tags.length
        ? `<div class="flex flex-wrap gap-1">${item.tags.map((t)=>`<span class="px-2 py-0.5 rounded-full border border-border text-xs bg-muted">${t}</span>`).join('')}</div>`
        : '';

      const featuresList = Array.isArray(item.features) && item.features.length
        ? `<ul class="list-disc pl-5">${item.features.map((f)=>`<li>${f}</li>`).join('')}</ul>`
        : '';

      const prosList = Array.isArray(item.pros) && item.pros.length
        ? `<ul class="list-disc pl-5">${item.pros.map((f)=>`<li>${f}</li>`).join('')}</ul>`
        : '';

      const consList = Array.isArray(item.cons) && item.cons.length
        ? `<ul class="list-disc pl-5">${item.cons.map((f)=>`<li>${f}</li>`).join('')}</ul>`
        : '';

      if ($pmBody) {
        $pmBody.innerHTML = `
          ${tagChips ? `<div><div class="font-semibold mb-1">${tagsLabel}</div>${tagChips}</div>` : ''}
          ${featuresList ? `<div><div class="font-semibold mb-1">${featuresLabel}</div>${featuresList}</div>` : ''}
          ${prosList ? `<div><div class="font-semibold mb-1">${prosLabel}</div>${prosList}</div>` : ''}
          ${consList ? `<div><div class="font-semibold mb-1">${consLabel}</div>${consList}</div>` : ''}
        `;
      }

      if ($pmClose) $pmClose.textContent = closeLabel;
      openModal();
    });
  }
})();