var cursor = document.querySelector('.cursor');
var landingNavbar = document.querySelector('.landing-navbar');

if (cursor) {
  document.addEventListener('mousemove', function(e) {
    cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
  });
}

if (landingNavbar) {
  var toggleNavbarOnScroll = function() {
    landingNavbar.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  toggleNavbarOnScroll();
  window.addEventListener('scroll', toggleNavbarOnScroll, { passive: true });
}

