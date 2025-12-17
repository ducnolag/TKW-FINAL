const newsData = [
  {
    id: 1,
    title: "Mừng tiệm lên 3 tuổi",
    category: "Sự kiện",
    date: "09/11/2025",
    excerpt: "Thời gian thật nhanh! Mới ngày nào TIỆM ĂN VẶT NGON NHẤT THẾ GIỚI còn \"khởi nghiệp\" với bao bỡ ngỡ, vậy mà hôm nay, chúng mình đã cùng nhau đi qua chặng đường 3 năm rực rỡ và đầy nỗ lực rồi cả nhà ơi! Hãy cùng nhìn lại những khoảnh khắc đáng nhớ và những thành tựu mà chúng ta đã đạt được trong suốt hành trình vừa qua nhé!",
    image: "https://static.vecteezy.com/system/resources/previews/023/633/867/non_2x/hello-summer-banner-background-with-oranges-and-ice-cream-summer-tropical-design-vector.jpg",
    url: "news-detail1.html"
  },
  {
    id: 2,
    title: "Đối tác Uy tín trên ShopeeFood & GrabFood!",
    category: "Thông báo",
    date: "25/08/2025",
    excerpt: "Chúng tôi vô cùng tự hào thông báo về cột mốc quan trọng vừa đạt được: chính thức nhận danh hiệu \"Đối tác uy tín\" từ các nền tảng giao hàng hàng đầu!",
    image: "https://static.wixstatic.com/media/3879c1_3a81c20469204007ae297e31dfff3ae2~mv2.png/v1/fill/w_664,h_434,al_c,lg_1,q_85/3879c1_3a81c20469204007ae297e31dfff3ae2~mv2.png",
    url: "news-detail3.html"
  },
  {
    id: 3,
    title: "Tiệm chính thức cán mốc 10.000 gói mì Indomie được bán ra!",
    category: "Khuyến mãi",
    date: "25/08/2025",
    excerpt: "WOA! Tiệm xin phép được \"khoe\" với cả nhà một tin vui cực kỳ \"chấn động\" trong tuần này: Chúng ta đã chính thức vượt mốc 10.000 gói mì Indomie được ship đi thành công!Đây là một cột mốc vô cùng ý nghĩa, đánh dấu sự tin tưởng và ủng hộ to lớn từ phía khách hàng dành cho Tiệm trong suốt thời gian qua. ",
    image: "https://png.pngtree.com/background/20230601/original/pngtree-happy-birthday-banner-design-vector-picture-image_2829303.jpg",
    url: "news-detail2.html"
  }
];

let currentCategory = "all"; // mặc định theo sidebar active
let currentKeyword = "";

// tìm kiếm tiếng Việt không dấu
function normalizeText(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getFilteredPosts() {
  const kw = normalizeText(currentKeyword);

  return newsData.filter(p => {
    const matchCat = !currentCategory || currentCategory === "all"
      ? true
      : p.category === currentCategory;

    const matchKw = !kw
      ? true
      : normalizeText(p.title).includes(kw) || normalizeText(p.excerpt).includes(kw);

    return matchCat && matchKw;
  });
}

function renderPosts(list) {
  const el = document.getElementById("news-list");
  if (!el) return;

  if (!list.length) {
    el.innerHTML = `<div class="alert alert-warning">Không tìm thấy bài viết phù hợp.</div>`;
    return;
  }

  el.innerHTML = list.map(p => `
    <div class="news-card mb-4">
      <div class="news-thumbnail">
        <img src="${p.image}" alt="${p.title}">
      </div>

      <div class="news-content">
        <div class="news-meta">
          <span class="meta-item">
            <i class="fas fa-tag"></i>
            <span class="post-category" data-category="${p.category}">${p.category}</span>
          </span>
          <span class="meta-item">
            <i class="fas fa-calendar-alt"></i> ${p.date}
          </span>
        </div>

        <h3 class="news-title">
          <a href="${p.url}">${p.title}</a>
        </h3>

        <p class="news-excerpt">${p.excerpt}</p>

        <a class="btn-read-more" href="${p.url}">
          Đọc tiếp <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join("");
}

function applyAndRender() {
  renderPosts(getFilteredPosts());
}

// hàm này sẽ được load-sidebar.js gọi sau khi sidebar inject xong
window.bindSidebarEvents = function () {
  // click danh mục
  document.querySelectorAll(".category-menu a[data-category]").forEach(a => {
    a.addEventListener("click", (e) => {
      e.preventDefault();

      currentCategory = a.dataset.category || "all";

      document.querySelectorAll(".category-menu li").forEach(li => li.classList.remove("active"));
      a.closest("li")?.classList.add("active");

      applyAndRender();
    });
  });

  // search
  const input = document.getElementById("search-input");
  const btn = document.getElementById("btn-search");

  btn?.addEventListener("click", () => {
    currentKeyword = input?.value || "";
    applyAndRender();
  });

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      currentKeyword = input.value || "";
      applyAndRender();
    }
  });
};

// render lần đầu (theo category mặc định)
document.addEventListener("DOMContentLoaded", () => {
  applyAndRender();
});
