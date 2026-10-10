/* =========================================================
   ui.js — shared interface behaviour.
   Dialogs, scroll reveals, countdown, header, My Events,
   and demo-only localStorage persistence.
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});

  var STORAGE_KEY = 'prism26.registrations.v1';
  var els = {};
  var revealObserver = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Dialogs ---------- */
  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', ''); /* very old fallback */
    }
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open || dialog.classList.contains('is-closing')) return;
    var finish = function () {
      dialog.classList.remove('is-closing');
      if (dialog.open) dialog.close();
    };
    if (reducedMotion) { finish(); return; }
    dialog.classList.add('is-closing');
    window.setTimeout(finish, 200);
  }

  function wireDialog(dialog) {
    if (!dialog) return;

    /* Esc key */
    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeDialog(dialog);
    });

    /* Backdrop click (click lands on the <dialog> itself, outside .modal-inner) */
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeDialog(dialog);
    });

    /* Any [data-close-dialog] inside */
    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-dialog]')) closeDialog(dialog);
    });
  }

  /* ---------- Scroll reveals ---------- */
  function observeReveals(nodes) {
    if (!nodes || !nodes.length) return;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, function (n) { n.classList.add('in-view'); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    Array.prototype.forEach.call(nodes, function (n) {
      if (!n.classList.contains('in-view')) revealObserver.observe(n);
    });
  }

  /* ---------- Countdown ---------- */
  function startCountdown() {
    var target = new Date(App.data.FEST.startsAt).getTime();
    var fields = {
      days: document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      mins: document.getElementById('cd-mins'),
      secs: document.getElementById('cd-secs')
    };
    if (!fields.days) return;

    var caption = document.querySelector('.countdown-caption');

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        fields.days.textContent = '00';
        fields.hours.textContent = '00';
        fields.mins.textContent = '00';
        fields.secs.textContent = '00';
        if (caption) caption.textContent = 'The fest is live!';
        window.clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      fields.days.textContent = pad(Math.floor(s / 86400));
      fields.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      fields.mins.textContent = pad(Math.floor((s % 3600) / 60));
      fields.secs.textContent = pad(s % 60);
    }

    tick();
    var timer = window.setInterval(tick, 1000);
  }

  /* ---------- Header ---------- */
  function wireHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function wireDemoNotice() {
    var notice = document.getElementById('hero-cookie-notice');
    var dismiss = document.getElementById('hero-cookie-dismiss');
    var key = 'prism26.demoNoticeDismissed.v1';
    if (!notice || !dismiss) return;
    try {
      if (window.localStorage.getItem(key) === 'true') notice.hidden = true;
    } catch (err) { /* storage may be unavailable */ }
    dismiss.addEventListener('click', function () {
      notice.hidden = true;
      try { window.localStorage.setItem(key, 'true'); } catch (err) { /* optional preference */ }
    });
  }

  /* ---------- Persistence (local demo only) ---------- */
  function loadRegistrations() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      /* Validate shape before trusting stored data. */
      return data.filter(function (r) {
        return r && typeof r.eventId === 'string' && typeof r.name === 'string' &&
          App.data.findEvent(r.eventId);
      });
    } catch (err) {
      return [];
    }
  }

  function saveRegistrations() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(App.state.registrations));
    } catch (err) { /* storage may be unavailable; demo only */ }
  }

  function applyRegistrationsToSeats() {
    App.state.registrations.forEach(function (r) {
      var event = App.state.findEvent(r.eventId);
      if (event) event.seatsLeft = Math.max(0, event.seatsLeft - (Number(r.quantity) || 1));
    });
  }

  /* ---------- My Events ---------- */
  function refreshBadge() {
    var badge = els.myEventsCount;
    if (!badge) return;
    var count = App.state.registrations.length;
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  function renderMyEvents() {
    var list = els.myeList;
    if (!list) return;
    var regs = App.state.registrations.slice().sort(function (a, b) { return b.at - a.at; });

    if (!regs.length) {
      list.innerHTML = '<p class="mye-empty">You have not registered for anything yet. Browse the events and grab a seat!</p>';
      return;
    }

    list.innerHTML = regs.map(function (r) {
      var event = App.state.findEvent(r.eventId);
      if (!event) return '';
      var cat = App.data.getCategory(event.category);
      return '<div class="mye-item">' +
          '<div>' +
            '<p class="mye-item-name">' + escapeHtml(event.name) + '</p>' +
            '<p class="mye-item-meta">' + escapeHtml(event.date + ' \u00b7 ' + event.time) + '</p>' +
          '</div>' +
          '<span class="seat-pill ' + (event.seatsLeft <= 0 ? 'is-full' : '') + '" style="--c1:' + cat.c1 + '">' +
            escapeHtml(r.name + ((Number(r.quantity) || 1) > 1 ? ' · ' + r.quantity + ' guests' : '')) +
          '</span>' +
        '</div>';
    }).join('');
  }

  function registrationsChanged() {
    refreshBadge();
    renderMyEvents();
    saveRegistrations();
  }

  function openMyEvents() {
    renderMyEvents();
    openDialog(els.myeDialog);
  }

  /* ---------- Success dialog ---------- */
  function showSuccess(registration, event) {
    var msg = els.successMsg;
    if (msg) {
      var quantity = Number(registration.quantity) || 1;
      msg.innerHTML = 'Nice one, <strong>' + escapeHtml(registration.name) +
        '</strong> — ' + (quantity === 1 ? 'your spot' : quantity + ' spots') + ' for <strong>' + escapeHtml(event.name) + '</strong> ' + (quantity === 1 ? 'is' : 'are') + ' reserved.';
    }
    if (els.successCard) els.successCard.hidden = false;
    if (els.successEventName) els.successEventName.textContent = event.name;
    if (els.successEventMeta) {
      els.successEventMeta.textContent = event.date + ' \u00b7 ' + event.time + ' \u00b7 ' + event.venue;
    }
    registrationsChanged();
    openDialog(els.successDialog);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Init ---------- */
  function init(options) {
    els.registerDialog = options.registerDialog;
    els.eventFlowDialog = options.eventFlowDialog;
    els.successDialog = options.successDialog;
    els.myeDialog = options.myEventsDialog;
    els.myeList = options.myeList;
    els.myEventsCount = options.myEventsCount;
    els.successMsg = options.successMsg;
    els.successCard = options.successCard;
    els.successEventName = options.successEventName;
    els.successEventMeta = options.successEventMeta;

    [els.eventFlowDialog, els.registerDialog, els.successDialog, els.myeDialog].forEach(wireDialog);

    /* Restore demo registrations and sync seats before cards render. */
    App.state.registrations = loadRegistrations();
    applyRegistrationsToSeats();
    refreshBadge();
    renderMyEvents();

    observeReveals(document.querySelectorAll('.reveal'));
    wireHeader();
    wireDemoNotice();
    startCountdown();

    els.myEventsBtn = options.myEventsBtn;
    if (els.myEventsBtn) els.myEventsBtn.addEventListener('click', openMyEvents);
    if (options.footerMyEvents) options.footerMyEvents.addEventListener('click', openMyEvents);
    if (options.successMyEvents) {
      options.successMyEvents.addEventListener('click', function () {
        closeDialog(els.successDialog);
        window.setTimeout(openMyEvents, reducedMotion ? 0 : 180);
      });
    }
  }

  App.ui = {
    init: init,
    openDialog: openDialog,
    closeDialog: closeDialog,
    observeReveals: observeReveals,
    showSuccess: showSuccess,
    registrationsChanged: registrationsChanged,
    openMyEvents: openMyEvents
  };
})();
