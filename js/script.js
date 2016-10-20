// initialize map
var map;

var point = {};

var marker;

var infowindow;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 44.236221, lng: -72.567444},
    zoom: 9,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  var geocoder = new google.maps.Geocoder();

  var input = document.getElementById('townsearch');

  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(42.664009, -73.564453),
    new google.maps.LatLng(45.055819, -71.411133));

  var searchBox = new google.maps.places.SearchBox(input, {bounds: defaultBounds});

  google.maps.event.addListener(searchBox, 'places_changed', function () {
    geocodeAddress(geocoder,map)
  })

  document.getElementById('submit').onclick = function () {

    var input = document.getElementById('townsearch');

    google.maps.event.trigger(input, 'focus')
    google.maps.event.trigger(input, 'keydown', {
        keyCode: 13
    });

    geocodeAddress(geocoder,map)
  };

};

// geocode user input address
function geocodeAddress(geocoder, resultsMap){
  var address = document.getElementById("townsearch").value;
  geocoder.geocode({"address":address},
  function(results, status){
    if (status === "OK") {

      marker = marker || new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      marker.setPosition(results[0].geometry.location)
      map.setZoom(13);
      map.panTo(marker.position);

      point.length=0
      point = turf.point([
        results[0].geometry.location.lng(),
        results[0].geometry.location.lat()
      ]);

      infowindow = infowindow || new google.maps.InfoWindow({
        content: "", maxWidth:200
      });

      defineDistricts(point);
    } else {
      console.log("Geocode was not successful because: " + status);
    }
  });
};


function defineDistricts(coords){
    $("#notVermontAlert").empty()
    getDist(point, housedist, "houseDist");
    getDist(point, sendist, "senDist");
    if (point.properties.houseDist){
      point.properties.rep = []
      point.properties.senator = []
      getLocalCandidates(point.properties.houseDist, point.properties.senDist);
      loadFederalTemplate();
      loadStatewideTemplate();
      loadLocalTemplate();
      $("#notes").html("Data from the <a href='https://www.sec.state.vt.us/elections/election-results.aspx' target='_blank'>Vermont Secretary of State</a>.")
      $('.expander').simpleexpand();
      loadInfoWindow(point);
    }
    else {
      loadAlertWindow("Whoops, it looks like this isn't in Vermont! Try another address.")
      $("#statewide").empty();
      $("#local").empty();
      $("#federal").empty();
      $("#notes").empty();
      $("#notVermontAlert").text("Whoops, that's not in Vermont! Try another address.")
    };
};

function getDist(point, multipolygon, string){
  for (var i=0; i<multipolygon.features.length;i++) {
    var isInside = turf.inside(point, multipolygon.features[i])
    if (isInside === true){
      point.properties[string] = multipolygon.features[i].properties.DISTRICT;
      point.properties[string+"Mem"]= Math.round(multipolygon.features[i].properties.MEMBERS);
      point.properties[string+"Name"]= multipolygon.features[i].properties.NAME;
      break;
    };

  };
};

function getLocalCandidates(houseDist, senDist){
  // arrays to hold local candidate datasets
  for (var i = 0; i<candidates.rep.length; i++){
    if (houseDist === candidates.rep[i].District) {
      point.properties.rep.push(candidates.rep[i])
    }
  }
  for (var i = 0; i<candidates.senator.length; i++){
    if (senDist === candidates.senator[i].District) {
      point.properties.senator.push(candidates.senator[i])
    }
  }
}

function loadFederalTemplate(){
  var targetContainer = $("#federal"),
    template = $("#federalTemplate").html();

    var html = Mustache.to_html(template, candidates);

  $(targetContainer).html(html);
};

function loadStatewideTemplate(){
  var targetContainer = $("#statewide"),
    template = $("#statewideTemplate").html();

    var html = Mustache.to_html(template, candidates);

  $(targetContainer).html(html);
};

function loadLocalTemplate(){
  var targetContainer = $("#local"),
    template = $("#localTemplate").html();

    var html = Mustache.to_html(template, point);

  $(targetContainer).html(html);
};

function loadInfoWindow(point){
  houseDist = point.properties.houseDistName
  senDist = point.properties.senDistName
  content = "<div id='infocontent'>Your Senate district is <b>" + senDist + "</b> and your House district is <b>" + houseDist + "</b>.</div>"
  infowindow.setContent(content);
  infowindow.open(map, marker);
};

function loadAlertWindow(addressalert){
  infowindow.setContent("<div id='infocontent'>"+addressalert+"</div>");
  infowindow.open(map, marker)
};
