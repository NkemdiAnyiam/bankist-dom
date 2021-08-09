'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// OLD WAY
//for (let i = 0; i < btnsOpenModal.length; i++)
//  btnsOpenModal[i].addEventListener('click', openModal);

// using forEach()
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Button scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({behavior: 'smooth'});
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //--- Matching strategy (step 2)
  if (e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if(!clicked) { return; } // this is called a "guard clause"

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Menu fade animation

const handleHover = function (opacity, e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) { el.style.opacity = opacity; }
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', handleHover.bind(nav, 0.5));
nav.addEventListener('mouseout', handleHover.bind(nav, 1));

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // same as saying const entry = entries[0]
  if (!entry.isIntersecting) { nav.classList.add('sticky'); }
  else { nav.classList.remove('sticky'); }
};

const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0, rootMargin: `-${navHeight}px`});
headerObserver.observe(header);

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) { return; }

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) { return; }

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    const removeBlur = function () {
      this.classList.remove('lazy-img');
      this.removeEventListener('load', removeBlur);
    };

    entry.target.addEventListener('load', removeBlur); // when JS finishes loading the image, a load event is fired.

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let currSlideNum = 0;
  const maxSlideNum = slides.length - 1;

  //------------Functions
  const createDots = function () {
    slides.forEach((_, i) => 
      dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    );
  };

  const activateDot = function (slideNum) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slideNum}"]`).classList.add('dots__dot--active')
  };

  const goToSlide = function (slideNum) {
    slideNum < 0 && (slideNum = maxSlideNum);
    slideNum > maxSlideNum && (slideNum = 0);

    slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * (i - slideNum)}%)`);
    activateDot(slideNum);
    
    currSlideNum = slideNum;
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };
  init();

  const nextSlide = function () {
    goToSlide(currSlideNum + 1);
  };

  const prevSlide = function () {
    goToSlide(currSlideNum - 1);
  };

  //------------Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prevSlide(); }
    else if (e.key === 'ArrowRight') { nextSlide(); }
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slideNum = Number(e.target.dataset.slide);
      goToSlide(slideNum);
    }
  });
};
slider();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------- 183. Selecting, Creating, and Deleting Elements
{ /*
console.log(document);
//--- Selecting Elements
console.log(document.documentElement); // selects <html>
console.log(document.querySelector('html'));
console.log(document.head); // selects <head>
console.log(document.querySelector('head'));
console.log(document.body); // selects <body>
console.log(document.querySelector('body'));

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

//--- Creating and inserting elements
// .insertAdjacentHTML()———Review lecture 145
const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

//header.prepend(message); // inserts it for the first time
//header.append(message); // moves message from being the first child to being the last child. DOM elements are unique
//header.append(message.cloneNode(true)); // appends a copy of the node instead of moving the original
header.append(message);

//--- Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  message.remove();
  //message.parentElement.removeChild(message);
});
*/
}

//--------------------------------------------------------------------------------------- 184. Styles, Attributes and Classes
{ /*
//--- Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
console.log(message.style.height); // totally blank line
console.log(message.style.width); // "120%"
console.log(message.style.backgroundColor); // "rgb(55, 56, 61)"

console.log(getComputedStyle(message));
console.log(getComputedStyle(message).height); // "43.4px"
console.log(getComputedStyle(message).color); // "rgb(187, 187, 187)"

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';
console.log(getComputedStyle(message).height); // "83.4px"

document.documentElement.style.setProperty('--color-primary', 'orangered');

//--- Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // "Bankist logo"
console.log(logo.className); // "nav__logo". Written as className instead of just class for historical reasons
console.log(logo.src); // "http://127.0.0.1:8080/img/logo.png"

// Non-standard attributes
console.log(logo.designer); // undefined;
console.log(logo.getAttribute('designer')); // "Jill"

logo.alt = 'Beautiful minimalist logo';
logo.setAttribute('company', 'Bankist');

console.log(logo.src); // absolute URL
console.log(logo.getAttribute('src')); // what src is literally set to in the HTML document
// same thing with internal links
const link = document.querySelector('.nav__link--btn');
console.log(link.href); // "http://127.0.0.1:8080/#" (absolute URL)
console.log(link.getAttribute('href')); // "#" (what it's literally set to in the HTML document)

//--- Data attributes
console.log(logo.dataset.versionNumber); // "3.0"
console.log(logo.dataset.pickleRick); // "pickle"

//--- Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
console.log(logo.classList.contains('c')); // true
console.log(logo.classList.contains('j')); // false

//logo.className = 'cool beans man'; // best not to do this because it removes all of the other classes
//console.log(logo.classList);
*/
}

//--------------------------------------------------------------------------------------- 185. Implementing Smooth Scrolling
{ /* (contains duplicate code)
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

btnScrollTo.addEventListener('click', function (e) {
  console.log(e.target.getBoundingClientRect());
  console.log(`Current scroll (X/Y): ${window.pageXOffset}/${window.pageYOffset}`); // "Current scroll (X/Y): 0/0" at very top of page

  console.log(`width/height of viewport: ${document.documentElement.clientWidth}, ${document.documentElement.clientHeight}`);

  //--- Scrolling
  const s1coords = section1.getBoundingClientRect();
  // //window.scrollTo(s1coords.left, s1coords.top); // s1coord.top will change when we scroll away from the top, so logic bug
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset); // this works as intended

  // Smooth Scrolling (old-school way)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  // Smooth Scrolling (modern way)
  section1.scrollIntoView({behavior: 'smooth'});
});
*/
}

//--------------------------------------------------------------------------------------- 186. Types of Events and Event Handlers
{ /*
const h1 = document.querySelector('h1');

//--- 1) addEventListener()
h1.addEventListener('mouseenter', function () { // fires when mouse enters element
  alert('addEventListener: You are reading the heading!');
});

h1.addEventListener('mouseenter', function () {
  alert('addEventListener2: You are reading the heading!');
}); // actually adds the second EventListener even though it's for the same event 'mouseenter'

//--- 2) onevent
h1.onmouseenter = function () { // old-school. Usually just use addEventListener()
  alert('onmouseenter: You are reading the heading!');
};

h1.onmouseenter = function () {
  alert('onmouseenter2: You are reading the heading!');
}; // overrides the previous onmouseenter event listener; so cannot assign multiple EventListeners for the same event

//--- Removing events (another advantage of adding with addEventListner() rather than onevent properties)
const alertH1 = function () {
  alert('addEventListener3: You are reading the heading!');
  h1.removeEventListener('mouseenter', alertH1); // pattern of ensuring this happens only once
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // another pattern is to remove it after a set amount of time
*/
}

//--------------------------------------------------------------------------------------- 187. Event Propagation: Bubbling and Capturing
// lecture

//--------------------------------------------------------------------------------------- 188. Event Propagation: Bubbling in Practice
{ /* (remove '#section--1' from HTML before using)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(this === e.currentTarget);

  
  //--- Stop propagation
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
}, true);  // third parameter tells it whether or not it should listen during capturing phase instead of bubbling phase
*/
}

//--------------------------------------------------------------------------------------- 189. Event Delegation: Implementing Page Navigation
{ /* (contains duplicate code)
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
    
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   });
// }); // inefficient because we're attachig several copies of the same handler function to the elements

//--- Event delegation
// 1. Add the event listener to a common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //--- Matching strategy (step 2)
  if (e.target.classList.contains('nav__link') && !e.target.classList.contains('nav__link--btn')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});
*/
}

//--------------------------------------------------------------------------------------- 190. DOM Traversing
{ /*
const h1 = document.querySelector('h1');

//--- Going downwards
console.log(h1.querySelectorAll('.highlight')); // "NodeList(2) [span.highlight, span.highlight]"
console.log(h1.childNodes); // "NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]"
console.log(h1.children); // "HTMLCollection(3) [span.highlight, br, span.highlight]"
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//--- Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement); // both of these just give the <div> in this case

h1.closest('.header').style.backgroundImage = 'var(--gradient-secondary)';

h1.closest('h1').style.backgroundImage = 'var(--gradient-primary)'; // selects itself
console.log(h1.querySelector('h1'));

//--- Going sideways
console.log(h1.previousElementSibling); // null
console.log(h1.nextElementSibling); // the <h4> element

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // "HTMLCollection(4) [h1, h4, button.btn--text.btn--scroll-to, img.header__img]"

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});
*/
}

//--------------------------------------------------------------------------------------- 191. Building a Tabbed Component
{ /* (contains duplicate code)
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  //const clicked = e.target; // will be <span> instead of <button> if we click on the <span>
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked); // will naturally be null if we clicked on the <div>

  //--- Guard clause
  if(!clicked) { return; } // this is called a "guard clause"

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
*/
}

//--------------------------------------------------------------------------------------- 192. Passing Arguments to Event Handlers
{ /* (contains duplicate code)
const nav = document.querySelector('nav');

const handleHover = function (opacity, e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) { el.style.opacity = opacity; }
    });
    logo.style.opacity = opacity;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// Using bind() instead of nesting handleHover() within an anonymous function
nav.addEventListener('mouseover', handleHover.bind(nav, 0.5));
nav.addEventListener('mouseout', handleHover.bind(nav, 1));

//--- Another way of passing multiple arguments as learned in the Q&A using closures:

// const handleHover = function (opacity) {
//   return function (e) {
//     if(e.target.classList.contains('nav__link')) {
//       const link = e.target;
//       const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//       const logo = link.closest('.nav').querySelector('img');

//       siblings.forEach(el => {
//         if(el !== link) { el.style.opacity = opacity; }
//       });
//       logo.style.opacity = opacity;
//     }
//   };
// };

// nav.addEventListener('mouseover', handleHover(0.5));
// nav.addEventListener('mouseout', handleHover(1));


//--- Jonas implemented it like below. 'this' becomes the value we want for opacity, and so then we actually wouldn't have to set opacity
// as one of the parameters in handleHover() at all; we just use 'this'. But that's is confusing and weird; why do this?

// const handleHover = function (e) {
//   if(e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if(el !== link) { el.style.opacity = this; }
//     });
//     logo.style.opacity = this;
//   }
// }
// nav.addEventListener('mouseover', handleHover.bind(0.5));
// nav.addEventListener('mouseout', handleHover.bind(1));
*/
}

//--------------------------------------------------------------------------------------- 193. Implementing a Sticky Navigation: The Scroll Event
{ /*
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function () {
  //console.log(e);
  //console.log(window.pageYOffset); // apparently, window.scrollY is exactly equivalent, but not supported in IE

  if (window.pageYOffset > initialCoords.top) { nav.classList.add('sticky'); }
  else { nav.classList.remove('sticky'); }
});
*/
}

//--------------------------------------------------------------------------------------- 194. A Better Way: The Intersection Observer API
{ /* (contains duplicate code)
const obsCallback = function (entries, observer) { // observer is the actual object created from InterserObserver() itself
  entries.forEach(entry => { console.log(entry) }); // logs an IntersectionObserverEntry object
};

const obsOptions = {
  root: null,
  //threshold: .1
  threshold: [0, 0.2, 1] // 1 will be impossible because section1 is bigger than the viewport
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);

//--- Sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // same as saying const entry = entries[0]
  //console.log(entry);
  if (!entry.isIntersecting)
    { nav.classList.add('sticky'); }
  else
    { nav.classList.remove('sticky'); }
};

//const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0, rootMargin: '-90px'});
const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0, rootMargin: `-${navHeight}px`});
headerObserver.observe(header);
*/
}

//--------------------------------------------------------------------------------------- 195. Revealing Elements on Scroll
{ /* (contains duplicate code)
const allSections = document.querySelectorAll('.section');

// Jonas's use of destructuring here is inappropriate because it ignores all but the first intersection in the first automatic
// call to this callback upon the page loading
// const revealSection = function (entries, observer) {
//   const [entry] = entries;
//   console.log(entry);
//   if (!entry.isIntersecting) { return; }

//   entry.target.classList.remove('section--hidden');
//   observer.unobserve(entry.target);
// };

const revealSection = function (entries, observer) {
  console.log(entries);
  entries.forEach(function (entry) { // this is what he SHOULD have done
    if (!entry.isIntersecting) { return; }

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
*/
}

//--------------------------------------------------------------------------------------- 196. Lazy Loading Images
{ /* (contains duplicate code)
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);

    if (!entry.isIntersecting) { return; }

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    //entry.target.classList.remove('lazy-img'); // shouldn't do this immediatley because JS needs to find and load the new image behind the scenes

    entry.target.addEventListener('load', function () { // when JS finishes loading the image, a load event is fired.
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));
*/
}

//--------------------------------------------------------------------------------------- 197: Building a Slider Component: Part 1
{ /* (contains duplicate code)

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currSlideNum = 0;
const maxSlideNum = slides.length;

const goToSlide = function (slideNum) {
  slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * (i - slideNum)}%)`);
  currSlideNum = slideNum;
}

goToSlide(0); // so starts at // 0%, 100%, 200%, and 300% for 4 slides

// Move slide
const nextSlide = function () {
  if(currSlideNum === maxSlideNum - 1) { currSlideNum = 0; }
  else { ++currSlideNum; }

  goToSlide(currSlideNum);
}

const prevSlide = function () {
  if(currSlideNum === 0) { currSlideNum = maxSlideNum - 1; }
  else { --currSlideNum; }

  goToSlide(currSlideNum);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
*/
}

//--------------------------------------------------------------------------------------- 198: Building a Slider Component: Part 2
{ /*
const dotsContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach((_, i) => 
    dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
  );
};

const activateDot = function (slideNum) { // pretend we defined this at the top of lecture 197 and also used it in nextSlide() and prevSlide()
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slideNum}"]`).classList.add('dots__dot--active')
};

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();

document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') { prevSlide(); }
  e.key === 'ArrowRight' && nextSlide();
});

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset; // just using destructuring because we can
    goToSlide(slide);
    activateDot(slide);
  }
});
*/
}

//--------------------------------------------------------------------------------------- 199. Lifecycle DOM Events
{ /*
document.addEventListener('DOMContentLoaded', function (e) { // only fired when HTML is parsed and JS is loaded
  console.log('HTML parsed and DOM tree built');
  console.log(e);
});

window.addEventListener('load', function (e) { // images and external resources must also be loaded for this to fire
  console.log('Page fully loaded');
  console.log(e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // necessary in some browsers
//   e.returnValue = ''; // doing this makes the "Leave site?" / "Reload site?" box appear
// });
*/
}
//--------------------------------------------------------------------------------------- 200. Efficient Script Loading: defer and async
// lecture
