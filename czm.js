Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGIxYmY0Zi1iYTgwLTRmYzctODUwNS00MDZiYzg0ZWU4ODAiLCJpZCI6MTM5NzE4LCJpYXQiOjE2ODQ0MjE3Nzl9.nk8yr8PVm-ZluXohTmPDAnyno5gJZXuhTBrO52ji8Bs';
const viewer = new Cesium.Viewer("cesiumContainer", {
    contextOptions: {
        webgl: {
            preserveDrawingBuffer: true
        }
    }
});
var layers = viewer.imageryLayers;
//var baseLayer = layers.get(0);
//layers.remove(baseLayer);
//layers.addImageryProvider(Cesium.IonImageryProvider.fromAssetId(3954));
var camera = viewer.scene.camera;

const latElement = document.getElementById("lat");
const lonElement = document.getElementById("lon");
const altElement = document.getElementById("alt");
const headingElement = document.getElementById("heading");
const pitchElement = document.getElementById("pitch");
const rollElement = document.getElementById("roll");
const hfovElement = document.getElementById("hfov");
const submitElement = document.getElementById("submit");

const waittime_ss = 4000
const waittime_csv = 2000

function moveCamera(){
        const frustum = new Cesium.PerspectiveFrustum({
            fov: Cesium.Math.toRadians(Number(hfovElement.value)),
            aspectRatio: viewer.canvas.clientWidth / viewer.canvas.clientHeight
        });
        camera.frustum = frustum;
        var lon = Number(lonElement.value);
        var lat = Number(latElement.value);
        var alt = Number(altElement.value);
        var heading = Cesium.Math.toRadians(Number(headingElement.value));
        var pitch = Cesium.Math.toRadians(Number(pitchElement.value));
        var roll = Cesium.Math.toRadians(Number(rollElement.value));
        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
            orientation: {
                heading: heading,
                pitch: pitch,
                roll: roll
            }
        });  
}
submitElement.addEventListener("click", function() {moveCamera()});    
viewer.scene.skyBox.show = false;
viewer.scene.globe.maximumScreenSpaceError = 1.5;
viewer.scene.postProcessStages.fxaa.enabled = false;
moveCamera()
var targetResolutionScale = 1.0;
var latlonResolutionScale = 0.125;

/*var prepareScreenshot = function(){
    var canvas = viewer.canvas;
    viewer.resolutionScale = targetResolutionScale;
    viewer.scene.preRender.removeEventListener(prepareScreenshot);
    setTimeout(function(){
        scene.postRender.addEventListener(captureScreenshot);
    }, waittime_ss);
}

var captureScreenshot = function(){
    viewer.scene.postRender.removeEventListener(captureScreenshot);
    var canvas = viewer.canvas;
    var img = viewer.canvas.toDataURL();
    var link = document.createElement('a');
    link.download = "snapshot-" + targetResolutionScale.toString() + "x.png";
    link.href = img;
    link.click();
    viewer.resolutionScale = 1.0;
}*/

function captureScreenshot(){    
    viewer.resolutionScale = targetResolutionScale;
    viewer.render();
    setTimeout(function(){       
        var img = viewer.canvas.toDataURL();
        var link = document.createElement('a');
        var filename = "test.png";
        //lonElement.value.toFixed(0).toString() + '_' + latElement.value.toFixed(0).toString()+'_'
            //+altElement.value.toFixed(0).toString()+'_'+headingElement.value.toFixed(0).toString() +'_'
            //+pitchElement.value.toFixed(0).toString()+'_'+rollElement.value.toFixed(0).toString()+'.png';
        link.download = filename
        link.href = img;
        link.click();
    }, waittime_ss)
}
function getPixelCoords(){
    viewer.resolutionScale = latlonResolutionScale;
    viewer.render();
    var out_string = '';
    for(var i=0; i<viewer.canvas.width; i++){
        for(var j=0; j<viewer.canvas.height;j++){
            var pos_pix = new Cesium.Cartesian2(i, j)
            var pos_cartesian = camera.pickEllipsoid(pos_pix)
            if (Cesium.defined(pos_cartesian)){
                var pos_cartographic = Cesium.Cartographic.fromCartesian(pos_cartesian);           
                var lat = Cesium.Math.toDegrees(pos_cartographic.latitude);               
                var lon = Cesium.Math.toDegrees(pos_cartographic.longitude);
                var height = pos_cartographic.height
                out_string += '[('+i.toString()+','+j.toString()+'), (' + lat.toString() + ',' + lon.toString() + ',' + height.toString() + ')], ';
            }
            else{
                out_string += '[('+i.toString()+','+j.toString()+'), (-1,-1,-1)], ';
            }
        }
    }
    var link = document.createElement('a');
    var filename = "test.csv";
    //lonElement.value.toFixed(0).toString() + '_' + latElement.value.toFixed(0).toString()+'_'
           // +altElement.value.toFixed(0).toString()+'_'+headingElement.value.toFixed(0).toString() +'_'
           // +pitchElement.value.toFixed(0).toString()+'_'+rollElement.value.toFixed(0).toString()+'.csv';
    link.download = filename;
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(out_string);
    link.click();
    viewer.resolutionScale = 1.0;
}
screenshotElement = document.getElementById("screenshot")
screenshotElement.addEventListener("click", function() {captureScreenshot()});  
pixelElement = document.getElementById("pixel")
pixelElement.addEventListener("click", function() {getPixelCoords()});

var val1 = [Math.random() * 4 - 82, Math.random() * 4 + 24, 400000, Math.random() * 360 - 180, Math.random() * 180 - 180, 0]
var val2 = [Math.random() * 4 - 82, Math.random() * 4 + 24, 400000, Math.random() * 360 - 180, Math.random() * 180 - 180, 0]
var vals = [val1, val2]




function sequence(){
    if(vals.length==0) return;
    var val = vals.shift();
    lonElement.value = val[0]
    latElement.value = val[1]
    altElement.value = val[2]
    headingElement.value = val[3]
    pitchElement.value = val[4]
    rollElement.value = val[5]
    moveCamera();
    captureScreenshot();
    setTimeout(getPixelCoords(), waittime_ss)     
    setTimeout(function(){
        sequence();
    }, waittime_csv + waittime_ss)
}
sequenceElement = document.getElementById("sequence")
sequenceElement.addEventListener("click", function() {sequence()});
   


