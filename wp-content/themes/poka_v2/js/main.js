jQuery(document).ready(function($) {

    var $window = $(window);

    //placeholders for IE
    $('input').placeholder();

    //Mm-menu
    $("#mobile-menu").mmenu({
        offCanvas: {
            pageSelector: "#page-wrapper"
        },
		navbars		: {
			content : [ "prev", "searchfield", "close" ]
		},
        extensions: ["pageshadow", "effect-menu-slide", "effect-listitems-slide"]
    });

    //Equal heights when needed
    $('.equalheight').matchHeight();

    $('header .menu').superfish();

    $('.lightbox').magnificPopup({
        type: 'image',
        mainClass: 'mfp-with-zoom',
        zoom: {
            enabled: true,

            duration: 300,
            easing: 'ease-in-out',
            opener: function(openerElement) {
                return openerElement.is('img') ? openerElement : openerElement.find('img');
            }
        },
        gallery:{
            enabled:true
        }
    });

    //Responsive videos
    $("#main, .section").fitVids();

    $('.carousel').each(function(){
        var num = 3;
        if( $(this).parents('.main__content__left').length ){
            num = 1;
        }
        $(this).owlCarousel({
            loop:true,
            margin:20,
            nav:true,
            responsive:{
                0:{
                    items:1
                },
                780:{
                    items:2
                },
                971:{
                    items:num
                }
            },
            navText:["<i class='fa fa-angle-left' aria-hidden='true'></i>","<i class='fa fa-angle-right' aria-hidden='true'></i>"]
        });
    });

    $('.carousel-relevant').owlCarousel({
        loop:true,
        margin:35,
        responsiveClass:true,
        items:3,
        autoWidth:true
    });

    $('.carousel-screenshot').owlCarousel({
        loop:true,
        margin:35,
        responsiveClass:true,
        items:4,
        nav:true,
        responsive:{
            0:{
                items:2,
                margin:10
            },
            780:{
                items:3
            },
            971:{
                items:4
            }
        }
    })

    //Social share
    $('.news-item .social li a, .post-info .social li a').click(function(){

        var windowWidth = $window.width();
        var windowHeight = $window.height();

        var url = $(this).attr('href');
        var winWidth = parseInt($(this).attr('data-width'));
        var winHeight = parseInt($(this).attr('data-height'));

        var winTop = (windowHeight / 2) - (winHeight / 2);
        var winLeft = (windowWidth / 2) - (winWidth / 2);
        window.open(url, 'Social Share', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);

        return false;
    });

    //Ajax search
    if( $('.search-form-ajax-input').length ){
        $.ajax({
            type: "post",
            url: ajax_var.url,
            dataType: "jsonp",
            data: "action=poka_autocompletesearch&nonce="+ajax_var.nonce,
            success: function(result){
                var inputSearchEl = $( ".search-form-ajax-input" );
                inputSearchEl.autocomplete({
                    minLength: 1,
                    source : result,
                    appendTo: inputSearchEl.parents('.search-form-ajax')
                })
                .autocomplete( "instance" )._renderItem = function( ul, item ) {
                    return $( "<li class='custom-li-el'>" )
                    .append( "<div class='img'><a href='" + item.link + "'><img src='"+ item.image +"' alt=''/></a></div>" )
                    .append( "<div class='text'><a class='title' href='" + item.link + "'>" + item.label + "</a><p>" + item.promo_title + "</p><div class='row row-sm'><div class='col-6'><a rel='nofollow' target='_blank' href='" + item.afflink + "' class='btn btn--green'>"+ item.playnowtext +"</a></div><div class='col-6'><a href='" + item.link + "' class='btn btn--blue'>"+ item.reviewtext +"</a></div></div></div>" )
                    .appendTo( ul );
                };

            }
        });
    }

    //User ratings
    $('.rating-user>i').hover(
        function(){
            if( !$(this).parent().hasClass('user-rated') ){
                $(this).parent().find('i').addClass('fa-star-o').removeClass('fa-star');
                $(this).prevAll().andSelf().removeClass('fa-star-o').addClass('fa-star');
            }
        }
    );

    $('.rating-user').hover(
        function(){},
        function(){
            var i = 0,
                starsTotal = parseInt($(this).attr('data-stars'));

            $(this).find('i').removeClass('fa-star').addClass('fa-star-o');

            while (i < starsTotal) {
                $(this).find('i').eq(i).removeClass('fa-star-o').addClass('fa-star');
                i++;
            }
    });

    $(".rating-user>i").click(function(){

        var el = $(this);

        if( !$(this).hasClass('user-rated') ){

            // Retrieve post ID from data attribute
            var post_id = el.parent().attr('data-post-id');

            if( el.parent().attr('data-log') == "no" ){
                el.parent().addClass('animated wobble');
            }

            var user_rating = el.parent().find('.fa-star').length;

            // Ajax call
            $.ajax({
                type: "post",
                url: ajax_var.url,
                data: "action=poka_rating&nonce="+ajax_var.nonce+"&review_rating=&post_id="+post_id+"&user_rating="+user_rating,
                success: function(result){
                    // If vote successful
                    el.parent().removeClass('animated wobble');

                    if(result != "already" && result != "login") {
                        el.parent().addClass('animated tada');
                        el.prevAll().andSelf().removeClass('fa-star-o').addClass('fa-star');
                        var num = parseInt(el.parent().next('.rating-counter').find('span').text());
                        //console.log(num);
                        el.parent().next('.rating-counter').find('span').text( num+1 );
                        el.parents('.clearfix').find('.rating-msg').text( ajax_var.msg_success ).addClass('success').removeClass('error');
                    }
                    if(result == "login") {
                        $('html,body').animate({"scrollTop":$('.login-register').offset().top});
                    }
                    if(result == "already") {
                        el.parent().addClass('animated wobble');
                        el.parents('.clearfix').find('.rating-msg').text( ajax_var.msg_error ).addClass('error').removeClass('success');
                    }
                }
            });
            el.parent().addClass('user-rated');

        }

        return false;
    })


});
