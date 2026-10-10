/* =========================================================
   data.js — single source of truth for the fest.
   Event objects, category metadata and the fest definition.
   ========================================================= */
(function () {
  'use strict';

  var App = (window.App = window.App || {});

  /* Fest identity + countdown target (local demo date). */
  var FEST = {
    name: "PRISM '26",
    tagline: 'Break into color.',
    startsAt: '2026-11-20T10:00:00+05:30',
    endsAt: '2026-11-22T22:00:00+05:30',
    venue: 'Main Campus, Blocks A-C'
  };

  /* Category metadata drives chips, card bands and badges.
     c1/c2 are the gradient stops taken from the brand palette. */
  var CATEGORIES = {
    all: { id: 'all', label: 'All', c1: '#45497A', c2: '#2E3159', icon: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' },

    technical: {
      id: 'technical', label: 'Technical', c1: '#45497A', c2: '#2E3159',
      icon: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
    },
    gaming: {
      id: 'gaming', label: 'Gaming', c1: '#E63946', c2: '#E07A8D',
      icon: '<svg viewBox="0 0 24 24"><rect x="2.5" y="7" width="19" height="10" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7 10v4M5 12h4M15.6 11.1h.01M18 13.4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    music: {
      id: 'music', label: 'Music', c1: '#E07A8D', c2: '#F4A261',
      icon: '<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="16.5" cy="16" r="2.5" fill="currentColor"/></svg>'
    },
    dance: {
      id: 'dance', label: 'Dance', c1: '#F4A261', c2: '#E63946',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2" fill="currentColor"/><path d="M12 8v6l-3 7M12 14l3 7M7 11l5-1 5 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    workshop: {
      id: 'workshop', label: 'Workshop', c1: '#6B7B6A', c2: '#45497A',
      icon: '<svg viewBox="0 0 24 24"><path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7 7.3 20l5.2-5.2a4 4 0 0 0 5-5.3l-2.6 2.6-2.1-.5-.5-2.1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
    },
    cultural: {
      id: 'cultural', label: 'Cultural', c1: '#E07A8D', c2: '#45497A',
      icon: '<svg viewBox="0 0 24 24"><path d="M4 5h16v6a8 8 0 0 1-16 0z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.6 10.6h.01M15.4 10.6h.01" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M8 15c1.2 1.5 6.8 1.5 8 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
    },
    sports: {
      id: 'sports', label: 'Sports', c1: '#45497A', c2: '#6B7B6A',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v18M3 12h18M6 5.5c3 3 3 10 0 13M18 5.5c-3 3-3 10 0 13" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
    }
  };

  /* Nine events across seven tracks. `capacity` is fixed; `seatsLeft`
     is the mutable initial state used by the prototype. */
  var EVENTS = [
    {
      id: 'evt-hacksphere',
      name: 'HackSphere',
      category: 'technical',
      date: 'Nov 20, 2026',
      isoDate: '2026-11-20T09:00:00',
      time: '9:00 AM – 9:00 AM (+1 day)',
      venue: 'Innovation Lab, Block C',
      description: 'A 24-hour build marathon. Ship a working prototype against an open campus-brief, with mentors on the floor all night.',
      capacity: 120,
      seatsLeft: 34,
      featured: true
    },
    {
      id: 'evt-codesprint',
      name: 'CodeSprint',
      category: 'technical',
      date: 'Nov 20, 2026',
      isoDate: '2026-11-20T11:30:00',
      time: '11:30 AM – 2:00 PM',
      venue: 'CS Lab 2, Block A',
      description: 'Three rounds of timed algorithmic puzzles. Fastest correct submissions climb the live leaderboard.',
      capacity: 80,
      seatsLeft: 3
    },
    {
      id: 'evt-pixel',
      name: 'Pixel Playoffs',
      category: 'gaming',
      date: 'Nov 21, 2026',
      isoDate: '2026-11-21T13:00:00',
      time: '1:00 PM – 8:00 PM',
      venue: 'Esports Arena, Block B',
      description: 'Squad-up esports finals across Battle Royale and a tactical FPS bracket. Big screens, bigger trash talk.',
      capacity: 64,
      seatsLeft: 0
    },
    {
      id: 'evt-stageflux',
      name: 'StageFlux',
      category: 'music',
      date: 'Nov 21, 2026',
      isoDate: '2026-11-21T17:00:00',
      time: '5:00 PM – 10:00 PM',
      venue: 'Open-Air Amphitheatre',
      description: 'Battle of the bands followed by a headline DJ set. Bring the noise; the campus is your crowd.',
      capacity: 300,
      seatsLeft: 187
    },
    {
      id: 'evt-groove',
      name: 'Groove Yard',
      category: 'dance',
      date: 'Nov 22, 2026',
      isoDate: '2026-11-22T15:00:00',
      time: '3:00 PM – 6:00 PM',
      venue: 'Studio Hall, Block D',
      description: 'Open-floor dance battles — hip-hop, contemporary and freestyle. Solo entries and crew throwdowns welcome.',
      capacity: 150,
      seatsLeft: 42
    },
    {
      id: 'evt-forge',
      name: 'Futurist Forge',
      category: 'workshop',
      date: 'Nov 20, 2026',
      isoDate: '2026-11-20T14:00:00',
      time: '2:00 PM – 5:00 PM',
      venue: 'Robotics Bay, Block C',
      description: 'Hands-on lab on applied AI and hobby robotics. Build a tiny autonomous bot you can keep.',
      capacity: 60,
      seatsLeft: 9
    },
    {
      id: 'evt-craft',
      name: 'Craft Carnival',
      category: 'cultural',
      date: 'Nov 21, 2026',
      isoDate: '2026-11-21T10:00:00',
      time: '10:00 AM – 4:00 PM',
      venue: 'Central Lawn',
      description: 'A colourful mela of handmade crafts, rangoli, live sketching and street-food stalls run by student clubs.',
      capacity: 200,
      seatsLeft: 121
    },
    {
      id: 'evt-thunder',
      name: 'Thunder Court',
      category: 'sports',
      date: 'Nov 22, 2026',
      isoDate: '2026-11-22T09:00:00',
      time: '9:00 AM – 12:00 PM',
      venue: 'Indoor Courts, Sports Complex',
      description: '3v3 knockout basketball under lights. Snappy games, loud crowds, one champion court.',
      capacity: 48,
      seatsLeft: 2
    },
    {
      id: 'evt-wordwars',
      name: 'Word Wars',
      category: 'cultural',
      date: 'Nov 22, 2026',
      isoDate: '2026-11-22T11:00:00',
      time: '11:00 AM – 2:00 PM',
      venue: 'Seminar Hall, Block A',
      description: 'A debate and rapid-fire quiz in one marathon session. Sharpen the tongue, defend the motion.',
      capacity: 90,
      seatsLeft: 55
    }
  ];

  function getCategory(id) {
    return CATEGORIES[id] || CATEGORIES.all;
  }

  function findEvent(id) {
    for (var i = 0; i < EVENTS.length; i++) {
      if (EVENTS[i].id === id) return EVENTS[i];
    }
    return null;
  }

  App.data = {
    FEST: FEST,
    CATEGORIES: CATEGORIES,
    EVENTS: EVENTS,
    getCategory: getCategory,
    findEvent: findEvent
  };
})();
