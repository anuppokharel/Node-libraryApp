const headerNav = document.querySelector('#header nav');
const headerTitle = document.querySelector('#logo h2');

const list = document.querySelector('nav ul');
const bars = document.querySelector('nav .fa-bars');
const cross = document.querySelector('nav .fa-xmark');

// Live mediaQuery check

let x = window.matchMedia('(max-width: 865px)');

x.addListener(mobileNav);

function mobileNav(x) {
  if (x.matches) {
    headerNav.classList.add('mobile--responsive');
    bars.classList.add('active');
    headerTitle.textContent = 'L M S';
  } else {
    headerNav.classList.remove('mobile--responsive');
    headerTitle.textContent = 'Library Management System';
  }
}

mobileNav(x);

// ************************

// Toggling the nav menu(Mobile Responsive)

bars.addEventListener('click', () => {
  bars.classList.remove('active');
  list.classList.add('active');
  cross.classList.add('active');
});

cross.addEventListener('click', () => {
  cross.classList.remove('active');
  list.classList.remove('active');
  bars.classList.add('active');
});
