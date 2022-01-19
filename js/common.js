var lastScrollTop = 0;

$(document).ready(function() {

    scrollConstruct();
    serviceCardEqualHeight();

    /**
     * Form Styler
     * @see  http://dimox.name/jquery-form-styler/
     */
    $('.js-styler').styler({
        selectSmartPositioning: false
    });

    $('form').bind('reset', function() {
        var $form = $(this);
        setTimeout(function() {
            $form.find('input').trigger('change');
            $form.find('.js-styler').trigger('refresh');
        });
    });

    /**
     * Form Validation
     * @see  http://jqueryvalidation.org/validate/
     */
    $('.js-validation-form').each(function() {
        $(this).validate();
    });

    $(document).on('change', 'input.js-styler[required], select.js-styler[required]', function(e) {
        var $this = $(this);
        setTimeout(function() {
            $this.valid();
            if ($this.is(':file')) {
                if ($this.hasClass('error'))
                    $this.closest('.jq-file').addClass('error');
                else
                    $this.closest('.jq-file').removeClass('error');
            } else {
                $this.trigger('refresh');
            }
        });
    });

    $('.subscribe-form').each(function() {
        $(this).validate({
            submitHandler: function(form) {
                $.ajax({
                    type: "POST",
                    url: $(form).attr('action'),
                    data: $(form).serialize()
                }).done(function() {
                    form.reset();
                    if ($(form).closest('.popup-window').length) {
                        $.fancybox.close();
                        $.fancybox.open('<div class="popup-window popup-window_success"><div class="popup-window__content"><div class="popup-window__title h2">Спасибо!</div><div class="popup-window__success-text h2">Перейдите в ваш почтовый ящик и подтвердите адрес электронной почты, чтобы получать от нас рассылку.</div></div></div>');
                        setTimeout(function() {
                            $.fancybox.close();
                        }, 5000);
                    } else {
                        $(form).closest('.form-block__content').hide();
                        $(form).closest('.form-block').append('<div class="form-block__content form-block__content_success"><div class="form-block__title h2">Спасибо!</div><div class="form-block__success-text h2">Перейдите в ваш почтовый ящик и подтвердите адрес электронной почты, чтобы получать от нас рассылку.</div></div>');
                    }
                });
            }
        });

        // вешаем маску на телефон
        $('.phone-field').inputmask("+7(999)999-9999");

        // добавляем правило для валидации телефона
        jQuery.validator.addMethod("checkMaskPhone", function(value, element) {
            return /\+\d{1}\(\d{3}\)\d{3}-\d{4}/g.test(value);
        });

        // получаем нашу форму по class
        var form = $('.form-request');

        // включаем валидацию в форме
        form.validate();

        // вешаем валидацию на поле с телефоном по классу
        $.validator.addClassRules({
            'phone-field': {
                checkMaskPhone: true,
            }
        });

        // Проверка на валидность формы при отправке, если нужно
        form.submit(function(e) {
            e.preventDefault();
            if (form.valid()) {
                alert('Форма отправлена');
            }
            return;
        });
    });
    if ($('.main-slider').length) {
        changeSliderColor($('.main-slider__item').eq(0).css('color'));

        $('.main-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            changeSliderColor($('.main-slider').find('[data-slick-index="' + nextSlide + '"] .main-slider__item').css('color'));
        });
    }

    $('.main-slider').slick({
        slidesToShow: 1,
        fade: true,
        autoplay: true,
        autoplaySpeed: 7000,
        speed: 700,
    });

    $('.slider').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        var $overlay = $(this).find('.slider__overlay');
        $overlay.addClass('is-visible');
        setTimeout(function() {
            $overlay.removeClass('is-visible');
        }, 600);
    });

    $('.slider').slick({
        slidesToShow: 1,
        fade: true,
        autoplay: true,
        autoplaySpeed: 7000,
    });

    $('.slider').append($('<div class="slider__overlay"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>'));

    $('.shop__gallery-slider').slick({
        slidesToShow: 1,
        dots: true,
        arrows: false,
    });

    $('.gallery').slick({
        infinite: false,
        dots: true,
        rows: 2,
        slidesPerRow: 3,
        responsive: [{
                breakpoint: 1080,
                settings: {
                    arrows: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    arrows: false,
                    slidesPerRow: 2
                }
            }
        ]
    });

    function changeSliderColor(sliderColor) {
        $('.main-slider').css('color', sliderColor);
        $('.header__top, .mobile-header').css('background-color', sliderColor);
    }

    $('.articles-catalog').on('init reInit afterChange', function(event, slick, currentSlide, nextSlide) {
        if (!$(this).find('.articles-catalog__count').length) {
            $(this).append($('<div class="articles-catalog__count" />'));
        }
        var $count = $(this).find('.articles-catalog__count');
        var i = (currentSlide ? currentSlide : 0) + 1;
        $count.html(i + ' / ' + slick.slideCount);
    });

    if ($(window).outerWidth() < 768) {
        $('.block__title + .articles-catalog, .articles-catalog-section .articles-catalog').slick({
            slidesToShow: 1
        });
    }

    $(window).on('resize', function() {
        if ($(window).outerWidth() < 768) {
            $('.block__title + .articles-catalog:not(.slick-slider), .articles-catalog-section .articles-catalog:not(.slick-slider)').slick({
                slidesToShow: 1
            });
        } else {
            $('.articles-catalog.slick-slider').slick('unslick');
        }
    });

    $('.catalog_slider, .services-catalog_slider').slick({
        slidesToShow: 5,
        swipeToSlide: true,
        responsive: [{
                breakpoint: 1280,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });

    /**
     * FancyBox 3
     * @see  http://fancyapps.com/fancybox/3/
     */
    $.fancybox.defaults.btnTpl.vk = '<button data-fancybox-vk class="fancybox-button fancybox-button--vk" title="ВКонтакте">' +
        '<svg viewBox="0 0 576 512"><path fill="currentColor" d="M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z"></path></svg>' +
        '</button>';

    $.fancybox.defaults.btnTpl.ok = '<button data-fancybox-ok class="fancybox-button fancybox-button--ok" title="Одноклассники">' +
        '<svg viewBox="0 0 320 512"><path fill="currentColor" d="M275.1 334c-27.4 17.4-65.1 24.3-90 26.9l20.9 20.6 76.3 76.3c27.9 28.6-17.5 73.3-45.7 45.7-19.1-19.4-47.1-47.4-76.3-76.6L84 503.4c-28.2 27.5-73.6-17.6-45.4-45.7 19.4-19.4 47.1-47.4 76.3-76.3l20.6-20.6c-24.6-2.6-62.9-9.1-90.6-26.9-32.6-21-46.9-33.3-34.3-59 7.4-14.6 27.7-26.9 54.6-5.7 0 0 36.3 28.9 94.9 28.9s94.9-28.9 94.9-28.9c26.9-21.1 47.1-8.9 54.6 5.7 12.4 25.7-1.9 38-34.5 59.1zM30.3 129.7C30.3 58 88.6 0 160 0s129.7 58 129.7 129.7c0 71.4-58.3 129.4-129.7 129.4s-129.7-58-129.7-129.4zm66 0c0 35.1 28.6 63.7 63.7 63.7s63.7-28.6 63.7-63.7c0-35.4-28.6-64-63.7-64s-63.7 28.6-63.7 64z"></path></svg>' +
        '</button>';

    $.fancybox.defaults.btnTpl.fb = '<button data-fancybox-fb class="fancybox-button fancybox-button--fb" title="Facebook">' +
        '<svg viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>' +
        '</button>';

    $.fancybox.defaults.btnTpl.tw = '<button data-fancybox-tw class="fancybox-button fancybox-button--tw" title="Twitter">' +
        '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>' +
        '</button>';

    $.fancybox.defaults.btnTpl.mr = '<button data-fancybox-mr class="fancybox-button fancybox-button--mr" title="Мой мир">' +
        '<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z"></path></svg>' +
        '</button>';

    var Share = {
        vkontakte: function() {
            Share.popup('http://vkontakte.ru/share.php?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(document.title) + '&noparse=true');
        },
        odnoklassniki: function() {
            Share.popup('https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=' + encodeURIComponent(window.location.href));
        },
        facebook: function() {
            Share.popup('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '&t=' + encodeURIComponent(document.title));
        },
        twitter: function() {
            Share.popup('http://twitter.com/share?text=' + encodeURIComponent(document.title) + '&url=' + encodeURIComponent(window.location.href));
        },
        mailru: function() {
            Share.popup('http://connect.mail.ru/share?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(document.title))
        },
        popup: function(url) {
            window.open(url, '', 'left=0,top=0,width=600,height=300,menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
        }
    };

    $('body').on('click', '[data-fancybox-vk]', function() {
        Share.vkontakte();
    });

    $('body').on('click', '[data-fancybox-ok]', function() {
        Share.odnoklassniki();
    });

    $('body').on('click', '[data-fancybox-fb]', function() {
        Share.facebook();
    });

    $('body').on('click', '[data-fancybox-tw]', function() {
        Share.twitter();
    });

    $('body').on('click', '[data-fancybox-mr]', function() {
        Share.mailru();
    });

    $('[data-fancybox="gallery"]').fancybox({
        buttons: [
            "vk",
            "ok",
            "fb",
            "tw",
            "mr",
            "zoom",
            "close"
        ]
    });

    $('.js-header-search-btn').on('click', function(e) {
        $('html').addClass('is-header-search-open');
        $('html').removeClass('is-footer-search-open');
    });

    $('.js-footer-search-btn').on('click', function(e) {
        $('html').addClass('is-footer-search-open');
        $('html').removeClass('is-header-search-open');
    });

    $('.js-search-close-btn').on('click', function(e) {
        $('html').removeClass('is-header-search-open is-footer-search-open');
    });

    $('.js-mobile-menu-btn').on('click', function(e) {
        noscrollStart();
        $('html').addClass('is-menu-open');
    });

    $('.js-mobile-search-btn').on('click', function(e) {
        noscrollStart();
        $('html').addClass('is-menu-open');
        $('.menu-popup .search__input').focus();
    });

    $('.js-menu-popup-close').on('click', function(e) {
        $('html').removeClass('is-menu-open');
        noscrollFinish();
    });

    $('.up-btn').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 700);
    });

    $('.catalog-nav__header').on('click', function(e) {
        e.preventDefault();
        $('.catalog-sort').removeClass('is-open');
        $('.catalog-nav').toggleClass('is-open');
    });

    $('.catalog-sort__header').on('click', function(e) {
        e.preventDefault();
        $('.catalog-nav').removeClass('is-open');
        $('.catalog-sort').toggleClass('is-open');
    });

    $('.aside-nav__header').on('click', function(e) {
        e.preventDefault();
        $('.aside-nav').toggleClass('is-open');
    });

    $('.js-catalog-sort-btn').on('click', function(e) {
        e.preventDefault();
        $('.js-catalog-sort-btn').removeClass('is-active');
        $(this).addClass('is-active');
    });

    $('[data-ajax-loader]').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        if (!$this.hasClass('is-loading')) {
            $this.addClass('is-loading');
            $.ajax({
                type: "POST",
                url: $this.attr('href')
            }).done(function(data) {
                setTimeout(function() {
                    var $container = $this.parent().prev();
                    $this.removeClass('is-loading');
                    if ($container.hasClass('slick-slider')) {
                        $container.slick('unslick');
                        $container.append(data);
                        $container.slick({
                            slidesToShow: 1
                        });
                    } else {
                        $container.append(data);
                    }
                }, 1000);
            });
        }
    });

    $(".form-control.js-styler").change(function() {
        var name_file = [];
        for (var i = 0; i < $(this).get(0).files.length; ++i) {
            name_file.push($(this).get(0).files[i].name);
        }
        $(".form-control__result").text(name_file.join(",\n"));
    });
});

$(window).on('scroll', function() {
    scrollConstruct();

    $('[data-scroll-loader]').each(function() {
        if (!$(this).hasClass('is-loading') && $(this).offset().top < $(document).scrollTop() + $(window).height()) {
            $(this).trigger('click');
        }
    });
});

$(window).on('load resize', function() {
    serviceCardEqualHeight();
});

function scrollConstruct() {
    var st = $(document).scrollTop();
    if (st > lastScrollTop) {
        if (st > 100 && !$('html').hasClass('is-header-hide')) {
            $('html').addClass('is-header-hide');
        }
    } else {
        if ($('html').hasClass('is-header-hide')) {
            $('html').removeClass('is-header-hide');
        }
    }
    lastScrollTop = st;

    if (st > 0) {
        $('html').addClass('is-scrolled');
    } else {
        $('html').removeClass('is-scrolled');
    }

    if (st > 100) {
        $('.up-btn').addClass('is-visible');
    } else {
        $('.up-btn').removeClass('is-visible');
    }

    if ($('.footer__content').offset().top <= st + $(window).innerHeight() - 78) {
        $('html').addClass('is-footer-visible');
    } else {
        $('html').removeClass('is-footer-visible');
    }
}

function serviceCardEqualHeight() {
    var topPos = 0;
    var maxHeight = 0;

    $('.service-item').removeClass('is-temp').find('.service-item__text').height('auto');

    $('.service-item').each(function() {
        if ($(this).offset().top !== topPos) {
            $('.service-item.is-temp').removeClass('is-temp').find('.service-item__text').height(maxHeight);

            topPos = $(this).offset().top;
            maxHeight = 0;
        }

        $(this).addClass('is-temp');
        maxHeight = Math.max($(this).find('.service-item__text').height(), maxHeight);
    });

    $('.service-item.is-temp').removeClass('is-temp').find('.service-item__text').height(maxHeight);
}

/**
 * Настройки Form Validation
 */
jQuery.extend(jQuery.validator.messages, {
    required: "Это поле необходимо заполнить",
    remote: "Исправьте это поле",
    email: "Некорректный e-mail",
    url: "Некорректный url",
    date: "Некорректная дата",
    dateISO: "Некорректная дата (ISO)",
    number: "Некорректное число",
    digits: "Cимволы 0-9",
    creditcard: "Некорректный номер карты",
    equalTo: "Не совпадает с предыдущим значением",
    accept: "Недопустимое расширение",
    maxlength: jQuery.validator.format("Максимум {0} символов"),
    minlength: jQuery.validator.format("Минимум {0} символов"),
    rangelength: jQuery.validator.format("Минимум {0} и максимумт {1} символов"),
    range: jQuery.validator.format("Допустимо знаечение между {0} и {1}"),
    max: jQuery.validator.format("Допустимо значение меньше или равное {0}"),
    min: jQuery.validator.format("Допустимо значение больше или равное {0}")
});

jQuery.validator.setDefaults({
    errorPlacement: function(error, element) {
        if ($(element).parents('.jq-selectbox').length) {
            error.insertAfter($(element).parents('.jq-selectbox'));
        } else if ($(element).parents('.jq-number').length) {
            error.insertAfter($(element).parents('.jq-number'));
        } else if ($(element).parents('.jq-file').length) {
            error.insertAfter($(element).parents('.jq-file'));
        } else if ($(element).is(':checkbox') || $(element).is(':radio')) {
            error.insertAfter($(element).closest('label'));
        } else {
            error.insertAfter(element);
        }
    },
    invalidHandler: function() {
        var $this = $(this);
        setTimeout(function() {
            $this.find('input.js-styler:not(:file)[required], select.js-styler[required]').trigger('refresh');
            $this.find('.js-styler:file[required]').each(function() {
                if ($(this).hasClass('error'))
                    $(this).closest('.jq-file').addClass('error');
                else
                    $(this).closest('.jq-file').removeClass('error');
            });
        }, 1);
    }
});

/**
 * Настройки FancyBox
 */
$.extend(true, $.fancybox.defaults, {
    touch: false,
    autoFocus: false,
});

/**
 * Mobile Scroll Prevent
 */
var noscrollY = 0;

function noscrollStart() {
    noscrollY = $(document).scrollTop();
    $('body').css('top', -noscrollY + 'px');
    $('html').addClass('is-noscroll');
}

function noscrollFinish() {
    $('html').removeClass('is-noscroll');
    $(document).scrollTop(noscrollY);
    $('body').css('top', 'auto');
}