var cursor = document.querySelector('.cursor');

const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        navbar.classList.add("shrink");
      } else {
        navbar.classList.remove("shrink");
      }
    });

document.addEventListener('mousemove', function(e){
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});

