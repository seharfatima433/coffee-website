# Sundial Coffee Roasters: Coffee by the hour

Task 02 – Interactive Business Website (Devixo Solutions Web Development Internship)
Built by Sehar Fatima with plain HTML5, CSS3 and vanilla JavaScript. No frameworks or libraries.

**Concept:** a Lahore coffee roastery whose whole site follows the time of day. Drag the sundial on the home page and the sky, the sun or moon and the recommended drink change with the hour. The menu filters by time of day and opens on the current hour in Lahore.

## Pages
Home, About, Services (menu, catering, FAQ), Portfolio (gallery with lightbox), Contact (form, hours, map).

## JavaScript features (all in `js/main.js`)
1. Responsive navigation menu (mobile toggle)
2. Image/content sliders (arrows, dots, autoplay, keyboard)
3. FAQ accordion
4. Form validation (contact form and newsletter)
5. Scroll-to-top button and scroll progress bar
6. Dark mode with saved preference
7. Animated counters
8. Typing animation in the hero
9. Interactive sundial with drink recommendation
10. Order cart (saved in localStorage) and a demo checkout page (delivery or pickup, validation, order confirmation)
11. Menu filter by time of day, portfolio filter and lightbox
12. "Open now" badge (Asia/Karachi time) and scroll-reveal animations

## Structure
```
coffee-website/
  index.html  about.html  services.html  portfolio.html  contact.html  checkout.html
  css/style.css
  js/main.js
  images/  screenshots/
```

## Product photos
Put your product images (Espresso.jpg, brownie.png, combo.png, etc.) inside the `images/` folder. The Services page shows all 23 as product cards. If a file name does not match, that card simply shows a coloured placeholder until you rename the file.

## Make images load faster
If pages feel slow, run `python tools/optimize-images.py` once (needs `pip install pillow`). It shrinks every photo in `images/` to 900 px and keeps backups in `images/originals/`.

## Run it
Extract the zip fully, then open `index.html` (or use VS Code Live Server). Do not open it from inside the zip.

## Deploy (GitHub Pages)
Push the folder contents to a new repository, then Settings > Pages > Deploy from branch `main` / root.

## Before you submit: replace the placeholders
The address, phone, email and WhatsApp number are samples. Search for `+92 000 0000000` and `sundialcoffee.example`, and put your own details in. Add real photos to `images/` if you like.
