/* =========================================================
   events-store.js — the only localStorage boundary for this app.
   All persisted values are versioned and namespaced.
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});
  var VERSION = 1;
  var KEYS = {
    events: 'nightfind:events',
    saved: 'nightfind:saved',
    selection: 'nightfind:selection',
    registrations: 'nightfind:registrations',
    ui: 'nightfind:ui'
  };
  var eventCache = (App.data.EVENTS || []).map(clone);
  var savedCache = [];
  var selectionCache = null;
  var registrationsCache = [];
  var uiCache = { theme: 'light' };

  function clone(value) {
    if (value === null || value === undefined) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify({ version: VERSION, data: value }));
      return true;
    } catch (error) {
      return false;
    }
  }

  function read(key, validate, fallback, normalize) {
    try {
      var raw = window.localStorage.getItem(key);
      if (raw === null || raw === '') {
        write(key, fallback);
        return clone(fallback);
      }
      var record = JSON.parse(raw);
      if (record && record.version === VERSION && validate(record.data)) return clone(record.data);
      if (record && record.version === 0 && normalize) {
        var migrated = normalize(record.data);
        if (validate(migrated)) {
          write(key, migrated);
          return clone(migrated);
        }
      }
      write(key, fallback);
      return clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function validEvents(value) {
    return Array.isArray(value) && value.length >= 8 && value.every(function (event) {
      return event && typeof event.id === 'string' && typeof event.name === 'string' &&
        typeof event.category === 'string' && typeof event.date === 'string' &&
        typeof event.time === 'string' && typeof event.venue === 'string' &&
        typeof event.address === 'string' && typeof event.description === 'string' &&
        Array.isArray(event.schedule) && typeof event.price === 'number' &&
        typeof event.image === 'string';
    });
  }

  function validStringList(value) {
    return Array.isArray(value) && value.every(function (item) { return typeof item === 'string'; });
  }

  function validSelection(value) {
    return value === null || (value && typeof value.eventId === 'string' &&
      Number.isInteger(value.quantity) && value.quantity >= 1 && value.quantity <= 99);
  }

  function validRegistrations(value) {
    return Array.isArray(value) && value.every(function (item) {
      return item && typeof item.eventId === 'string' && typeof item.name === 'string' &&
        Number.isInteger(Number(item.quantity || 1));
    });
  }

  function getEvents() {
    var seed = (App.data.EVENTS || []).map(clone);
    var value = read(KEYS.events, validEvents, seed, function (oldData) { return oldData; });
    if (!validEvents(value)) value = seed;
    eventCache = clone(value);
    return clone(eventCache);
  }

  function getEventById(id) {
    var events = getEvents();
    for (var i = 0; i < events.length; i++) if (events[i].id === id) return events[i];
    return null;
  }

  function setEvents(events) {
    if (!validEvents(events)) return false;
    eventCache = clone(events);
    return write(KEYS.events, eventCache);
  }

  function getSaved() {
    var validIds = getEvents().map(function (event) { return event.id; });
    savedCache = read(KEYS.saved, validStringList, [], function (oldData) { return oldData; })
      .filter(function (id) { return validIds.indexOf(id) !== -1; });
    return savedCache.slice();
  }

  function toggleSaved(id) {
    var saved = getSaved();
    var index = saved.indexOf(id);
    if (index === -1) saved.push(id);
    else saved.splice(index, 1);
    savedCache = saved;
    write(KEYS.saved, savedCache);
    return index === -1;
  }

  function getSelection() {
    var value = read(KEYS.selection, validSelection, null, function (oldData) { return oldData; });
    if (value && !getEventById(value.eventId)) value = null;
    selectionCache = value;
    return clone(selectionCache);
  }

  function setSelection(value) {
    if (value !== null && !validSelection(value)) return false;
    selectionCache = clone(value);
    return write(KEYS.selection, selectionCache);
  }

  function getRegistrations() {
    registrationsCache = read(KEYS.registrations, validRegistrations, [], function (oldData) { return oldData; });
    var validIds = getEvents().map(function (event) { return event.id; });
    registrationsCache = registrationsCache.filter(function (item) { return validIds.indexOf(item.eventId) !== -1; });
    return clone(registrationsCache);
  }

  function setRegistrations(registrations) {
    if (!validRegistrations(registrations)) return false;
    registrationsCache = clone(registrations);
    return write(KEYS.registrations, registrationsCache);
  }

  function loadUI() {
    uiCache = read(KEYS.ui, function (value) {
      return value && (value.theme === undefined || value.theme === 'light' || value.theme === 'dark');
    }, { theme: 'light' }, function (old) {
      return old && typeof old === 'object' ? { theme: old.theme === 'dark' ? 'dark' : 'light' } : null;
    });
    if (!uiCache.theme) uiCache.theme = 'light';
    return uiCache;
  }

  function getTheme() {
    return loadUI().theme;
  }

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return false;
    var ui = loadUI();
    ui.theme = theme;
    uiCache = ui;
    return write(KEYS.ui, uiCache);
  }

  App.eventsStore = {
    keys: KEYS,
    getEvents: getEvents,
    getEventById: getEventById,
    setEvents: setEvents,
    getSaved: getSaved,
    toggleSaved: toggleSaved,
    getSelection: getSelection,
    setSelection: setSelection,
    getRegistrations: getRegistrations,
    setRegistrations: setRegistrations,
    getTheme: getTheme,
    setTheme: setTheme
  };
})();
