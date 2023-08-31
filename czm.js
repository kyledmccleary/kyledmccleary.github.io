Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGIxYmY0Zi1iYTgwLTRmYzctODUwNS00MDZiYzg0ZWU4ODAiLCJpZCI6MTM5NzE4LCJpYXQiOjE2ODQ0MjE3Nzl9.nk8yr8PVm-ZluXohTmPDAnyno5gJZXuhTBrO52ji8Bs';
const viewer = new Cesium.Viewer("cesiumContainer", {
    contextOptions: {
        webgl: {
            preserveDrawingBuffer: true
        }
    }
});
viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[9];
viewer.scene.skyBox.show = false;
viewer.scene.globe.maximumScreenSpaceError = 1.5;
viewer.scene.postProcessStages.fxaa.enabled = false;
var targetResolutionScale = 3.0;
var latlonResolutionScale = 0.25;
var camera = viewer.scene.camera;
const waittime_ss = 3000

const XElement = document.getElementById("X");
const YElement = document.getElementById("Y");
const ZElement = document.getElementById("Z");
const DxElement = document.getElementById("D_x");
const DyElement = document.getElementById("D_y");
const DzElement = document.getElementById("D_z");
const UxElement = document.getElementById("U_x");
const UyElement = document.getElementById("U_y");
const UzElement = document.getElementById("U_z");
const RxElement = document.getElementById("R_x");
const RyElement = document.getElementById("R_y");
const RzElement = document.getElementById("R_z");
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
const orbitElement = document.getElementById("orbit_box")
const headingElement = document.getElementById("heading")
const pitchElement = document.getElementById("pitch")
const rollElement = document.getElementById("roll")
const latElement = document.getElementById("lat")
const lonElement = document.getElementById("lon")
const altElement = document.getElementById("alt")
const startElement = document.getElementById("startno")

function moveCamera(){   
        const frustum = new Cesium.PerspectiveFrustum({
            fov: Cesium.Math.toRadians(Number(hfovElement.value)),
            aspectRatio: viewer.canvas.clientWidth / viewer.canvas.clientHeight
        });
        camera.frustum = frustum;
        var X = Number(XElement.value);
        var Y = Number(YElement.value);
        var Z = Number(ZElement.value);
        var pos = new Cesium.Cartesian3(X,Y,Z)
        var D_x = Number(DxElement.value);
        var D_y = Number(DyElement.value);
        var D_z = Number(DzElement.value);
        var D = new Cesium.Cartesian3(D_x, D_y, D_z)

        var U_x = Number(UxElement.value);
        var U_y = Number(UyElement.value);
        var U_z = Number(UzElement.value);
        var U = new Cesium.Cartesian3(U_x, U_y, U_z)

        var R_x = Number(RxElement.value);
        var R_y = Number(RyElement.value);
        var R_z = Number(RzElement.value);
        var R = new Cesium.Cartesian3(R_x, R_y, R_z)
        camera.setView({
            destination: pos,
            orientation: {
                direction: D,
                up: U,
                right: R
            }
        });  
}
moveCamera();
function moveCameraHPR(){      
        const frustum = new Cesium.PerspectiveFrustum({
            fov: Cesium.Math.toRadians(Number(hfovElement.value)),
            aspectRatio: viewer.canvas.clientWidth / viewer.canvas.clientHeight
        });
        camera.frustum = frustum;
        var h = Number(headingElement.value);
        var p = Number(pitchElement.value);
        var r = Number(rollElement.value);

        var lat = Number(latElement.value);
        var lon = Number(lonElement.value);
        var alt = Number(altElement.value);
        var pos = new Cesium.Cartesian3.fromDegrees(lon, lat, alt);
        
        camera.setView({
            destination: pos,
            orientation: {           
               heading:Cesium.Math.toRadians(h),
               pitch:Cesium.Math.toRadians(p),
               roll:Cesium.Math.toRadians(r)
            }
        });  
}

submitElement.addEventListener("click", function() {moveCameraHPR()});    

var fno = Number(startElement.value)
function captureScreenshot(filename){       
    var img = viewer.canvas.toDataURL();
    var link = document.createElement('a');
    link.download = filename + '.png'
    link.href = img;
    link.click();
}

function getSatPose(){
    var satpos = camera.position
    var direction = camera.direction
    var up = camera.up
    var right = camera.right
    var out_string = JSON.stringify({position: viewer.camera.position, direction:viewer.camera.direction,
                                     up: viewer.camera.up, right:viewer.camera.right})
    var filename = fno.toString()
    fno = fno+1
    var link = document.createElement('a');
    link.download = filename + '.txt';
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(out_string);
    link.click();
    return filename
}

function getPixelCoords(f=null){
    var out_string = '[';
    var s = 1/latlonResolutionScale;
    for(var i=0; i<viewer.canvas.clientWidth/s; i++){
        for(var j=0; j<viewer.canvas.clientHeight/s;j++){
            var pos_pix = new Cesium.Cartesian2(i*s, j*s)
            var pos_cartesian = camera.pickEllipsoid(pos_pix, viewer.scene.globe.ellipsoid)
            if (pos_cartesian){
                var pos_cartographic = Cesium.Cartographic.fromCartesian(pos_cartesian);           
                var lat = Cesium.Math.toDegrees(pos_cartographic.latitude);               
                var lon = Cesium.Math.toDegrees(pos_cartographic.longitude);
                out_string += '['+i.toString()+', '+j.toString()+', ' + lat.toString() + ',' + lon.toString() + '], ';
            }
        }
    }
    out_string += ']'
    if(f){
        var filename =  f + fno.toString()
        fno = fno+1
    } 
    else{
        var filename = fno.toString()
        fno = fno+1
    }
    var link = document.createElement('a');
    link.download = filename + '.csv';
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(out_string);
    link.click();
    return filename
}
screenshotElement = document.getElementById("screenshot")
screenshotElement.addEventListener("click", function() {captureScreenshot()});  
pixelElement = document.getElementById("pixel")
pixelElement.addEventListener("click", function() {getPixelCoords()});

var vals = [];
var latmin, latmax, lonmin, lonmax, altmin, altmax, headingmin, headingmax, pitchmin, pitchmax, rollmin, rollmax;
var cnt
function genViews(){
    updateVals();
    cnt = Number(numRandViewsElement.value);   
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

function viewSequence(f=null){
    if(vals.length==0){
        viewer.resolutionScale = 1.0;
        return;
    }     
    var val = vals.shift();
    XElement.value = val[0]
    YElement.value = val[1]
    ZElement.value = val[2]
    DxElement.value = val[3]
    DyElement.value = val[4]
    DzElement.value = val[5]
    UxElement.value = val[6]
    UyElement.value = val[7]
    UzElement.value = val[8]
    RxElement.value = val[9]
    RyElement.value = val[10]
    RzElement.value = val[11]    
  moveCamera();
  setTimeout(function(){
   viewSequence(f);
  }, waittime_ss)
}

function addLandmarks(f=null){
    const lds = JSON.parse('[[-120.425, 39.358333333333334], [-120.425, 38.525], [-121.25833333333333, 39.58333333333333], [-120.425, 34.733333333333334], [-122.725, 39.58333333333333], [-122.19999999999999, 37.53333333333333], [-120.425, 36.3], [-121.68333333333334, 36.7], [-121.03333333333333, 35.56666666666666], [-120.425, 39.58333333333333], [-120.53333333333333, 43.75], [-120.425, 40.79166666666667], [-120.425, 47.58333333333333], [-121.35833333333333, 46.88333333333333], [-121.85833333333333, 44.46666666666667], [-121.25833333333333, 41.1], [-120.425, 42.2], [-121.36666666666667, 43.141666666666666], [-122.55833333333334, 41.21666666666667], [-121.925, 42.05], [-121.25833333333333, 47.58333333333333], [-121.26666666666667, 46.05], [-122.19999999999999, 43.24166666666667], [-120.425, 44.58333333333333], [-120.53333333333333, 42.91666666666667], [-114.425, 27.566666666666666], [-114.45, 31.308333333333334], [-114.425, 30.083333333333332], [-115.28333333333333, 31.116666666666667], [-114.425, 28.4], [-115.49166666666667, 29.741666666666667], [-114.55833333333334, 29.233333333333334], [-116.11666666666667, 30.575], [-114.73333333333333, 30.475], [-116.48333333333333, 31.516666666666666], [-113.58333333333334, 31.46666666666667], [-113.525, 29.15833333333333], [-113.56666666666666, 26.90833333333333], [-111.48333333333333, 24.425], [-112.23333333333333, 29.083333333333332], [-112.81666666666666, 30.25], [-110.38333333333333, 24.425], [-112.94166666666666, 28.258333333333333], [-112.73333333333333, 26.46666666666667], [-111.50833333333333, 28.34166666666667], [-109.44166666666666, 26.375], [-110.63333333333333, 27.6], [-112.05000000000001, 25.258333333333333], [-111.49166666666667, 26.35], [-112.31666666666666, 27.383333333333333], [-112.94166666666666, 31.083333333333336], [-110.93333333333334, 25.34166666666667], [-108.88333333333333, 25.541666666666664], [-112.69166666666666, 29.416666666666668], [-113.58333333333334, 27.741666666666667], [-84.43333333333334, 42.88333333333333], [-85.82499999999999, 40.425], [-86.42500000000001, 41.75833333333333], [-89.42500000000001, 41.61666666666667], [-88.4, 47.03333333333333], [-85.49166666666667, 44.75], [-84.64166666666667, 43.75], [-86.3, 46.11666666666667], [-85.74166666666667, 42.575], [-84.46666666666667, 46.13333333333333], [-85.475, 43.91666666666667], [-89.26666666666667, 46.63333333333333], [-89.30000000000001, 45.733333333333334], [-85.46666666666667, 46.41666666666667], [-88.09166666666667, 42.70833333333333], [-84.425, 47.58333333333333], [-88.43333333333334, 46.175], [-87.13333333333333, 46.275], [-84.65833333333333, 44.71666666666667], [-88.92500000000001, 42.24166666666667], [-78.425, 24.933333333333334], [-80.175, 26.15], [-78.425, 26.84166666666667], [-79.10833333333333, 25.4], [-80.39166666666667, 26.983333333333334], [-80.75833333333333, 24.95], [-82.55833333333334, 27.641666666666666], [-81.63333333333333, 24.6], [-79.25833333333333, 24.425], [-80.55, 27.833333333333336], [-82.06666666666666, 26.666666666666664], [-78.425, 25.766666666666666], [-82.19999999999999, 28.983333333333334], [-81.42500000000001, 30.041666666666664], [-81.225, 27.016666666666666], [-81.23333333333333, 29.125], [-81.38333333333333, 28.191666666666666], [-80.15833333333333, 25.316666666666666], [-79.25833333333333, 26.891666666666666], [-82.69999999999999, 29.816666666666666], [-82.06666666666666, 43.04166666666667], [-83.48333333333333, 43.825], [-79.11666666666667, 44.3], [-80.275, 44.80833333333334], [-81.50833333333333, 43.875], [-81.10833333333333, 44.766666666666666], [-82.275, 45.90833333333333], [-81.23333333333333, 42.925], [-82.9, 42.99166666666667], [-83.58333333333334, 44.65833333333333], [-80.39166666666667, 41.86666666666667], [-80.42500000000001, 43.55], [-78.425, 43.475], [-82.65, 43.825], [-80.90833333333333, 46.09166666666667], [-79.71666666666667, 46.58333333333333], [-78.425, 44.55], [-78.425, 42.641666666666666], [-79.725, 47.50833333333333], [-78.84166666666667, 46.08333333333333], [-76.30000000000001, 38.33333333333333], [-76.0, 37.358333333333334], [-75.07499999999999, 38.825], [-76.09166666666667, 36.525], [-76.65, 35.68333333333334], [-76.25, 39.16666666666667], [-76.86666666666667, 34.80833333333334], [-75.30833333333334, 37.99166666666667], [-74.42500000000001, 39.58333333333333], [-77.58333333333334, 39.58333333333333], [10.458333333333334, 34.08333333333333], [11.166666666666668, 33.516666666666666], [10.891666666666666, 34.91666666666667], [10.675, 36.108333333333334], [8.383333333333333, 33.63333333333333], [6.441666666666666, 35.325], [11.575, 33.05833333333334], [10.533333333333333, 36.94166666666666], [9.7, 37.108333333333334], [8.483333333333334, 35.46666666666667], [7.433333333333334, 46.00833333333333], [10.575, 46.44166666666666], [6.8, 44.733333333333334], [8.383333333333333, 46.6], [11.408333333333333, 47.03333333333333], [9.216666666666667, 46.71666666666667], [6.6, 45.58333333333333], [10.575, 47.275], [9.741666666666667, 47.375], [11.45, 46.2], [9.741666666666667, 46.275], [7.383333333333333, 44.233333333333334], [7.433333333333334, 45.175], [7.55, 46.84166666666667], [11.575, 47.58333333333333], [12.416666666666668, 32.86666666666667], [14.841666666666667, 32.425], [14.008333333333333, 32.74166666666667], [13.25, 32.858333333333334], [12.75, 37.81666666666666], [14.025, 37.125], [15.016666666666666, 37.45833333333333], [16.875, 39.06666666666666], [14.858333333333333, 36.625], [13.708333333333332, 37.95833333333333], [12.416666666666668, 46.95], [13.316666666666666, 47.2], [14.149999999999999, 47.45833333333333], [13.591666666666667, 46.6], [12.483333333333334, 47.58333333333333], [13.75, 42.2], [17.09166666666667, 44.233333333333334], [14.983333333333334, 47.40833333333333], [12.758333333333333, 46.36666666666667], [14.641666666666666, 44.9], [14.425, 46.625], [13.316666666666666, 47.58333333333333], [13.616666666666667, 43.03333333333333], [17.575, 40.49166666666667], [16.733333333333334, 43.4], [15.375, 44.1], [16.258333333333333, 44.325], [13.266666666666666, 45.53333333333333], [14.55, 40.675], [17.575, 43.4], [127.55833333333334, 39.58333333333333], [126.41666666666666, 37.04166666666667], [130.44166666666666, 32.975], [126.41666666666666, 35.83333333333333], [131.53333333333333, 33.675], [130.7, 33.80833333333334], [128.95833333333331, 35.266666666666666], [128.125, 38.75], [126.61666666666667, 34.94166666666666], [126.50833333333333, 33.65833333333333], [129.35833333333335, 36.1], [128.48333333333335, 36.18333333333334], [127.49166666666667, 34.891666666666666], [128.85833333333335, 37.891666666666666], [127.25, 36.6], [137.51666666666665, 36.641666666666666], [134.79166666666669, 34.38333333333333], [136.98333333333335, 34.875], [136.68333333333334, 36.50833333333333], [133.64999999999998, 34.30833333333334], [135.625, 34.75833333333333], [132.60000000000002, 33.983333333333334], [137.54166666666669, 35.80833333333334], [136.14999999999998, 35.59166666666667], [137.575, 34.733333333333334], [139.97500000000002, 38.06666666666666], [140.28333333333333, 39.58333333333333], [138.41666666666669, 37.225], [139.05, 38.025], [139.84166666666667, 38.9], [139.58333333333331, 35.24166666666667], [139.25833333333333, 36.80833333333334], [140.83333333333331, 38.16666666666667], [141.11666666666667, 39.58333333333333], [140.55, 36.516666666666666], [141.00833333333333, 43.04166666666667], [141.95833333333331, 45.09166666666667], [142.16666666666669, 46.55833333333334], [143.575, 42.68333333333334], [143.575, 43.91666666666667], [140.75, 40.68333333333334], [142.31666666666666, 47.58333333333333], [142.79166666666669, 44.80833333333334], [141.8, 44.25833333333333], [141.84166666666667, 43.05], [140.35833333333335, 42.625], [142.74166666666667, 43.79166666666667], [142.74166666666667, 42.83333333333333], [143.0, 46.75], [140.65833333333333, 41.525], [141.97500000000002, 45.925], [141.53333333333333, 43.875], [141.49166666666667, 41.075], [140.11666666666667, 40.425], [141.19166666666666, 42.21666666666667]]')
    for (var i = 0; i < lds.length; i++){
            var lon = lds[i][0]
            var lat = lds[i][1]
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lon,lat,0),
                point:{
                    color: Cesium.Color.RED,
                    pixelSize: 6
                }
            })
}
}

function checkLandmarks(){
    const lds = JSON.parse('[[-120.425, 39.358333333333334], [-120.425, 38.525], [-121.25833333333333, 39.58333333333333], [-120.425, 34.733333333333334], [-122.725, 39.58333333333333], [-122.19999999999999, 37.53333333333333], [-120.425, 36.3], [-121.68333333333334, 36.7], [-121.03333333333333, 35.56666666666666], [-120.425, 39.58333333333333], [-120.53333333333333, 43.75], [-120.425, 40.79166666666667], [-120.425, 47.58333333333333], [-121.35833333333333, 46.88333333333333], [-121.85833333333333, 44.46666666666667], [-121.25833333333333, 41.1], [-120.425, 42.2], [-121.36666666666667, 43.141666666666666], [-122.55833333333334, 41.21666666666667], [-121.925, 42.05], [-121.25833333333333, 47.58333333333333], [-121.26666666666667, 46.05], [-122.19999999999999, 43.24166666666667], [-120.425, 44.58333333333333], [-120.53333333333333, 42.91666666666667], [-114.425, 27.566666666666666], [-114.45, 31.308333333333334], [-114.425, 30.083333333333332], [-115.28333333333333, 31.116666666666667], [-114.425, 28.4], [-115.49166666666667, 29.741666666666667], [-114.55833333333334, 29.233333333333334], [-116.11666666666667, 30.575], [-114.73333333333333, 30.475], [-116.48333333333333, 31.516666666666666], [-113.58333333333334, 31.46666666666667], [-113.525, 29.15833333333333], [-113.56666666666666, 26.90833333333333], [-111.48333333333333, 24.425], [-112.23333333333333, 29.083333333333332], [-112.81666666666666, 30.25], [-110.38333333333333, 24.425], [-112.94166666666666, 28.258333333333333], [-112.73333333333333, 26.46666666666667], [-111.50833333333333, 28.34166666666667], [-109.44166666666666, 26.375], [-110.63333333333333, 27.6], [-112.05000000000001, 25.258333333333333], [-111.49166666666667, 26.35], [-112.31666666666666, 27.383333333333333], [-112.94166666666666, 31.083333333333336], [-110.93333333333334, 25.34166666666667], [-108.88333333333333, 25.541666666666664], [-112.69166666666666, 29.416666666666668], [-113.58333333333334, 27.741666666666667], [-84.43333333333334, 42.88333333333333], [-85.82499999999999, 40.425], [-86.42500000000001, 41.75833333333333], [-89.42500000000001, 41.61666666666667], [-88.4, 47.03333333333333], [-85.49166666666667, 44.75], [-84.64166666666667, 43.75], [-86.3, 46.11666666666667], [-85.74166666666667, 42.575], [-84.46666666666667, 46.13333333333333], [-85.475, 43.91666666666667], [-89.26666666666667, 46.63333333333333], [-89.30000000000001, 45.733333333333334], [-85.46666666666667, 46.41666666666667], [-88.09166666666667, 42.70833333333333], [-84.425, 47.58333333333333], [-88.43333333333334, 46.175], [-87.13333333333333, 46.275], [-84.65833333333333, 44.71666666666667], [-88.92500000000001, 42.24166666666667], [-78.425, 24.933333333333334], [-80.175, 26.15], [-78.425, 26.84166666666667], [-79.10833333333333, 25.4], [-80.39166666666667, 26.983333333333334], [-80.75833333333333, 24.95], [-82.55833333333334, 27.641666666666666], [-81.63333333333333, 24.6], [-79.25833333333333, 24.425], [-80.55, 27.833333333333336], [-82.06666666666666, 26.666666666666664], [-78.425, 25.766666666666666], [-82.19999999999999, 28.983333333333334], [-81.42500000000001, 30.041666666666664], [-81.225, 27.016666666666666], [-81.23333333333333, 29.125], [-81.38333333333333, 28.191666666666666], [-80.15833333333333, 25.316666666666666], [-79.25833333333333, 26.891666666666666], [-82.69999999999999, 29.816666666666666], [-82.06666666666666, 43.04166666666667], [-83.48333333333333, 43.825], [-79.11666666666667, 44.3], [-80.275, 44.80833333333334], [-81.50833333333333, 43.875], [-81.10833333333333, 44.766666666666666], [-82.275, 45.90833333333333], [-81.23333333333333, 42.925], [-82.9, 42.99166666666667], [-83.58333333333334, 44.65833333333333], [-80.39166666666667, 41.86666666666667], [-80.42500000000001, 43.55], [-78.425, 43.475], [-82.65, 43.825], [-80.90833333333333, 46.09166666666667], [-79.71666666666667, 46.58333333333333], [-78.425, 44.55], [-78.425, 42.641666666666666], [-79.725, 47.50833333333333], [-78.84166666666667, 46.08333333333333], [-76.30000000000001, 38.33333333333333], [-76.0, 37.358333333333334], [-75.07499999999999, 38.825], [-76.09166666666667, 36.525], [-76.65, 35.68333333333334], [-76.25, 39.16666666666667], [-76.86666666666667, 34.80833333333334], [-75.30833333333334, 37.99166666666667], [-74.42500000000001, 39.58333333333333], [-77.58333333333334, 39.58333333333333], [10.458333333333334, 34.08333333333333], [11.166666666666668, 33.516666666666666], [10.891666666666666, 34.91666666666667], [10.675, 36.108333333333334], [8.383333333333333, 33.63333333333333], [6.441666666666666, 35.325], [11.575, 33.05833333333334], [10.533333333333333, 36.94166666666666], [9.7, 37.108333333333334], [8.483333333333334, 35.46666666666667], [7.433333333333334, 46.00833333333333], [10.575, 46.44166666666666], [6.8, 44.733333333333334], [8.383333333333333, 46.6], [11.408333333333333, 47.03333333333333], [9.216666666666667, 46.71666666666667], [6.6, 45.58333333333333], [10.575, 47.275], [9.741666666666667, 47.375], [11.45, 46.2], [9.741666666666667, 46.275], [7.383333333333333, 44.233333333333334], [7.433333333333334, 45.175], [7.55, 46.84166666666667], [11.575, 47.58333333333333], [12.416666666666668, 32.86666666666667], [14.841666666666667, 32.425], [14.008333333333333, 32.74166666666667], [13.25, 32.858333333333334], [12.75, 37.81666666666666], [14.025, 37.125], [15.016666666666666, 37.45833333333333], [16.875, 39.06666666666666], [14.858333333333333, 36.625], [13.708333333333332, 37.95833333333333], [12.416666666666668, 46.95], [13.316666666666666, 47.2], [14.149999999999999, 47.45833333333333], [13.591666666666667, 46.6], [12.483333333333334, 47.58333333333333], [13.75, 42.2], [17.09166666666667, 44.233333333333334], [14.983333333333334, 47.40833333333333], [12.758333333333333, 46.36666666666667], [14.641666666666666, 44.9], [14.425, 46.625], [13.316666666666666, 47.58333333333333], [13.616666666666667, 43.03333333333333], [17.575, 40.49166666666667], [16.733333333333334, 43.4], [15.375, 44.1], [16.258333333333333, 44.325], [13.266666666666666, 45.53333333333333], [14.55, 40.675], [17.575, 43.4], [127.55833333333334, 39.58333333333333], [126.41666666666666, 37.04166666666667], [130.44166666666666, 32.975], [126.41666666666666, 35.83333333333333], [131.53333333333333, 33.675], [130.7, 33.80833333333334], [128.95833333333331, 35.266666666666666], [128.125, 38.75], [126.61666666666667, 34.94166666666666], [126.50833333333333, 33.65833333333333], [129.35833333333335, 36.1], [128.48333333333335, 36.18333333333334], [127.49166666666667, 34.891666666666666], [128.85833333333335, 37.891666666666666], [127.25, 36.6], [137.51666666666665, 36.641666666666666], [134.79166666666669, 34.38333333333333], [136.98333333333335, 34.875], [136.68333333333334, 36.50833333333333], [133.64999999999998, 34.30833333333334], [135.625, 34.75833333333333], [132.60000000000002, 33.983333333333334], [137.54166666666669, 35.80833333333334], [136.14999999999998, 35.59166666666667], [137.575, 34.733333333333334], [139.97500000000002, 38.06666666666666], [140.28333333333333, 39.58333333333333], [138.41666666666669, 37.225], [139.05, 38.025], [139.84166666666667, 38.9], [139.58333333333331, 35.24166666666667], [139.25833333333333, 36.80833333333334], [140.83333333333331, 38.16666666666667], [141.11666666666667, 39.58333333333333], [140.55, 36.516666666666666], [141.00833333333333, 43.04166666666667], [141.95833333333331, 45.09166666666667], [142.16666666666669, 46.55833333333334], [143.575, 42.68333333333334], [143.575, 43.91666666666667], [140.75, 40.68333333333334], [142.31666666666666, 47.58333333333333], [142.79166666666669, 44.80833333333334], [141.8, 44.25833333333333], [141.84166666666667, 43.05], [140.35833333333335, 42.625], [142.74166666666667, 43.79166666666667], [142.74166666666667, 42.83333333333333], [143.0, 46.75], [140.65833333333333, 41.525], [141.97500000000002, 45.925], [141.53333333333333, 43.875], [141.49166666666667, 41.075], [140.11666666666667, 40.425], [141.19166666666666, 42.21666666666667]]')
    var occluder = new Cesium.EllipsoidalOccluder(viewer.scene.globe.ellipsoid, viewer.camera.position)
    var dets = 0
    for (var i = 0; i < lds.length; i++){
        var lon = lds[i][0]
        var lat = lds[i][1]
        var pos = Cesium.Cartesian3.fromDegrees(lon, lat);     
        if(occluder.isPointVisible(pos)){
            var coords = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(viewer.scene, pos)
            if(coords){
                if(coords.x > 0 && coords.x < viewer.canvas.width){
                    if(coords.y > 0 && coords.y < viewer.canvas.height){
                        dets = dets + 1;
                        if(dets > 1){
                            return true
                        }
                    }
                } 
            }
            
        }
    }
    return false
}
function sequence(){
    if(vals.length==0){
        viewer.resolutionScale = 1.0;
        return;
    }     
    var val = vals.shift();
    XElement.value = val[0]
    YElement.value = val[1]
    ZElement.value = val[2]
    DxElement.value = val[3]
    DyElement.value = val[4]
    DzElement.value = val[5]
    UxElement.value = val[6]
    UyElement.value = val[7]
    UzElement.value = val[8]
    RxElement.value = val[9]
    RyElement.value = val[10]
    RzElement.value = val[11]
    moveCamera();
    viewer.resolutionScale = targetResolutionScale;
    viewer.render()
    fn = getSatPose()
    setTimeout(function(){  
        captureScreenshot(fn);
    }, waittime_ss)
    setTimeout(function(){
        sequence();
    }, waittime_ss)
}
sequenceElement = document.getElementById("sequence")
sequenceElement.addEventListener("click", function() {
    genViews()
    hprsequence()
});

function hprsequence(){
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
    moveCameraHPR();
    viewer.resolutionScale = targetResolutionScale;
    viewer.render()
    fn = getSatPose()
    setTimeout(function(){  
        captureScreenshot(fn);  
    }, waittime_ss)
    setTimeout(function(){
        hprsequence();
    }, waittime_ss)    
}

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
    moveCameraHPR();
}

function orbitSequence(){
    vals = JSON.parse(orbitElement.value)
}
const orb_button = document.getElementById("orbit")
orb_button.addEventListener("click", function() {
    orbitSequence()
    sequence()
});
const orb_view_button = document.getElementById("orb_view")
orb_view_button.addEventListener("click", function(){
    orbitSequence()
    viewSequence()
})