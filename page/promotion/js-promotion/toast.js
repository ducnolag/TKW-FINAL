// Toast
    const toastBox = document.createElement('div');
    toastBox.id = 'toast-box';
    document.body.appendChild(toastBox);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `<i class="fas fa-check-circle icon"></i><div class="toast-msg">${message}</div><div class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></div>`;
        toastBox.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 3000);
    }

    function copyCode(event, code) {
        event.stopPropagation();
        navigator.clipboard.writeText(code).then(() => { showToast('Đã lưu mã <strong>' + code + '</strong> vào bộ nhớ tạm!'); });
    }
