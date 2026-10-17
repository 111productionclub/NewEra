(function () {
  "use strict";

  var IMG = "assets/img/";

  var PRODUCTS = [
    {
      id: "biohazard",
      name: "\"BIOHAZARD\" t-shirt",
      price: 3500,
      status: "In stock",
      statusPixel: true,
      image: IMG + "biohazard.jpg",
      gallery: [IMG + "biohazard-main.jpg", IMG + "biohazard-mini-1.jpg", IMG + "biohazard-mini-2.jpg"],
      sizes: { baby: false, big: true, overbig: true },
      description: [
        "модель: оверсайз крой, декоративные наружные швы, накидка на спине",
        "акцентные элементы: вышивка, прочная DTF печать",
        "материал: футер трехнитка (100% хлопок)"
      ]
    },
    {
      id: "bomber",
      name: "«kill racing» bomber",
      price: 7700,
      status: "Sold Out",
      soldOut: true,
      image: IMG + "bomber.jpg",
      hideOnMobileRelated: true
    },
    {
      id: "pants",
      name: "pants «shadow»",
      price: 2800,
      status: "5 Remaining",
      dark: true,
      image: IMG + "pants.png",
      background: IMG + "pants-bg.jpg",
      hideOnMobileRelated: true
    },
    {
      id: "shorts",
      name: "shots «glow»",
      price: 3000,
      status: "In stock",
      dark: true,
      image: IMG + "shorts.jpg"
    }
  ];

  var SIZES = ["baby", "big", "overbig"];
  var STORAGE_KEY = "newera-cart";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function formatPrice(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  }

  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
    });
  }

  /* ---------- Cart state ---------- */

  var cart = loadCart();

  function loadCart() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data.filter(function (i) { return findProduct(i.id); }) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* storage unavailable */ }
    renderBadge();
  }

  function addToCart(id, size) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) {
        cart[i].qty += 1;
        saveCart();
        return;
      }
    }
    cart.push({ id: id, size: size, qty: 1 });
    saveCart();
  }

  function cartTotal() {
    return cart.reduce(function (sum, item) {
      return sum + findProduct(item.id).price * item.qty;
    }, 0);
  }

  function renderBadge() {
    var badge = $(".header__badge");
    if (!badge) return;
    var count = cart.reduce(function (n, i) { return n + i.qty; }, 0);
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  /* ---------- Cards ---------- */

  function cardHtml(p) {
    var cls = "card" + (p.dark ? " card--dark-text" : "") + (p.hideOnMobileRelated ? " card--hide-mobile" : "");
    var media = p.background
      ? '<img class="card__img card__img--bg" src="' + p.background + '" alt="">' +
        '<img class="card__img card__img--item" src="' + p.image + '" alt="' + escapeHtml(p.name) + '">'
      : '<img class="card__img" src="' + p.image + '" alt="' + escapeHtml(p.name) + '">';

    return (
      '<a class="' + cls + '" href="product.html?id=' + p.id + '">' +
        media +
        '<span class="card__status' + (p.statusPixel ? " card__status--pixel" : "") + '">' + p.status + "</span>" +
        '<span class="card__info">' +
          '<span class="card__name">' + escapeHtml(p.name) + "</span><br>" +
          '<span class="card__price">' + formatPrice(p.price) + "</span>" +
        "</span>" +
      "</a>"
    );
  }

  function renderGrids() {
    var grids = document.querySelectorAll("[data-products]");
    for (var i = 0; i < grids.length; i++) {
      grids[i].innerHTML = PRODUCTS.map(cardHtml).join("");
    }
  }

  /* ---------- Product page ---------- */

  function initProductPage() {
    var root = $("[data-product-page]");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var product = findProduct(params.get("id")) || PRODUCTS[0];
    var gallery = product.gallery || [product.image];
    var current = 0;
    var selectedSize = null;

    document.title = product.name + " — NewEra";

    $(".info__title", root).textContent = product.name;
    $(".info__price", root).textContent = formatPrice(product.price);

    var desc = $(".info__desc", root);
    desc.innerHTML = (product.description || []).map(function (line) {
      return "<p>" + escapeHtml(line) + "</p>";
    }).join("");

    /* gallery */
    var mainImg = $(".gallery__main img", root);
    var thumbs = $(".gallery__thumbs", root);
    var next = $(".gallery__next", root);
    var mainWrap = $(".gallery__main", root);

    if (product.background) {
      mainWrap.style.background = "url(" + product.background + ") center / cover";
      mainImg.style.objectFit = "contain";
    }

    thumbs.innerHTML = gallery.length > 1
      ? gallery.slice(1).map(function (src, i) {
          return '<button class="gallery__thumb" type="button" data-index="' + (i + 1) + '" aria-label="Фото ' + (i + 2) + '">' +
            '<img src="' + src + '" alt=""></button>';
        }).join("")
      : "";
    next.hidden = gallery.length < 2;

    function show(index) {
      current = (index + gallery.length) % gallery.length;
      mainImg.src = gallery[current];
      var buttons = thumbs.querySelectorAll(".gallery__thumb");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("is-active", +buttons[i].dataset.index === current);
      }
    }

    thumbs.addEventListener("click", function (e) {
      var btn = e.target.closest(".gallery__thumb");
      if (btn) show(+btn.dataset.index);
    });
    next.addEventListener("click", function () { show(current + 1); });
    show(0);

    /* sizes */
    var sizesBox = $(".sizes", root);
    var available = product.sizes || { baby: true, big: true, overbig: true };
    sizesBox.innerHTML = SIZES.map(function (s) {
      var disabled = product.soldOut || !available[s];
      return '<button class="size" type="button" data-size="' + s + '"' + (disabled ? " disabled" : "") + ">" + s + "</button>";
    }).join("");

    function selectSize(size) {
      selectedSize = size;
      var buttons = sizesBox.querySelectorAll(".size");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle("is-active", buttons[i].dataset.size === size);
        buttons[i].setAttribute("aria-pressed", buttons[i].dataset.size === size);
      }
    }

    sizesBox.addEventListener("click", function (e) {
      var btn = e.target.closest(".size");
      if (btn && !btn.disabled) selectSize(btn.dataset.size);
    });

    var firstAvailable = SIZES.filter(function (s) { return available[s]; });
    if (!product.soldOut) selectSize(firstAvailable.indexOf("big") !== -1 ? "big" : firstAvailable[0]);

    /* add to cart */
    var toCart = $(".to-cart", root);
    if (product.soldOut) {
      toCart.disabled = true;
      toCart.textContent = "Sold Out";
    }
    toCart.addEventListener("click", function () {
      if (!selectedSize) return;
      addToCart(product.id, selectedSize);
      openModal();
    });
  }

  /* ---------- Order modal ---------- */

  var modal;

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<section class="order" role="dialog" aria-modal="true" aria-labelledby="order-title">' +
        '<button class="order__close" type="button" aria-label="Закрыть">&times;</button>' +
        '<h2 class="order__title" id="order-title">ВАШ ЗАКАЗ:</h2>' +
        '<ul class="order__items"></ul>' +
        '<form class="form" novalidate>' +
          '<label class="field"><span class="field__label field__label--sm">Как с вами связатся?</span>' +
            '<input class="field__input" name="telegram" type="text" placeholder="Телеграм юз/ссылка на тг" required></label>' +
          '<label class="field"><span class="field__label">Телефон</span>' +
            '<input class="field__input" name="phone" type="tel" autocomplete="tel" required></label>' +
          '<label class="field"><span class="field__label field__label--lg">Какая доставка?</span>' +
            '<span class="field__select">' +
              '<select class="field__input" name="delivery" required>' +
                '<option value="" disabled selected hidden>Яндекс/сдэк/почта доставка</option>' +
                '<option value="yandex">Яндекс доставка</option>' +
                '<option value="cdek">СДЭК</option>' +
                '<option value="post">Почта России</option>' +
              "</select>" +
              '<img src="assets/icons/caret-down.svg" alt="">' +
            "</span></label>" +
          '<label class="field"><span class="field__label">Получатель(Фио Полностью)</span>' +
            '<input class="field__input" name="name" type="text" autocomplete="name" placeholder="Иванов Иван Иванович" required></label>' +
          '<label class="field"><span class="field__label">Адрес</span>' +
            '<input class="field__input" name="address" type="text" autocomplete="street-address" required></label>' +
          '<div class="consent">' +
            '<p class="consent__title">Согласие на обработку персональных данных</p>' +
            '<label class="consent__label"><input type="checkbox" name="agree" required>' +
              '<span>Я ознакомлен и согласен с <a href="#">политикой конфеденциальности</a></span></label>' +
          "</div>" +
          '<div class="totals">' +
            '<div class="totals__row"><span>Сумма</span><span data-sum></span></div>' +
            '<div class="totals__row"><span>Доставка</span><span class="totals__note">оплата доставки при получении</span></div>' +
            '<div class="totals__row totals__row--total"><span>Итого</span><span data-total></span></div>' +
          "</div>" +
          '<button class="submit" type="submit">Оформить заказ</button>' +
        "</form>" +
      "</section>";
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".order__close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    $(".order__items", modal).addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-action]");
      if (!btn) return;
      var item = cart[+btn.closest(".order-item").dataset.index];
      var action = btn.dataset.action;
      if (action === "plus") item.qty += 1;
      if (action === "minus") item.qty -= 1;
      if (action === "remove" || item.qty < 1) cart.splice(cart.indexOf(item), 1);
      saveCart();
      renderOrder();
    });

    $(".form", modal).addEventListener("submit", onSubmit);
    $(".form", modal).addEventListener("input", function (e) {
      e.target.classList.remove("is-invalid");
      if (e.target.name === "agree") e.target.closest(".consent").classList.remove("is-invalid");
    });
  }

  function renderOrder() {
    var list = $(".order__items", modal);
    if (!cart.length) {
      list.innerHTML = '<li class="order__empty">Корзина пуста</li>';
    } else {
      list.innerHTML = cart.map(function (item, index) {
        var p = findProduct(item.id);
        return (
          '<li class="order-item" data-index="' + index + '">' +
            '<img class="order-item__img" src="' + p.image + '" alt="">' +
            "<div>" +
              '<p class="order-item__name">' + escapeHtml(p.name) + "</p>" +
              '<p class="order-item__size">Размер: <b>' + item.size + "</b></p>" +
            "</div>" +
            '<div class="qty">' +
              '<button class="qty__btn qty__btn--plus" type="button" data-action="plus" aria-label="Добавить"></button>' +
              '<span class="qty__value">' + item.qty + "</span>" +
              '<button class="qty__btn qty__btn--minus" type="button" data-action="minus" aria-label="Убавить"></button>' +
            "</div>" +
            '<span class="order-item__price">' + formatPrice(p.price * item.qty) + "</span>" +
            '<button class="order-item__remove" type="button" data-action="remove" aria-label="Удалить"></button>' +
          "</li>"
        );
      }).join("");
    }
    var total = formatPrice(cartTotal());
    $("[data-sum]", modal).textContent = total;
    $("[data-total]", modal).textContent = total;
  }

  function onSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var valid = cart.length > 0;
    var fields = form.querySelectorAll("[required]");
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "";
      if (f.type === "checkbox") f.closest(".consent").classList.toggle("is-invalid", !ok);
      else f.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    }
    if (!valid) return;

    cart = [];
    saveCart();
    form.reset();
    renderOrder();
    var msg = document.createElement("p");
    msg.className = "order__success";
    msg.textContent = "Спасибо! Заказ оформлен, мы свяжемся с вами.";
    form.replaceWith(msg);
  }

  function openModal() {
    if (!modal) buildModal();
    renderOrder();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (!$(".form", modal)) {
      modal.remove();
      modal = null;
    }
  }

  /* ---------- Init ---------- */

  renderGrids();
  initProductPage();
  renderBadge();

  var cartBtn = $(".header__btn--cart");
  if (cartBtn) cartBtn.addEventListener("click", openModal);
})();
