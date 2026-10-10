/* =========================================================
   main.js — application entry point.
   Builds shared state after DOM ready, initialises modules,
   and connects their callbacks.
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});

  function byId(id) { return document.getElementById(id); }

  function buildState() {
    /* Runtime copy keeps App.data.EVENTS as the immutable source of truth. */
    var events = App.data.EVENTS.map(function (e) {
      return Object.assign({}, e);
    });
    App.state = {
      events: events,
      registrations: [],
      activeCategory: 'all',
      query: '',
      findEvent: function (id) {
        for (var i = 0; i < this.events.length; i++) {
          if (this.events[i].id === id) return this.events[i];
        }
        return null;
      }
    };
  }

  function init() {
    buildState();

    App.ui.init({
      registerDialog: byId('register-dialog'),
      successDialog: byId('success-dialog'),
      myEventsDialog: byId('my-events-dialog'),
      myeList: byId('mye-list'),
      myEventsCount: byId('my-events-count'),
      successMsg: byId('success-msg'),
      successCard: byId('success-card'),
      successEventName: byId('success-event-name'),
      successEventMeta: byId('success-event-meta'),
      myEventsBtn: byId('my-events-btn'),
      footerMyEvents: byId('footer-my-events'),
      successMyEvents: byId('success-my-events')
    });

    App.events.init({
      grid: byId('events-grid'),
      filterBar: byId('filter-bar'),
      search: byId('search'),
      resultsCount: byId('results-count'),
      emptyState: byId('empty-state')
    });

    App.registration.init({
      dialog: byId('register-dialog'),
      form: byId('reg-form'),
      eventIcon: byId('reg-event-icon'),
      eventName: byId('reg-event-name'),
      eventMeta: byId('reg-event-meta'),
      seatsNote: byId('reg-seats-note'),
      submit: byId('reg-submit'),
      name: byId('reg-name'),
      email: byId('reg-email'),
      phone: byId('reg-phone'),
      fieldName: byId('field-name'),
      fieldEmail: byId('field-email'),
      fieldPhone: byId('field-phone'),
      errName: byId('err-name'),
      errEmail: byId('err-email'),
      errPhone: byId('err-phone')
    });

    /* Discovery -> registration handoff. */
    App.events.onRegister = App.registration.open;

    var resetBtn = byId('empty-reset');
    if (resetBtn) resetBtn.addEventListener('click', App.events.reset);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
