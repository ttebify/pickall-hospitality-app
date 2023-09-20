////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var resizeId;

$(document).ready(function($) {
    "use strict";

    var date = new Date();

    responsiveNavigation();

//  Rating -------------------------------------------------------------------------------------------------------------

    rating();

//  Masonry on all resolutions except mobile ---------------------------------------------------------------------------
    if( $(".masonry").length ){
        drawMasonry();
    }

//  Tooltip initialize -------------------------------------------------------------------------------------------------

    $('[data-toggle="tooltip"]').tooltip();

//  Date picker --------------------------------------------------------------------------------------------------------

    var month = date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    var today = month + "-" + day + "-" + year;

    if( $(".date").length ){
        $(".date").datepicker({
            orientation: "bottom auto",
            todayHighlight: true,
            startDate: today,
            autoclose: true
            //datesDisabled: ["4-7-2016"]
        });
    }

//  iCheck -------------------------------------------------------------------------------------------------------------

    if ($("input[type=checkbox]").length ) {
        $("input").iCheck();
    }

    if ($("input[type=radio]").length > 0) {
        $("input").iCheck();
    }

//  Smooth Scroll ------------------------------------------------------------------------------------------------------

    $('a[href^="#"].scroll').on('click',function (e) {
        e.preventDefault();
        var target = this.hash,
            $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 1000, 'swing', function () {
            window.location.hash = target;
        });
    });

//  Tab in Modal -------------------------------------------------------------------------------------------------------

    $("a[data-toggle=modal]").on('click',function (e) {
        var _this = $(this);
        if( _this.attr("data-tab")  ){
            var tab = _this.attr("href");
        }
        else {
            tab = false;
        }
        var target = _this.attr("data-target");
        e.preventDefault();
        $.ajax({
            url: "assets/external/modal.php",
            data: { tab: tab },
            method: "POST",
            success: function(data){
                $("body").append(data);
                $(target).on('show.bs.modal', function () {
                    $(tab).addClass("active");
                    $(target).find('a[href="' + tab + '"]').tab('show');
                    $("input").iCheck();
                });
                $(target).on('hidden.bs.modal', function () {
                    if( _this.attr("data-tab")  ){
                        $(target).remove();
                    }
                });
                $(target).modal();
            },
            error : function () {
                console.log("error");
            }
        });
        /*

        */
    });
/*
    $("[data-ajax-action]").on('click',function (e) {
        e.preventDefault();
        $.ajax({
            url: "assets/external/modal.php",
            //dataType: "json",
            //data: { action: "modal", data:  },
            method: "POST",
            success: function(data){
                alert(data)
            },
            error : function () {
                console.log("error");
            }
        });
    });
*/
//  Show element after desired time ------------------------------------------------------------------------------------

    if( !viewport.is('xs') ){
        var messagesArray = [];
        $("[data-toggle=popover]").popover({
            template: '<div class="popover" role="tooltip"><div class="close"><i class="fa fa-close"></i></div><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        });
        $(".popover .close").live('click',function () {
            $(this).closest(".popover").popover("hide");
        });
        $("[data-show-after-time]").each(function() {
            var _this = $(this);
            setTimeout(function(){
                if( _this.attr("data-toggle") == "popover" ){
                    _this.popover("show");
                }
                else {
                    for( var i=0; i < messagesArray.length; i++ ){
                        $(messagesArray[i]).css("bottom", parseInt( $(messagesArray[i]).css("bottom") ) + _this.context.clientHeight + 10 );
                    }
                    messagesArray.push(_this);
                    _this.addClass("show");
                    if( _this.attr("data-close-after-time") ){
                        setTimeout(function(){
                            closeThis();
                        }, _this.attr("data-close-after-time") );
                    }
                }
            }, _this.attr("data-show-after-time") );
            $(this).find(".close").on("click",function () {
                closeThis();
            });
            function closeThis(){
                _this.removeClass("show");
                setTimeout(function(){
                    _this.remove();
                }, 400 );
            }
        });

    }

//  Show element when scrolled desired amount of pixels ----------------------------------------------------------------

    $("[data-show-after-scroll]").each(function() {
        var _this = $(this);
        var scroll = _this.attr("data-show-after-scroll");
        var offsetTop = $(this).offset().top;
        $(window).scroll(function() {
            var currentScroll = $(window).scrollTop();
            if (currentScroll >= scroll) {
                _this.addClass("show");
            }
            else {
                _this.removeClass("show");
            }
        });
    });

//  Element get fixed position after top edge of window touches the element

    $("[data-fixed-after-touch]").each(function() {
        var wrapper = $(this).find(".wrapper");
        wrapper.width( $(this).width() );
        $(this).css( "height", wrapper.height() );
        var offsetTop = $(this).offset().top;
        $(window).scroll(function() {
            var currentScroll = $(window).scrollTop();
            if (currentScroll >= offsetTop) {
                wrapper.addClass("position-fixed");
            }
            else {
                wrapper.removeClass("position-fixed");
            }
        });
    });

//  Owl Carousel -------------------------------------------------------------------------------------------------------

    if( $(".gallery-carousel").length ){
        $(".gallery-carousel").owlCarousel({
            margin:10,
            items: 4,
            navText: [],
            nav: true,
            dots: false,
                responsive : {
                    0 : {
                        items: 1
                    },
                    480 : {
                        items: 3
                    },
                    768 : {
                        items: 3
                    },
                    1200 : {
                        items: 4
                    }
                }
        });
    }

//  Owl Carousel in item view ------------------------------------------------------------------------------------------

    $(".item.big .image, .item.list .image")
        .mouseenter(function() {
            if( $(this).find(".owl-carousel").length == 0 ){
                //$(this).find( $("img[data-image]") ).each(function() {
                    //$(this).attr( "src", $(this).attr("data-src") );
                //});
                $(this).find(".gallery").owlCarousel({
                    autoplaySpeed: 1000,
                    autoplay: false,
                    mouseDrag: false,
                    loop: true,
                    items: 1,
                    lazyLoad:true,
                    nav: true,
                    navContainer: $(this).find(".owl-navigation"),
                    navText: []
                });
                $(this).addClass("show-nav");
            }
            else {
                $(this).addClass("show-nav");
            }
        })
        .mouseleave(function() {
            $(this).removeClass("show-nav");
            $(this).find(".gallery").trigger("to.owl.carousel", 0);
        });

//  Calendar
    /*
    if( $(".calendar").length ){
        for( var i = 1 ; i<=12 ; i++ ){
            $('.calendar-wrapper').append('<div id="month_'+i+'" class="month"></div>');

            $("#month_"+i).zabuto_calendar({
                ajax: {
                    url: "assets/external/calendar.php",
                    modal: true
                },
                language: "en",
                month: i,
                show_previous: false,
                show_next: false,
                today: true
            });
        }

        $(".calendar-wrapper").owlCarousel({
            items: 2,
            nav: true,
            autoHeight: true,
            navText: [],
            startPosition: month
        });
    }
    */
    /*
    var _date = new Date();
    var year = _date.getFullYear();
    $(".calendar-ui").datepick({
        //monthsToShow: 3,
        changeMonth: false,
        maxDate: new Date(year, 11, 31)
    });
    */

//  Form Validation ----------------------------------------------------------------------------------------------------

    $("#form-subscribes button").on("click", function(){
        $("#form-subscribe").validate({
            submitHandler: function() {
                $.post("assets/external/subscribe.php", $("#form-subscribe").serialize(),  function(response) {
                    $('#form-subscribe .form-status').html(response);
                    $('#form-subscribe button').attr('disabled','true');
                });
                return false;
            }
        });
    });

//  Transfer "img" into CSS background-image ---------------------------------------------------------------------------

    $(".bg-transfer").each(function() {
        $(this).css("background-image", "url("+ $(this).find("img").attr("src") +")" );
    });

    equalHeight( ".container" );

//  Fixed header in tables ---------------------------------------------------------------------------------------------

    if($(".table-fixed-header").length){
        $(".table-fixed-header").fixedHeader({
            topOffset: 20
        });
    }

//  Trigger "switch" class after click ---------------------------------------------------------------------------------

    $("[data-switch]").on("click", function(e){
        e.preventDefault();
        $( $(this).attr("data-switch")).toggleClass("switch");
    });

//  Enable image previews in multi file input --------------------------------------------------------------------------

    if( $("input[type=file].with-preview").length ){
        $("input.file-upload-input").MultiFile({
            list: ".file-upload-previews"
        });
    }

//  Enable image preview in file upload with single image --------------------------------------------------------------

    $(".single-file-preview input[type=file]").change(function() {
        previewImage(this);
    });

//  Increment/Decrement for Number input -------------------------------------------------------------------------------

    $(function() {
        var i;
        var html = "<div class='change-button plus'><i class='fa fa-caret-up'></i></div><div class='change-button minus'><i class='fa fa-caret-down'></i></div>";
        $("input[type=number]").wrap("<div class='input-number'></div>");
        $(".input-number").prepend(html);

        $("input[type=number]").parents(".input-number").find(".plus").on("click", function(){
            var input = $(this).parents(".input-number").find("input[type=number]");
            i = input.val();
            if( input.val() == undefined || input.val() == "" ){
                input.val( i+1 );
            }
            else {
                i++;
                input.val(i);
            }
        });

        $("input[type=number]").parents(".input-number").find(".minus").on("click", function(e){
            var input = $(this).parents(".input-number").find("input[type=number]");
            i = input.val();
            if( input.val() >= 2 ){
                input.val( i-1 );
            }
        });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// On Resize
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(window).resize(function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 250);
    responsiveNavigation();
});

$(window).load(function(){
    if( $(".one-item-carousel").length ){
        $(this).css("display", "block");
        $(".one-item-carousel").owlCarousel({
            items: 1,
            nav: true,
            autoHeight: true,
            navText: []
        });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Do after resize -----------------------------------------------------------------------------------------------------

function doneResizing(){
    var $equalHeight = $('.container');
    for( var i=0; i<$equalHeight.length; i++ ){
        equalHeight( $equalHeight );
    }
    drawMasonry();
}

// Masonry -------------------------------------------------------------------------------------------------------------

function drawMasonry(){
    setTimeout(function(){
        if( !viewport.is('xs') ){
            $('.grid').masonry({
                gutter: 29,
                itemSelector: '.grid-item'
            });
        }
    }, 500);
}

// Navigation on mobile resolutions ------------------------------------------------------------------------------------

function responsiveNavigation(){
    var $secondaryNav = $("#secondary-nav");
    var $primaryNav = $("#primary-nav");
    if( viewport.is('xs') ){
        $secondaryNav.addClass("collapse");
        $("#primary-nav").addClass("collapse");
    }
    else {
        $secondaryNav.removeClass("collapse");
        $secondaryNav.removeAttr("style");
        $primaryNav.removeClass("collapse");
        $primaryNav.removeAttr("style");
    }
}

// Equal Heights -------------------------------------------------------------------------------------------------------

function equalHeight(container){
    if( !viewport.is('xs') ){
        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            $el,
            topPosition = 0;

        $(container).find('.equal-height').each(function() {
            $el = $(this);
            //var marginBottom = $el.css("margin-bottom").replace("px", "");
            //console.log( $el.css("margin-bottom").replace("px", "") );
            $($el).height('auto');
            topPostion = $el.position().top;
            if (currentRowStart != topPostion) {
                for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
                rowDivs.length = 0; // empty the array
                currentRowStart = topPostion;
                currentTallest = $el.height();
                rowDivs.push($el);
            } else {
                rowDivs.push($el);
                currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
        });
    }
}

//  Find the viewport resolution ---------------------------------------------------------------------------------------

var viewport = (function() {
    var viewPorts = ['xs', 'sm', 'md', 'lg'];

    var viewPortSize = function() {
        return window.getComputedStyle(document.body, ':before').content.replace(/"/g, '');
    };

    var is = function(size) {
        if ( viewPorts.indexOf(size) == -1 ) throw "no valid viewport name given";
        return viewPortSize() == size;
    };

    var isEqualOrGreaterThan = function(size) {
        if ( viewPorts.indexOf(size) == -1 ) throw "no valid viewport name given";
        return viewPorts.indexOf(viewPortSize()) >= viewPorts.indexOf(size);
    };

    // Public API
    return {
        is: is,
        isEqualOrGreaterThan: isEqualOrGreaterThan
    }

})();

// Rating --------------------------------------------------------------------------------------------------------------

function rating(element){
    var ratingElement =
            '<span class="stars">'+
                '<i class="fa fa-star s1" data-score="1"></i>'+
                '<i class="fa fa-star s2" data-score="2"></i>'+
                '<i class="fa fa-star s3" data-score="3"></i>'+
                '<i class="fa fa-star s4" data-score="4"></i>'+
                '<i class="fa fa-star s5" data-score="5"></i>'+
                '<i class="fa fa-star s6" data-score="6"></i>'+
                '<i class="fa fa-star s7" data-score="7"></i>'+
                '<i class="fa fa-star s8" data-score="8"></i>'+
                '<i class="fa fa-star s9" data-score="9"></i>'+
                '<i class="fa fa-star s10" data-score="10"></i>'+
            '</span>'
        ;
    if( !element ) { element = ''; }
    $.each( $(element + ' .star-rating'), function(i) {
        $(this).append(ratingElement);
        if( $(this).hasClass('active') ){
            $(this).append('<input readonly hidden="" name="score_' + $(this).attr('data-name') +'" id="score_' + $(this).attr('data-name') +'">');
        }
        // If rating exists
        var rating = $(this).attr('data-rating');
        for( var e = 0; e < rating; e++ ){
            var rate = e+1;
            console.log("a");
            $(this).children('.stars').children( '.s' + rate ).addClass('active');
        }
    });

    var ratingActive = $('.star-rating.active i');

    ratingActive.mouseenter(function() {
        for( var i=0; i<$(this).attr('data-score'); i++ ){
            var a = i+1;
            $(this).parent().children('.s'+a).addClass('hover');
        }
        })
        .mouseleave(function() {
            for( var i=0; i<$(this).attr('data-score'); i++ ){
                var a = i+1;
                $(this).parent().children('.s'+a).removeClass('hover');
            }
        });

    ratingActive.on('click', function(){
        $(this).parents(".star-rating").find("input").val( $(this).attr('data-score') );
        $(this).parent().children('.fa').removeClass('active');
        for( var i=0; i<$(this).attr('data-score'); i++ ){
            var a = i+1;
            $(this).parent().children('.s'+a).addClass('active');
        }
        return false;
    });
}

/*
(function( $, window, undefined ) {
    $.imagePreview = $.extend( {}, {

        addLog: function(id, status, str){
            var d = new Date();
            var li = $('<li />', {'class': 'demo-' + status});

            var message = '[' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '] ';

            message += str;

            li.html(message);

            $(id).prepend(li);
        },
        addFile: function(id, i, file){
            var template = '<div id="demo-file' + i + '">' +
                '<img src="http://placehold.it/48.png" class="demo-image-preview" />' +
                '<span class="demo-file-id">#' + i + '</span> - ' + file.name + ' <span class="demo-file-size">(' + $.imagePreview.humanizeSize(file.size) + ')</span><br />Status: <span class="demo-file-status">Waiting to upload</span>'+
                '<div class="progress progress-striped active">'+
                '<div class="progress-bar" role="progressbar" style="width: 0%;">'+
                '<span class="sr-only">0% Complete</span>'+
                '</div>'+
                '</div>'+
                '</div>';

            var i = $(id).attr('file-counter');
            if (!i){
                $(id).empty();

                i = 0;
            }

            i++;

            $(id).attr('file-counter', i);

            $(id).prepend(template);
        },

        updateFileStatus: function(i, status, message){
            $('#demo-file' + i).find('span.demo-file-status').html(message).addClass('demo-file-status-' + status);
        },

        updateFileProgress: function(i, percent){
            $('#demo-file' + i).find('div.progress-bar').width(percent);

            $('#demo-file' + i).find('span.sr-only').html(percent + ' Complete');
        },

        humanizeSize: function(size) {
            var i = Math.floor( Math.log(size) / Math.log(1024) );
            return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
        }

    }, $.imagePreview);
})(jQuery, this);

*/

// Preview for single file upload --------------------------------------------------------------------------------------

function previewImage(input) {
    var ext = $(input).val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
        alert('invalid extension!');
    }
    else {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $(input).parents(".single-file-preview").find("img").attr("src", e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
}