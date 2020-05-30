$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  $('.mini-submenu').fadeIn();
  return false;
});


$('.mini-submenu').on('click', function () {
  animateSidebar();
  $('.mini-submenu').hide();
})

var baseLayer = L.esri.basemapLayer('DarkGray')

map = L.map("map", {
  zoom: 5.3,
  center: [39.707186656826565, -90],
  layers: [baseLayer],
  zoomControl: true,
  attributionControl: true,
  maxZoom: 10
});

map.on("click", function (e) {
  console.log(e)
})

L.control.scale({ position: "bottomleft" }).addTo(map);
var north = L.control({ position: "topright" });
north.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info");
  div.id = 'north_arrow'
  div.innerHTML = '<img style="height:120px;width:auto;" src="img/north_arrow.png">';
  return div;
}
north.addTo(map);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'><a href='https://github.com/luyuliu' target='_blank'>Luyu Liu</a> | <a href='https://github.com/bmcbride/bootleaf' target='_blank'>Bootleaf</a></span>";
  return div;
};
map.addControl(attributionControl);

$(document).ready(function (e) {
  var allPromises = [
    $.get("https://luyuliu.github.io/visualization-police-shootings/data/cities.geojson"),
    $.get("https://luyuliu.github.io/visualization-police-shootings/data/victims.json")
  ];
  Promise.all(allPromises).then(readyFunction);

})

function readyFunction(data) {
  // Data processing
  var victims_hash_data = data[1]
  var data = data[0]
  console.log(victims_hash_data)


  // Visualization
  var colorRamp = [1, 2, 3, 4, 5, 6, 12, 83]
  var colorCode = ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d']

  var sizeCode = [2, 3, 4, 5, 6, 8, 10]

  var title = 'Police fatal<br>shooting victims';
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    div.id = 'legend'

    var legendContent2 = "<span style='font-size:30;'>Legend</span>"
    legendContent2 += "<h3>" + title + "</h3>"
    legendContent2 += '<table><tbody>'
    for (var i = 0; i < colorCode.length; i++) {
      if (colorRamp[i] == -Infinity) {
        labelContent2 = "( -∞, " + colorRamp[i + 1] + ")";
      }
      else {
        if (colorRamp[i + 1] == Infinity) {
          labelContent2 = "[" + colorRamp[i] + ", ∞ )";
        }
        else {
          labelContent2 = "[" + colorRamp[i] + ", " + colorRamp[i + 1] + ")";
        }
      }
      legendContent2 += "<tr valign='middle'>" +
        "<td class='tablehead' align='middle'>" + getColorBlockString(colorCode[i], sizeCode[i]) + "</td>" +
        "<td class='tablecontent' align='right' style='width:180px;'><span style='width:90%;font-size:30;font:'>" + labelContent2 + "</span><td>" + "</tr>";
    }
    legendContent2 += "</tbody><table>";

    div.innerHTML = legendContent2;
    return div;
  }
  legend.addTo(map);

  citiesLayer = L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      var count = feature.properties.count;
      var color = returnColor(count, colorRamp, colorCode);
      var size = returnSize(count, colorRamp, sizeCode);
      return new L.circleMarker(latlng, {
        //radius: 10, 
        //fillOpacity: 0.85
        //This sets them as empty circles
        radius: size,
        //this is the color of the center of the circle
        fillColor: color,
        //this is the color of the outside ring
        color: "#ffffff",
        //this is the thickness of the outside ring
        weight: 0,
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
            var latlng = e.target.feature.geometry.coordinates[0];
            var property = e.target.feature.properties;
            var total_count = property["count"];
            var max_age = property["maximum_ag"]
            if (max_age == 0) {
              max_age == "unknown";
            }
            var min_age = property["minimum_ag"]
            if (min_age == 999) {
              min_age == "unknown";
            }

            var popup = L.popup()
              .setLatLng([parseFloat(latlng[1]), parseFloat(latlng[0])])
              .setContent("<span>Total Casualty: " + property["count"] +
                "</span></br><span>Female victims percentage: " + Math.round(property["female_cou"] / total_count * 100) +
                "%</span></br><span>Known black victims percentage: " + Math.round(property["known_blac"] / total_count * 100) +
                "%</span></br><span>Known hispanic victims percentage: " + Math.round(property["known_hisp"] / total_count * 100) +
                "%</span></br><span>Known nonwhite victims percentage: " + Math.round(property["known_nonw"] / total_count * 100) +
                "%</span></br><span>age span: " + min_age + " - " + max_age +
                "</span></br><span>Non-fleeing percentage: " + Math.round(property["non_fleein"] / total_count * 100) +
                "%</span></br><span>Unarmed percentage: " + Math.round(property["unarmed_co"] / total_count * 100) + 
                "%</span>"
              )
              .openOn(map);
            
            var victim_data = victims_hash_data[property["OBJECTID"].toString()]
            console.log(victim_data)
            var table = new Tabulator("#victims-table", {
              data: victim_data,           //load row data from array
              // layout: "fitColumns",      //fit columns to width of table
              // width: "500px",
              // responsiveLayout: "hide",  //hide columns that dont fit on the table
              tooltips: true,            //show tool tips on cells
              addRowPos: "top",          //when adding a new row, add it to the top of the table
              history: true,             //allow undo and redo actions on the table
              pagination: "local",       //paginate the data
              paginationSize: 18,         //allow 7 rows per page of data
              movableColumns: true,      //allow column order to be changed
              resizableRows: true,       //allow row order to be changed
              initialSort: [             //set the initial sort order of the data
                { column: "name", dir: "asc" },
              ],
              columns: [                 //define the table columns
                { title: "Name", field: "name" },
                { title: "Age", field: "age" },
                { title: "Gender", field: "gender" },
                { title: "Race", field: "race" },
                { title: "Arm", field: "armed" },
                { title: "Body camera on/off", field: "body_camera" },
                { title: "Cause of death", field: "cause_of_death" },
                { title: "Death date", field: "date" },
                { title: "Fleeing status", field: "flee" },
                { title: "Death date", field: "date" },
                { title: "Signs of mental illness", field: "signs_of_mental_illness" },
                { title: "Threat level", field: "threat_level" }
              ],
            });

          }
        });
      }
    }
  }).addTo(map);


}



function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function () {
    map.invalidateSize();
  });
}

function getColorBlockString(color, size) {
  var div = '<svg height="20" width="20"><circle cx="10" cy="10" r="' + size + '" fill="' + color + '"></circle></svg>'
  return div;
}

function returnColor(value, colorRamp, colorCode) {
  for (var i = 1; i < colorRamp.length; i++) {
    if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
      return colorCode[i - 1]
    }
    else {
      continue;
    }
  }
  return
}

function returnSize(value, colorRamp, sizeCode) {
  for (var i = 1; i < colorRamp.length; i++) {
    if (value >= colorRamp[i - 1] && value < colorRamp[i]) {
      return sizeCode[i - 1]
    }
    else {
      continue;
    }
  }
  return
}