/* =========================================================
   registration.js — form validation, seat rules, success.
   Owns the registration dialog's business logic.
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});

  var els = {};
  var currentEventId = null;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,}$/;

  function digitsCount(value) {
    return (value.match(/\d/g) || []).length;
  }

  /* Returns an error string, or '' when valid. */
  function validateName(value) {
    var v = value.trim();
    if (!v) return 'Please enter your full name.';
    if (v.length < 2) return 'That name looks a little short.';
    if (!NAME_RE.test(v)) return 'Use letters, spaces, apostrophes or hyphens only.';
    return '';
  }

  function validateEmail(value) {
    var v = value.trim();
    if (!v) return 'Please enter your email address.';
    if (!EMAIL_RE.test(v)) return 'Enter a valid email, e.g. you@campus.in.';
    return '';
  }

  function validatePhone(value) {
    var v = value.trim();
    if (!v) return 'Please enter your phone number.';
    var cleaned = v.replace(/[\s().-]/g, '');
    if (!/^\+?\d+$/.test(cleaned)) return 'Use digits only, with an optional leading +.';
    var count = digitsCount(cleaned);
    if (count < 7) return 'That number looks too short.';
    if (count > 15) return 'That number looks too long.';
    return '';
  }

  var fields = [
    { input: 'name', field: 'fieldName', err: 'errName', validate: validateName },
    { input: 'email', field: 'fieldEmail', err: 'errEmail', validate: validateEmail },
    { input: 'phone', field: 'fieldPhone', err: 'errPhone', validate: validatePhone }
  ];

  function setFieldState(f, message) {
    var fieldEl = els[f.field];
    var inputEl = els[f.input];
    var errEl = els[f.err];

    errEl.textContent = message;
    if (message) {
      fieldEl.classList.add('has-error');
      fieldEl.classList.remove('is-valid');
      inputEl.setAttribute('aria-invalid', 'true');
    } else {
      fieldEl.classList.remove('has-error');
      fieldEl.classList.add('is-valid');
      inputEl.removeAttribute('aria-invalid');
    }
  }

  function resetField(f) {
    els[f.field].classList.remove('has-error', 'is-valid');
    els[f.err].textContent = '';
    els[f.input].removeAttribute('aria-invalid');
  }

  function validateField(f) {
    var message = f.validate(els[f.input].value);
    setFieldState(f, message);
    return message === '';
  }

  function validateAll() {
    var firstInvalid = null;
    fields.forEach(function (f) {
      var ok = validateField(f);
      if (!ok && !firstInvalid) firstInvalid = els[f.input];
    });
    return firstInvalid;
  }

  function resetForm() {
    els.form.reset();
    fields.forEach(resetField);
  }

  function open(eventId) {
    var event = App.state.findEvent(eventId);
    if (!event) return;
    currentEventId = eventId;

    var cat = App.data.getCategory(event.category);
    els.eventIcon.style.setProperty('--c1', cat.c1);
    els.eventIcon.style.setProperty('--c2', cat.c2);
    els.eventIcon.innerHTML = cat.icon;
    els.eventName.textContent = event.name;
    els.eventMeta.textContent = event.date + ' \u00b7 ' + event.time + ' \u00b7 ' + event.venue;

    if (event.seatsLeft <= 0) {
      els.seatsNote.textContent = 'This event is full. You cannot register right now.';
      els.submit.disabled = true;
    } else {
      els.seatsNote.textContent = event.seatsLeft + ' of ' + event.capacity + ' seats remaining. Reserve yours now.';
      els.submit.disabled = false;
    }

    resetForm();
    App.ui.openDialog(els.dialog);
    window.setTimeout(function () { els.name.focus(); }, 60);
  }

  function handleSubmit(e) {
    e.preventDefault();
    var event = App.state.findEvent(currentEventId);
    if (!event) return;

    if (event.seatsLeft <= 0) {
      els.seatsNote.textContent = 'Sorry — the last seat just went. This event is full.';
      els.submit.disabled = true;
      App.events.refreshCard(event.id, true);
      return;
    }

    var firstInvalid = validateAll();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var name = els.name.value.trim();
    var email = els.email.value.trim();
    var phone = els.phone.value.trim();

    /* Mutate state first, then sync every dependent surface. */
    event.seatsLeft = Math.max(0, event.seatsLeft - 1);
    var registration = {
      eventId: event.id,
      name: name,
      email: email,
      phone: phone,
      at: Date.now()
    };
    App.state.registrations.push(registration);

    App.events.refreshCard(event.id, true);
    App.ui.closeDialog(els.dialog);
    App.ui.showSuccess(registration, event);
  }

  function init(options) {
    els.dialog = options.dialog;
    els.form = options.form;
    els.eventIcon = options.eventIcon;
    els.eventName = options.eventName;
    els.eventMeta = options.eventMeta;
    els.seatsNote = options.seatsNote;
    els.submit = options.submit;

    els.name = options.name;
    els.email = options.email;
    els.phone = options.phone;
    els.fieldName = options.fieldName;
    els.fieldEmail = options.fieldEmail;
    els.fieldPhone = options.fieldPhone;
    els.errName = options.errName;
    els.errEmail = options.errEmail;
    els.errPhone = options.errPhone;

    els.form.addEventListener('submit', handleSubmit);

    /* Live feedback: clear an error as soon as the field becomes valid,
       and only re-flag a touched field once it had an error. */
    fields.forEach(function (f) {
      els[f.input].addEventListener('input', function () {
        if (els[f.field].classList.contains('has-error')) {
          validateField(f);
        }
      });
      els[f.input].addEventListener('blur', function () {
        if (els[f.input].value.trim()) validateField(f);
      });
    });
  }

  App.registration = {
    init: init,
    open: open
  };
})();
