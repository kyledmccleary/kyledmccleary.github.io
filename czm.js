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
const randomElement = document.getElementById("random");
const latMinElement = document.getElementById("randlatmin")
const latMaxElement = document.getElementById("randlatmax")
const lonMinElement = document.getElementById("randlonmin")
const lonMaxElement = document.getElementById("randlonmax")
const altMinElement = document.getElementById("randaltmin")
const altMaxElement = document.getElementById("randaltmax")
const numRandViewsElement = document.getElementById("numrandviews")
const randHeadingMinElement = document.getElementById("randheadmin")
const randHeadingMaxElement = document.getElementById("randheadmax")
const randPitchMinElement = document.getElementById("randpitchmin")
const randPitchMaxElement = document.getElementById("randpitchmax")
const randRollMinElement = document.getElementById("randrollmin")
const randRollMaxElement = document.getElementById("randrollmax")

const waittime_ss = 3000

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
var targetResolutionScale = 3.0;
var latlonResolutionScale = 0.25;

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

function captureScreenshot(filename){       
    var img = viewer.canvas.toDataURL();
    var link = document.createElement('a');
    //var filename = "test.png";
    //lonElement.value.toFixed(0).toString() + '_' + latElement.value.toFixed(0).toString()+'_'
        //+altElement.value.toFixed(0).toString()+'_'+headingElement.value.toFixed(0).toString() +'_'
        //+pitchElement.value.toFixed(0).toString()+'_'+rollElement.value.toFixed(0).toString()+'.png';
    link.download = filename + '.png'
    link.href = img;
    link.click();
}
function getPixelCoords(){
    //viewer.resolutionScale = latlonResolutionScale;
    //viewer.render();
    var out_string = '';
    var s = 1/latlonResolutionScale;
    var minlat = 5000
    var maxlat = -5000
    var minlon = 5000
    var maxlon = -5000
    for(var i=0; i<viewer.canvas.width*latlonResolutionScale; i++){
        for(var j=0; j<viewer.canvas.height*latlonResolutionScale;j++){
            var pos_pix = new Cesium.Cartesian2(i*s, j*s)
            var pos_cartesian = camera.pickEllipsoid(pos_pix, viewer.scene.globe.ellipsoid)
            if (pos_cartesian){
                var pos_cartographic = Cesium.Cartographic.fromCartesian(pos_cartesian);           
                var lat = Cesium.Math.toDegrees(pos_cartographic.latitude);               
                var lon = Cesium.Math.toDegrees(pos_cartographic.longitude);
                if(lat < minlat){minlat = lat};
                if(lon < minlon){minlon = lon};
                if(lat > maxlat){maxlat = lat};
                if(lon > maxlon){maxlon = lon};
                //var height = 0
                out_string += '[('+i.toString()+','+j.toString()+'), (' + lat.toString() + ',' + lon.toString() + ')], ';
            }
          /*  else{
                out_string += '[('+i.toString()+','+j.toString()+'), (-1,-1,-1)], ';
            }*/
        }
    }
    
    var filename = Math.round(minlon).toString() + '_' + Math.round(maxlon).toString() + '_' + Math.round(minlat).toString() + '_' + Math.round(maxlat).toString() 
    //lonElement.value.toFixed(0).toString() + '_' + latElement.value.toFixed(0).toString()+'_'
           // +altElement.value.toFixed(0).toString()+'_'+headingElement.value.toFixed(0).toString() +'_'
           // +pitchElement.value.toFixed(0).toString()+'_'+rollElement.value.toFixed(0).toString()+'.csv';
    if(filename.startsWith("5000")){
        return filename
    } 
    var link = document.createElement('a');
    link.download = filename + '.csv';
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(out_string);
    link.click();
    //viewer.resolutionScale = 1.0;
    return filename
}
screenshotElement = document.getElementById("screenshot")
screenshotElement.addEventListener("click", function() {captureScreenshot()});  
pixelElement = document.getElementById("pixel")
pixelElement.addEventListener("click", function() {getPixelCoords()});

//var val1 = [Math.random() * 4 - 82, Math.random() * 4 + 24, 400000, Math.random() * 360 - 180, Math.random() * 180 - 180, 0]
//var val2 = [Math.random() * 4 - 82, Math.random() * 4 + 24, 400000, Math.random() * 360 - 180, Math.random() * 180 - 180, 0]
//var val3 = [Math.random() * 4 - 82, Math.random() * 4 + 24, 400000, Math.random() * 360 - 180, Math.random() * 180 - 180, 0]
//var vals = [val1, val2, val3]

/*const cnt = 1000
var vals = []
var latmin = -60 //24
var latmax = 60 //32
var lonmin = -180 //-84
var lonmax = 180 //-78
var altmin = 400000
var altmax = 450000
for(var i=0; i<cnt; i++){
    vals.push(getRandomView(latmin, latmax, lonmin, lonmax, altmin, altmax))
}*/
var vals = [];
var latmin, latmax, lonmin, lonmax, altmin, altmax, headingmin, headingmax, pitchmin, pitchmax, rollmin, rollmax;
function genViews(){
    updateVals();
    var cnt = Number(numRandViewsElement.value);   
    for(var i=0; i<cnt; i++){
        vals.push(getRandomView())
    }
}

function updateVals(){
    latmin = Number(latMinElement.value)
    latmax = Number(latMaxElement.value)
    lonmin = Number(lonMinElement.value)
    lonmax = Number(lonMaxElement.value)
    altmin = Number(altMinElement.value)
    altmax = Number(altMaxElement.value)
    headingmin = Number(randHeadingMinElement.value)
    headingmax = Number(randHeadingMaxElement.value)
    pitchmin = Number(randPitchMinElement.value)
    pitchmax = Number(randPitchMaxElement.value)
    rollmin = Number(randRollMinElement.value)
    rollmax = Number(randRollMaxElement.value)
}

function sequence(){
    if(vals.length==0){
        viewer.resolutionScale = 1.0;
        return;
    }     
    var val = vals.shift();
    lonElement.value = val[0]
    latElement.value = val[1]
    altElement.value = val[2]
    headingElement.value = val[3]
    pitchElement.value = val[4]
    rollElement.value = val[5]
    moveCamera();
    var filename = getPixelCoords();
   // if(!filename.startsWith("5000")){
    viewer.resolutionScale = targetResolutionScale;
    viewer.render()
    setTimeout(function(){  
        captureScreenshot(filename);
            //setTimeout(function(){
          //      getPixelCoords();
           // }, waittime_ss)     
    }, waittime_ss)
    setTimeout(function(){
        sequence();
    }, waittime_ss)
  //  }
   /* else{
        setTimeout(function(){
            sequence();
        }, waittime_ss)
    }   */
}
sequenceElement = document.getElementById("sequence")
sequenceElement.addEventListener("click", function() {
    genViews()
    sequence()
});

randomElement.addEventListener("click", function() {
    updateVals();
    var view = getRandomView();  
    goToView(view);
});
   
function getRandomView(){
    var lonrange = lonmax-lonmin
    var latrange = latmax-latmin
    var altrange = altmax-altmin
    var headingrange = headingmax-headingmin
    var pitchrange = pitchmax-pitchmin
    var rollrange = rollmax-rollmin
    var randlon = Math.random() * lonrange + lonmin
    var randlat = Math.random() * latrange + latmin
    var randalt = Math.random() * altrange + altmin
    var randheading = Math.random() * headingrange +headingmin
    var randpitch = Math.random() * pitchrange +pitchmin
    var randroll = Math.random() * rollrange +rollmin
    return [randlon, randlat, randalt, randheading, randpitch, randroll]
}

function goToView(view){
    lonElement.value = view[0]
    latElement.value = view[1]
    altElement.value = view[2]
    headingElement.value = view[3]
    pitchElement.value = view[4]
    rollElement.value = view[5]
    moveCamera();
}
