/* =========================================================
   events.js — event discovery: rendering, filtering, search.
   Reads from App.state.events (runtime copy of App.data.EVENTS).
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});

  var els = {};
  var cardsById = {};

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function seatInfo(event) {
    if (event.seatsLeft <= 0) {
      return { cls: 'is-full', text: 'Full', label: 'Event full' };
    }
    var n = event.seatsLeft;
    var cls = n <= 5 ? 'is-low' : '';
    var text = n === 1 ? '1 seat left' : n + ' seats left';
    return { cls: cls, text: text, label: text };
  }

  var ICONS = {
    calendar: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-5.2-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.8-6.5 10-6.5 10z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="11" r="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  function cardMarkup(event, index, animate) {
    var cat = App.data.getCategory(event.category);
    var seat = seatInfo(event);
    var featured = event.featured ? ' is-featured' : '';
    var full = event.seatsLeft <= 0 ? ' is-full' : '';
    var reveal = animate ? ' reveal' : '';

    return '' +
      '<article class="event-card' + reveal + featured + full + '" data-id="' + esc(event.id) + '" style="--i:' + index + ';--c1:' + cat.c1 + ';--c2:' + cat.c2 + '">' +
        '<div class="card-band">' +
          '<span class="card-cat">' + esc(cat.label) + '</span>' +
          (event.seatsLeft <= 0 ? '<span class="card-ribbon">' + ICONS.lock + 'Sold out</span>' : '') +
          '<span class="card-icon">' + cat.icon + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<h3 class="card-title">' + esc(event.name) + '</h3>' +
          '<ul class="card-meta">' +
            '<li class="meta-row">' + ICONS.calendar + '<span>' + esc(event.date) + '</span></li>' +
            '<li class="meta-row">' + ICONS.clock + '<span>' + esc(event.time) + '</span></li>' +
            '<li class="meta-row">' + ICONS.pin + '<span>' + esc(event.venue) + '</span></li>' +
          '</ul>' +
          '<p class="card-desc">' + esc(event.description) + '</p>' +
          '<div class="card-footer">' +
            '<span class="seat-pill ' + seat.cls + '" data-seat aria-label="' + esc(seat.label) + '">' + esc(seat.text) + '</span>' +
            '<button class="btn btn-primary card-btn" type="button" data-event-details aria-label="View details for ' + esc(event.name) + '">' +
              'View event <span aria-hidden="true">→</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function buildChips() {
    var counts = {};
    App.state.events.forEach(function (e) {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });

    var html = chipMarkup('all', App.data.CATEGORIES.all, App.state.events.length);
    Object.keys(App.data.CATEGORIES).forEach(function (id) {
      if (id === 'all' || !counts[id]) return;
      html += chipMarkup(id, App.data.CATEGORIES[id], counts[id]);
    });
    els.filterBar.innerHTML = html;
  }

  function chipMarkup(id, cat, count) {
    var active = App.state.activeCategory === id;
    return '<button class="chip' + (active ? ' is-active' : '') + '" type="button" ' +
      'data-category="' + esc(id) + '" aria-pressed="' + active + '">' +
      '<span class="chip-count">' + count + '</span>' + esc(cat.label) + '</button>';
  }

  function getFiltered() {
    var q = App.state.query.trim().toLowerCase();
    var cat = App.state.activeCategory;
    return App.state.events.filter(function (e) {
      var catOk = cat === 'all' || e.category === cat;
      var searchable = [e.name, e.category, e.date, e.time, e.venue, e.description].join(' ').toLowerCase();
      var searchOk = !q || searchable.indexOf(q) !== -1;
      return catOk && searchOk;
    });
  }

  function updateResults(list) {
    var total = App.state.events.length;
    var catLabel = App.data.getCategory(App.state.activeCategory).label;
    var parts = ['Showing <strong>' + list.length + '</strong> of ' + total + ' events'];
    if (App.state.activeCategory !== 'all') parts.push('in <strong>' + esc(catLabel) + '</strong>');
    if (App.state.query.trim()) parts.push('matching &ldquo;<strong>' + esc(App.state.query.trim()) + '</strong>&rdquo;');
    els.resultsCount.innerHTML = parts.join(' ');
  }

  function render(options) {
    var animate = !options || options.animate !== false;
    var list = getFiltered();

    els.grid.innerHTML = list.map(function (event, i) {
      return cardMarkup(event, i, animate);
    }).join('');
    cardsById = {};
    var nodes = els.grid.querySelectorAll('.event-card');
    Array.prototype.forEach.call(nodes, function (node) {
      cardsById[node.dataset.id] = node;
    });

    updateResults(list);
    els.emptyState.hidden = list.length !== 0;

    if (animate) {
      if (App.ui && App.ui.observeReveals) {
        App.ui.observeReveals(nodes);
      } else {
        Array.prototype.forEach.call(nodes, function (n) { n.classList.add('in-view'); });
      }
    }
  }

  /* Update a single card's seat display in place (after registration). */
  function refreshCard(id, animate) {
    var event = App.state.findEvent(id);
    var node = cardsById[id];
    if (!event || !node) return;

    var seat = node.querySelector('[data-seat]');
    var info = seatInfo(event);

    seat.className = 'seat-pill ' + info.cls;
    seat.textContent = info.text;
    seat.setAttribute('aria-label', info.label);

    if (event.seatsLeft <= 0) {
      node.classList.add('is-full');
      if (!node.querySelector('.card-ribbon')) {
        var ribbon = document.createElement('span');
        ribbon.className = 'card-ribbon';
        ribbon.innerHTML = ICONS.lock + 'Sold out';
        node.querySelector('.card-band').appendChild(ribbon);
      }
    } else {
      node.classList.remove('is-full');
      var ribbon = node.querySelector('.card-ribbon');
      if (ribbon) ribbon.remove();
    }

    if (animate) {
      seat.classList.remove('pulse');
      void seat.offsetWidth; /* restart animation */
      seat.classList.add('pulse');
    }
  }

  function setCategory(id) {
    App.state.activeCategory = id;
    var chips = els.filterBar.querySelectorAll('.chip');
    Array.prototype.forEach.call(chips, function (c) {
      var active = c.dataset.category === id;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-pressed', String(active));
    });
    render({ animate: true });
  }

  function setQuery(value) {
    App.state.query = value;
    render({ animate: false });
  }

  function reset() {
    App.state.query = '';
    if (els.search) els.search.value = '';
    if (els.searchClear) els.searchClear.hidden = true;
    App.state.activeCategory = 'all';
    buildChips();
    render({ animate: true });
  }

  function init(options) {
    els.grid = options.grid;
    els.filterBar = options.filterBar;
    els.search = options.search;
    els.searchClear = options.searchClear;
    els.resultsCount = options.resultsCount;
    els.emptyState = options.emptyState;

    buildChips();
    render();

    els.filterBar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (chip) setCategory(chip.dataset.category);
    });

    els.search.addEventListener('input', function (e) {
      setQuery(e.target.value);
      if (options.searchClear) options.searchClear.hidden = !e.target.value;
    });

    if (options.searchClear) {
      options.searchClear.addEventListener('click', function () {
        els.search.value = '';
        setQuery('');
        options.searchClear.hidden = true;
        els.search.focus();
      });
    }

    els.grid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-event-details]');
      if (!btn) return;
      var card = e.target.closest('.event-card');
      if (card && App.events.onDetails) App.events.onDetails(card.dataset.id);
    });
  }

  App.events = {
    init: init,
    render: render,
    refreshCard: refreshCard,
    setCategory: setCategory,
    setQuery: setQuery,
    reset: reset,
    getFiltered: getFiltered,
    onDetails: null
  };
})();
