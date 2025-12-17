/**
 * QUẢN LÝ BREADCRUMB VÀ TIÊU ĐỀ ĐỘNG CHO TRANG DETAIL
 * Dùng dữ liệu sản phẩm từ URL parameter để cập nhật breadcrumb
 */

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.warn('⚠️ Không có ID sản phẩm trong URL');
        return;
    }

    try {
        // Lấy dữ liệu sản phẩm
        const response = await fetch('/data/product.json');
        if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm');
        
        const data = await response.json();
        
        // Tìm sản phẩm theo ID
        let product = null;
        for (const category in data) {
            const found = data[category].find(item => item.id == productId);
            if (found) {
                product = found;
                break;
            }
        }

        if (!product) {
            console.warn(`⚠️ Không tìm thấy sản phẩm với ID: ${productId}`);
            return;
        }

        // Xác định danh mục sản phẩm
        let categoryName = 'Sản phẩm';
        let categoryLink = '/page/category/product/product.htm';
        
        // Nếu có thông tin danh mục trong sản phẩm
        if (product.category) {
            categoryName = product.category;
        }

        // Cập nhật breadcrumb động
        if (typeof renderBreadcrumb === 'function') {
            renderBreadcrumb([
                { name: categoryName, link: categoryLink },
                { name: product.title, link: "" }
            ]);
        }

        // Cập nhật tiêu đề trang
        document.title = product.title + ' - Tiệm Ăn Vặt';
        
        // Cập nhật h1 tiêu đề sản phẩm nếu có
        const pageMainTitle = document.querySelector('.page-main-title');
        if (pageMainTitle) {
            pageMainTitle.textContent = product.title;
        }

        console.log('✅ Breadcrumb đã cập nhật cho sản phẩm:', product.title);

    } catch (error) {
        console.error('❌ Lỗi khi cập nhật breadcrumb:', error);
    }
});
