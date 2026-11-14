/* Mark Bradley — Portfolio scripts (vanilla JS, no dependencies) */
(function () {
  'use strict';

  /* ---------- Carousels: the arrow moves one slide, then loops back to the start ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var next = carousel.querySelector('.carousel__next');
    var prev = carousel.querySelector('.carousel__prev');
    if (!track || !next) return;

    function slideWidth() {
      var first = track.children[0];
      if (!first) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function atEnd() {
      return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }

    // The back arrow only shows when there is something to go back to
    function updatePrev() {
      if (prev) prev.hidden = track.scrollLeft <= 4;
    }
    track.addEventListener('scroll', updatePrev);
    updatePrev();

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -slideWidth() });
      });
    }

    next.addEventListener('click', function () {
      if (atEnd()) {
        track.scrollTo({ left: 0 });
      } else {
        track.scrollBy({ left: slideWidth() });
      }
    });

    // Keyboard support when the track has focus
    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); track.scrollBy({ left: slideWidth() }); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); track.scrollBy({ left: -slideWidth() }); }
    });
  });

  /* ---------- Videos: only one plays at a time, and it pauses when scrolled away ---------- */
  var videos = Array.prototype.slice.call(document.querySelectorAll('video'));

  videos.forEach(function (video) {
    video.addEventListener('play', function () {
      videos.forEach(function (other) {
        if (other !== video && !other.paused) other.pause();
      });
    });
  });

  if ('IntersectionObserver' in window && videos.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
      });
    }, { threshold: 0.1 });
    videos.forEach(function (video) { observer.observe(video); });
  }
})();

// Navbar: on the home page, colour the link of the section you are looking at
const navLinks = document.querySelectorAll('.site-nav a[href^="index.html#"]');
const homeSections = document.querySelectorAll('#about, #case-studies, #various-projects');
if (homeSections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          if (link.hash === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  homeSections.forEach((section) => observer.observe(section));
}
