// Check Time & Update UI
    function checkTime() {
        const now = new Date();
        const mins = now.getHours() * 60 + now.getMinutes();
        
        updateStatus('card-afternoon', 'status-afternoon', mins >= 810 && mins <= 1050);
        updateStatus('card-night', 'status-night', mins >= 1350 || mins <= 150);
    }

    function updateStatus(cardId, statusId, isActive) {
        const card = document.getElementById(cardId);
        const status = document.getElementById(statusId);
        if(!card) return;

        if(isActive) {
            card.classList.add('active'); card.classList.remove('wait');
            status.textContent = "ĐANG DIỄN RA";
        } else {
            card.classList.remove('active'); card.classList.add('wait');
            status.textContent = "SẮP DIỄN RA";
        }
    }
    checkTime(); setInterval(checkTime, 60000);