'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sectionSignUp = document.querySelector('.section--sign-up');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//Implementing Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  // console.log(e.target);
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current Scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // console.log(s1coords.top);
  // console.log(window.pageYOffset);
  // console.log(s1coords.top + window.pageYOffset);
  // // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //modern way

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
//cookie message
const cookie = function () {
  const message = document.createElement('div');
  message.classList.add('cookie-message');
  message.textContent =
    'We use cookies for improved functionality and analytics.';
  message.innerHTML =
    'We use cookies for improved functionality and analytics. <button class="btn btn-close-cookie">Got it!</button>';

  header.prepend(message);
  // header.append(message);

  //Delete Elements
  document
    .querySelector('.btn-close-cookie')
    .addEventListener('click', function () {
      message.remove();
    });

  //Style
  message.style.backgroundColor = '#37383d';
  message.style.width = '120%';
  message.style.padding = '10px';
};
window.addEventListener('load', cookie);

///////////////////////////////////////
//Event Delegation: Implementing Page Navigation

// //NORMAL WAY OF MAKING SMOOTH SCROLLS
// document.querySelectorAll('.scrolling').forEach(function (element) {
//   element.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// //USING EVENT DELEGATION FOR SMOOTH SCROLLS
//1. ADD EVENT LISTENER TO COMMON PARENT ELEMENT
//2. DETERMINE WHAT ELEMENT ORIGINATED THE EVENT

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Matching strategy
  if (e.target.classList.contains('scrolling')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Building Tabbed Component

//will slow down page so it's a bad practice
// tabs.forEach(tab => tab.addEventListener('click', () => console.log('TAB')));

//to make it fast we use the delegation

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //Guard clause

  // old way
  // if (clicked) {
  // clicked.classList.add('operations__tab--active');
  // }

  // modern way
  if (!clicked) return;

  //Active tab

  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  //Activate tab area
  clicked.classList.add('operations__tab--active');

  //Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
//Menu fade animation

// const handleHover = function (event, opacityNumber) {
//   console.log(this, event.currentTarget);
//   if (event.target.classList.contains('nav__link')) {
//     const clickedLink = event.target;
//     const siblings = clickedLink.closest('.nav').querySelectorAll('.nav__link');
//     const logo = clickedLink.closest('.nav').querySelector('img');

//     siblings.forEach(element => {
//       if (element !== clickedLink) element.style.opacity = opacityNumber;
//     });
//     logo.style.opacity = opacityNumber;
//   }
// };

const handleHover = function (event) {
  // console.log(this, event.currentTarget);
  if (event.target.classList.contains('nav__link')) {
    const clickedLink = event.target;
    const siblings = clickedLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickedLink.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element !== clickedLink) element.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (event) {
//   handleHover(event, 0.5);
// });
// nav.addEventListener('mouseout', function (event) {
//   handleHover(event, 1);
// });

//passing an 'argument' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
//Implementing a Sticky Navigation: The Scroll event
// const initialCordinate = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCordinate.top) nav.classList.add('sticky');
//   else {
//     nav.classList.remove('sticky');
//   }
// });

///////////////////////////////////////
//A Better Way: The intersection Observer API
//Second Way of making a Sticky Navigation
// const observerCallback = function (entries, observer) {
//   console.log(entries);
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNavigation = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNavigation, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
//Revealing Element on Scroll
//Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionsObserver.observe(section);
  // section.classList.add('section--hidden');
});

///////////////////////////////////////
//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace the src attribute with the data-src
  entry.target.src = entry.target.dataset.src;
  //this will make it happen so fast that you might not get to see the effect
  // entry.target.classList.remove('lazy-img');

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
//Building A Slider Component: Part 1 &&
//Building A Slider Component: Part 2

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const slider = document.querySelector('.slider');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //Functions
  //Create Dots
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //Activate Dots
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //translating them to the right
  // slides.forEach(
  //   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
  // );
  //eg. 0,100%,200%,300%

  //code refactoring
  const goToSlide = function (currentSlide) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
    );
  };

  //Go to Next slide
  const nextSlide = function () {
    //My way of doing it
    curSlide++;

    if (curSlide === maxSlide) curSlide = 0;
    //Jonas's way of doing it
    // if (curSlide === maxSlide - 1) {
    //   curSlide = 0;
    //   console.log(curSlide, maxSlide - 1);
    // } else {
    //   curSlide++;
    //   console.log(curSlide, maxSlide - 1);
    // }

    // slides.forEach(
    //   (slide, index) =>
    //     (slide.style.transform = `translateX(${100 * (index - curSlide)}%)`)
    // );
    //eg. -100%,0,100%,200%

    goToSlide(curSlide);

    activateDot(curSlide);
  };

  //Go to Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);

    activateDot(curSlide);
  };

  //Keyboard clicks
  const keyBoardSlide = function (e) {
    e.preventDefault();

    // if (e.key === 'ArrowLeft') prevSlide();
    // if (e.key === 'ArrowRight') nextSlide();

    //Using Short-circuiting
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  };

  //Default Beginnings
  const initialiaziation = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  initialiaziation();

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', keyBoardSlide);
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      // console.log(e.target.dataset);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
//Selecting, Creating and Deleting Elements

//Selecting Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const butttons = document.getElementsByTagName('button');
// console.log(butttons);

// console.log(document.getElementsByClassName('btn'));

//Creating and inserting Elementings
// .insertAdjacentHTML

//Practice on insertAdjacentHTML
// const openAccount = document.querySelector('.open');
// openAccount.insertAdjacentHTML(
//   'beforebegin',
//   `<li class="nav__item">
//       <a class="nav__link" href="app/index.html">
//          Log In
//       </a>
//    </li>`
// );

// const cookie = function () {
//   const message = document.createElement('div');
//   message.classList.add('cookie-message');
//   message.textContent =
//     'We use cookies for improved functionality and analytics.';
//   message.innerHTML =
//     'We use cookies for improved functionality and analytics. <button class="btn btn-close-cookie">Got it!</button>';

//   // header.prepend(message);
//   header.append(message);
//   // header.append(message.cloneNode(true));
//   // header.before(message);
//   // header.after(message);

//   //Delete Elements
//   document
//     .querySelector('.btn-close-cookie')
//     .addEventListener('click', function () {
//       //newer way of removing element from a dom tree
//       message.remove();

//       //old way of removing element from a dom tree
//       // message.parentElement.removeChild(message);
//     });

//   // //Style
//   message.style.backgroundColor = '#37383d';
//   message.style.width = '120%';
//   message.style.padding = '10px';
//   // console.log(message.style.color);
//   // console.log(message.style.backgroundColor);

//   // console.log(getComputedStyle(message).color);
//   // console.log(getComputedStyle(message).height);
// };
// window.addEventListener('load', cookie);

// //Works when you reduce the width of the browser
// // message.style.height =
// //   Number.parseInt(getComputedStyle(message).height, 10) + 40 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'orangeRed');
// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// //set attributes
// logo.alt = 'Beautiful minimalist logo';

// //Non-standard meaning it isn't recognized as an attribute name
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');

// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data Attributes
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes like in arrays

//don't use this cos it will over write all of the other classes and it only allows 1 class to be put in the element
// logo.className = 'jonas';

///////////////////////////////////////
//Types of Events and Event Handlers
//Events

// const h1 = document.querySelector('h1');

// //1st way of handling events
// const alertH1 = function (e) {
//   alert('addEventListner: Great! You are reading the heading with !!!');

//   setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// };

// h1.addEventListener('mouseenter', alertH1);

//second way of handling events
// h1.onmouseenter = function (e) {
//   alert('addEventListner: Great! You are reading the heading with !!!');
// };

///////////////////////////////////////
// // Event Propagation in practice
// // rgb(255,255,255)

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + min) + 1);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // console.log(this);
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //Stop event propagation
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
//   // e.stopPropagation();
// });
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//     // e.stopPropagation();
//   }
//   // ,true
// );

////////////////////////////
//DOM traversing

// const h1 = document.querySelector('h1');

// // Going downwards child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);

// //nodes
// console.log(h1.childNodes);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards child
// console.log(h1.parentElement);
// //nodes
// console.log(h1.parentNode);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'orange';

// h1.closest('.header__title').style.background = 'var(--gradient-primary)';

// // Going sideways: siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// //nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (element) {
//   if (element !== h1) element.style.transform = 'scale(0.5)';
// });

///////////////////////////////////////
// Lifecycle DOM Events
//DOM content loaded

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML  parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
