var mapStyles = [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#C6E2FF"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#C5E3BF"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]}];

$(document).ready(function($) {
    "use strict";

 //  Map in item view --------------------------------------------------------------------------------------------------

    $(".item .mark-circle.map").on("click", function(){
        var _latitude = $(this).closest(".item").attr("data-map-latitude");
        var _longitude = $(this).closest(".item").attr("data-map-longitude");
        var _id =  $(this).closest(".item").attr("data-id");
        $(this).closest(".item").find(".map-wrapper").attr("id", "map"+_id);
        var _this = "map"+_id;
        simpleMap(_latitude,_longitude, _this);
        $(this).closest(".item").addClass("show-map");
        $(this).closest(".item").find(".btn-close").on("click", function(){
            $(this).closest(".item").removeClass("show-map");
        });
    });

});

// Simple map ----------------------------------------------------------------------------------------------------------

function simpleMap(_latitude,_longitude, element, markerDrag){
    if (!markerDrag){
        markerDrag = false;
    }
    var mapCenter = new google.maps.LatLng(_latitude,_longitude);
    var mapOptions = {
        zoom: 9,
        center: mapCenter,
        disableDefaultUI: true,
        scrollwheel: true,
        styles: mapStyles
    };
    var mapElement = document.getElementById(element);
    var map = new google.maps.Map(mapElement, mapOptions);

    var marker = new MarkerWithLabel({
        position: new google.maps.LatLng( _latitude,_longitude ),
        map: map,
        icon: 'assets/img/marker.png',
        labelAnchor: new google.maps.Point(50, 0),
        draggable: markerDrag
    });

    google.maps.event.addListener(marker, "mouseup", function (event) {
        var latitude = this.position.lat();
        var longitude = this.position.lng();
        $('#latitude').val( this.position.lat() );
        $('#longitude').val( this.position.lng() );
    });

    autoComplete(map, marker);
    weather(_latitude, _longitude);
}

// Weather -------------------------------------------------------------------------------------------------------------

function weather(_latitude, _longitude){

    if( $(".weather").length ){

        var geocoder;
        var latlng = new google.maps.LatLng(_latitude, _longitude);
        var city, country, street;
        geocoder = new google.maps.Geocoder();

        geocoder.geocode(
            {'latLng': latlng},
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var add= results[0].formatted_address ;
                        var  value=add.split(",");
                        count = value.length;
                        country = value[count-1];
                        city = value[count-2].replace(/\d+/g, '');
                        street = value[count-3];

                        $.simpleWeather({
                            location: city + ", " + country,
                            woeid: '',
                            unit: 'c',
                            success: function(weather) {
                                var html = '<div class="left"><i class="icon-'+weather.code+'"></i><span>'+weather.temp+'&deg;'+weather.units.temp+'</span>' +
                                    '</div><div class="right"><ul><li>'+weather.city+', '+weather.region+'</li><li class="currently">'+weather.currently+'</li></ul></div>';
                                $(".weather-detail").html(html);
                            },
                            error: function(error) {
                                $(".weather-detail").html('<p>'+error+'</p>');
                            }
                        });
                    }
                    else  {
                        console.log("address not found");
                    }
                }
                else {
                    console.log("Geocoder failed due to: " + status);
                }
            }
        );
    }
}

//Autocomplete ---------------------------------------------------------------------------------------------------------

function autoComplete(map, marker){
    if( $("#address-autocomplete").length ){
        var input = /** @type {HTMLInputElement} */( document.getElementById('address-autocomplete') );
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
            if( marker ){
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);
                $('#latitude').val( marker.getPosition().lat() );
                $('#longitude').val( marker.getPosition().lng() );
            }
            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }
        });

        function success(position) {
            map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            //initSubmitMap(position.coords.latitude, position.coords.longitude);
            $('#latitude').val( position.coords.latitude );
            $('#longitude').val( position.coords.longitude );
        }

        $('.geo-location').on("click", function() {
            if (navigator.geolocation) {
                $('#'+element).addClass('fade-map');
                navigator.geolocation.getCurrentPosition(success);
            } else {
                console.log('Geo Location is not supported');
            }
        });
    }
}

// Big Map on Home -----------------------------------------------------------------------------------------------------

function bigMap(_latitude,_longitude, element, useAjax){
    if( document.getElementById(element) != null ){
        var urlToPHP;
        if( useAjax == true ){
            urlToPHP = "assets/external/ajax.markers.php";
        }
        else {
            urlToPHP = "assets/external/locations.php";
        }
        var geocoder = new google.maps.Geocoder();
        var map = new google.maps.Map(document.getElementById(element), {
            zoom: 9,
            scrollwheel: true,
            center: new google.maps.LatLng(_latitude, _longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: mapStyles
        });

        // Place marker after map is loaded and ready ------------------------------------------------------------------

        google.maps.event.addListenerOnce(map, 'idle', function(){
            $.ajax({
                url: urlToPHP,
                dataType: "json",
                method: "POST",
                success: function(locations){
                    placeMarkers(locations);
                },
                error : function () {
                    console.log("error");
                }
            });
        });

        // Create and place markers function ---------------------------------------------------------------------------
        var i;
        var a;
        function placeMarkers(locations){

            var newMarkers = [];
            for (i = 0; i < locations.length; i++) {
                var marker;
                var markerContent = document.createElement('div');
                markerContent.innerHTML =
                    '<div class="map-marker">' +
                        '<div class="icon">' +
                            '<img src="assets/img/marker.png">' +
                        '</div>' +
                    '</div>';

                // Latitude, Longitude and Address
                if ( locations[i]["latitude"] && locations[i]["longitude"] && locations[i]["address"] ){
                    marker = new RichMarker({
                        position: new google.maps.LatLng( locations[i]["latitude"], locations[i]["longitude"] ),
                        map: map,
                        draggable: false,
                        content: markerContent,
                        flat: true
                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            var _this = this;
                            if ( useAjax == true ){
                                var id = locations[i]["id"];
                                ajaxLoadInfobox(i, marker, newMarkers, locations, _this, id);
                            }
                            else {
                                openInfobox(i, marker, newMarkers, locations, _this);
                            }
                        }
                    })(marker, i));
                }
                // Only Address
                else if ( locations[i]["address"] && locations[i]["latitude"] == undefined && locations[i]["longitude"] == undefined ){
                    a = i;
                    geocoder.geocode( { 'address': locations[i]["address"] }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var marker = new RichMarker({
                                position: results[0].geometry.location,
                                map: map,
                                draggable: false,
                                content: markerContent,
                                flat: true
                            });
                            google.maps.event.addListener(marker, 'click', (function(marker, a) {
                                return function() {
                                    //console.log( locations[a]["id"] );
                                    var _this = this;
                                    if ( useAjax == true ){
                                        var id = locations[a]["id"];
                                        ajaxLoadInfobox(a, marker, newMarkers, locations, _this, id);
                                    }
                                    else {
                                        openInfobox(a, marker, newMarkers, locations, _this);
                                    }
                                }
                            })(marker, a));

                        } else {
                            console.log('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                }
                // Only Latitude and Longitude
                else if ( locations[i]["latitude"] && locations[i]["longitude"] && locations[i]["address"] == undefined ) {
                    marker = new RichMarker({
                        position: new google.maps.LatLng( locations[i]["latitude"], locations[i]["longitude"] ),
                        map: map,
                        draggable: false,
                        content: markerContent,
                        flat: true
                    });
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            var _this = this;
                            if ( useAjax == true ){
                                var id = locations[i]["id"];
                                ajaxLoadInfobox(i, marker, newMarkers, locations, _this, id);
                            }
                            else {
                                openInfobox(i, marker, newMarkers, locations, _this);
                            }
                        }
                    })(marker, i));
                }
                // No coordinates
                else {
                    console.log( "No location coordinates");
                }

                newMarkers.push(marker);
            }

            var clusterStyles = [
                {
                    url: 'assets/img/cluster.png',
                    height: 36,
                    width: 36
                }
            ];
            var markerCluster = new MarkerClusterer(map, newMarkers, {styles: clusterStyles, maxZoom: 10});
        }

        // Ajax loading of infobox -------------------------------------------------------------------------------------

        function ajaxLoadInfobox(i, marker, newMarkers, locations, _this, id){
            $.ajax({
                url: "assets/external/ajax.infobox.php",
                dataType: "html",
                data: { id: id },
                method: "POST",
                success: function(htmlContent){
                    openInfobox(i, marker, newMarkers, locations, _this, htmlContent);
                },
                error : function () {
                    console.log("error");
                }
            });
        }

        // Infobox -----------------------------------------------------------------------------------------------------

        var lastInfobox;

        function openInfobox(i, marker, newMarkers, locations, _this, htmlContent){
            if( useAjax == true ){
                console.log(useAjax);
                boxText = htmlContent;
            }
            else {
                console.log(useAjax);
                var boxText = document.createElement("div");
                    boxText.innerHTML =
                        /*
                        '<a href="' + locations[i]["url"] + '" class="infobox-inner">' +
                            '<div class="label-wrapper">' +
                                '<figure class="label label-info">' + locations[i]["type"] + '</figure>' +
                            '</div>' +
                            '<div class="wrapper">' +
                                '<div class="info">' +
                                    '<h3>' + locations[i]["title"] + '</h3>' +
                                    '<figure class="location">' + locations[i]["location"] + '</figure>' +
                                '</div>' +
                            '</div>' +
                            '<div class="meta">' +
                                '<span><i class="fa fa-star"></i>' + locations[i]["rating"] + '</span>' +
                                '<span><i class="fa fa-bed"></i>' + locations[i]["beds"] + '</span>' +
                            '</div>' +
                            '<div class="image" style="background-image: url('+ locations[i]["image"] +')"></div>' +
                        '</a>';
                        */
                        '<a href="' + locations[i]["url"] + '" class="infobox-inner">' +
                            '<div class="image-wrapper">' +
                                '<div class="label-wrapper">' +
                                    '<figure class="label label-info">' + locations[i]["type"] + '</figure>' +
                                '</div>' +
                                '<div class="wrapper">' +
                                    '<div class="info">' +
                                        '<h3>' + locations[i]["title"] + '</h3>' +
                                        '<figure class="location">' + locations[i]["location"] + '</figure>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="image" style="background-image: url('+ locations[i]["image"] +')"></div>' +
                            '</div>' +
                            '<div class="meta">' +
                                '<span><i class="fa fa-star"></i>' + locations[i]["rating"] + '</span>' +
                                '<span><i class="fa fa-bed"></i>' + locations[i]["beds"] + '</span>' +
                            '</div>' +
                        '</a>';
            }
            infoboxOptions = {
                content: boxText,
                disableAutoPan: false,
                pixelOffset: new google.maps.Size(-16, -50),
                zIndex: null,
                alignBottom: true,
                boxClass: "infobox-wrapper",
                enableEventPropagation: true,
                closeBoxMargin: "0px 0px -8px 0px",
                closeBoxURL: "assets/img/close-btn.png",
                infoBoxClearance: new google.maps.Size(1, 1)
            };

            if( lastInfobox != undefined ){
                lastInfobox.close();
            }

            newMarkers[i].infobox = new InfoBox(infoboxOptions);
            newMarkers[i].infobox.open(map, _this);
            lastInfobox = newMarkers[i].infobox;

        }

        // Geo Location ------------------------------------------------------------------------------------------------

        function success(position) {
            var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.panTo(center);
            $('#map').removeClass('fade-map');
        }

        // Geo Location on button click --------------------------------------------------------------------------------

        $('.geo-location').on("click", function() {
            if (navigator.geolocation) {
                $('#map').addClass('fade-map');
                navigator.geolocation.getCurrentPosition(success);
            } else {
                error('Geo Location is not supported');
            }
        });

        // Autocomplete

        autoComplete(map);
    }
    else {
        console.log("No map element");
    }
}
