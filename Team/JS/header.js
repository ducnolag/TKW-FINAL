// Load header từ file header.html
    fetch('../html/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể load header.html');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Lỗi khi load header:', error);
        });
