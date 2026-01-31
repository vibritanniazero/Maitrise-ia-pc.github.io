/*
  script.js
  - SPA navigation (pushState + back)
  - Theme switch + localStorage
  - Language translation via internal JSON dictionary
  - Ebooks data and cart + WhatsApp integration
  - Cleanly commented and easy to edit
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ================== CONFIG / DATA ================== */
  const WHATSAPP_NUMBER = '22577229057';

  // Ebooks list (24)
  const EBOOKS = [
    'compte et finance',
    'Communication',
    'cours Photoshop',
    'adobe Photo',
    'Amour & Sexe',
    'Developement personnel',
    'Cerveaux',
    'e-commerce, Marketing digital',
    'Économie',
    'Entrepreneuriat',
    '500 Idée Business',
    'Bibliographie',
    'Agricultures et élevages',
    "Maîtrise l'anglais en 15 jours",
    'Formation sur WhatsApp business',
    'Formation sur Facebook',
    'Formation sur Télégram',
    'Faire des vents sur les réseaux sociaux',
    "L'art de se lancer dans le business",
    'Formation Microsoft Word',
    'Formation Microsoft Excel',
    'Formation sur les IA',
    'Formation sur les Programmations',
    'Apprendre à Hacker légalement'
  ];

  // Group definitions
  const GROUPS = {
    'ultime1': { label: 'Ultimate Pack 1 (1–14)', from:1, to:14, priceRev:8000, pricePers:4999 },
    'ultime2': { label: 'Ultimate Pack 2 (15–19)', from:15, to:19, priceRev:5000, pricePers:3500 },
    'ultime3': { label: 'Ultimate Pack 3 (20–24)', from:20, to:24, priceRev:5000, pricePers:3900 }
  };

  // Internal JSON dictionary for translations
  const DICT = {
    fr: {
      home_title: "Welcome to the official ebook sales website MAÎTRISE IA & PC. Here you will find all the necessary trainings for your growth in digitalization, technology, and artificial intelligence.",
      view_ebooks: "📘 View the ebooks",
      wholesale_intro: "Welcome to this section. You are purchasing ebooks in bulk with an authorized reseller certificate, allowing you to sell them legally in your country.",
      personal_intro: "In this section, you may buy ultimate packs or individual ebooks for your personal training. Any reproduction or resale is strictly prohibited and protected by copyright.",
      show_list: "Show list",
      send_whatsapp: "Send order via WhatsApp",
      clear_cart: "Clear"
    },
    en: {
      home_title: "Bienvenue — Formation pratique et ebooks professionnels pour maîtriser les outils numériques, les IA et les compétences PC.",
      view_ebooks: "📘 Voir les ebooks",
      wholesale_intro: "Bienvenue dans cette section. Vous achetez des ebooks en gros avec un certificat revendeur autorisé, ce qui vous permet de les vendre légalement dans votre pays.",
      personal_intro: "Dans cette section, vous pouvez acheter des packs ou des ebooks individuels pour votre formation personnelle. Toute reproduction ou revente est strictement interdite et protégée par le droit d'auteur.",
      show_list: "Afficher la liste",
      send_whatsapp: "Envoyer la commande via WhatsApp",
      clear_cart: "Vider"
    }
  };

  /* ================== STATE + PERSISTENCE ================== */
  const app = document.getElementById('app');
  let cart = JSON.parse(localStorage.getItem('maitrise_cart') || '[]');
  let theme = localStorage.getItem('maitrise_theme') || 'light';
  let lang = localStorage.getItem('maitrise_lang') || 'fr';

  // Apply initial preferences
  document.body.setAttribute('data-theme', theme);
  app.setAttribute('data-theme', theme);
  app.setAttribute('data-lang', lang);
  document.getElementById('languageSelect').value = lang;
  document.getElementById('themeSwitch').checked = (theme === 'dark');
  document.getElementById('toggleLang').textContent = lang.toUpperCase();
  document.getElementById('toggleTheme').textContent = theme === 'dark' ? 'Dark' : 'Light';

  /* ================== SPA NAVIGATION ================== */
  const pages = Array.from(document.querySelectorAll('.page'));
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const backBtn = document.getElementById('backBtn');

  function showPage(id, push = true) {
    // hide all, show requested
    pages.forEach(p => {
      if (p.id === 'page-' + id) {
        p.classList.add('active'); p.setAttribute('aria-hidden','false');
      } else {
        p.classList.remove('active'); p.setAttribute('aria-hidden','true');
      }
    });
    tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
    // update history
    if (push) history.pushState({ page: id }, '', `#${id}`);
  }

  // click tabs
  tabs.forEach(t => {
    t.addEventListener('click', () => showPage(t.dataset.target));
  });

  // go to ebooks from hero
  document.getElementById('gotoEbooks').addEventListener('click', () => showPage('ebooks'));

  // Back button (browser-like)
  backBtn.addEventListener('click', () => history.back());

  // Handle back/forward
  window.addEventListener('popstate', (ev) => {
    const state = ev.state;
    if (state && state.page) showPage(state.page, false);
    else {
      // default to home
      showPage('home', false);
    }
  });

  // On load, navigate to hash if present
  const initialHash = location.hash.replace('#','');
  if (initialHash) showPage(initialHash, false);
  else showPage('home', false);

  /* ================== DROPDOWN TOP MENU ================== */
  const dotsBtn = document.getElementById('dotsBtn');
  const topDropdown = document.getElementById('topDropdown');
  dotsBtn.addEventListener('click', (e) => {
    topDropdown.classList.toggle('hidden');
    topDropdown.setAttribute('aria-hidden', topDropdown.classList.contains('hidden'));
  });
  // close dropdown clicking outside
  document.addEventListener('click', (e) => {
    if (!dotsBtn.contains(e.target) && !topDropdown.contains(e.target)) {
      topDropdown.classList.add('hidden');
      topDropdown.setAttribute('aria-hidden','true');
    }
  });

  /* ================== THEME SWITCH ================== */
  const themeSwitch = document.getElementById('themeSwitch');
  function applyTheme(t) {
    theme = t;
    document.body.setAttribute('data-theme', t);
    app.setAttribute('data-theme', t);
    localStorage.setItem('maitrise_theme', t);
    document.getElementById('toggleTheme').textContent = t === 'dark' ? 'Dark' : 'Light';
  }
  themeSwitch.addEventListener('change', (e) => applyTheme(e.target.checked ? 'dark' : 'light'));

  /* ================== LANGUAGE TRANSLATION ================== */
  const languageSelect = document.getElementById('languageSelect');
  function applyLanguage(l) {
    lang = l;
    localStorage.setItem('maitrise_lang', lang);
    app.setAttribute('data-lang', lang);
    document.getElementById('toggleLang').textContent = lang.toUpperCase();
    // Update strings based on DICT
    const dict = DICT[lang] || DICT.fr;
    // Home text
    document.querySelector('.welcome-text').textContent = dict.home_title;
    // Buttons / UI labels
    document.getElementById('gotoEbooks').textContent = dict.view_ebooks;
    document.getElementById('showWholesaleList').textContent = dict.show_list;
    document.getElementById('sendWhatsAppBtn').textContent = dict.send_whatsapp;
    document.getElementById('clearCartBtn').textContent = dict.clear_cart;
  }
  languageSelect.addEventListener('change', (e) => applyLanguage(e.target.value));
  document.getElementById('toggleLang').addEventListener('click', () => {
    const next = (lang === 'fr') ? 'en' : 'fr';
    languageSelect.value = next;
    applyLanguage(next);
  });

  // Apply initial language
  applyLanguage(lang);

  /* ================== RENDER EBOOKS (wholesale & individual) ================== */
  const wholesaleListEl = document.getElementById('wholesaleList');
  const showWholesaleBtn = document.getElementById('showWholesaleList');
  showWholesaleBtn.addEventListener('click', () => {
    wholesaleListEl.classList.toggle('hidden');
    if (!wholesaleListEl.classList.contains('hidden')) renderWholesale();
  });

  function renderWholesale() {
    wholesaleListEl.innerHTML = '';
    Object.keys(GROUPS).forEach(key => {
      const g = GROUPS[key];
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h4>${g.label}</h4>
        <div class="muted">Includes ebooks ${g.from} to ${g.to}</div>
        <p class="muted" style="margin-top:8px">Short description: A complete pack covering the main topics to kickstart training and resell legally with authorization.</p>
        <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
          <div class="price">${g.priceRev} Fr</div>
          <button class="btn" onclick="addGroupToCart('${key}', false)">Add to cart</button>
        </div>
      `;
      wholesaleListEl.appendChild(card);
    });
  }

  // Render individual ebooks
  const individualContainer = document.getElementById('individualEbooks');
  function renderIndividuals() {
    individualContainer.innerHTML = '';
    EBOOKS.forEach((title, idx) => {
      const id = idx + 1;
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = `
        <h4>${id}. ${title}</h4>
        <div class="muted">Price: 999 Fr</div>
        <div style="margin-top:10px"><button class="btn" onclick="toggleIndividual(${id})">Add to cart</button></div>
      `;
      individualContainer.appendChild(c);
    });
  }
  renderIndividuals();

  /* ================== CART MANAGEMENT ================== */
  const cartListEl = document.getElementById('cartList');
  const cartTotalEl = document.getElementById('cartTotal');

  function saveCart() {
    localStorage.setItem('maitrise_cart', JSON.stringify(cart));
  }

  function recalcCartUI() {
    // Show cart items
    cartListEl.innerHTML = '';
    if (cart.length === 0) {
      cartListEl.innerHTML = '<div class="muted">Cart is empty</div>';
      cartTotalEl.textContent = '0';
      return;
    }
    let total = 0;
    cart.forEach((it, i) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<div>${i+1}. ${it.title}</div><div>${it.price ? it.price + ' Fr' : ''} <button class="icon-btn" onclick="removeFromCart(${i})">✖</button></div>`;
      cartListEl.appendChild(div);
      total += it.price || 0;
    });
    cartTotalEl.textContent = total;
  }

  // Public functions used by onclick in HTML
  window.addGroupToCart = function(groupKey, personal){
    const g = GROUPS[groupKey];
    if(!g) return alert('Group not found');
    const id = groupKey + (personal ? '_pers' : '_rev');
    // avoid duplicates
    if(cart.find(x=>x.id === id)) return alert('Already in cart');
    const price = personal ? g.pricePers : g.priceRev;
    cart.push({ id, title: (g.label + (personal ? ' — Personal' : ' — Reseller')), price });
    saveCart(); recalcCartUI();
    alert('Added to cart');
  };

  window.toggleIndividual = function(id){
    const idx = cart.findIndex(c => c.id === ('ebook_' + id));
    if(idx >= 0){
      cart.splice(idx,1);
      saveCart(); recalcCartUI();
      alert('Removed from cart');
      return;
    }
    const title = `${id}. ${EBOOKS[id-1]}`;
    cart.push({ id: 'ebook_' + id, title, price: 999 });
    saveCart(); recalcCartUI();
    alert('Added to cart');
  };

  window.addToCart = function(text){
    // fallback if used elsewhere
    cart.push({ id: 'misc_' + Date.now(), title: text, price: 0 });
    saveCart(); recalcCartUI();
    alert('Added to cart');
  };

  window.removeFromCart = function(index){
    if(index >= 0 && index < cart.length){
      cart.splice(index,1);
      saveCart(); recalcCartUI();
    }
  };

  document.getElementById('clearCartBtn').addEventListener('click', () => {
    if (!confirm('Clear cart?')) return;
    cart = [];
    saveCart(); recalcCartUI();
  });

  // init cart UI
  recalcCartUI();

  /* ================== WHATSAPP INTEGRATION ================== */
  document.getElementById('sendWhatsAppBtn').addEventListener('click', () => {
    if (cart.length === 0) return alert('Your cart is empty');
    let total = 0;
    const lines = ['Hello, I want to order the following ebooks:'];
    cart.forEach(it => {
      lines.push('- ' + it.title + (it.price ? ` (${it.price} Fr)` : ''));
      total += it.price || 0;
    });
    lines.push('');
    lines.push(`Total: ${total} Fr`);
    lines.push('Payment: Orange Money or Wave');
    lines.push('Contact: +225 07 77 22 9057');
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
  });

  /* ================== TOP MENU ACTIONS (Share) ================== */
  document.getElementById('sharePage').addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: 'MAITRISE IA & PC', text: 'Discover training ebooks', url: location.href }).catch(()=>{});
    } else {
      prompt('Copy this link to share', location.href);
    }
  });

  /* ================== RESET PREFS ================== */
  document.getElementById('resetPrefs').addEventListener('click', () => {
    if (!confirm('Reset preferences and clear cart?')) return;
    localStorage.removeItem('maitrise_theme'); localStorage.removeItem('maitrise_lang'); localStorage.removeItem('maitrise_cart');
    location.reload();
  });

  /* ================== UTILITY: Send (legacy) example ================== */
  // Optionally pre-render initial wholesale if user navigates directly
  // Render wholesale if visible
  if (!document.getElementById('wholesaleList').classList.contains('hidden')) renderWholesale();

  /* ================== FIN ================== */
});
// ==============================
// SYSTÈME DE NOTATION + AVIS
// ==============================

let selectedStars = 0;

// Gestion du clic sur les étoiles
document.querySelectorAll(".stars span").forEach(star => {
  star.addEventListener("click", () => {
    // Forcer la valeur en NOMBRE
    selectedStars = parseInt(star.dataset.value);

    // Mise à jour visuelle des étoiles
    document.querySelectorAll(".stars span").forEach(s => {
      s.classList.toggle(
        "active",
        parseInt(s.dataset.value) <= selectedStars
      );
    });
  });
});

// Soumission de l'avis
function submitReview() {
  const comment = document.getElementById("comment").value.trim();

  if (selectedStars === 0 || comment.length < 10) {
    alert("Veuillez donner une note et écrire un commentaire d'au moins 10 caractères.");
    return;
  }

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  reviews.push({
    stars: selectedStars, // bien un NUMBER
    comment: comment,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("reviews", JSON.stringify(reviews));

  // Réinitialisation
  document.getElementById("comment").value = "";
  selectedStars = 0;

  // Réinitialiser les étoiles visuellement
  document.querySelectorAll(".stars span").forEach(s => {
    s.classList.remove("active");
  });

  displayReviews();
}

// Affichage des avis
function displayReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const container = document.getElementById("reviewsList");
  container.innerHTML = "";

  reviews.forEach(r => {
    container.innerHTML += `
      <div class="review">
        <div class="review-stars">
          ${"★".repeat(Number(r.stars))}${"☆".repeat(5 - Number(r.stars))}
        </div>
        <p>${r.comment}</p>
        <small>${r.date}</small>
      </div>
    `;
  });
}

// Charger les avis au démarrage
displayReviews();
    
