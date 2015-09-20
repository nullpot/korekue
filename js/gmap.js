'use strict'

var g_map;
var g_markerHash = {};
var g_marker;
var g_coder;
var g_myLatlng;

function initialize() {
    var locateFlg = false;

    if( $('#map_canvas').data('lat') === undefined
     || $('#map_canvas').data('lng') === undefined ){
        //初期値
        g_myLatlng = new google.maps.LatLng(
            35.658824, 139.745422  //東京タワー
        );
        locateFlg = true;
    }else{
        var lat = parseFloat($('#map_canvas').data('lat'));
        var lng = parseFloat($('#map_canvas').data('lng'));
        g_myLatlng = new google.maps.LatLng(lat, lng);
    }
    var mapOptions = {
        zoom: 17,
        disableDefaultUI: true,
        zoomControl: true,
        panControl: true,
        center: g_myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    g_map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    g_coder = new google.maps.Geocoder();

    var setMarker = function(){
        g_marker = new google.maps.Marker({
            map: g_map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: g_myLatlng
        });
        google.maps.event.addListener(g_marker, 'click', toggleBounce);
    };

    if(locateFlg){
        // 現在地取得
        if( navigator ){

            var md = $('<div>').attr('id','modal_bk');
            md.append(
                $('<div>')
                    .text('現在地を取得中です')
                    .addClass('CenterMiddle')
            );

            var searchKorekue(curLat, curLng){
                $.ajax({
                    url : 'search.php',
                    type : 'POST',
                    data : {
                        lat : curLat,
                        lng : curLng,
                    }
                }).done(function(res){
                    var shopPos = new google.maps.LatLng(res.lat, res.lng);
                    setMarker(shopPos);
                    var shopName = res.shopname;
                    $('.Gmap').after($('<div>').text(showName));
                });
            };

            var success = function(ev){
                g_myLatlng = new google.maps.LatLng(ev.coords.latitude, ev.coords.longitude);
                g_map.setCenter(g_myLatlng);
                searchKorekue(ev.coords.latitude, ev.coords.longitude);
                setMarker();
                md.fadeOut("200", function(){
                    md.remove();
                });
            };
            var error = function(ev){
                $('#modal_bk .CenterMiddle').text('現在地の取得に失敗しました');
                setMarker();
                md.fadeOut("200", function(){
                    md.remove();
                });
            }

            $('body').append(md);
            navigator.geolocation.getCurrentPosition(
                success, error
            );
        }else{
            locateFlg = false;
        }
    }
    if( !locateFlg ){
        setMarker();
    }

    //地名検索ボタン
    $('#searchMapBtn').on('click', $.proxy(function(ev){
        var searchText = $('#searchMapText').val();
        searchText = searchText.replace(/^\s*/,'').replace(/\s*$/,'');
        if( searchText.length == 0 ){
            return;
        }

        if( g_coder ){
            g_coder.geocode({
                address: searchText,
                region: 'ja',
            }, function(res, st){
                if( st == google.maps.GeocoderStatus.OK ){
                    g_map.setCenter(res[0].geometry.location);
                    g_marker.setPosition(res[0].geometry.location);
                }
            });
        }
    }, this));
}
        
function addMarker(id, location){
    if( g_markerHash !== undefined && g_markerHash[id] ){
        var curPos = g_markerHash[id].getPosition();
        var meter = google.maps.geometry.spherical.computeDistanceBetween(location, curPos);
        if( meter < 100 ){
            return;
        }
        
        var prev = g_markerHash[id];
        prev.setMap(null);
    }
    var marker = new google.maps.Marker({
        draggable: false,
        animation: google.maps.Animation.BOUNCE,
        position: location,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5
        },
        map: g_map
    });
    g_markerHash[id] = marker;
}

function clearMarker(){
    for (var k in g_markerHash){
        g_markerHash[k].setMap(null);
        delete g_markerHash[k];
    }
}

function toggleBounce(){
    if( g_marker.getAnimation() ){
        g_marker.setAnimation(null);
    }else{
        g_marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCMje-M_JnXPbXNisBgIbS0GR_aCCJt3qQ&sensor=FALSE&libraries=geometry&callback=initialize";
    document.body.appendChild(script);
}


function takeMarker() {
    var pos = g_marker.getPosition();
    var lat = $('<input>').attr({'type':'hidden','name':'lat'}).val(pos.lat().toString());
    var lng = $('<input>').attr({'type':'hidden','name':'lng'}).val(pos.lng().toString());
    
    $('#notifyForm').append(lat);
    $('#notifyForm').append(lng);
}

window.onload = loadScript;
