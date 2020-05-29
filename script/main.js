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


var labelTextCollision = new L.LabelTextCollision({
  collisionFlg: true
});

map = L.map("map", {
  zoom: 5.3,
  center: [39.707186656826565, -100],
  layers: [baseLayer],
  zoomControl: false,
  attributionControl: false,
  maxZoom: 18,
  renderer: labelTextCollision
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
    $.get("https://raw.githubusercontent.com/washingtonpost/data-police-shootings/master/fatal-police-shootings-data.csv")
  ];
  Promise.all(allPromises).then(readyFunction);

})

function readyFunction(data) {
  // Data processing
  var allText = data[0];
  console.log(allText);
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];

  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {

      var tarr = {};
      for (var j = 0; j < headers.length; j++) {
        tarr[headers[j]] = data[j];
      }
      lines.push(tarr);
    }
  }
  console.log(lines)

  // Visualization
  

}