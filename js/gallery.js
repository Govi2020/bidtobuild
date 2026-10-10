/* PRISM gallery loop; replace these photo URLs with approved fest photography. */
(function () {
  'use strict';

  var moments = [
    { title: 'Lights up, volume up', category: 'Music', image: 'photo-1506157786151-b8491531f063', alt: 'Placeholder concert crowd beneath stage lights' },
    { title: 'Ideas take shape', category: 'Workshops', image: 'photo-1521737711867-e3b97375f902', alt: 'Placeholder image of people collaborating around a table' },
    { title: 'Made to be seen', category: 'Culture', image: 'photo-1523381210434-271e8be1f52b', alt: 'Placeholder clothing and design display' },
    { title: 'Meet us center stage', category: 'Community', image: 'photo-1516280440614-37939bbacd81', alt: 'Placeholder live performer on stage' },
    { title: 'Build something bright', category: 'Technology', image: 'photo-1519389950473-47ba0277781c', alt: 'Placeholder student team working on a project' },
    { title: 'Move with the moment', category: 'Dance', image: 'photo-1504609813442-a8924e83f76e', alt: 'Placeholder audience at a live event' }
  ];

  var track = document.getElementById('gallery-track');
  var toggle = document.getElementById('gallery-toggle');
  if (!track) return;

  function createSet(isDuplicate) {
    var set = document.createElement('div');
    set.className = 'gallery-set';
    set.setAttribute('role', 'list');
    if (isDuplicate) {
      set.setAttribute('aria-hidden', 'true');
      set.setAttribute('inert', '');
    }

    moments.forEach(function (moment, index) {
      var card = document.createElement('figure');
      card.className = 'gallery-card';
      card.setAttribute('role', 'listitem');
      card.style.setProperty('--card-tilt', (index % 2 ? 5 : -6) + 'deg');
      card.style.setProperty('--card-lift', (index % 3 - 1) * 12 + 'px');

      var image = document.createElement('img');
      image.src = 'https://images.unsplash.com/' + moment.image + '?auto=format&fit=crop&w=720&q=78';
      image.alt = isDuplicate ? '' : moment.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', function () {
        card.classList.add('is-placeholder');
        image.remove();
      }, { once: true });

      var caption = document.createElement('figcaption');
      caption.className = 'gallery-card-caption';
      var category = document.createElement('span');
      category.className = 'gallery-card-category';
      category.textContent = moment.category;
      var title = document.createElement('strong');
      title.textContent = moment.title;
      caption.appendChild(category);
      caption.appendChild(title);
      card.appendChild(image);
      card.appendChild(caption);
      set.appendChild(card);
    });
    return set;
  }

  track.appendChild(createSet(false));
  track.appendChild(createSet(true));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var paused = track.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' gallery animation');
      toggle.textContent = paused ? 'Play gallery' : 'Pause gallery';
    });
  }
})();
