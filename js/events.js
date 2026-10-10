(function () {
  'use strict';
  var App = (window.App = window.App || {});
  var els = {}, saved = [], viewAll = false;
  var categories = [{ id: 'all', label: 'All events' }, { id: 'music', label: 'Music' }, { id: 'talks', label: 'Talks' }, { id: 'workshops', label: 'Workshops' }];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
  function category(id) { return App.data.getCategory(id); }
  function registrationFor(id) { return App.state.registrations.find(function (r) { return r.eventId === id; }) || null; }
  function safeImage(url) { return /^https:\/\//i.test(url) ? url : ''; }
  function iconHeart() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 11-8.8 11S3.2 14 3.2 8.8A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8.8 1.4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'; }
  function filtered() {
    var q = App.state.query.trim().toLowerCase(), cat = App.state.activeCategory;
    return App.state.events.filter(function (e) {
      var text = [e.name, e.category, e.date, e.time, e.venue, e.description].join(' ').toLowerCase();
      return (cat === 'all' || e.category === cat) && (!q || text.indexOf(q) >= 0) && (!els.available.checked || e.seatsLeft > 0);
    }).sort(function (a, b) {
      var by = els.sort.value;
      return by === 'name' ? a.name.localeCompare(b.name) : by === 'price' ? a.price - b.price : new Date(a.isoDate) - new Date(b.isoDate);
    });
  }
  function card(e, small, index) {
    var cat = category(e.category), full = e.seatsLeft <= 0, isSaved = saved.indexOf(e.id) >= 0, booked = !!registrationFor(e.id);
    return '<article class="event-card event-photo-card' + (small ? ' event-card-small' : '') + (full ? ' is-full' : '') + (booked ? ' is-booked' : '') + ' reveal" data-id="' + esc(e.id) + '" style="--i:' + index + ';--c1:' + cat.c1 + '">' +
      '<button class="event-card-open" type="button" data-event-details aria-label="View ' + esc(e.name) + '"><span class="sr-only">View event details</span></button>' +
      '<div class="event-photo-wrap"><img class="event-photo" src="' + esc(safeImage(e.image)) + '" alt="' + esc(e.imageAlt || '') + '" loading="lazy"><span class="date-badge">' + esc(e.dateBadge || e.date) + '</span>' +
      '<button class="save-button' + (isSaved ? ' is-saved' : '') + '" type="button" data-save="' + esc(e.id) + '" aria-label="' + (isSaved ? 'Unsave ' : 'Save ') + esc(e.name) + '" aria-pressed="' + isSaved + '">' + iconHeart() + '</button>' +
      (booked ? '<span class="booked-badge">Seat Booked</span>' : full ? '<span class="full-badge">Full</span>' : '') + '</div><div class="event-photo-copy"><h4>' + esc(e.name) + '</h4><p>' + esc(e.time) + ' <span aria-hidden="true">·</span> ' + esc(e.venue) + '</p><div class="event-card-foot"><span class="category-label category-' + esc(e.category) + '">' + esc(cat.label) + '</span><span class="seat-pill' + (e.seatsLeft <= 5 && !full ? ' is-low' : '') + '">' + (full ? 'Full' : esc(e.seatsLeft) + ' seats left') + '</span></div></div></article>';
  }
  function renderChips() {
    els.filterBar.innerHTML = categories.map(function (c) {
      var active = App.state.activeCategory === c.id;
      return '<button class="chip' + (active ? ' is-active' : '') + '" type="button" data-category="' + c.id + '" aria-pressed="' + active + '">' + (c.id === 'all' ? '<span aria-hidden="true">▦</span> ' : '') + c.label + '</button>';
    }).join('');
  }
  function render() {
    var list = filtered(), curated = !viewAll && !App.state.query.trim() && App.state.activeCategory === 'all' && !els.available.checked;
    els.loading.hidden = true; els.curated.hidden = !curated; els.empty.hidden = list.length > 0;
    els.count.textContent = 'Showing ' + list.length + ' of ' + App.state.events.length + ' events';
    els.allGrid.hidden = curated;
    if (curated) {
      els.grid.innerHTML = list.slice(0, 4).map(function (e, i) { return card(e, false, i); }).join('');
      els.more.innerHTML = list.slice(4, 7).map(function (e, i) { return card(e, true, i + 4); }).join('');
    } else els.allGrid.innerHTML = list.map(function (e, i) { return card(e, false, i); }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.events .event-card.reveal'), function (node) { App.ui.observeReveals([node]); });
    els.viewAll.textContent = viewAll ? 'Show less ↑' : 'View all →';
  }
  function renderDetail(id) {
    var e = App.state.findEvent(id); if (!e) { location.hash = '#events'; return; }
    var cat = category(e.category), isSaved = saved.indexOf(e.id) >= 0, booked = !!registrationFor(e.id);
    els.image.src = safeImage(e.image); els.image.alt = e.imageAlt || e.name;
    els.detailCategory.textContent = cat.label; els.detailTitle.textContent = e.name;
    els.facts.innerHTML = '<li>▣ <span>' + esc(e.date) + '</span></li><li>◷ <span>' + esc(e.time) + '</span></li><li>⌖ <span>' + esc(e.venue) + '</span></li>';
    els.address.textContent = e.address; els.description.textContent = e.description;
    els.schedule.innerHTML = e.schedule.map(function (row) { return '<li><time>' + esc(row.time) + '</time><span>' + esc(row.title) + '</span></li>'; }).join('');
    els.detailSave.classList.toggle('is-saved', isSaved); els.detailSave.setAttribute('aria-pressed', String(isSaved));
    els.choose.disabled = booked || e.seatsLeft <= 0; els.choose.textContent = booked ? 'Seat Booked' : e.seatsLeft <= 0 ? 'Event full' : 'Choose tickets →';
    els.detail.hidden = false; els.list.hidden = true; els.review.hidden = true;
  }
  function renderReview() {
    var selection = App.eventsStore.getSelection(), e = selection && App.state.findEvent(selection.eventId);
    if (!e) { location.hash = '#events'; return; }
    var registration = registrationFor(e.id);
    var quantity = registration ? (Number(registration.quantity) || 1) : Math.min(Math.max(1, selection.quantity), Math.max(1, Math.min(e.seatsLeft, 10)));
    if (e.seatsLeft <= 0 && !registration) { location.hash = '#event/' + encodeURIComponent(e.id); return; }
    App.eventsStore.setSelection({ eventId: e.id, quantity: quantity });
    els.backEvent.href = '#event/' + encodeURIComponent(e.id); els.reviewImage.src = safeImage(e.image); els.reviewImage.alt = e.imageAlt || e.name;
    els.reviewName.textContent = e.name; els.reviewDate.textContent = '▣  ' + e.date; els.reviewTime.textContent = '◷  ' + e.time;
    els.reviewVenue.textContent = '⌖  ' + e.venue; els.reviewAddress.textContent = e.address;
    els.quantity.innerHTML = Array.from({ length: registration ? quantity : Math.min(10, e.seatsLeft) }, function (_, i) { return '<option value="' + (i + 1) + '"' + (i + 1 === quantity ? ' selected' : '') + '>' + (i + 1) + '</option>'; }).join('');
    els.quantity.disabled = !!registration;
    var amount = e.price * quantity, money = 'HKD ' + amount;
    els.unitPrice.textContent = 'HKD ' + e.price; els.subtotal.textContent = money; els.total.textContent = money;
    els.checkout.disabled = !!registration;
    els.checkout.textContent = registration ? 'Seat Booked' : 'Continue to checkout →';
    els.review.hidden = false; els.list.hidden = true; els.detail.hidden = true;
  }
  function route() {
    var match = location.hash.match(/^#event\/([^/?]+)/);
    if (match) renderDetail(decodeURIComponent(match[1]));
    else if (location.hash === '#review') renderReview();
    else { els.list.hidden = false; els.detail.hidden = true; els.review.hidden = true; render(); }
  }
  function toggleSaved(id) { App.eventsStore.toggleSaved(id); saved = App.eventsStore.getSaved(); render(); route(); }
  function init(o) {
    els = { list:o.list, detail:o.detail, review:o.review, filterBar:o.filterBar, search:o.search, count:o.count, loading:o.loading, empty:o.empty, curated:o.curated, grid:o.grid, more:o.more, allGrid:o.allGrid, viewAll:o.viewAll, sort:o.sort, available:o.available, filtersToggle:o.filtersToggle, filterOptions:o.filterOptions, searchClear:o.searchClear, image:o.image, detailCategory:o.detailCategory, detailTitle:o.detailTitle, facts:o.facts, address:o.address, description:o.description, schedule:o.schedule, detailSave:o.detailSave, choose:o.choose, reviewImage:o.reviewImage, reviewName:o.reviewName, reviewDate:o.reviewDate, reviewTime:o.reviewTime, reviewVenue:o.reviewVenue, reviewAddress:o.reviewAddress, backEvent:o.backEvent, quantity:o.quantity, unitPrice:o.unitPrice, subtotal:o.subtotal, total:o.total, checkout:o.checkout, share:o.share, shareStatus:o.shareStatus };
    saved = App.eventsStore.getSaved(); renderChips();
    var tags = ['MUSIC','TALKS','WORKSHOPS','AFTER DARK','LIVE SETS','MAKERS'];
    document.getElementById('category-marquee-track').innerHTML = tags.concat(tags).map(function (t) { return '<span>' + t + ' <b aria-hidden="true">✳</b></span>'; }).join('');
    els.filterBar.addEventListener('click', function (ev) { var b = ev.target.closest('[data-category]'); if (!b) return; App.state.activeCategory = b.dataset.category; renderChips(); render(); });
    els.search.addEventListener('input', function () { App.state.query = els.search.value; els.searchClear.hidden = !els.search.value; render(); });
    els.searchClear.addEventListener('click', function () { els.search.value = ''; App.state.query = ''; els.searchClear.hidden = true; render(); els.search.focus(); });
    els.viewAll.addEventListener('click', function () { viewAll = !viewAll; render(); });
    els.sort.addEventListener('change', render); els.available.addEventListener('change', render);
    els.filtersToggle.addEventListener('click', function () { var open = els.filtersToggle.getAttribute('aria-expanded') !== 'true'; els.filtersToggle.setAttribute('aria-expanded', String(open)); els.filterOptions.hidden = !open; });
    document.getElementById('empty-reset').addEventListener('click', function () { App.state.query = ''; els.search.value = ''; els.available.checked = false; App.state.activeCategory = 'all'; renderChips(); render(); });
    document.getElementById('events').addEventListener('click', function (ev) {
      var save = ev.target.closest('[data-save]'); if (save) { ev.preventDefault(); ev.stopPropagation(); toggleSaved(save.dataset.save); return; }
      var button = ev.target.closest('[data-event-details]'); if (button) location.hash = '#event/' + encodeURIComponent(button.closest('[data-id]').dataset.id);
    });
    els.detailSave.addEventListener('click', function () { toggleSaved(decodeURIComponent(location.hash.split('/')[1] || '')); });
    els.choose.addEventListener('click', function () { var id = decodeURIComponent(location.hash.split('/')[1] || ''); App.eventsStore.setSelection({ eventId:id, quantity:1 }); location.hash = '#review'; });
    els.quantity.addEventListener('change', function () { var selection = App.eventsStore.getSelection(); if (selection) { selection.quantity = Number(els.quantity.value); App.eventsStore.setSelection(selection); renderReview(); } });
    els.checkout.addEventListener('click', function () { var s = App.eventsStore.getSelection(); if (s && !registrationFor(s.eventId)) App.registration.open(s.eventId, s.quantity); });
    els.share.addEventListener('click', function () { var url = location.href; if (navigator.share) navigator.share({ title: els.detailTitle.textContent, url:url }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { els.shareStatus.textContent = 'Event link copied.'; }, function () { els.shareStatus.textContent = 'Copy this link from your address bar.'; }); });
    window.addEventListener('hashchange', function () {
      route();
      if (location.hash.indexOf('#event/') === 0 || location.hash === '#review') {
        document.getElementById('events').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    });
    route();
  }
  App.events = { init:init, render:render, refreshCard:function () { render(); route(); }, reset:function () { App.state.query=''; els.search.value=''; App.state.activeCategory='all'; renderChips(); render(); }, route:route };
})();
