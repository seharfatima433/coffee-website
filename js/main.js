/* ==========================================================================
   Sundial Coffee Roasters - js/main.js
   Devixo Solutions Web Development Internship, Task 02
   Vanilla JavaScript (no libraries). One section per feature.

    1. Helpers and page-ready flag     9. Counters (animated numbers)
    2. Dark mode                      10. Sundial: choose the hour
    3. Mobile navigation menu         11. Order list (cart) and toast
    4. Scroll progress + to-top       12. FAQ accordion
    5. Scroll reveal animation        13. Menu filter by time of day
    6. Typing animation               14. Gallery filter + lightbox
    7. Parallax beans + tilt cards    15. Forms: validation
    8. Sliders (specials, reviews)    16. "Open now" badge
                                     17. Checkout page + phone-message pop-up
   ========================================================================== */

'use strict';

/* ---------- 1. Helpers ---------- */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Pakistan time, so "open now" and the sundial start hour are right for the shop
function karachiNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
}
const formatRs = (n) => 'Rs ' + n.toLocaleString('en-US');

/* ---------- 2. Dark mode ---------- */
// The saved theme is applied by a small script in <head> (no flash). Here we handle the button.
(function themeToggle() {
  const button = $('.theme-toggle');
  if (!button) return;
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  apply(document.documentElement.getAttribute('data-theme') || 'light');
  button.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    // Storage can be blocked (private windows), so always use try/catch
    try { localStorage.setItem('sundial-theme', next); } catch (error) { /* ignore */ }
  });
})();

/* ---------- 3. Mobile navigation menu ---------- */
(function mobileMenu() {
  const header = $('.site-header');
  const button = $('.menu-btn');
  if (!header || !button) return;
  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  button.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
  $$('.nav-links a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
})();

/* ---------- 4. Scroll progress bar + scroll-to-top ---------- */
(function scrollFeatures() {
  const bar = $('.progress');
  const topButton = $('.to-top');
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    if (topButton) topButton.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
  if (topButton) topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
})();

/* ---------- 5. Scroll reveal ---------- */
(function scrollReveal() {
  const items = $$('[data-reveal]');
  if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('reveal-on');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  // A small stagger for siblings inside the same grid
  items.forEach((item) => {
    const siblings = item.parentElement ? [...item.parentElement.children].filter((c) => c.hasAttribute('data-reveal')) : [];
    item.style.setProperty('--delay', `${Math.max(0, siblings.indexOf(item)) * 0.1}s`);
    observer.observe(item);
  });
})();

/* ---------- 6. Typing animation ---------- */
(function typingAnimation() {
  const target = $('#typed');
  if (!target || reduceMotion) return;     // reduced motion keeps the static phrase
  const words = JSON.parse(target.dataset.words);
  let wordIndex = 0, charIndex = 0, deleting = false;
  function tick() {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = word.slice(0, charIndex);
    let delay = deleting ? 38 : 85;
    if (!deleting && charIndex === word.length) { deleting = true; delay = 1800; }
    else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  }
  target.textContent = '';
  setTimeout(tick, 700);
})();

/* ---------- 7. Parallax beans (hero) and 3D tilt cards ---------- */
(function motionEffects() {
  if (reduceMotion) return;
  const hero = $('.hero');
  const beans = $$('.bean');
  if (hero && beans.length) {
    hero.addEventListener('mousemove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      beans.forEach((bean, i) => {
        const depth = (i + 1) * 14;
        bean.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${x * 20}deg)`;
      });
    });
  }
  // Tilt: the tile leans toward the mouse, like a card held in your hand
  $$('.tile, .service-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ---------- 8. Sliders (works for every .slider on the page) ---------- */
$$('.slider').forEach(function imageSlider(slider) {
  const track = $('.slides', slider);
  const slides = $$('.slides > *', slider);
  const dotsBox = $('.dots', slider);
  const autoplayMs = Number(slider.dataset.autoplay || 0);
  let index = 0, timer = null;

  // One round button per slide; clicking a dot jumps to that slide and stops autoplay
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); stop(); });
    dotsBox.appendChild(dot);
    return dot;
  });

  // Show slide number i: slide the track sideways and update the dots and aria attributes
  function goTo(i) {
    index = (i + slides.length) % slides.length;       // wraps around at both ends
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, n) => slide.setAttribute('aria-hidden', String(n !== index)));
    dots.forEach((dot, n) => {
      dot.classList.toggle('is-active', n === index);
      dot.setAttribute('aria-current', String(n === index));
    });
  }
  // Autoplay helpers (autoplay is skipped for visitors who prefer reduced motion)
  function start() { if (!autoplayMs || reduceMotion || timer) return; timer = setInterval(() => goTo(index + 1), autoplayMs); }
  function stop() { clearInterval(timer); timer = null; }

  $('.slider-prev', slider).addEventListener('click', () => { goTo(index - 1); stop(); });
  $('.slider-next', slider).addEventListener('click', () => { goTo(index + 1); stop(); });
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { goTo(index - 1); stop(); }
    if (event.key === 'ArrowRight') { goTo(index + 1); stop(); }
  });
  goTo(0);
  start();
});

/* ---------- 9. Animated counters ---------- */
(function animatedCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;
  const finalText = (el) => Number(el.dataset.count).toFixed(Number(el.dataset.decimals || 0)) + (el.dataset.suffix || '');

  function animate(el) {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    (function frame(now) {
      const progress = Math.min((now - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);       // fast start, slow finish
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    })(start);
  }
  // Start each counter only when it scrolls into view, and only once
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reduceMotion) entry.target.textContent = finalText(entry.target); else animate(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => observer.observe(counter));
})();

/* ---------- 10. The sundial: choose the hour ---------- */
// The same prices as the menu on the Services page
// The five times of day. Each phase has its colour theme (in CSS), a drink suggestion and a photo.
const PHASES = {
  dawn:      { photo: 'Cardamom Cortado a cup of coffee.jpg', name: 'Dawn',        kicker: 'First light calls for',  drink: 'Cardamom Cortado',   price: 650, text: 'Espresso, warm milk and freshly crushed cardamom. Gentle, like the sky.' },
  morning:   { photo: 'Hazelnut coffee.jpg', name: 'Morning',     kicker: 'To start the day',       drink: 'Flat White',         price: 560, text: 'Silky milk over a double ristretto. Smooth, strong and ready for your inbox.' },
  afternoon: { photo: 'Mango Cold Brew an iced drink.jpg', name: 'Afternoon',   kicker: 'Beat the slump with',    drink: 'Mango Cold Brew',    price: 720, text: 'Twelve-hour cold brew over sweet Sindhri mango. Cold, bright and awake.' },
  golden:    { photo: 'Rose Pistachio Latte a latte.jpg', name: 'Golden hour', kicker: 'As the light turns',     drink: 'Rose Pistachio Latte', price: 680, text: 'Rose syrup, crushed pistachio and steamed milk. Made for slow evenings.' },
  night:     { photo: 'Decaf Hazelnut Mocha.jpg', name: 'Night',       kicker: 'For the late shift',     drink: 'Decaf Hazelnut Mocha', price: 640, text: 'Dark chocolate and roasted hazelnut, without the buzz. Sleep stays safe.' },
};
// Turns an hour (0 to 23) into one of the five phase names
function phaseForHour(hour) {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 20) return 'golden';
  return 'night';
}
(function sundial() {
  const dial = $('.dial');
  if (!dial) return;
  const hero = $('.dial-section') || dial;
  const range = $('#dial-range');
  const body = $('#dial-body');
  const reco = $('.reco');
  const addButton = $('#reco-add');
  let currentPhase = '';

  // Sun and moon travel along a half-circle. Sun: 5 AM to 8 PM. Moon: 8 PM to 5 AM.
  function position(hour) {
    const isDay = hour >= 5 && hour < 20;
    const t = isDay ? (hour - 5) / 15 : ((hour - 20 + 24) % 24) / 9;
    const cx = 160, cy = 168, r = 124;
    const x = cx - r * Math.cos(Math.PI * t);
    const y = cy - r * Math.sin(Math.PI * t);
    body.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }

  // Updates the suggested-drink card with a short fade so the change feels smooth
  function showReco(phase) {
    const data = PHASES[phase];
    const apply = () => {
      const pic = $('#reco-img');
      if (pic) { pic.style.display = ''; pic.src = 'images/' + encodeURIComponent(data.photo); pic.alt = data.drink; }
      $('#reco-kicker').textContent = data.kicker;
      $('#reco-name').textContent = data.drink;
      $('#reco-text').textContent = data.text;
      $('#reco-price').textContent = formatRs(data.price);
      addButton.dataset.name = data.drink;
      addButton.dataset.price = data.price;
      reco.classList.remove('is-changing');
    };
    if (reduceMotion) return apply();
    reco.classList.add('is-changing');                   // fade out, swap text, fade in
    setTimeout(apply, 220);
  }

  // Main sundial update: clock text, sun/moon position, sky phase and the drink suggestion
  function setHour(hour) {
    hour = Number(hour);
    range.value = hour;
    const phase = phaseForHour(hour);
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    $('#dial-clock').textContent = `${h12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    $('#dial-phase').textContent = PHASES[phase].name;
    range.setAttribute('aria-valuetext', `${h12}:00 ${hour < 12 ? 'AM' : 'PM'}, ${PHASES[phase].name}`);
    position(hour);
    if (phase !== currentPhase) {
      currentPhase = phase;
      dial.dataset.phase = phase;
      hero.dataset.phase = phase;
      showReco(phase);
    }
  }

  range.addEventListener('input', () => setHour(range.value));
  $('#dial-now').addEventListener('click', () => setHour(karachiNow().getHours()));
  setHour(karachiNow().getHours());                      // start at the real hour
})();

/* ---------- 11. Order list (cart) and toast ---------- */
const toast = (function toastMessages() {
  const box = $('#toast');
  let timer;
  return function show(message) {
    if (!box) return;
    box.textContent = message;
    box.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => box.classList.remove('is-visible'), 2600);
  };
})();

(function orderList() {
  const drawer = $('#cart');
  if (!drawer) return;
  const STORAGE_KEY = 'sundial-order';
  const countBadge = $('.cart-count');
  const list = $('#cart-items');
  let order = {};                                        // { "Flat White": { price: 560, qty: 2 } }

  try { order = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (error) { order = {}; }
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(order)); } catch (error) { /* ignore */ } };

  // Redraws the whole order drawer from the 'order' object, then saves it and tells other code it changed
  function render() {
    const names = Object.keys(order);
    const count = names.reduce((sum, n) => sum + order[n].qty, 0);
    const total = names.reduce((sum, n) => sum + order[n].qty * order[n].price, 0);
    countBadge.textContent = count;
    countBadge.classList.toggle('has-items', count > 0);
    $('#cart-empty').hidden = count > 0;
    $('#cart-foot').hidden = count === 0;
    list.innerHTML = '';
    names.forEach((name) => {
      const item = order[name];
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `<strong></strong><span class="line">${formatRs(item.price * item.qty)}</span>
        <span class="qty"><button type="button" data-act="dec" aria-label="Remove one"></button><span>${item.qty}</span><button type="button" data-act="inc" aria-label="Add one"></button></span>
        <button type="button" class="cart-remove" data-act="rm">Remove</button>`;
      $('strong', li).textContent = name;               // textContent keeps the name safe
      $$('button', li).forEach((b) => { b.dataset.name = name; });
      $('[data-act="dec"]', li).textContent = '-';
      $('[data-act="inc"]', li).textContent = '+';
      list.appendChild(li);
    });
    $('#cart-total').textContent = formatRs(total);
    save();
    document.dispatchEvent(new CustomEvent('order-changed'));
  }

  // The checkout page asks for the order to be cleared after a successful purchase
  document.addEventListener('order-clear', () => { order = {}; render(); });

  // Open or close the drawer and move keyboard focus accordingly
  function setOpen(open) {
    document.body.classList.toggle('cart-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) $('#cart-close').focus();
  }

  // Delegated clicks: any button with data-add adds a drink to the order
  document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-add]');
    if (addBtn) {
      const name = addBtn.dataset.name, price = Number(addBtn.dataset.price);
      order[name] = order[name] || { price, qty: 0 };
      order[name].qty += 1;
      render();
      toast(`${name} added to your order`);
      return;
    }
    const act = event.target.closest('[data-act]');
    if (act && drawer.contains(act)) {
      const name = act.dataset.name;
      if (act.dataset.act === 'inc') order[name].qty += 1;
      if (act.dataset.act === 'dec') order[name].qty -= 1;
      if (act.dataset.act === 'rm' || order[name].qty <= 0) delete order[name];
      render();
      return;
    }
    if (event.target.closest('.cart-btn')) setOpen(true);
    if (event.target.closest('#cart-close') || event.target.closest('.cart-overlay')) setOpen(false);
  });
  $('#cart-clear').addEventListener('click', () => { order = {}; render(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  render();
})();

/* ---------- 12. FAQ accordion ---------- */
(function faqAccordion() {
  const questions = $$('.faq-q');
  questions.forEach((question) => {
    question.addEventListener('click', () => {
      const willOpen = question.getAttribute('aria-expanded') !== 'true';
      questions.forEach((other) => other.setAttribute('aria-expanded', 'false'));   // one open at a time
      question.setAttribute('aria-expanded', String(willOpen));
    });
  });
})();

/* ---------- 13. Menu filter by time of day ---------- */
(function menuFilter() {
  const buttons = $$('[data-menu-filter]');
  const items = $$('.menu-item');
  if (!buttons.length) return;
  function select(button) {
    const phase = button.dataset.menuFilter;
    buttons.forEach((b) => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    items.forEach((item) => { item.hidden = phase !== 'all' && !item.dataset.times.split(' ').includes(phase); });
    const note = $('#menu-note');
    if (note) note.textContent = phase === 'all' ? 'Showing the whole menu.' : `Showing what we pour at ${PHASES[phase].name.toLowerCase()}.`;
  }
  buttons.forEach((button) => button.addEventListener('click', () => select(button)));
  // Open on the filter for the current hour, so the menu already feels "right now"
  const nowButton = buttons.find((b) => b.dataset.menuFilter === phaseForHour(karachiNow().getHours()));
  if (nowButton) select(nowButton);
})();

/* ---------- 14. Gallery filter + lightbox ---------- */
(function gallery() {
  const buttons = $$('[data-gallery-filter]');
  const tiles = $$('.tile');
  const dialog = $('#lightbox');
  if (!tiles.length) return;

  buttons.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.galleryFilter;
    buttons.forEach((b) => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    tiles.forEach((tile) => { tile.hidden = category !== 'all' && tile.dataset.cat !== category; });
  }));

  if (!dialog || typeof dialog.showModal !== 'function') return;
  let current = 0;                                    // index of the project shown in the lightbox
  // Only tiles that are not hidden by the filter can be stepped through
  const visible = () => tiles.filter((t) => !t.hidden);
  // Fill the lightbox with the clicked tile's title, text and photo
  function show(tile) {
    $('#lightbox-title').textContent = tile.dataset.title;
    $('#lightbox-text').textContent = tile.dataset.text;
    const art = $('.lightbox-art', dialog);
    art.className = 'lightbox-art ' + [...tile.classList].find((c) => /^c-\d$/.test(c));
    $('use', art).setAttribute('href', $('use', tile).getAttribute('href'));
    const old = $('img', art); if (old) old.remove();
    const src = $('img', tile);
    if (src) { const big = document.createElement('img'); big.src = src.getAttribute('src'); big.alt = tile.dataset.title; big.onerror = () => big.remove(); art.append(big); }
    current = visible().indexOf(tile);
  }
  tiles.forEach((tile) => tile.addEventListener('click', () => { show(tile); dialog.showModal(); }));
  const step = (d) => { const list = visible(); show(list[(current + d + list.length) % list.length]); };
  $('#lightbox-prev').addEventListener('click', () => step(-1));
  $('#lightbox-next').addEventListener('click', () => step(1));
  $('.close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });   // click the dark backdrop
  dialog.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') step(-1); if (event.key === 'ArrowRight') step(1); });
})();

/* ---------- 15. Forms: validation ---------- */
// Rules return an error message, or '' when the value is fine
const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your full name (at least 2 letters).' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address, like name@example.com.'),
  phone: (v) => (v.trim() === '' || /^[+\d][\d\s-]{6,}$/.test(v.trim()) ? '' : 'Use digits only, for example +92 300 1234567 (or leave it empty).'),
  mobile: (v) => (/^[+\d][\d\s-]{9,}$/.test(v.trim()) ? '' : 'Please enter a mobile number we can call, for example 0300 1234567.'),
  address: (v) => (document.querySelector('input[name="type"]:checked')?.value === 'pickup' || v.trim().length >= 10 ? '' : 'Please enter your full address (house, street, area).'),
  subject: (v) => (v === '' ? 'Please choose a subject.' : ''),
  message: (v) => (v.trim().length < 20 ? 'Please write at least 20 characters so we can help you properly.' : ''),
};
// Shared validation for every form: 'fields' are the input names to check and 'onValid' runs when all pass
function attachValidation(form, fields, onValid) {
  // Check one field, show or clear its message, and return true when it is valid
  function check(field) {
    const input = form.elements[field];
    const message = RULES[field](input.value);
    const box = input.closest('.field') || input.parentElement;
    box.classList.toggle('has-error', message !== '');
    box.classList.toggle('is-valid', message === '' && input.value.trim() !== '');
    input.setAttribute('aria-invalid', String(message !== ''));
    const out = $('.error', box);
    if (out) out.textContent = message;
    return message === '';
  }
  fields.forEach((field) => {
    const input = form.elements[field];
    input.addEventListener('blur', () => check(field));                 // check when the user leaves the field
    input.addEventListener('input', () => {                             // re-check live once an error is showing
      const box = input.closest('.field') || input.parentElement;
      if (box.classList.contains('has-error')) check(field);
    });
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const results = fields.map(check);
    if (results.includes(false)) {
      form.elements[fields[results.indexOf(false)]].focus();           // jump to the first problem
      return;
    }
    onValid();
  });
}

(function contactForm() {
  const form = $('#contact-form');
  if (!form) return;
  const messageBox = form.elements.message;
  messageBox.addEventListener('input', () => { $('#message-count').textContent = `${messageBox.value.length} / 500`; });
  attachValidation(form, ['name', 'email', 'phone', 'subject', 'message'], () => {
    // There is no server, so we only show a confirmation
    $('#success-name').textContent = form.elements.name.value.trim().split(' ')[0];
    form.hidden = true;
    const success = $('#form-success');
    success.hidden = false;
    success.focus();
  });
})();

(function newsletterForm() {
  const form = $('#newsletter');
  if (!form) return;
  attachValidation(form, ['email'], () => {
    form.reset();
    toast('Thank you! (Demo form: nothing was sent.)');
  });
})();

/* ---------- 16. "Open now" badge ---------- */
(function openNow() {
  const badge = $('#open-badge');
  if (!badge) return;
  const hours = { 0: [8, 22], 1: [7, 23], 2: [7, 23], 3: [7, 23], 4: [7, 23], 5: [7, 23], 6: [7, 23] };   // [open, close] by weekday
  const now = karachiNow();
  const [open, close] = hours[now.getDay()];
  const isOpen = now.getHours() >= open && now.getHours() < close;
  badge.textContent = isOpen ? 'Open now' : 'Closed now';
  badge.classList.toggle('is-open', isOpen);
})();


/* ---------- 17. Checkout page (demo: nothing is charged, nothing is sent) ---------- */
(function checkoutPage() {
  const form = $('#checkout-form');
  if (!form) return;                                  // only runs on checkout.html
  const FREE_DELIVERY_FROM = 3000, DELIVERY_FEE = 150;   // in rupees
  let order = {};                                     // copy of the saved order
  // Read the order that the cart saved in localStorage
  const read = () => { try { order = JSON.parse(localStorage.getItem('sundial-order')) || {}; } catch (error) { order = {}; } };
  const typeValue = () => form.querySelector('input[name="type"]:checked').value;

  // Subtotal, delivery fee and total (delivery is free for pickup or orders over the limit)
  function totals() {
    const names = Object.keys(order);
    const subtotal = names.reduce((s, n) => s + order[n].price * order[n].qty, 0);
    const fee = typeValue() === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
    return { names, subtotal, fee, total: subtotal + fee };
  }

  // Draw the order summary box; show the 'empty order' message when there is nothing to buy
  function render() {
    if (!$('#checkout-done').hidden) return;          // the thank-you card is showing, leave the page as it is
    read();
    const t = totals();
    const empty = t.names.length === 0;
    $('#checkout-empty').hidden = !empty;
    $('#checkout-main').hidden = empty;
    if (empty) return;
    const list = $('#sum-items');
    list.innerHTML = '';
    t.names.forEach((n) => {
      const li = document.createElement('li');
      li.innerHTML = '<span></span><strong></strong>';
      $('span', li).textContent = `${order[n].qty} x ${n}`;
      $('strong', li).textContent = formatRs(order[n].price * order[n].qty);
      list.appendChild(li);
    });
    $('#sum-subtotal').textContent = formatRs(t.subtotal);
    $('#sum-fee').textContent = typeValue() === 'pickup' ? 'Pickup, free' : (t.fee ? formatRs(t.fee) : 'Free');
    $('#sum-total').textContent = formatRs(t.total);
    $('#sum-hint').textContent = typeValue() === 'delivery' && t.subtotal < FREE_DELIVERY_FROM
      ? `Add ${formatRs(FREE_DELIVERY_FROM - t.subtotal)} more for free delivery.` : '';
  }

  // Switch the page between Delivery and Pickup: address field, payment wording and time note
  function updateType() {
    const pickup = typeValue() === 'pickup';
    $('#address-field').hidden = pickup;
    $('#pay-cash-text').textContent = pickup ? 'Pay cash at the counter' : 'Cash on delivery';
    $('#pay-card-text').textContent = pickup ? 'Pay by card at the counter' : 'Card machine brought to your door';
    $('#time-note').textContent = pickup ? 'Ready in about 15 minutes.' : 'Delivered in about 35 to 45 minutes.';
    render();
  }
  $$('input[name="type"]', form).forEach((r) => r.addEventListener('change', updateType));
  document.addEventListener('order-changed', render);       // edited in the order drawer
  $('#edit-order').addEventListener('click', () => $('.cart-btn').click());

  // Phone-style text message pop-up (a preview only: no SMS is really sent)
  const popup = $('#order-popup');
  function showMessage(number, t, pickup) {
    if (!popup || typeof popup.showModal !== 'function') return;
    const first = form.elements.name.value.trim().split(' ')[0];
    const items = t.names.reduce((n, name) => n + order[name].qty, 0);
    const when = pickup ? 'It will be ready for pickup in about 15 minutes.' : 'It will reach you in about 35 to 45 minutes.';
    const now = new Date();
    $('#sms-to').textContent = `to ${form.elements.mobile.value.trim()}`;
    $('#sms-time').textContent = 'Today ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    $('#sms-text').textContent = `Hi ${first}! Your Sundial order ${number} is confirmed: ${items} item${items > 1 ? 's' : ''}, ${formatRs(t.total)}. ${when} Thank you for choosing Sundial!`;
    const typing = $('#sms-typing'), text = $('#sms-text');
    typing.hidden = false; text.hidden = true; text.classList.remove('is-in');
    popup.showModal();
    setTimeout(() => { typing.hidden = true; text.hidden = false; requestAnimationFrame(() => text.classList.add('is-in')); }, reduceMotion ? 0 : 1100);
  }
  if (popup) {
    $('#sms-close').addEventListener('click', () => popup.close());
    popup.addEventListener('click', (event) => { if (event.target === popup) popup.close(); });
  }

  // When the form is valid: make an order number, show the thank-you card, open the message pop-up, empty the cart
  attachValidation(form, ['name', 'mobile', 'address'], () => {
    const t = totals();
    if (t.names.length === 0) return;
    const number = 'SC-' + String(Math.floor(1000 + Math.random() * 9000));   // random 4-digit demo order number
    const pickup = typeValue() === 'pickup';
    const pay = form.querySelector('input[name="payment"]:checked').value;
    $('#done-number').textContent = number;
    $('#done-name').textContent = form.elements.name.value.trim().split(' ')[0];
    $('#done-time').textContent = pickup ? 'Ready for pickup in about 15 minutes at 12 Canal View Road.' : 'Arriving in about 35 to 45 minutes.';
    $('#done-pay').textContent = `${formatRs(t.total)}, ${pay === 'card' ? 'card machine' : 'cash'} ${pickup ? 'at the counter' : 'on delivery'}.`;
    const list = $('#done-items');
    list.innerHTML = '';
    t.names.forEach((n) => { const li = document.createElement('li'); li.textContent = `${order[n].qty} x ${n}`; list.appendChild(li); });
    $('#checkout-main').hidden = true;
    const done = $('#checkout-done');
    done.hidden = false;
    done.focus();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    showMessage(number, t, pickup);
    document.dispatchEvent(new CustomEvent('order-clear'));
  });
  updateType();
})();