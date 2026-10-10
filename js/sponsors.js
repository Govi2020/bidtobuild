/* Renders the sponsor marquee from js/sponsors-data.js. */
(function () {
  'use strict';

  var sponsors = (window.App && window.App.sponsorData) || [];
  var track = document.getElementById('sponsors-track');
  if (!track || !sponsors.length) return;

  function createSponsorItem(sponsor) {
    var item = document.createElement('li');
    item.className = 'sponsor-item';

    var mark;
    if (sponsor.logoPath) {
      mark = document.createElement('img');
      mark.className = 'sponsor-logo-image';
      mark.src = sponsor.logoPath;
      mark.alt = sponsor.description || (sponsor.name + ' logo');
      mark.decoding = 'async';
      mark.width = 180;
      mark.height = 64;
    } else {
      mark = document.createElement('span');
      mark.className = 'sponsor-wordmark sponsor-wordmark--' + (sponsor.style || 'wide');
      mark.textContent = sponsor.logoText || sponsor.name;
      mark.setAttribute('role', 'img');
      mark.setAttribute('aria-label', sponsor.description || (sponsor.name + ' logo placeholder'));
    }

    if (/^https:\/\//i.test(sponsor.href || '')) {
      var link = document.createElement('a');
      link.className = 'sponsor-link';
      link.href = sponsor.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Visit ' + sponsor.name + ' website');
      link.appendChild(mark);
      item.appendChild(link);
    } else {
      item.appendChild(mark);
    }

    return item;
  }

  function createLogoGroup() {
    var group = document.createElement('ul');
    group.className = 'sponsors-group';
    group.setAttribute('role', 'list');
    sponsors.forEach(function (sponsor) {
      group.appendChild(createSponsorItem(sponsor));
    });
    return group;
  }

  var firstGroup = createLogoGroup();
  var repeatedGroup = createLogoGroup();
  repeatedGroup.setAttribute('aria-hidden', 'true');
  repeatedGroup.setAttribute('inert', '');
  repeatedGroup.querySelectorAll('a').forEach(function (link) {
    link.tabIndex = -1;
  });

  track.appendChild(firstGroup);
  track.appendChild(repeatedGroup);
})();
