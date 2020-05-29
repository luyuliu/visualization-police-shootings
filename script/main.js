$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  $('.mini-submenu').fadeIn();
  return false;
});


$('.mini-submenu').on('click', function () {
  animateSidebar();
  $('.mini-submenu').hide();
})

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function () {
    map.invalidateSize();
  });
}
var baseLayer = L.esri.basemapLayer('DarkGray')

map = L.map("map", {
  zoom: 5.3,
  center: [39.707186656826565, -100],
  layers: [baseLayer],
  zoomControl: true,
  attributionControl: true,
  maxZoom: 10
});

map.on("click", function (e) {
  console.log(e)
})

function getColorBlockString(color) {
  var div = '<div class="legendbox" style="padding:0px;background:' + color + '"></div>'
  return div;
}

L.control.scale({ position: "bottomleft" }).addTo(map);
var north = L.control({ position: "topright" });
north.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info");
  div.id = 'north_arrow'
  div.innerHTML = '<img style="height:120px;width:auto;" src="img/north_arrow.png">';
  return div;
}
north.addTo(map);

$(document).ready(function (e) {
  var allPromises = [
    $.get("https://luyuliu.github.io/visualization-police-shootings/data/shooting.geojson")
  ];
  Promise.all(allPromises).then(readyFunction);

})

function readyFunction(data) {
  // Data processing
  var data = data[0]
  console.log(data)


  // Visualization
  clusterLayer = new L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 9
  });

  clusterFullLayer = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return new L.circleMarker(latlng, {
        //radius: 10, 
        //fillOpacity: 0.85
        //This sets them as empty circles
        radius: 10,
        //this is the color of the center of the circle
        fillColor: "#ffffff",
        //this is the color of the outside ring
        color: "#ffffff",
        //this is the thickness of the outside ring
        weight: .5,
        //This is the opacity of the outside ring
        opacity: 1,
        //this is the opacity of the center. setting it to 0 makes the center transparent
        fillOpacity: 0.5,
      });
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        layer.on({
          click: function (e) {

          }
        });
      }
    }
  });


  clusterLayer.addLayer(clusterFullLayer)
  map.addLayer(clusterLayer);
}