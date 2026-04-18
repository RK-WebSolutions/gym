jQuery(document).ready(function ($) {
    "use strict";
    var $grid;

    $('a[href=\\#]').on('click', function (e) {
        e.preventDefault();
    });
    /*ISOTOPE HTML END*/

    /* Theia Side Bar */
    if (typeof ($.fn.theiaStickySidebar) !== "undefined") {
        $('.has-sidebar .fixed-bar-coloum').theiaStickySidebar({'additionalMarginTop': 150});
        $('.other-page .fixed-bar-coloum').theiaStickySidebar({'additionalMarginTop': 150});
    }

    /* Header Search */
    $('a[href="#header-search"]').on("click", function (event) {
        event.preventDefault();
        $("#header-search").addClass("open");
        $('#header-search > form > input[type="search"]').focus();
    });

    $("#header-search, #header-search button.close").on("click keyup", function (
        event
    ) {
        if (
            event.target === this ||
            event.target.className === "close" ||
            event.keyCode === 27
        ) {
            $(this).removeClass("open");
        }
    });

    /*-------------------------------
   //  Back to Top
  -------------------------------*/
  const backToTop = document.querySelector(".scrollup");
  window.onscroll = function () {
    scrollFunction();
  };
  function scrollFunction() {
    if (backToTop !== null) {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        backToTop.style.display = "block";
        backToTop.classList.add('back-top');
      } else {
        backToTop.style.display = "none";
        backToTop.classList.remove('back-top');
      }
    }
  }
  if (backToTop !== null) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
  }


    /* Mobile menu */
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 100) {
            $("body").addClass("not-top");
            $("body").removeClass("top");
        } else {
            $("body").addClass("top");
            $("body").removeClass("not-top");
        }
    });

    /* Search Box */
    $(".search-box-area").on('click', '.search-button, .search-close', function (event) {
        event.preventDefault();
        if ($('.search-text').hasClass('active')) {
            $('.search-text, .search-close').removeClass('active');
        } else {
            $('.search-text, .search-close').addClass('active');
        }
        return false;
    });

    /* Header Right Menu */
    var menuArea = $('.additional-menu-area');
    menuArea.on('click', '.side-menu-trigger', function (e) {
        e.preventDefault();
        var self = $(this);
        if (self.hasClass('side-menu-open')) {
            $('.sidenav').css('transform', 'translateX(0%)');
            if (!menuArea.find('> .rt-cover').length) {
                menuArea.append("<div class='rt-cover'></div>");
            }
            self.removeClass('side-menu-open').addClass('side-menu-close');
        }
    });

    function closeMenuArea() {
        var trigger = $('.side-menu-trigger', menuArea);
        trigger.removeClass('side-menu-close').addClass('side-menu-open');
        if (menuArea.find('> .rt-cover').length) {
            menuArea.find('> .rt-cover').remove();
        } 
        if( gymatObj.rtl =='yes'  ) {
            $('.sidenav').css('transform', 'translateX(100%)');
        }else {
            $('.sidenav').css('transform', 'translateX(-100%)');
        }
    }

    menuArea.on('click', '.closebtn', function (e) {
        e.preventDefault();
        closeMenuArea();
    });

    $(document).on('click', '.rt-cover', function () {
        closeMenuArea();
    });

    /*-------------------------------------
    MeanMenu activation code
    --------------------------------------*/
    
    // var a = $('.offscreen-navigation .menu');
    //
    // if (a.length) {
    //     a.children("li").addClass("menu-item-parent");
    //     a.find(".menu-item-has-children > a").on("click", function (e) {
    //         e.preventDefault();
    //         $(this).toggleClass("opened");
    //         var n = $(this).next(".sub-menu"),
    //             s = $(this).closest(".menu-item-parent").find(".sub-menu");
    //         a.find(".sub-menu").not(s).slideUp(250).prev('a').removeClass('opened'), n.slideToggle(250)
    //     });
    //     a.find('.menu-item:not(.menu-item-has-children) > a').on('click', function (e) {
    //         $('.rt-slide-nav').slideUp();
    //         $('body').removeClass('slidemenuon');
    //     });
    // }
    //
    // $('.mean-bar .sidebarBtn').on('click', function (e) {
    //     e.preventDefault();
    //     if ($('.rt-slide-nav').is(":visible")) {
    //         $('.rt-slide-nav').slideUp();
    //         $('body').removeClass('slidemenuon');
    //     } else {
    //         $('.rt-slide-nav').slideDown();
    //         $('body').addClass('slidemenuon');
    //     }
    //
    // });

    var a = $('.offscreen-navigation .menu');

    if (a.length) {
        $(".menu-item-has-children").append("<span></span>");
        $(".page_item_has_children").append("<span></span>");

        a.children("li").addClass("menu-item-parent");

        $('.menu-item-has-children > span').on('click', function () {
            var _self = $(this),
                sub_menu = _self.parent().find('>.sub-menu');
            if (_self.hasClass('open')) {
                sub_menu.slideUp();
                _self.removeClass('open');
            } else {
                sub_menu.slideDown();
                _self.addClass('open');
            }
        });
        $('.page_item_has_children > span').on('click', function () {
            var _self = $(this),
                sub_menu = _self.parent().find('>.children');
            if (_self.hasClass('open')) {
                sub_menu.slideUp();
                _self.removeClass('open');
            } else {
                sub_menu.slideDown();
                _self.addClass('open');
            }
        });
    }

    $('.mean-bar .sidebarBtn').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('slidemenuon');
    });


    /*Header and mobile menu stick*/
    $(window).on('scroll', function () {
        if ($('body').hasClass('sticky-header')) {            

            // Sticky header
            var stickyPlaceHolder = $("#rt-sticky-placeholder"),
                menu = $("#header-menu"),
                menuH = menu.outerHeight(),
                topHeaderH = $('#tophead').outerHeight() || 0,
                middleHeaderH = $('#middleHeader').outerHeight() || 0,
                targrtScroll = topHeaderH + middleHeaderH;
            if ($(window).scrollTop() > targrtScroll) {
                menu.addClass('rt-sticky');
                stickyPlaceHolder.height(menuH);
            } else {
                menu.removeClass('rt-sticky');
                stickyPlaceHolder.height(0);
            }

            // Sticky mobile header
            var stickyPlaceHolder = $("#mobile-sticky-placeholder"),
                menubar = $("#mobile-men-bar"),
                menubarH = menubar.outerHeight(),
                topHeaderH = $('#mobile-top-fix').outerHeight() || 0,
                total_height =topHeaderH;
            if ($(window).scrollTop() > total_height) {
                $("#meanmenu").addClass('mobile-sticky');
                stickyPlaceHolder.height(menubarH);             
            } else {
                $("#meanmenu").removeClass('mobile-sticky');
                stickyPlaceHolder.height(0);
            }
        }
    });

    
    // Popup - Used in video
    if (typeof $.fn.magnificPopup == 'function') {
        $('.rt-video-popup').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }
    if (typeof $.fn.magnificPopup == 'function') {
        if ($('.zoom-gallery').length) {
            $('.zoom-gallery').each(function () { // the containers for all your galleries
                $(this).magnificPopup({
                    delegate: 'a.gymat-popup-zoom', // the selector for gallery item
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                });
            });
        }
    }
    /* Woocommerce Shop change view */
    $('#shop-view-mode li a').on('click', function () {
        $('body').removeClass('product-grid-view').removeClass('product-list-view');

        if ($(this).closest('li').hasClass('list-view-nav')) {
            $('body').addClass('product-list-view');
            Cookies.set('shopview', 'list');
        } else {
            $('body').addClass('product-grid-view');
            Cookies.remove('shopview');
        }
        return false;
    });
    /* when product quantity changes, update quantity attribute on add-to-cart button */
    $("form.cart").on("change", "input.qty", function () {
        if (this.value === "0")
            this.value = "1";

        $(this.form).find("button[data-quantity]").data("quantity", this.value);
    });

    /* remove old "view cart" text, only need latest one thanks! */
    $(document.body).on("adding_to_cart", function () {
        $("a.added_to_cart").remove();
    });

    /*variable ajax cart end*/
    // Quantity
    $(document).on('click', '.quantity .input-group-btn .quantity-btn', function () {
        var $input = $(this).closest('.quantity').find('.input-text');

        if ($(this).hasClass('quantity-plus')) {
            $input.trigger('stepUp').trigger('change');
        }

        if ($(this).hasClass('quantity-minus')) {
            $input.trigger('stepDown').trigger('change');
        }
    });

    if( $('.header-shop-cart').length ){
        $( document ).on('click', '.remove-cart-item', function(){
          var product_id = $(this).attr("data-product_id");
          var loader_url = $(this).attr("data-url");
          var main_parent = $(this).parents('li.menu-item.dropdown');
          var parent_li = $(this).parents('li.cart-item');
          parent_li.find('.remove-item-overlay').css({'display':'block'});
          $.ajax({
            type: 'post',
            dataType: 'json',
            url: gymatObj.ajaxURL,
            data: { action: "gymat_product_remove",
                product_id: product_id
            },success: function(data){
              main_parent.html( data["mini_cart"] );
              $( document.body ).trigger( 'wc_fragment_refresh' );
            },error: function(xhr, status, error) {
              $('.header-shop-cart').children('ul.minicart').html('<li class="cart-item"><p class="cart-update-pbm text-center">'+ gymatObj.cart_update_pbm +'</p></li>');
            }
          });
          return false;
        });
    }
    // Wishlist
    $(document).on('click', '.rdtheme-wishlist-icon', function () {

        if ($(this).hasClass('rdtheme-add-to-wishlist') && typeof yith_wcwl_l10n != "undefined") {

            var $obj = $(this),
                productId = $obj.data('product-id'),
                afterTitle = $obj.data('title-after');
            var data = {
                'action': 'gymat_add_to_wishlist',
                'context': 'frontend',
                'nonce': $obj.data('nonce'),
                'add_to_wishlist': productId
            };

            $.ajax({
                url: yith_wcwl_l10n.ajax_url,
                type: 'POST',
                data: data,
                success: function success(data) {
                    if (data['result'] != 'error') {
                        $obj.removeClass('ajaxloading');
                        $obj.find('.wishlist-icon').removeClass('fa fa-heart').addClass('fas fa-heart').show();
                        $obj.removeClass('rdtheme-add-to-wishlist').addClass('rdtheme-remove-from-wishlist');
                        $obj.find('span').html(afterTitle);
                        $obj.attr('title',afterTitle);
                        $('body').trigger('rt_added_to_wishlist', [productId]);
                        $('body').trigger('added_to_wishlist', [productId]);
                    } else {
                        console.log(data['message']);
                    }
                }
            });

            return false;
        }
    });
    
    //Remove From Wishlist Ajax
   $(document).on( 'added_to_wishlist removed_from_wishlist', function(){
    $.get( yith_wcwl_l10n.ajax_url, {
      action: 'yith_wcwl_update_wishlist_count'
    }, function( data ) {
      $('.wishlist-icon span.wishlist-icon-num').html( data.count );
    } );
});

    
});

//function Load
function gymat_content_load_scripts() {
    var $ = jQuery;
    //Preloader
    $('#preloader').fadeOut('slow', function () {
        $(this).remove();
    });
    
    

    /*---------------------------------------
      Background Parallax
      --------------------------------------- */
      if ($(".rt-parallax-bg-yes").length) {
        $(".rt-parallax-bg-yes").each(function () {
            var speed = $(this).data('speed');
            $(this).parallaxie({
                speed: speed ? speed : 0.5,
                offset: 0,
            });
        })
    }

    
    /*===================================
	 // Section background image 
	====================================*/
    imageFunction();

    function imageFunction() {
        $("[data-bg-image]").each(function () {
        let img = $(this).data("bg-image");
        $(this).css({
            backgroundImage: "url(" + img + ")",
        });
        });
    }    



    /*=================================
   // counter up
   ==================================*/
   
   let counter=true;
   $(".counter-appear").appear();
   $(".counter-appear").on("appear", function () {
    if (counter) {
        // Only number counter
            $(".counterUp").each(function () {
                var $this = $(this);
                let duration=$(this).data('duration');
                jQuery({
                    Counter: 0,
                }).animate(
                    {
                    Counter: $this.attr("data-counter"),
                    },
                    {
                    duration: duration,
                    easing: "swing",
                    step: function () {
                        var num = Math.ceil(this.Counter).toString();
                        if (Number(num) > 99999) {
                        while (/(\d+)(\d{3})/.test(num)) {
                            num = num.replace(/(\d+)(\d{3})/, "");
                        }
                        }
                        $this.html(num);
                    },
                    }
                );
            });
        
        counter = false;
        }
   }); 

    
   
    $('.rt-related-slider').each(function() {
        var $this = $(this);
        var settings = $this.data('xld');
        var autoplayconditon= settings['auto'];
        var $pagination = $this.find('.swiper-pagination')[0];
        var $next = $this.find('.swiper-button-next')[0];
        var $prev = $this.find('.swiper-button-prev')[0];
        var swiper = new Swiper( this, {
                autoplay:   autoplayconditon,
                autoplayTimeout: settings['autoplay']['delay'],
                speed: settings['speed'],
                loop:  settings['loop'],
                pauseOnMouseEnter :true,
                slidesPerView: settings['slidesPerView'],
                spaceBetween:  settings['spaceBetween'],
                centeredSlides:  settings['centeredSlides'], 
                slidesPerGroup: settings['slidesPerGroup'] ? settings['slidesPerGroup']:1,
                pagination: {
                    el: $pagination,
                    clickable: true,
                    type: 'bullets',
                },
                navigation: {
                    nextEl: $next,
                    prevEl: $prev,
                },
                breakpoints: {
                0: {
                    slidesPerView: settings['breakpoints']['0']['slidesPerView'],
                },
                576: {
                    slidesPerView: settings['breakpoints']['576']['slidesPerView'],
                },
                768: {
                    slidesPerView: settings['breakpoints']['768']['slidesPerView'],
                },
                992: {
                    slidesPerView: settings['breakpoints']['992']['slidesPerView'],
                },
                1200: {
                    slidesPerView:  settings['breakpoints']['1200']['slidesPerView'],
                },
                1600: {
                    slidesPerView: settings['breakpoints']['1600']['slidesPerView'],
                },
            },
        });
        if( autoplayconditon == true ) {
            $(".rt-related-slider").mouseenter(function() {
                swiper.autoplay.stop();
            });
            $(".rt-related-slider").mouseleave(function() {
                swiper.autoplay.start();
            });
        }
        swiper.init();
    });

    /*========================================
  //    upcomming-slider
  ========================================*/
    if ($(".upcomming-class-slider")) {
        $(".upcomming-class-slider").each(function() {
            var $this = $(this);
            var settings = $this.data('xld');
            var autoplayconditon= settings['auto'];
            let __swiperSlider = $(this)[0];
            let btnPrev = $(this)
                .closest(".upcomming-class-layout2")
                .find(".swiper-button-next")[0];
            let btnNext = $(this)
                .closest(".upcomming-class-layout2")
                .find(".swiper-button-prev")[0];
            new Swiper(__swiperSlider, {
                autoplay:   autoplayconditon,
                autoplayTimeout: settings['autoplay']['delay'],
                speed: settings['speed'],
                loop:  settings['loop'],
                pauseOnMouseEnter :true,
                slidesPerView: settings['slidesPerView'],
                spaceBetween:  settings['spaceBetween'],
                centeredSlides:  settings['centeredSlides'], 
                slidesPerGroup: settings['slidesPerGroup'] ? settings['slidesPerGroup']:1,
                breakpoints: {
                    0: {
                        slidesPerView: settings['breakpoints']['0']['slidesPerView'],
                    },
                    576: {
                        slidesPerView: settings['breakpoints']['576']['slidesPerView'],
                    },
                    768: {
                        slidesPerView: settings['breakpoints']['768']['slidesPerView'],
                    },
                    992: {
                        slidesPerView: settings['breakpoints']['992']['slidesPerView'],
                    },
                    1200: {
                        slidesPerView:  settings['breakpoints']['1200']['slidesPerView'],
                    },
                    1600: {
                        slidesPerView: settings['breakpoints']['1600']['slidesPerView'],
                    },
                },
                navigation: {
                    nextEl: btnPrev,
                    prevEl: btnNext,
                },
            });
        });
    }

    /* Swiper slider grid view */
    $('.product-list-slider').each(function() {
        var $this = $(this);
        var settings=$this.data('xld');
        var $next = $this.find('.swiper-grid-button-next')[0];
        var $prev = $this.find('.swiper-grid-button-prev')[0];
        var swiper = new Swiper( this, {
            spaceBetween:  settings['spaceBetween'],
            autoplay:   settings['auto'],
            autoplayTimeout: settings['autoplay']['delay'],
            slidesPerGroup: settings['slidesPerGroup'],
            centeredSlides:settings['centeredSlides'],
            speed: settings['speed'],
            slidesPerColumnFill: "row",
            slideToClickedSlide: settings['slideToClickedSlide'],
            slidesPerView: 2,
            slidesPerColumn: settings['slidesPerColumn'], 
            navigation: {
                nextEl: $next,
                prevEl: $prev,
            },
            breakpoints: {
              0: {
                slidesPerView: settings['breakpoints']['0']['slidesPerView'],
                slidesPerColumn: settings['breakpoints']['0']['slidesPerColumn'],
                slidesPerColumnFill: "row",
              },
              576: {
                slidesPerView: settings['breakpoints']['576']['slidesPerView'],
                slidesPerColumn: settings['breakpoints']['576']['slidesPerColumn'],
                slidesPerColumnFill: "row",
              },
              768: {
                slidesPerView: settings['breakpoints']['768']['slidesPerView'],
                slidesPerColumn: settings['breakpoints']['768']['slidesPerColumn'],
                slidesPerColumnFill: "row",
              },
              992: {
                slidesPerView: settings['breakpoints']['992']['slidesPerView'],
                slidesPerColumn: settings['breakpoints']['992']['slidesPerColumn'],
                slidesPerColumnFill: "row",
              },
              1200: {
                slidesPerView: settings['breakpoints']['1200']['slidesPerView'],
                slidesPerColumn: settings['breakpoints']['1200']['slidesPerColumn'],
                slidesPerColumnFill: "row",
              },
              1600: {
                slidesPerView: settings['breakpoints']['1600']['slidesPerView'],
                slidesPerColumn: settings['breakpoints']['1600']['slidesPerColumn'],
                slidesPerColumnFill: "row",
              },
            },
        });
    });

    /**thumb slider */
    $('.slider-wraper-data').each(function(){
        var slider_wrap = $(this);
        var $next = slider_wrap.find('.swiper-button-next')[0];
        var $prev = slider_wrap.find('.swiper-button-prev')[0];
        var target_thumb_slider = slider_wrap.find('.prouduct-thumb-slider');
        var thumb_slider = null;
        if(target_thumb_slider.length){
            thumb_slider = new Swiper(target_thumb_slider[0],
                {
                loop:true,
                spaceBetween:  8,
                speed: 800,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                slidesPerView: 3,
                breakpoints: {
                    0: {
                    slidesPerView: 2,
                    },
                    400: {
                    slidesPerView: 3,
                    },
                },

            });
        }

        var target_slider = slider_wrap.find('.product-gallery-slider');
        if(target_slider.length){
            new Swiper(target_slider[0], {
                loop: true,
                speed: 800,
                thumbs: {
                    swiper: thumb_slider,
                },
                navigation:{
                    nextEl: $next,
                    prevEl: $prev,
                }
            });
        }
    });
    /* vanilla Tilt Effect */
    var windowSize=$(window).width();
    if(windowSize>991){
        var tiltBlock = $(".js-tilt");
        if (tiltBlock.length) {
            $(".js-tilt").tilt({
                glare: false,
            });
        }
    }
	
    //countdown js
    if($('.count-down-style-1').length){
        $('.count-down-style-1').each(function () {
            var $CountdownSelector = $(this).find('.countdown');
            var eventCountdownTime = $(this).data('time');
            $CountdownSelector.countdown(eventCountdownTime).on('update.countdown', function (event) {
            $(this).html(
                event.strftime(
                `<div class="count-down-block hr"><span class="count">%D</span><span class="count-text">${gymatObj.day}</span></div><div class="count-down-block hr"><span class="count">%H</span><span class="count-text">${gymatObj.hour}</span></div><div class="count-down-block min"><span class="count">%M</span><span class="count-text">${gymatObj.minute}</span></div><div class="count-down-block sec"><span class="count">%S</span><span class="count-text">${gymatObj.second}</span></div>`
                )
            );
            }).on('finish.countdown', function (event) {
            $(this).html(event.strftime(''));
            });
        });
    }
  

    //upcomming class hover box
    $(".upcomming-class-layout2 .class-item").hover(function() {
        $(".upcomming-class-layout2 .class-item").removeClass("class-item_active");
        $(this).addClass("class-item_active");
    });

    /*===================================
   // swiper-button
  ====================================*/

    $(".swiper-button-arrow").hover(function () {
        $(".swiper-button-arrow").removeClass("active");
        $(this).addClass("active");
    });

    /*-------------------------------
    // pricing table
    -------------------------------*/
    const pricingWrapper = $(".pricing-wrapper");
    if (pricingWrapper) {
        $(".pricing-wrapper").each(function() {
            $(".pricing-switch-container").on("click", function() {
                $(".pricing-switch")
                    .parents(".price-switch-box")
                    .toggleClass("price-switch-box--active"),
                    $(".pricing-switch").toggleClass("pricing-switch-active"),
                    $(".rt-tab-content").toggleClass("rt-active");
            });
        });
    } 
    
    /* Wow Js Init */
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: false,
        live: true,
        scrollContainer: null,
    });

    new WOW().init();

    
    /**bmi calculator all code */

    // Show or hide inputs based on radio fields
    $('.rt-bmi-calculator').each(function() {
        rdthemeBMIRadioChange($(this));       
    });

    $('.rt-bmi-calculator .rt-bmi-radio').on('change', 'input[name=rt-bmi-unit]', function() {
        var $parent = $(this).closest('.rt-bmi-calculator');
        rdthemeBMIRadioChange($parent);
    });

    $("body").mouseover(function(el){
        
    	if( $(window).width() <= 1400 ){
		 if(el.pageY<=11000){
		 	$('.rt-routine table tbody tr td .rt-item:hover .trainer-thumb').css('bottom','calc(100% - 150px)')
		 	$('.rt-routine table tbody tr:last-child td .rt-item:hover .trainer-thumb').css({"bottom": "calc(100% + 50px)"})
		 	$('.rt-routine table tbody tr td:nth-of-type(1) .rt-item:hover .trainer-thumb').css({"left": "0"})
		 }else{
		 	$('.rt-routine table tbody tr td .rt-item:hover .trainer-thumb').css('bottom','calc(100% + 15px)')
		 }
		}
	});

    /* Routine */
    $('.rt-routine .rt-routine-nav a').click(function (e) {
        e.preventDefault();
        var $parent = $(this).closest('.rt-routine'),
        id = $(this).data('id');
        $parent.find('.rt-routine-nav li').removeClass('active');
        $(this).parent().addClass('active');

        if ( id == 'all' ) {
            $parent.find('.rt-item').addClass('show');
        }
        else {
            $parent.find('.rt-item').removeClass('show');
            $parent.find('.rt-routine-id-'+id).addClass('show');
        }
    });

    // Calculate BMI
    $('.rt-bmi-calculator').on('click', '.rt-bmi-submit', function(event) {
        event.preventDefault();
        var $parent = $(this).closest('.rt-bmi-calculator'),
        bmi = rdthemeBMICalculate($parent),
        chart = $parent.find('.rt-bmi-result').data('chart'),
        status = false,
        errorMsg;

        if ( bmi == 'emptyError' ) {
            errorMsg = $parent.find('.rt-bmi-error').data('emptymsg');
        }
        else if( bmi == 'numberError' ){
            errorMsg = $parent.find('.rt-bmi-error').data('numbermsg');
        }
        else if( bmi<18.5 ){
            status = 1;
        }
        else if( 18.5<=bmi && bmi<=24.99 ){
            status = 2;
        }
        else if( 25<=bmi && bmi<=29.99 ){
            status = 3;
        }
        else if( bmi>=30 ){
            status = 4;
        }

        if (status) {
            $parent.find('.rt-bmi-val').text(bmi);
            $parent.find('.rt-bmi-status').text(chart[status-1][1]);
            $parent.find('.rt-bmi-error').hide();
            $parent.find('.rt-bmi-result').show();
        }
        else {
            $parent.find('.rt-bmi-result').hide();
            $parent.find('.rt-bmi-error').text(errorMsg).show();
        }
    });

    function rdthemeBMICalculate($parent){
        var unit = $parent.find('input[name=rt-bmi-unit]:checked').val();
        if ( unit == 'metric' ) {
            var weight = $parent.find('input[name=rt-bmi-weight]').val();
            var height = $parent.find('input[name=rt-bmi-height]').val();
            if ( weight == '' || height == '' ) {
                return 'emptyError';
            }
            if ( !jQuery.isNumeric(weight) || !jQuery.isNumeric(height) ) {
                return 'numberError';
            }
            height = height/100;
            var bmi = weight/(height*height);
        }
        else {
            var weight = $parent.find('input[name=rt-bmi-pound]').val();
            var feet   = $parent.find('input[name=rt-bmi-feet]').val();
            var inch   = $parent.find('input[name=rt-bmi-inch]').val();
            if ( weight == '' || feet == '' || inch == '' ) {
                return 'emptyError';
            }
            if ( !jQuery.isNumeric(weight) || !jQuery.isNumeric(feet) || !jQuery.isNumeric(inch) ) {
                return 'numberError';
            }
            height = (feet*12)+parseFloat(inch);
            var bmi = (weight/(height*height)*703);
        }
        return Math.round(bmi*100)/100;
    }
    
    function rdthemeBMIRadioChange($parent){
        var unit = $parent.find('input[name=rt-bmi-unit]:checked').val();
        if ( unit == 'metric' ) {
            $parent.find('.rt-bmi-fields .rt-bmi-fields-imperial').hide();
            $parent.find('.rt-bmi-fields .rt-bmi-fields-metric').show();
            $parent.find('.rt-bmi-fields').addClass('metric');
            $parent.find('.rt-bmi-fields').removeClass('imperial');
        }
        else {
            $parent.find('.rt-bmi-fields .rt-bmi-fields-metric').hide();
            $parent.find('.rt-bmi-fields .rt-bmi-fields-imperial').show();
            $parent.find('.rt-bmi-fields').addClass('imperial');
            $parent.find('.rt-bmi-fields').removeClass('metric');
        }
    }

}

(function ($) {
    "use strict";

    // Window Load+Resize
    $(window).on('load resize', function () {

        // Define the maximum height for mobile menu
        var wHeight = $(window).height();
        wHeight = wHeight - 50;
        $('.mean-nav > ul').css('max-height', wHeight + 'px');
        
    });

    // Elementor Frontend Load
    $(window).on('elementor/frontend/init', function () {
        if (elementorFrontend.isEditMode()) {
            elementorFrontend.hooks.addAction('frontend/element_ready/widget', function () {
                gymat_content_load_scripts();
            });
        }
    });
    
    // Window Load
    $(window).on('load', function () {
        gymat_content_load_scripts();
    });

})(jQuery);