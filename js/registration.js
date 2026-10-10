(function () {
  'use strict';
  var App = (window.App = window.App || {}), els = {}, currentEventId = null, currentQuantity = 1;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var fields = [
    { input:'name', field:'fieldName', err:'errName', validate:function(v){ return !v.trim() ? 'Please enter your full name.' : v.trim().length < 2 ? 'That name looks a little short.' : ''; } },
    { input:'email', field:'fieldEmail', err:'errEmail', validate:function(v){ return !v.trim() ? 'Please enter your email address.' : !EMAIL_RE.test(v.trim()) ? 'Enter a valid email, e.g. you@campus.in.' : ''; } },
    { input:'phone', field:'fieldPhone', err:'errPhone', validate:function(v){ var c=v.trim().replace(/[\s().-]/g,''); var n=(c.match(/\d/g)||[]).length; return !c ? 'Please enter your phone number.' : !/^\+?\d+$/.test(c) ? 'Use digits only, with an optional leading +.' : n < 7 ? 'That number looks too short.' : n > 15 ? 'That number looks too long.' : ''; } }
  ];
  function setField(f) { var error=f.validate(els[f.input].value); els[f.err].textContent=error; els[f.field].classList.toggle('has-error',!!error); els[f.field].classList.toggle('is-valid',!error && !!els[f.input].value.trim()); if(error) els[f.input].setAttribute('aria-invalid','true'); else els[f.input].removeAttribute('aria-invalid'); return !error; }
  function resetForm(){ els.form.reset(); fields.forEach(function(f){ els[f.err].textContent=''; els[f.field].classList.remove('has-error','is-valid'); els[f.input].removeAttribute('aria-invalid'); }); }
  function open(eventId, quantity) {
    var event=App.state.findEvent(eventId); if(!event) return;
    if(App.state.registrations.some(function(r){return r.eventId===eventId;})) return;
    currentEventId=eventId; currentQuantity=Math.max(1,Number(quantity)||1);
    els.eventIcon.textContent=App.data.getCategory(event.category).label.slice(0,1);
    els.eventName.textContent=event.name; els.eventMeta.textContent=event.date+' · '+event.time+' · '+event.venue;
    els.seatsNote.textContent=event.seatsLeft+' seats currently available. This demo stores your registration only in this browser.';
    els.submit.disabled=event.seatsLeft < currentQuantity; resetForm(); App.ui.openDialog(els.dialog); window.setTimeout(function(){els.name.focus();},60);
  }
  function submit(e) {
    e.preventDefault(); var event=App.state.findEvent(currentEventId); if(!event) return;
    if(App.state.registrations.some(function(r){return r.eventId===event.id;})){ App.ui.closeDialog(els.dialog); App.events.refreshCard(); return; }
    if(event.seatsLeft < currentQuantity){ els.seatsNote.textContent='Only '+event.seatsLeft+' seats remain. Go back and update your ticket quantity.'; els.submit.disabled=true; return; }
    var first=null; fields.forEach(function(f){ if(!setField(f)&&!first) first=els[f.input]; }); if(first){first.focus();return;}
    event.seatsLeft=Math.max(0,event.seatsLeft-currentQuantity);
    var registration={eventId:event.id,name:els.name.value.trim(),email:els.email.value.trim(),phone:els.phone.value.trim(),quantity:currentQuantity,at:Date.now()};
    App.state.registrations.push(registration); App.eventsStore.setEvents(App.state.events); App.eventsStore.setRegistrations(App.state.registrations);
    App.ui.closeDialog(els.dialog); App.events.refreshCard(); App.ui.showSuccess(registration,event);
  }
  function init(o) {
    els={dialog:o.dialog,form:o.form,eventIcon:o.eventIcon,eventName:o.eventName,eventMeta:o.eventMeta,seatsNote:o.seatsNote,submit:o.submit,name:o.name,email:o.email,phone:o.phone,fieldName:o.fieldName,fieldEmail:o.fieldEmail,fieldPhone:o.fieldPhone,errName:o.errName,errEmail:o.errEmail,errPhone:o.errPhone};
    els.form.addEventListener('submit',submit);
    fields.forEach(function(f){ els[f.input].addEventListener('input',function(){if(els[f.field].classList.contains('has-error'))setField(f);}); els[f.input].addEventListener('blur',function(){if(els[f.input].value.trim())setField(f);}); });
  }
  App.registration={init:init,open:open};
})();
