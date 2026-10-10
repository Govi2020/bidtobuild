/* =========================================================
   data.js — one source of seeded events and UI categories.
   ========================================================= */
(function () {
  'use strict';
  var App = (window.App = window.App || {});

  var FEST = {
    name: "PRISM '26",
    tagline: 'Break into color.',
    startsAt: '2026-11-20T10:00:00+05:30',
    endsAt: '2026-11-22T22:00:00+05:30',
    venue: 'Main Campus, Blocks A-C'
  };

  var CATEGORIES = {
    all: { id: 'all', label: 'All events', c1: '#171717', c2: '#454545', icon: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' },
    music: { id: 'music', label: 'Music', c1: '#ed2f9c', c2: '#f4a536', icon: '<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="16.5" cy="16" r="2.5" fill="currentColor"/></svg>' },
    talks: { id: 'talks', label: 'Talks', c1: '#4354ed', c2: '#171717', icon: '<svg viewBox="0 0 24 24"><path d="M4 5.5h16v11H9l-5 3v-14Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' },
    workshops: { id: 'workshops', label: 'Workshops', c1: '#f4a536', c2: '#ed2f9c', icon: '<svg viewBox="0 0 24 24"><path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7 7.3 20l5.2-5.2a4 4 0 0 0 5-5.3l-2.6 2.6-2.1-.5-.5-2.1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>' }
  };

  var EVENTS = [
    {
      id: 'evt-after-hours', name: 'After Hours Sessions', category: 'music',
      date: 'Friday 20 November 2026', dateBadge: 'FRI 20 NOV', isoDate: '2026-11-20T18:00:00+05:30', time: '18:00 – 21:00', venue: 'Warehouse Hall', address: 'Harbour Road, Kowloon',
      description: 'An intimate evening of sound and atmosphere as boundary-pushing artists come together for live sets and improvisations. Deep listening, immersive visuals, and the best energy to close your week.',
      schedule: [{ time: '18:00', title: 'Doors open' }, { time: '18:30', title: 'Ambient set · Lumen Drift' }, { time: '19:15', title: 'Live set · Northline' }, { time: '20:15', title: 'Improvisation · Special guest' }, { time: '21:00', title: 'Event ends' }],
      price: 180, capacity: 240, seatsLeft: 86, featured: true, image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a live concert and audience'
    },
    {
      id: 'evt-voices', name: 'Voices in Focus', category: 'talks',
      date: 'Saturday 21 November 2026', dateBadge: 'SAT 21 NOV', isoDate: '2026-11-21T19:00:00+05:30', time: '19:00 – 20:30', venue: 'Civic Studio', address: 'Arts Block, Level 2',
      description: 'A thoughtful evening of short talks and open conversation with artists, organizers and makers shaping what comes next.',
      schedule: [{ time: '19:00', title: 'Welcome and introductions' }, { time: '19:15', title: 'Three voices · short talks' }, { time: '20:00', title: 'Audience conversation' }, { time: '20:30', title: 'Event ends' }],
      price: 180, capacity: 120, seatsLeft: 31, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a speaker at a community event'
    },
    {
      id: 'evt-clay-calm', name: 'Clay & Calm Workshop', category: 'workshops',
      date: 'Friday 20 November 2026', dateBadge: 'FRI 20 NOV', isoDate: '2026-11-20T16:00:00+05:30', time: '16:00 – 18:30', venue: 'Maker Loft', address: 'Design Block, Ground Floor',
      description: 'Slow down, get your hands in the clay and make a small piece to take home. All materials and friendly guidance are included.',
      schedule: [{ time: '16:00', title: 'Welcome and materials' }, { time: '16:15', title: 'Shape and explore' }, { time: '17:45', title: 'Finishing touches' }, { time: '18:30', title: 'Workshop ends' }],
      price: 180, capacity: 32, seatsLeft: 11, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a handmade ceramic piece'
    },
    {
      id: 'evt-midnight', name: 'Midnight Improvisations', category: 'music',
      date: 'Saturday 21 November 2026', dateBadge: 'SAT 21 NOV', isoDate: '2026-11-21T21:00:00+05:30', time: '21:00 – 23:30', venue: 'The Listening Room', address: 'West Wing, Room 04',
      description: 'A close-up set of spontaneous collaborations, warm instruments and unexpected turns. Come curious and stay for the last note.',
      schedule: [{ time: '21:00', title: 'Doors open' }, { time: '21:20', title: 'Opening improvisation' }, { time: '22:00', title: 'Ensemble set' }, { time: '23:30', title: 'Event ends' }],
      price: 180, capacity: 90, seatsLeft: 6, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a live music set'
    },
    {
      id: 'evt-dreamscape', name: 'Electronic Dreamscape', category: 'music',
      date: 'Friday 20 November 2026', dateBadge: 'FRI 20 NOV', isoDate: '2026-11-20T20:00:00+05:30', time: '20:00 – 22:30', venue: 'Grid Space', address: 'Innovation Block, Courtyard',
      description: 'A late-evening journey through live electronic sets, light and moving image, curated by the students who make the scene.',
      schedule: [{ time: '20:00', title: 'Doors open' }, { time: '20:30', title: 'Modular landscapes' }, { time: '21:15', title: 'Live set · Mira Sol' }, { time: '22:30', title: 'Event ends' }],
      price: 180, capacity: 180, seatsLeft: 73, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of an illuminated dance floor'
    },
    {
      id: 'evt-designing', name: 'Designing Tomorrow', category: 'talks',
      date: 'Saturday 21 November 2026', dateBadge: 'SAT 21 NOV', isoDate: '2026-11-21T14:00:00+05:30', time: '14:00 – 16:00', venue: 'Form Studio', address: 'Design Block, Level 1',
      description: 'A practical conversation about more thoughtful products, materials and public spaces, with time to sketch your own idea.',
      schedule: [{ time: '14:00', title: 'Welcome' }, { time: '14:15', title: 'Designing for what is next' }, { time: '15:00', title: 'Open conversation' }, { time: '16:00', title: 'Event ends' }],
      price: 180, capacity: 80, seatsLeft: 25, image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a bright creative studio'
    },
    {
      id: 'evt-movement', name: 'Movement Lab', category: 'workshops',
      date: 'Sunday 22 November 2026', dateBadge: 'SUN 22 NOV', isoDate: '2026-11-22T17:00:00+05:30', time: '17:00 – 19:00', venue: 'Motion House', address: 'Sports Block, Studio B',
      description: 'An open movement session that blends contemporary dance, improvisation and playful ways to use space. All levels welcome.',
      schedule: [{ time: '17:00', title: 'Arrive and warm up' }, { time: '17:20', title: 'Guided movement' }, { time: '18:10', title: 'Open lab' }, { time: '19:00', title: 'Workshop ends' }],
      price: 180, capacity: 40, seatsLeft: 17, image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of performers in motion'
    },
    {
      id: 'evt-open-studio', name: 'Open Studio: Print & Play', category: 'workshops',
      date: 'Sunday 22 November 2026', dateBadge: 'SUN 22 NOV', isoDate: '2026-11-22T11:00:00+05:30', time: '11:00 – 13:00', venue: 'Print Room', address: 'Arts Block, Ground Floor',
      description: 'Make a small-run poster using bold type, simple shapes and shared printmaking tools. Leave with your own edition.',
      schedule: [{ time: '11:00', title: 'Choose a prompt' }, { time: '11:20', title: 'Make your print' }, { time: '12:30', title: 'Share the editions' }, { time: '13:00', title: 'Workshop ends' }],
      price: 180, capacity: 24, seatsLeft: 8, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a sketchbook and creative tools'
    },
    {
      id: 'evt-open-mic', name: 'Open Mic Afterglow', category: 'music',
      date: 'Sunday 22 November 2026', dateBadge: 'SUN 22 NOV', isoDate: '2026-11-22T20:00:00+05:30', time: '20:00 – 22:00', venue: 'The Courtyard', address: 'Central Campus, South Lawn',
      description: 'A welcoming final-night gathering for songs, spoken word and surprise collaborations from across the festival.',
      schedule: [{ time: '20:00', title: 'Sign-ups close' }, { time: '20:15', title: 'First performances' }, { time: '21:15', title: 'Guest set' }, { time: '22:00', title: 'Festival finale' }],
      price: 180, capacity: 150, seatsLeft: 64, image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1100&q=82', imageAlt: 'Placeholder photo of a festival crowd at night'
    }
  ];

  function getCategory(id) { return CATEGORIES[id] || CATEGORIES.all; }
  function findEvent(id) {
    for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i];
    return null;
  }
  App.data = { FEST: FEST, CATEGORIES: CATEGORIES, EVENTS: EVENTS, getCategory: getCategory, findEvent: findEvent };
})();
