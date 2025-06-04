(function () {
    let interval = window.salespulseConfig?.display_interval || 15;
    let apiUrl = window.salespulseConfig?.api_url || '/api/salespulse/notifications';
    let analyticsUrl = window.salespulseConfig?.analytics_url || '/api/salespulse/analytics';
    let popupStyle = window.salespulseConfig?.popup_style || 'style-default';
    let popupPosition = window.salespulseConfig?.popup_position || 'bottom-left';
    let popupTemplate = document.querySelector('.salespulse-popup');
    if (!popupTemplate) return;
    popupTemplate.classList.add(popupStyle);
    popupTemplate.classList.add(popupPosition);
    let notifications = [];
    let current = 0;
    let timer = null;

    function fetchNotifications() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                notifications = data;
                current = 0;
                showNext();
            });
    }

    function showNext() {
        if (!notifications.length) return;
        let n = notifications[current];
        if (!n) return;
        popupTemplate.querySelector('.salespulse-buyer').textContent = n.buyer_name;
        popupTemplate.querySelector('.salespulse-city').textContent = n.city;
        popupTemplate.querySelector('.salespulse-product').textContent = n.product_title;
        popupTemplate.querySelector('.salespulse-time').textContent = n.time_ago;
        popupTemplate.style.display = 'block';
        popupTemplate.classList.add('fade-in');
        setTimeout(() => popupTemplate.classList.remove('fade-in'), 500);
        sendAnalytics(n.id || null, 'impression');
        timer = setTimeout(() => {
            popupTemplate.classList.add('fade-out');
            setTimeout(() => {
                popupTemplate.classList.remove('fade-out');
                popupTemplate.style.display = 'none';
                current = (current + 1) % notifications.length;
                showNext();
            }, 500);
        }, interval * 1000);
    }

    function sendAnalytics(id, type) {
        if (!analyticsUrl) return;
        fetch(analyticsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_id: id, event_type: type })
        });
    }

    popupTemplate.querySelector('.salespulse-dismiss').addEventListener('click', function () {
        clearTimeout(timer);
        popupTemplate.style.display = 'none';
        let n = notifications[current];
        if (n) sendAnalytics(n.id || null, 'dismiss');
        current = (current + 1) % notifications.length;
        showNext();
    });

    popupTemplate.addEventListener('click', function () {
        let n = notifications[current];
        if (n) sendAnalytics(n.id || null, 'click');
    });

    fetchNotifications();
})(); 