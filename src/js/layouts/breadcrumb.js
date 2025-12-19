/**
 * HÀM TẠO BREADCRUMB TỰ ĐỘNG
 * @param {Array} items - Danh sách các mục: [{ name: "Tên", link: "url" }, ...]
 * @param {String} containerId - ID của thẻ div chứa breadcrumb
 */
function renderBreadcrumb(items, containerId = 'breadcrumb-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. Tạo HTML hiển thị
    let html = `<nav aria-label="breadcrumb" class="breadcrumb-wrapper">
                    <ol class="breadcrumb-list">
                        <li class="breadcrumb-item">
                            <a href="/index.htm"><i class="fa-solid fa-house"></i> Trang chủ</a>
                        </li>`;

    // 2. Tạo dữ liệu Schema JSON-LD cho SEO
    let schemaData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": window.location.origin + "/index.html"
        }]
    };

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const position = index + 2;

        // Thêm dấu phân cách
        html += `<li class="breadcrumb-separator"><i class="fa-solid fa-chevron-right"></i></li>`;

        if (isLast) {
            // Mục cuối cùng (Active)
            html += `<li class="breadcrumb-item active" aria-current="page">${item.name}</li>`;
        } else {
            // Các mục ở giữa (Có link)
            html += `<li class="breadcrumb-item">
                        <a href="${item.link}">${item.name}</a>
                     </li>`;
        }

        // Thêm vào Schema
        schemaData.itemListElement.push({
            "@type": "ListItem",
            "position": position,
            "name": item.name,
            "item": item.link ? (window.location.origin + item.link) : undefined
        });
    });

    html += `   </ol>
             </nav>`;

    // 3. Render ra màn hình
    container.innerHTML = html;

    // 4. Inject Schema vào Head (Tốt cho Google Search)
    const oldScript = document.getElementById('breadcrumb-schema');
    if (oldScript) oldScript.remove();
    
    const script = document.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
}