(function ($) {
    'use strict';

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    let showError = message => {
        window.showAlert('alert-danger', message);
    }

    let showSuccess = message => {
        window.showAlert('alert-success', message);
    }

    let handleError = data => {
        if (typeof (data.errors) !== 'undefined' && data.errors.length) {
            handleValidationError(data.errors);
        } else if (typeof (data.responseJSON) !== 'undefined') {
            if (typeof (data.responseJSON.errors) !== 'undefined') {
                if (data.status === 422) {
                    handleValidationError(data.responseJSON.errors);
                }
            } else if (typeof (data.responseJSON.message) !== 'undefined') {
                showError(data.responseJSON.message);
            } else {
                $.each(data.responseJSON, (index, el) => {
                    $.each(el, (key, item) => {
                        showError(item);
                    });
                });
            }
        } else {
            showError(data.statusText);
        }
    }

    let handleValidationError = errors => {
        let message = '';

        $.each(errors, (index, item) => {
            if (message !== '') {
                message += '<br />';
            }
            message += item;
        });

        showError(message);
    }

    window.showAlert = (messageType, message) => {
        if (messageType && message !== '') {
            let alertId = Math.floor(Math.random() * 1000);

            let html = `<div class="alert ${messageType} alert-dismissible" id="${alertId}">
                <span class="btn-close" data-bs-dismiss="alert" aria-label="close"></span>
                <i class="fas fa-` + (messageType === 'alert-success' ? 'check-circle' : 'exclamation-circle') + ` message-icon"></i>
                ${message}
            </div>`;

            $('#alert-container').append(html).ready(() => {
                window.setTimeout(() => {
                    $(`#alert-container #${alertId}`).remove();
                }, 6000);
            });
        }
    }

    let isRTL = $('body').prop('dir') === 'rtl';

    $(document).ready(function () {

        if (jQuery().mCustomScrollbar) {
            $('.ps-custom-scrollbar').mCustomScrollbar({
                theme: 'dark',
                scrollInertia: 0
            });
        }

        window.onBeforeChangeSwatches = function (data) {
            $('.add-to-cart-form .error-message').hide();
            $('.add-to-cart-form .success-message').hide();
            $('.number-items-available').html('').hide();

            if (data && data.attributes) {
                $('.add-to-cart-form button[type=submit]').prop('disabled', true).addClass('btn-disabled');
            }
        }

        window.onChangeSwatchesSuccess = function (res) {
            $('.add-to-cart-form .error-message').hide();
            $('.add-to-cart-form .success-message').hide();

            if (res) {
                let buttonSubmit = $('.add-to-cart-form button[type=submit]');
                if (res.error) {
                    buttonSubmit.prop('disabled', true).addClass('btn-disabled');
                    $('.number-items-available').html('<span class="text-danger">(' + res.message + ')</span>').show();
                    $('.hidden-product-id').val('');
                } else {
                    $('.add-to-cart-form').find('.error-message').hide();
                    $('.product-price ins span.text-brand').text(res.data.display_sale_price);
                    if (res.data.sale_price !== res.data.price) {
                        $('.product-price ins span.old-price').text(res.data.display_price).show();
                        $('.product-price span.save-price .percentage-off').text(res.data.sale_percentage);
                        $('.product-price span.save-price').show();
                    } else {
                        $('.product-price ins span.old-price').hide();
                        $('.product-price span.save-price').hide();
                    }

                    $('.sku_wrapper .value').text(res.data.sku);

                    $('.hidden-product-id').val(res.data.id);

                    buttonSubmit.prop('disabled', false).removeClass('btn-disabled');

                    if (res.data.error_message) {
                        buttonSubmit.prop('disabled', true).addClass('btn-disabled');
                        $('.number-items-available').html('<span class="text-danger">(' + res.data.error_message + ')</span>').show();
                    } else if (res.data.success_message) {
                        $('.number-items-available').html('<span class="text-success">(' + res.data.success_message + ')</span>').show();
                    } else {
                        $('.number-items-available').html('').hide();
                    }

                    const unavailableAttributeIds = res.data.unavailable_attribute_ids || [];
                    $('.attribute-swatch-item').removeClass('pe-none');
                    $('.product-filter-item option').prop('disabled', false);
                    if (unavailableAttributeIds && unavailableAttributeIds.length) {
                        unavailableAttributeIds.map(function (id) {
                            let $item = $('.attribute-swatch-item[data-id="' + id + '"]');
                            if ($item.length) {
                                $item.addClass('pe-none');
                                $item.find('input').prop('checked', false);
                            } else {
                                $item = $('.product-filter-item option[data-id="' + id + '"]');
                                if ($item.length) {
                                    $item.prop('disabled', 'disabled').prop('selected', false);
                                }
                            }
                        });
                    }

                    let slider = $('.product-image-slider');

                    slider.slick('unslick');

                    let imageHtml = '';
                    res.data.image_with_sizes.origin.forEach(function (item) {
                        imageHtml += '<figure class="border-radius-10"><a href="' + item + '"><img src="' + item + '" alt="image"/></a></figure>'
                    });

                    slider.html(imageHtml);

                    slider.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        rtl: isRTL,
                        arrows: false,
                        fade: false,
                        asNavFor: '.slider-nav-thumbnails',
                    });

                    let sliderThumbnail = $('.slider-nav-thumbnails');

                    sliderThumbnail.slick('unslick');

                    let thumbHtml = '';
                    res.data.image_with_sizes.thumb.forEach(function (item) {
                        thumbHtml += '<div class="item"><img src="' + item + '" alt="image"/></div>'
                    });

                    sliderThumbnail.html(thumbHtml);

                    sliderThumbnail.slick({
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        rtl: isRTL,
                        asNavFor: '.product-image-slider',
                        dots: false,
                        focusOnSelect: true,
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>'
                    });

                    // Remove active class from all thumbnail slides
                    sliderThumbnail.find('.slick-slide').removeClass('slick-active');

                    // Set active class to first thumbnail slides
                    sliderThumbnail.find('.slick-slide').eq(0).addClass('slick-active');

                    // On before slide change match active thumbnail to current slide
                    slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                        let mySlideNumber = nextSlide;
                        sliderThumbnail.find('.slick-slide').removeClass('slick-active');
                        sliderThumbnail.find('.slick-slide').eq(mySlideNumber).addClass('slick-active');
                    });

                    slider.lightGallery({
                        selector: '.slick-slide:not(.slick-cloned) a',
                        thumbnail: true,
                        share: false,
                        fullScreen: false,
                        autoplay: false,
                        autoplayControls: false,
                        actualSize: false,
                    });
                }
            }
        };

        $(document).on('click', '.newsletter-form button[type=submit]', function (event) {
            event.preventDefault();
            event.stopPropagation();

            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                type: 'POST',
                cache: false,
                url: _self.closest('form').prop('action'),
                data: new FormData(_self.closest('form')[0]),
                contentType: false,
                processData: false,
                success: res => {
                    _self.removeClass('button-loading');

                    if (typeof refreshRecaptcha !== 'undefined') {
                        refreshRecaptcha();
                    }

                    if (!res.error) {
                        _self.closest('form').find('input[type=email]').val('');
                        showSuccess(res.message);
                    } else {
                        showError(res.message);
                    }
                },
                error: res => {
                    if (typeof refreshRecaptcha !== 'undefined') {
                        refreshRecaptcha();
                    }
                    _self.removeClass('button-loading');
                    handleError(res);
                }
            });
        });

        $(document).on('change', '.switch-currency', function () {
            $(this).closest('form').submit();
        });

        $(document).on('click', '.js-add-to-wishlist-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'POST',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.wishlist-count span').text(res.data.count);
                    _self.removeClass('button-loading');
                    _self.toggleClass('wis_added');

                    _self.removeClass('button-loading')
                        .removeClass('js-add-to-wishlist-button')
                        .addClass('js-remove-from-wishlist-button');
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.js-remove-from-wishlist-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'DELETE',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.wishlist-count span').text(res.data.count);
                    _self.removeClass('button-loading');

                    _self.closest('tr').remove();
                    _self.removeClass('js-remove-from-wishlist-button')
                        .addClass('js-add-to-wishlist-button');
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.js-add-to-compare-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'POST',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    $('.compare-count span').text(res.data.count);
                    window.showAlert('alert-success', res.message);

                    _self.removeClass('button-loading');
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.js-remove-from-compare-button', function (event) {
            event.preventDefault();
            let _self = $(this);
            let buttonHtml = _self.html();

            _self.html(buttonHtml + '...');

            $.ajax({
                url: _self.data('url'),
                method: 'DELETE',
                success: res => {

                    if (res.error) {
                        _self.text(buttonHtml);
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    $('.compare-count span').text(res.data.count);

                    $('.table__compare').load(window.location.href + ' .table__compare > *', function () {
                        window.showAlert('alert-success', res.message);

                        _self.html(buttonHtml);
                    });
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.add-to-cart-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.prop('disabled', true).addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'POST',
                data: {
                    id: _self.data('id')
                },
                dataType: 'json',
                success: res => {
                    _self.prop('disabled', false).removeClass('button-loading').addClass('active');

                    if (res.error) {
                        window.showAlert('alert-danger', res.message);

                        if (res.data.next_url !== undefined) {
                            window.location.href = res.data.next_url;
                        }

                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    if (res.data.next_url !== undefined) {
                        window.location.href = res.data.next_url;
                    } else {
                        $.ajax({
                            url: window.siteUrl + '/ajax/cart',
                            method: 'GET',
                            success: response => {
                                if (!response.error) {
                                    $('.cart-dropdown-wrap').html(response.data.html);
                                    $('.mini-cart-icon span').text(response.data.count);
                                }
                            }
                        });
                    }
                },
                error: res => {
                    _self.prop('disabled', false).removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.add-to-cart-form button[type=submit]', function (event) {
            event.preventDefault();
            event.stopPropagation();

            let _self = $(this);

            if (!$('.hidden-product-id').val()) {
                _self.prop('disabled', true).addClass('btn-disabled');
                return;
            }

            _self.prop('disabled', true).addClass('btn-disabled').addClass('button-loading');

            let $form = _self.closest('form');
            let data = $form.serializeArray();
            data.push({name: 'checkout', value: _self.prop('name') === 'checkout' ? 1 : 0});

            $.ajax({
                type: 'POST',
                url: $form.prop('action'),
                data: $.param(data),
                success: res => {
                    _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);

                        if (res.data.next_url !== undefined) {
                            window.location.href = res.data.next_url;
                        }

                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    if (res.data.next_url !== undefined) {
                        window.location.href = res.data.next_url;
                    } else {
                        $.ajax({
                            url: window.siteUrl + '/ajax/cart',
                            method: 'GET',
                            success: function (response) {
                                if (!response.error) {
                                    $('.cart-dropdown-wrap').html(response.data.html);
                                    $('.mini-cart-icon span').text(response.data.count);
                                }
                            }
                        });
                    }
                },
                error: res => {
                    _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                    handleError(res, _self.closest('form'));
                }
            });
        });

        $(document).on('click', '.remove-cart-item', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.closest('li').addClass('content-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'GET',
                success: res => {
                    _self.closest('li').removeClass('content-loading');

                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    $.ajax({
                        url: window.siteUrl + '/ajax/cart',
                        method: 'GET',
                        success: response => {
                            if (!response.error) {
                                $('.cart-dropdown-wrap').html(response.data.html);
                                $('.mini-cart-icon span').text(response.data.count);
                                window.showAlert('alert-success', res.message);
                            }
                        }
                    });
                },
                error: res => {
                    _self.closest('li').removeClass('content-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('click', '.remove-cart-button', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.closest('.table--cart').addClass('content-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'GET',
                success: function (res) {

                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        _self.closest('.table--cart').removeClass('content-loading');
                        return false;
                    }

                    $('.section--shopping-cart').load(window.location.href + ' .section--shopping-cart > *', function () {
                        _self.closest('.table--cart').removeClass('content-loading');
                        window.showAlert('alert-success', res.message);
                    });

                    $.ajax({
                        url: window.siteUrl + '/ajax/cart',
                        method: 'GET',
                        success: response => {
                            if (!response.error) {
                                $('.cart-dropdown-wrap').html(response.data.html);
                                $('.mini-cart-icon span').text(response.data.count);
                            }
                        }
                    });
                },
                error: res => {
                    _self.closest('.table--cart').removeClass('content-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(document).on('change', '.submit-form-on-change', function () {
            $(this).closest('form').submit();
        });

        $('.form-coupon-wrapper .coupon-code').keypress(event => {
            if (event.keyCode === 13) {
                $('.apply-coupon-code').trigger('click');
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });

        /**
         * Update Cart
         */
        $(document).on('click', '.detail-qty .qty-up', function (event) {
            event.preventDefault();
            event.stopPropagation();
            let qtyval = parseInt($(this).closest('.detail-qty').find('.qty-val').val(), 10);
            qtyval = qtyval + 1;
            $(this).closest('.detail-qty').find('input').val(qtyval);

            if ($(this).closest('.section--shopping-cart').length) {
                ajaxUpdateCart($(this));
            }
        });

        $(document).on('click', '.detail-qty .qty-down', function (event) {
            event.preventDefault();
            event.stopPropagation();
            let qtyval = parseInt($(this).closest('.detail-qty').find('.qty-val').val(), 10);

            qtyval = qtyval - 1;
            if (qtyval > 1) {
            } else {
                qtyval = 1;
            }

            $(this).closest('.detail-qty').find('input').val(qtyval);

            if (qtyval >= 0) {
                if ($(this).closest('.section--shopping-cart').length) {
                    ajaxUpdateCart($(this));
                }
            }
        });

        $(document).on('change', '.section--shopping-cart .detail-qty .qty-val', function () {
            ajaxUpdateCart($(this));
        });

        function ajaxUpdateCart(_self) {

            _self.closest('.table--cart').addClass('content-loading');

            $.ajax({
                type: 'POST',
                cache: false,
                url: _self.closest('form').prop('action'),
                data: new FormData(_self.closest('form')[0]),
                contentType: false,
                processData: false,
                success: res => {
                    if (res.error) {
                        window.showAlert('alert-danger', res.message);
                        _self.closest('.table--cart').removeClass('content-loading');
                        _self.closest('.detail-qty').find('.qty-val').text(res.data.count);
                        return false;
                    }

                    $('.section--shopping-cart').load(window.location.href + ' .section--shopping-cart > *', function () {
                        _self.closest('.table--cart').removeClass('content-loading');
                        window.showAlert('alert-success', res.message);
                    });

                    $.ajax({
                        url: window.siteUrl + '/ajax/cart',
                        method: 'GET',
                        success: response => {
                            if (!response.error) {
                                $('.cart-dropdown-wrap').html(response.data.html);
                                $('.mini-cart-icon span').text(response.data.count);
                            }
                        }
                    });
                },
                error: res => {
                    _self.closest('.table--cart').removeClass('content-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        }

        $(document).on('click', '.btn-apply-coupon-code', event => {
            event.preventDefault();
            let _self = $(event.currentTarget);
            _self.prop('disabled', true).addClass('btn-disabled').addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                type: 'POST',
                data: {
                    coupon_code: _self.closest('.form-coupon-wrapper').find('.coupon-code').val(),
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: res => {
                    if (!res.error) {
                        $('.section--shopping-cart').load(window.location.href + '?applied_coupon=1 .section--shopping-cart > *', function () {
                            _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                            window.showAlert('alert-success', res.message);
                        });
                    } else {
                        window.showAlert('alert-danger', res.message);
                        _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                    }
                },
                error: data => {
                    if (typeof (data.responseJSON) !== 'undefined') {
                        if (data.responseJSON.errors !== 'undefined') {
                            $.each(data.responseJSON.errors, (index, el) => {
                                $.each(el, (key, item) => {
                                    window.showAlert('alert-danger', item);
                                });
                            });
                        } else if (typeof (data.responseJSON.message) !== 'undefined') {
                            window.showAlert('alert-danger', data.responseJSON.message);
                        }
                    } else {
                        window.showAlert('alert-danger', data.status.text);
                    }
                    _self.prop('disabled', false).removeClass('btn-disabled').removeClass('button-loading');
                }
            });
        });

        $(document).on('click', '.btn-remove-coupon-code', event => {
            event.preventDefault();
            let _self = $(event.currentTarget);
            let buttonText = _self.text();
            _self.text(_self.data('processing-text'));

            $.ajax({
                url: _self.data('url'),
                type: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: res => {
                    if (!res.error) {
                        $('.section--shopping-cart').load(window.location.href + ' .section--shopping-cart > *', function () {
                            _self.text(buttonText);
                        });
                    } else {
                        window.showAlert('alert-danger', res.message);
                        _self.text(buttonText);
                    }
                },
                error: data => {
                    if (typeof (data.responseJSON) !== 'undefined') {
                        if (data.responseJSON.errors !== 'undefined') {
                            $.each(data.responseJSON.errors, (index, el) => {
                                $.each(el, (key, item) => {
                                    window.showAlert('alert-danger', item);
                                });
                            });
                        } else if (typeof (data.responseJSON.message) !== 'undefined') {
                            window.showAlert('alert-danger', data.responseJSON.message);
                        }
                    } else {
                        window.showAlert('alert-danger', data.status.text);
                    }
                    _self.text(buttonText);
                }
            });
        });

        $(document).on('click', '.js-remove-from-wishlist-button-wishlist', function (event) {
            event.preventDefault();
            let _self = $(this);

            _self.addClass('button-loading');

            $.ajax({
                url: _self.data('url'),
                method: 'DELETE',
                success: res => {

                    if (res.error) {
                        _self.removeClass('button-loading');
                        window.showAlert('alert-danger', res.message);
                        return false;
                    }

                    window.showAlert('alert-success', res.message);

                    $('.wishlist-count span').text(res.data.count);
                    _self.removeClass('button-loading');

                    _self.closest('tr').remove();
                },
                error: res => {
                    _self.removeClass('button-loading');
                    window.showAlert('alert-danger', res.message);
                }
            });
        });

        $(window).on('load', function () {
            let $modal = $('#flash-sale-modal');
            if ($modal.length && !getCookie($modal.data('id'))) {
                setTimeout(function () {
                    $modal.modal('show');
                    setCookie($modal.data('id'), 1, 1);
                }, 5000);
            }
        });

        $(document).on('click', '.js-quick-view-button', event => {
            event.preventDefault();

            let $modal = $('#quick-view-modal');

            $modal.find('.quick-view-content').html('');
            $modal.find('.modal-body').addClass('modal-empty');
            $modal.find('.loading-spinner').show();
            $modal.modal('show');

            $.ajax({
                url: $(event.currentTarget).data('url'),
                type: 'GET',
                success: res => {
                    if (!res.error) {
                        $modal.find('.loading-spinner').hide();
                        $modal.find('.modal-body').removeClass('modal-empty');
                        let $quickViewContent = $modal.find('.quick-view-content');
                        $quickViewContent.html(res.data);

                        $modal.find('.product-image-slider').slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            rtl: isRTL,
                            arrows: false,
                            fade: false,
                            asNavFor: '.slider-nav-thumbnails',
                        });

                        $modal.find('.slider-nav-thumbnails').slick({
                            slidesToShow: 5,
                            slidesToScroll: 1,
                            rtl: isRTL,
                            asNavFor: '.product-image-slider',
                            dots: false,
                            focusOnSelect: true,
                            prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                            nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>'
                        });

                        // Remove active class from all thumbnail slides
                        $modal.find('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');

                        // Set active class to first thumbnail slides
                        $modal.find('.slider-nav-thumbnails .slick-slide').eq(0).addClass('slick-active');

                        // On before slide change match active thumbnail to current slide
                        $modal.find('.product-image-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                            let mySlideNumber = nextSlide;
                            $modal.find('.slider-nav-thumbnails .slick-slide').removeClass('slick-active');
                            $modal.find('.slider-nav-thumbnails .slick-slide').eq(mySlideNumber).addClass('slick-active');
                        });

                        $modal.find('.product-image-slider').lightGallery({
                            selector: '.slick-slide:not(.slick-cloned) a',
                            thumbnail: true,
                            share: false,
                            fullScreen: false,
                            autoplay: false,
                            autoplayControls: false,
                            actualSize: false,
                        });

                        //Filter color/Size
                        $('.list-filter').each(function () {
                            $(this).find('a').on('click', function (event) {
                                event.preventDefault();
                                $(this).parent().siblings().removeClass('active');
                                $(this).parent().toggleClass('active');
                                $(this).parents('.attr-detail').find('.current-size').text($(this).text());
                                $(this).parents('.attr-detail').find('.current-color').text($(this).attr('data-color'));
                            });
                        });

                    } else {
                        window.showAlert('alert-danger', res.message);
                        $modal.modal('hide');
                    }
                },
                error: () => {
                    $modal.modal('hide');
                }
            });
        });

        // Products filter ajax
        const $formSearch = $('#products-filter-ajax');
        const $productListing = $('.products-listing');

        function changeInputInSearchForm(parseParams) {
            $formSearch.find('input, select, textarea').each(function (e, i) {
                const $el = $(i);
                const name = $el.attr('name');
                let value = parseParams[name] || null;
                const type = $el.attr('type');
                switch (type) {
                    case 'checkbox':
                        $el.prop('checked', false);
                        if (Array.isArray(value)) {
                            $el.prop('checked', value.includes($el.val()));
                        } else {
                            $el.prop('checked', !!value);
                        }
                        break;
                    default:
                        if ($el.is('[name=max_price]')) {
                            $el.val(value || $el.data('max'));
                        } else if ($el.is('[name=min_price]')) {
                            $el.val(value || $el.data('min'));
                        } else if ($el.val() !== value) {
                            $el.val(value);
                        }
                        break;
                }

                $el.trigger('change');
            });
        }

        $(document).on('click', '.clear_filter.clear_all_filter', function (e) {
            e.preventDefault();
            changeInputInSearchForm([]);
            $formSearch.trigger('submit');
        })

        $(document).on('click', '.clear_filter.bf_icons', function (e) {
            e.preventDefault();
            const $this = $(e.currentTarget);
            let name = $this.data('name');
            let value = $this.data('value');
            let $input;
            if (name.substring(name.length - 2) == '[]') {
                $input = $formSearch.find('[name="' + name + '"][value="' + value + '"]');
                switch ($input.attr('type')) {
                    case 'checkbox':
                        $input.prop('checked', false);
                        break;
                    default:
                        $input.val(null);
                        break;
                }
            } else {
                $input = $formSearch.find('[name="' + name + '"]');
                switch ($input.attr('name')) {
                    case 'min_price':
                        $input.val($input.data('min'));
                        break;
                    case 'max_price':
                        $input.val($input.data('max'));
                        break;
                    default:
                        $input.val(null);
                        break;
                }
            }

            if ($input) {
                $input.trigger('change');
            }

            $formSearch.trigger('submit');
        });

        $(document).on('change', '.product-category-select', function () {
            $('.product-cat-label').text($.trim($(this).find('option:selected').text()));
        });

        $('.product-cat-label').text($.trim($('.product-category-select option:selected').text()));

        $(document).on('click', '.show-advanced-filters', function (event) {
            event.preventDefault();
            event.stopPropagation();

            $(this).toggleClass('active');

            $('.advanced-search-widgets').slideToggle(500);
        });

        function checkHasAnyFilter(formData) {
            if (!formData) {
                formData = $formSearch.serializeArray();
            }
            let filtered = convertFromDataToArray(formData);
            let isFiltering = false;
            if (filtered && filtered.length) {
                filtered.map((x) => {
                    let findBy;
                    if (x.name.substring(x.name.length - 2) == '[]') {
                        findBy = '[name="' + x.name + '"][value="' + x.value + '"]';
                    } else {
                        findBy = '[name="' + x.name + '"]';
                    }
                    let $input = $formSearch.find(findBy);
                    if ($input.length) {
                        isFiltering = true;
                    }
                });
            }

            if ($('.shop-filter-toggle').length) {
                if (isFiltering) {
                    $('.shop-filter-toggle').addClass('is-filtering');
                } else {
                    $('.shop-filter-toggle').removeClass('is-filtering');
                }
            }
        }

        checkHasAnyFilter();

        function convertFromDataToArray(formData) {
            let data = [];
            formData.forEach(function (obj) {
                if (obj.value) {
                    // break with price
                    if (['min_price', 'max_price'].includes(obj.name)) {
                        const dataValue = $formSearch.find('input[name=' + obj.name + ']').data(obj.name.substring(0, 3));
                        if (dataValue == parseInt(obj.value)) {
                            return;
                        }
                    }
                    data.push(obj);
                }
            });

            return data;
        }

        if ($formSearch.length) {
            $(document).on('submit', '#products-filter-ajax', function (event) {
                event.preventDefault();
                const $form = $(event.currentTarget);
                const formData = $form.serializeArray();
                let data = convertFromDataToArray(formData);
                let uriData = [];

                const $inputs = $productListing.find('input');
                $inputs.map(function (i, el) {
                    const $input = $(el);
                    if ($input.val()) {
                        data.push({name: $input.attr('name'), value: $input.val()});

                    }
                });

                // Without "s" param
                data.map(function (obj) {
                    uriData.push(encodeURIComponent(obj.name) + '=' + obj.value);
                })

                const nextHref = $form.attr('action') + (uriData && uriData.length ? ('?' + uriData.join('&')) : '');

                // add to params get to popstate not show json
                data.push({name: 's', value: 1});

                $.ajax({
                    url: $form.attr('action'),
                    type: 'GET',
                    data: data,
                    beforeSend: function () {
                        // Show loading before sending
                        $productListing.find('.list-content-loading').show();
                        if (window.closeShopFilterSection) {
                            window.closeShopFilterSection();
                        }
                        // Animation scroll to filter button
                        $('html, body').animate({
                            scrollTop: $formSearch.offset().top - $('header').height()
                        }, 500);
                    },
                    success: function (res) {
                        if (res.error == false) {
                            $productListing.html(res.data);

                            if (res.additional?.filters_html) {
                                if (jQuery().mCustomScrollbar) {
                                    $(document).find('.ps-custom-scrollbar').mCustomScrollbar('destroy')
                                }

                                const $categoriesFilter = $formSearch.find('.product-categories-filter-widget').clone()

                                $formSearch.html(res.additional.filters_html)

                                $formSearch.find('.product-categories-filter-widget').replaceWith($categoriesFilter)

                                if (jQuery().mCustomScrollbar) {
                                    $(document).find('.ps-custom-scrollbar').mCustomScrollbar({
                                        theme: 'dark',
                                        scrollInertia: 0,
                                    })
                                }

                                if ($('.slider-range').length) {
                                    $('.slider-range').map(function (i, el) {
                                        const $this = $(el);
                                        const $parent = $this.closest('.range');
                                        const $min = $parent.find('input.min-range');
                                        const $max = $parent.find('input.max-range');
                                        $this.slider({
                                            range: true,
                                            min: $min.data('min') || 0,
                                            max: $max.data('max') || 500,
                                            values: [$min.val() || 0, $max.val() || 500],
                                            slide: function (event, ui) {
                                                setInputRange($parent, ui.values[0], ui.values[1]);
                                            },
                                            change: function (event, ui) {
                                                setInputRange($parent, ui.values[0], ui.values[1]);
                                            }
                                        });
                                        setInputRange($parent, $this.slider('values', 0), $this.slider('values', 1));
                                    });
                                }
                            }

                            if (nextHref != window.location.href) {
                                window.history.pushState(data, res.message, nextHref);
                            }
                            checkHasAnyFilter(formData);
                        } else {
                            showError(res.message || 'Opp!');
                        }
                    },
                    error: function (res) {
                        handleError(res);
                    },
                    complete: function () {
                        $productListing.find('.list-content-loading').hide();
                    }
                });
            });

            function setInputRange($parent, min, max) {
                let $filter = $parent.closest('.widget-filter-item');
                let minFormatted = min;
                let maxFormatted = max;
                if ($filter.length && $filter.data('type') === 'price') {
                    minFormatted = minFormatted.format_price();
                    maxFormatted = maxFormatted.format_price();
                }
                const $from = $parent.find('.from');
                const $to = $parent.find('.to');
                $parent.find('input.min-range').val(min);
                $parent.find('input.max-range').val(max);
                $from.text(minFormatted);
                $to.text(maxFormatted);
            }

            window.addEventListener('popstate', function () {
                let url = window.location.origin + window.location.pathname;
                if ($formSearch.attr('action') == url) {
                    const parseParams = parseParamsSearch();
                    changeInputInSearchForm(parseParams);
                    $formSearch.trigger('submit');
                } else {
                    history.back()
                }
            }, false);

            $(document).on('click', '.products-listing .pagination-page a', function (e) {
                e.preventDefault();
                let aLink = $(e.currentTarget).attr('href');

                if (!aLink.includes(window.location.protocol)) {
                    aLink = window.location.protocol + aLink;
                }

                let url = new URL(aLink);
                let page = url.searchParams.get('page');
                $productListing.find('input[name=page]').val(page)
                $formSearch.trigger('submit');
            });

            $(document).on('click', '.products_sortby .products_ajaxsortby a', function (e) {
                e.preventDefault();
                const $this = $(e.currentTarget);
                const href = $this.attr('href');
                const $parent = $this.closest('.products_ajaxsortby');
                $parent.find('a.selected').removeClass('selected');
                $this.addClass('selected');
                if (href.indexOf('?') >= 0) {
                    const queryString = href.substring(href.indexOf('?') + 1);
                    if (queryString) {
                        const parse = parseParamsSearch(queryString);
                        $productListing.find('input[name="' + $parent.data('name') + '"]').val(parse[$parent.data('name')]);
                    }
                }
                $formSearch.trigger('submit');
            });

            $(document).on('change', '.category-filter-input', event => {

                let _self = $(event.currentTarget);

                let checked = _self.prop('checked');
                $(document).find('.category-filter-input[data-parent-id="' + _self.attr('data-id') + '"]').each((index, el) => {
                    if (checked) {
                        $(el).prop('checked', true);
                    } else {
                        $(el).prop('checked', false);
                    }
                });

                if (parseInt(_self.attr('data-parent-id')) !== 0) {
                    let ids = [];
                    let children = $(document).find('.category-filter-input[data-parent-id="' + _self.attr('data-parent-id') + '"]');

                    children.each((i, el) => {
                        if ($(el).is(':checked')) {
                            ids.push($(el).val());
                        }
                    });

                    $(document).find('.category-filter-input[data-id="' + _self.attr('data-parent-id') + '"]').prop('checked', ids.length === children.length);
                }
            });
        }

        function parseParamsSearch(query, includeArray = false) {
            let pairs = query || window.location.search.substring(1);
            let re = /([^&=]+)=?([^&]*)/g;
            let decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
            let decode = function (str) {
                return decodeURIComponent(str.replace(decodeRE, " "));
            };

            let params = {}, e;
            while (e = re.exec(pairs)) {
                let k = decode(e[1]), v = decode(e[2]);
                if (k.substring(k.length - 2) == '[]') {
                    if (includeArray) {
                        k = k.substring(0, k.length - 2);
                    }
                    (params[k] || (params[k] = [])).push(v);
                } else {
                    params[k] = v;
                }
            }

            return params;
        }

        function setCookie(cname, cvalue, exdays) {
            let d = new Date();
            let url = new URL(window.siteUrl);
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            let expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/' + '; domain=' + url.hostname;
        }

        function getCookie(cname) {
            let name = cname + '=';
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        }

        const quickSearchProducts = function () {
            const quickSearch = '.form--quick-search';
            const $quickSearch = $('.form--quick-search');
            $('body').on('click', function(e) {
                if (!$(e.target).closest(quickSearch).length) {
                    $('.panel--search-result').removeClass('active');
                }
            });

            let currentRequest = null;
            $quickSearch.on('keyup', '.input-search-product', function () {
                const $form = $(this).closest('form');
                ajaxSearchProduct($form);
            });

            $quickSearch.on('change', '.product-category-select', function () {
                const $form = $(this).closest('form');
                ajaxSearchProduct($form);
            });

            $quickSearch.on('click', '.loadmore', function (e) {
                e.preventDefault();
                const $form = $(this).closest('form');
                $(this).addClass('loading');
                ajaxSearchProduct($form, $(this).attr('href'));
            });

            function ajaxSearchProduct($form, url = null) {
                const $panel = $form.find('.panel--search-result');
                const k = $form.find('.input-search-product').val();
                if (!k) {
                    $panel.html('').removeClass('active');
                    return;
                }

                $quickSearch.find('.input-search-product').val(k); // update all inputs

                const $button = $form.find('button[type=submit]');
                currentRequest = $.ajax({
                    type: 'GET',
                    url: url || $form.data('ajax-url'),
                    dataType: 'json',
                    data: url ? [] : $form.serialize(),
                    beforeSend : function() {
                        $button.addClass('loading');

                        if (currentRequest != null) {
                            currentRequest.abort();
                        }
                    },
                    success: res => {
                        if (!res.error) {
                            if (url) {
                                const $content = $('<div>' + res.data + '</div>');
                                $panel.find('.panel__content').find('.loadmore-container').remove();
                                $panel.find('.panel__content').append($content.find('.panel__content').contents());
                            } else {
                                $panel.html(res.data).addClass('active');
                            }
                        } else {
                            $panel.html('').removeClass('active');
                        }
                    },
                    error: () => {},
                    complete: () => {
                        $button.removeClass('loading');
                    }
                });
            }
        }
        quickSearchProducts();

        const reviewList = function () {
            const $body = $('body');

            let $galleries = $('.block--review .block__images')
            if ($galleries.length) {
                $galleries.map((index, value) => {
                    if (!$(value).data('lightGallery')) {
                        $(value).lightGallery({
                            selector: 'a',
                            thumbnail: true,
                            share: false,
                            fullScreen: false,
                            autoplay: false,
                            autoplayControls: false,
                            actualSize: false,
                        })
                    }
                })
            }

            let $reviewListWrapper = $body.find('.comment-list')
            const $loadingSpinner = $body.find('.loading-spinner')

            $loadingSpinner.addClass('d-none')

            const fetchData = (url, hasAnimation = false) => {
                $.ajax({
                    url: url,
                    type: 'GET',
                    beforeSend: function () {
                        $loadingSpinner.removeClass('d-none')

                        if (hasAnimation) {
                            $('html, body').animate(
                                {
                                    scrollTop: `${$('.product-reviews-container').offset().top}px`,
                                },
                                1500
                            )
                        }
                    },
                    success: function (res) {
                        $reviewListWrapper.html(res.data)
                        $('.product-reviews-container .product-reviews-header').html(res.message)

                        let $galleries = $('.product-reviews-container .block__images')
                        if ($galleries.length) {
                            $galleries.map((index, value) => {
                                if (!$(value).data('lightGallery')) {
                                    $(value).lightGallery({
                                        selector: 'a',
                                        thumbnail: true,
                                        share: false,
                                        fullScreen: false,
                                        autoplay: false,
                                        autoplayControls: false,
                                        actualSize: false,
                                    })
                                }
                            })
                        }
                    },
                    complete: function () {
                        $loadingSpinner.addClass('d-none')
                    },
                })
            }

            if ($reviewListWrapper.length < 1) {
                return
            }

            fetchData($reviewListWrapper.data('url'))

            $reviewListWrapper.on('click', '.pagination ul li.page-item a', function (e) {
                e.preventDefault()

                const href = $(this).prop('href')

                if (href === '#') {
                    return
                }

                fetchData(href, true)
            })
        }

        $(document).ready(function () {
            reviewList()

            $(document).on('click', '.product-tabs .nav-item .nav-link', function (e) {
                e.preventDefault();
                const _self = $(e.currentTarget);

                if (_self.hasClass('active')) {
                    return;
                }

                const $tabContent = _self.closest('.product-tabs');

                $tabContent.find('.nav-item .nav-link').removeClass('active');

                _self.addClass('active');

                const $loading = $tabContent.find('.loading-spinner');

                const $productList = $tabContent.find('.product-grid-4');

                $productList.html('');

                $loading.removeClass('d-none');

                $.ajax({
                    url: _self.data('url'),
                    method: 'GET',
                    success: (res) => {

                        if (res.error) {
                            window.showAlert('alert-danger', res.message);
                            return false;
                        }

                        $tabContent.find('.product-grid-4').html(res.data);

                        $loading.addClass('d-none');
                    },
                    error: (res) => {
                        window.showAlert('alert-danger', res.message);
                    }
                });
            });

            $('.primary-sidebar #products-filter-ajax').on('change', 'select, input', () => {
                $('#products-filter-ajax').trigger('submit')
            })

            const $productListing = $(document).find('.products-listing');

            document.addEventListener('ecommerce.product-filter.before', () => {
                $productListing.find('.list-content-loading').show();
            })

            document.addEventListener('ecommerce.product-filter.success', (event) => {
                $productListing.find('.list-content-loading').hide();
            })
        })

    });

})(jQuery);
