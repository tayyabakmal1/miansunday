<div class="salespulse-popup {{ setting('salespulse_popup_style', 'style-default') }} {{ setting('salespulse_popup_position', 'bottom-left') }}" style="display:none;">
    <span class="salespulse-buyer">{{ buyer_name }}</span> from <span class="salespulse-city">{{ city }}</span>
    bought <span class="salespulse-product">{{ product_title }}</span>
    <span class="salespulse-time">{{ time_ago }}</span>
    <button class="salespulse-dismiss">&times;</button>
</div>

<script>
    window.salespulseConfig = {
        api_url: '{{ url('api/salespulse/notifications') }}',
        display_interval: {{ (int) setting('salespulse_display_interval', 15) }},
        popup_style: '{{ setting('salespulse_popup_style', 'style-default') }}',
        popup_position: '{{ setting('salespulse_popup_position', 'bottom-left') }}',
    };
</script>
<script src="{{ asset('vendor/core/plugins/salespulse/js/popup.js') }}"></script>
<link rel="stylesheet" href="{{ asset('vendor/core/plugins/salespulse/css/popup-styles.css') }}"> 