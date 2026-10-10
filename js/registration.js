/* =========================================================
   registration.js — form validation, seat rules, success.
   Owns the registration dialog's business logic.
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});

  var els = {};
  var currentEventId = null;
  var currentQuantity = 1;

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

  function setFlowStep(step) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-flow-step]'), function (item) {
      var current = item.dataset.flowStep === step;
      item.classList.toggle('is-current', current);
      item.classList.toggle('is-complete', item.dataset.flowStep === 'event' && step !== 'event' || item.dataset.flowStep === 'tickets' && step === 'details');
      if (current) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  function updateQuantity() {
    var event = App.state.findEvent(currentEventId);
    if (!event) return;
    var max = Math.max(1, event.seatsLeft);
    currentQuantity = Math.max(1, Math.min(currentQuantity, max));
    els.quantity.textContent = currentQuantity;
    els.seatTotal.textContent = currentQuantity;
    els.quantityDecrease.disabled = currentQuantity <= 1;
    els.quantityIncrease.disabled = currentQuantity >= max;
  }

  function showEventDetails(eventId) {
    var event = App.state.findEvent(eventId);
    if (!event) return;
    currentEventId = eventId;
    currentQuantity = 1;

    var cat = App.data.getCategory(event.category);
    els.eventIcon.style.setProperty('--c1', cat.c1);
    els.eventIcon.style.setProperty('--c2', cat.c2);
    els.eventIcon.innerHTML = cat.icon;
    els.eventName.textContent = event.name;
    els.eventMeta.textContent = event.date + ' \u00b7 ' + event.time + ' \u00b7 ' + event.venue;

    els.flowCategory.textContent = cat.label;
    els.flowArt.style.setProperty('--c1', cat.c1);
    els.flowArt.style.setProperty('--c2', cat.c2);
    els.flowArt.innerHTML = cat.icon;
    els.flowTitle.textContent = event.name;
    els.flowDescription.textContent = event.description;
    els.flowMeta.innerHTML = '<li><span>Date</span><strong>' + escapeHtml(event.date) + '</strong></li>' +
      '<li><span>Time</span><strong>' + escapeHtml(event.time) + '</strong></li>' +
      '<li><span>Location</span><strong>' + escapeHtml(event.venue) + '</strong></li>';
    els.detailCapacity.textContent = event.seatsLeft > 0 ? event.seatsLeft + (event.seatsLeft === 1 ? ' seat remaining' : ' seats remaining') : 'This event is full';
    els.chooseTickets.disabled = event.seatsLeft <= 0;
    els.chooseTickets.textContent = event.seatsLeft <= 0 ? 'Event full' : 'Choose tickets →';
    els.detailStep.hidden = false;
    els.ticketStep.hidden = true;
    setFlowStep('event');
    App.ui.openDialog(els.flowDialog);
  }

  function showTicketReview() {
    var event = App.state.findEvent(currentEventId);
    if (!event) return;
    if (event.seatsLeft <= 0) {
      els.detailCapacity.textContent = 'This event is full';
      return;
    }
    var cat = App.data.getCategory(event.category);
    els.ticketIcon.style.setProperty('--c1', cat.c1);
    els.ticketIcon.style.setProperty('--c2', cat.c2);
    els.ticketIcon.innerHTML = cat.icon;
    els.ticketName.textContent = event.name;
    els.ticketMeta.textContent = event.date + ' · ' + event.time;
    els.detailStep.hidden = true;
    els.ticketStep.hidden = false;
    setFlowStep('tickets');
    updateQuantity();
    els.backToEvent.focus();
  }

  function openRegistration() {
    var event = App.state.findEvent(currentEventId);
    if (!event) return;

    if (event.seatsLeft <= 0) {
      els.seatsNote.textContent = 'This event is full. You cannot register right now.';
      els.submit.disabled = true;
    } else {
      els.seatsNote.textContent = currentQuantity + (currentQuantity === 1 ? ' attendee' : ' attendees') + ' · ' + event.seatsLeft + ' seats currently available.';
      els.submit.disabled = false;
    }

    resetForm();
    setFlowStep('details');
    App.ui.closeDialog(els.flowDialog);
    window.setTimeout(function () {
      App.ui.openDialog(els.dialog);
      window.setTimeout(function () { els.name.focus(); }, 60);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 230);
  }

  function backToTickets() {
    App.ui.closeDialog(els.dialog);
    window.setTimeout(function () {
      els.detailStep.hidden = true;
      els.ticketStep.hidden = false;
      setFlowStep('tickets');
      updateQuantity();
      App.ui.openDialog(els.flowDialog);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 230);
  }

  function handleSubmit(e) {
    e.preventDefault();
    var event = App.state.findEvent(currentEventId);
    if (!event) return;

    if (event.seatsLeft < currentQuantity) {
      els.seatsNote.textContent = event.seatsLeft <= 0 ? 'Sorry — this event just filled up.' : 'Only ' + event.seatsLeft + ' seats remain. Go back and update your selection.';
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
    event.seatsLeft = Math.max(0, event.seatsLeft - currentQuantity);
    var registration = {
      eventId: event.id,
      name: name,
      email: email,
      phone: phone,
      quantity: currentQuantity,
      at: Date.now()
    };
    App.state.registrations.push(registration);

    App.events.refreshCard(event.id, true);
    App.ui.closeDialog(els.dialog);
    App.ui.showSuccess(registration, event);
  }

  function init(options) {
    els.dialog = options.dialog;
    els.flowDialog = options.flowDialog;
    els.flowCategory = options.flowCategory;
    els.flowArt = options.flowArt;
    els.flowTitle = options.flowTitle;
    els.flowMeta = options.flowMeta;
    els.flowDescription = options.flowDescription;
    els.detailCapacity = options.detailCapacity;
    els.detailStep = options.detailStep;
    els.ticketStep = options.ticketStep;
    els.chooseTickets = options.chooseTickets;
    els.ticketIcon = options.ticketIcon;
    els.ticketName = options.ticketName;
    els.ticketMeta = options.ticketMeta;
    els.quantity = options.quantity;
    els.seatTotal = options.seatTotal;
    els.quantityDecrease = options.quantityDecrease;
    els.quantityIncrease = options.quantityIncrease;
    els.backToEvent = options.backToEvent;
    els.continueDetails = options.continueDetails;
    els.backToTickets = options.backToTickets;
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
    els.chooseTickets.addEventListener('click', showTicketReview);
    els.backToEvent.addEventListener('click', function () {
      els.ticketStep.hidden = true;
      els.detailStep.hidden = false;
      setFlowStep('event');
      els.chooseTickets.focus();
    });
    els.quantityDecrease.addEventListener('click', function () { currentQuantity -= 1; updateQuantity(); });
    els.quantityIncrease.addEventListener('click', function () { currentQuantity += 1; updateQuantity(); });
    els.continueDetails.addEventListener('click', openRegistration);
    els.backToTickets.addEventListener('click', backToTickets);

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
    open: showEventDetails
  };
})();
