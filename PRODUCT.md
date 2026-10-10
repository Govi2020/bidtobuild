# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

College students attending a campus festival. They need to see which events are available, find events they like, and register for them.

## Product Purpose

The Campus Event Hub is a Bit2Build competition prototype for browsing and registering for PRISM '26 campus fest events. Success means students can discover events, check remaining seats, submit a valid registration, and see a clear confirmation.

## Positioning

A single campus-fest page brings event listings, category filtering, event-name search, seat availability, and registration together. No broader market differentiation has been established; this is a competition prototype rather than a live ticketing service.

## Operating Context

The site is evaluated as a web prototype for a college festival. It uses dummy event data. Registrations are stored only in the visitor's browser and do not reach fest organizers or reserve seats in a shared system.

## Capabilities and Constraints

- Show at least six events with name, category, date, time, venue, and a short description.
- Filter events by category, including an All option, and search by event name.
- Show seats remaining and identify events as Full when capacity is exhausted.
- Collect a student's name, email, and phone number with validation and clear field errors; show a success confirmation naming the student and event.
- The current implementation is static HTML, CSS, and vanilla JavaScript in separate files. It has no production backend; registrations persist locally in the visitor's browser only.
- Support mobile, tablet, and desktop layouts without horizontal scrolling; keep forms and dialogs usable on small screens.
- Do not present dummy event details or browser-local registration state as live event operations.

## Brand Commitments

- Festival identity in the current project: PRISM '26, part of Bit2Build.
- Current tagline: “Break into color.”

## Evidence on Hand

- Nine seeded sample event records in `js/data.js`; these are prototype data, not verified event listings.
- Existing PRISM wordmark and favicon assets in `index.html` and `assets/images/favicon.svg`.
- The current footer does not contain confirmed organizer contact details. Do not invent them.
- No backend, shared registration database, or production event inventory is present.

## Product Principles

- Help students find relevant events quickly.
- Show availability clearly and prevent registrations for full events.
- Validate registration details and confirm the selected event and student.
- Keep the prototype's sample data and local-only behavior transparent.
- Make discovery and registration usable across screen sizes.

## Accessibility & Inclusion

- Keep the page usable on mobile, tablet, and desktop, with no sideways scrolling.
- Provide clear validation errors for name, email, and phone fields.
- Ensure dialogs fit small screens and controls remain keyboard accessible with visible focus states.
- Respect reduced-motion preferences.
