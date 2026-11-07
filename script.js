// ===== بيانات المنتجات =====
const products = [
  {
    id: 1,
    name: "هاتف ذكي أنيق",
    desc: "شاشة 6.5 بوصة، بطارية 5000mAh",
    price: 3500,
    category: "electronics",
    badge: "الأكثر مبيعاً",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  },
  {
    id: 2,
    name: "سماعات لاسلكية",
    desc: "عزل ضوضاء، بلوتوث 5.0",
    price: 450,
    category: "electronics",
    badge: null,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  },
  {
    id: 3,
    name: "ساعة ذكية",
    desc: "مقاومة للماء، تتبع اللياقة",
    price: 1200,
    category: "electronics",
    badge: "جديد",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    id: 4,
    name: "حذاء رياضي",
    desc: "خفيف ومريح للاستخدام اليومي",
    price: 650,
    category: "fashion",
    badge: null,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    id: 5,
    name: "حقيبة جلدية",
    desc: "تصميم عصري، مساحة واسعة",
    price: 850,
    category: "fashion",
    badge: null,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  },
  {
    id: 6,
    name: "نظارة شمسية",
    desc: "حماية UV400، إطار خفيف",
    price: 320,
    category: "fashion",
    badge: "خصم 20%",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
  },
  {
    id: 7,
    name: "مصباح مكتب",
    desc: "إضاءة LED قابلة للتعديل",
    price: 280,
    category: "home",
    badge: null,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
  },
  {
    id: 8,
    name: "وسادة مريحة",
    desc: "ميموري فوم لدعم الرقبة",
    price: 190,
    category: "home",
    badge: null,
    img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80",
  },
];

let cart = JSON.parse(localStorage.getItem("noorCart")) || [];

// ===== عرض المنتجات =====
function renderProducts(filter = "all") {
  const grid = document.getElementById("productsGrid");
  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  grid.innerHTML = filtered
    .map(
      (p) => `
    <div class="card">
      <div class="card-img">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <span class="price">${p.price.toLocaleString()} ج.م</span>
          <button class="add-btn" onclick="addToCart(${p.id})">أضف</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ===== الفلاتر =====
function filterProducts(cat, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(cat);
}

// ===== السلة =====
function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    const product = products.find((p) => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  showToast();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
  }
}

function saveCart() {
  localStorage.setItem("noorCart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;

  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">سلة التسوق فارغة</p>';
    totalEl.textContent = "0 ج.م";
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>${(item.price * item.qty).toLocaleString()} ج.م</span>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})">🗑</button>
    </div>
  `,
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = total.toLocaleString() + " ج.م";
}

function openCart() {
  document.getElementById("cartPanel").classList.add("active");
  document.getElementById("cartOverlay").classList.add("active");
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
}

function checkout() {
  if (cart.length === 0) {
    alert("سلة التسوق فارغة!");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  alert(
    `تم تأكيد طلبك بنجاح!\nالإجمالي: ${total.toLocaleString()} ج.م\nشكراً لتسوقك معنا.`,
  );
  cart = [];
  saveCart();
  closeCart();
}

// ===== إشعار =====
let toastTimer;
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

// ===== القائمة =====
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

// ===== النشرة =====
function subscribe(e) {
  e.preventDefault();
  alert("شكراً لاشتراكك في نشرتنا!");
  e.target.reset();
}

// ===== تهيئة =====
renderProducts();
updateCartUI();
