let map;
const api_url = "http://127.0.0.1:5000/";
const key = "gKX0coub6faLUp0QxHew";

function CenterMap(long, lat) {
  console.log("Long: " + long + " Lat: " + lat);
  //map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
  map.getView().setCenter(ol.proj.fromLonLat([long, lat]));
  map.getView().setZoom(15);
}

function loadMap(target, center, zoom) {
  // const raster = new ol.layer.Tile({
  //   source: new ol.source.OSM(),
  // });
  // map = new ol.Map({
  //   layers: [raster],
  //   target: target,
  //   view: new ol.View({
  //     center: center,
  //     zoom: zoom,
  //   }),
  // });
  const attribution = new ol.control.Attribution({
    collapsible: false,
  });
  const source = new ol.source.TileJSON({
    url: `https://api.maptiler.com/maps/satellite/tiles.json?key=${key}`, // source URL
    tileSize: 512,
    crossOrigin: "anonymous",
  });
  const raster = new ol.layer.Tile({
    source: source,
  });
  map = new ol.Map({
    layers: [raster],
    // controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
    target: target,
    view: new ol.View({
      //constrainResolution: true,
      center: center, // starting position [lng, lat]
      zoom: zoom, // starting zoom
    }),
  });
}

function addMapLayer(data) {
  if (data.errMsg) {
    console.info(data.errMsg);
  } else {
    if (data.hasOwnProperty("url")) {
      var $this = this;
      addTileServerURL(data.url, "geeLayer");
    } else {
      console.warn("Wrong Data Returned");
    }
  }
  $("#overlay").hide();
}

function addTileServerURL(url, layerID) {
  var geeLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: url,
    }),
    id: layerID,
  });
  map.addLayer(geeLayer);
}

function removeLayer(which) {
  map.getLayers().forEach(function (layer) {
    if (layer.get("id") != undefined && layer.get("id") === which) {
      map.removeLayer(layer);
    }
  });
}

function addInteraction(which) {
  removeLayer("drawLayer");
  var source = new ol.source.Vector({ wrapX: false });
  var vectorLayer = new ol.layer.Vector({
    source: source,
    id: "drawLayer",
  });

  map.addLayer(vectorLayer);

  draw = new ol.interaction.Draw({
    source: source,
    type: which,
  });
  map.addInteraction(draw);
  draw.on("drawend", drawEnd);
}

function drawEnd(event) {
  map.removeInteraction(draw);
  var geom = event.feature
    .getGeometry()
    .clone()
    .transform("EPSG:3857", "EPSG:4326");
  if (geom.flatCoordinates.length == 2) {
    polygon = geom.getCoordinates();
  } else {
    polygon = geom.getCoordinates()[0];
  }
  $("#drawnPolygon").text(JSON.stringify(polygon));
  jQuery(requestModal).modal("show");
}

function drawPolyStart() {
  jQuery(requestModal).modal("hide");
  addInteraction("Polygon");
}

function downloadMap() {
  map.once("rendercomplete", function () {
    const mapCanvas = document.createElement("canvas");
    const size = map.getSize();
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    const mapContext = mapCanvas.getContext("2d");
    Array.prototype.forEach.call(
      map.getViewport().querySelectorAll(".ol-layer canvas, canvas.ol-layer"),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity =
            canvas.parentNode.style.opacity || canvas.style.opacity;
          mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
          let matrix;
          const transform = canvas.style.transform;
          if (transform) {
            // Get the transform parameters from the style's transform matrix
            matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(",")
              .map(Number);
          } else {
            matrix = [
              parseFloat(canvas.style.width) / canvas.width,
              0,
              0,
              parseFloat(canvas.style.height) / canvas.height,
              0,
              0,
            ];
          }
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          const backgroundColor = canvas.parentNode.style.backgroundColor;
          if (backgroundColor) {
            mapContext.fillStyle = backgroundColor;
            mapContext.fillRect(0, 0, canvas.width, canvas.height);
          }
          mapContext.drawImage(canvas, 0, 0);
        }
      }
    );
    mapContext.globalAlpha = 1;
    mapContext.setTransform(1, 0, 0, 1, 0, 0);
    const link = document.getElementById("image-download");
    link.href = mapCanvas.toDataURL();
    link.click();
  });
  map.renderSync();
}
