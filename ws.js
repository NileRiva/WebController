const servos = ["s1slider","s2slider","s3slider","s4slider","s5slider","s6slider"];
const servoangles = ["s1angle","s2angle","s3angle","s4angle","s5angle","s6angle"];
let slider = new Array();
let output = new Array();
distance = document.getElementById("distance");
battery = document.getElementById("battery");
voltage = document.getElementById("voltage");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  


// var ws = new WebSocket("ws://192.168.1.1:8000/gobot")
// var ws = new WebSocket("ws://192.168.137.130:8000/gobot")
var ws = new WebSocket("ws://192.168.137.122:8000/gobot")

setInterval(async function () {
    // ws.send("FF310000FF"); 
    // await sleep(10);
    ws.send("FF130500FF");
    await sleep(10);
    ws.send("FF319900FF");
    await sleep(10);
}, 1000);

ws.onmessage = async event => {
    let data = await event.data.text();
    console.log(data.charCodeAt(0));
    console.log(data.charCodeAt(1));
    console.log(data.charCodeAt(2));
    console.log(data.charCodeAt(3));
    console.log(data.charCodeAt(4));
    console.log(data.charCodeAt(5));
        if(data.charCodeAt(2)==1)
        {battery.innerHTML=data.charCodeAt(3);}
        else if(data.charCodeAt(2)==2)
        { if (data.charCodeAt(3)<=255)
                {distance.innerHTML=data.charCodeAt(3);}
            else
                {distance.innerHTML="Out of Range";}
            }
        else if(data.charCodeAt(2)==99)
        { voltage.innerHTML = (data.charCodeAt(3) * 256 + data.charCodeAt(4));}
        

  }



function servoinstruction(servonum,angle){
    return "FF"+"01"+servonum.toString(16).padStart(2, '0').toUpperCase()+angle.toString(16).padStart(2, '0').toUpperCase()+"FF";
}

function sliderupper(i){
    slider[i] = document.getElementById(servos[i]);
    output[i] = document.getElementById(servoangles[i]);
    slider[i].value = +slider[i].value + +slider[i].step;
    output[i].innerHTML = slider[i].value;
    let angle=parseInt(slider[i].value);//Had to convert to string
    console.log(servoinstruction(i+3,angle));
    ws.send(String(servoinstruction(i+3,angle)));

}

function sliderdowner(i){
    slider[i] = document.getElementById(servos[i]);
    output[i] = document.getElementById(servoangles[i]);
    slider[i].value = +slider[i].value - +slider[i].step;
    output[i].innerHTML = slider[i].value;
    let angle=parseInt(slider[i].value);//Had to convert to string
    console.log(servoinstruction(i+3,angle));
    ws.send(String(servoinstruction(i+3,angle)));
}

for(let i=0; i<servos.length;i++)
{
    slider[i] = document.getElementById(servos[i]);
    output[i] = document.getElementById(servoangles[i]);
    output[i].innerHTML = slider[i].value;

    slider[i].oninput = function() {
    output[i].innerHTML = this.value;
    let angle=parseInt(this.value);//Had to convert to string
    //console.log(servoinstruction(i+3,angle));
    ws.send(String(servoinstruction(i+3,angle)));
    }
}

var sendCommand = 1;
            
            //Key Pressed
            document.addEventListener("keydown", function (evt) {
                if (evt.keyCode == "38" && sendCommand) {   // up arrow
                    ws.send("FF000100FF"); 
                    sendCommand = 0;
                }
                else if (evt.keyCode == "40" && sendCommand) {  // down arrow
                    ws.send("FF000200FF"); 
                    sendCommand = 0;
                }
                else if (evt.keyCode == "37" && sendCommand) {  // left arrow
                    ws.send("FF000300FF"); 
                    sendCommand = 0;
                }
                else if (evt.keyCode == "39" && sendCommand) {  // right arrow
                    ws.send("FF000400FF");
                    sendCommand = 0;
                }
                else if (evt.keyCode == "13" && sendCommand) {  // Enter
                    ws.send("FF130000FF");
                    sendCommand = 0;
                }
                else if (evt.keyCode == "38" && evt.keyCode == "37" && sendCommand) {  // Forward Left right arrow
                    ws.send("FF000500FF");
                    sendCommand = 0;
                }
                else if (evt.keyCode == "38" && evt.keyCode == "39" && sendCommand) {  // Forward right arrow
                    ws.send("FF000700FF");
                    sendCommand = 0;
                }
                else if (evt.keyCode == "40" && evt.keyCode == "37" && sendCommand) {  // Backward Left arrow
                    ws.send("FF000600FF");
                    sendCommand = 0;
                }
                else if (evt.keyCode == "40" && evt.keyCode == "39" && sendCommand) {  // Backward right arrow
                    ws.send("FF000800FF");
                    sendCommand = 0;
                }
            });
            
            //Key Released
            document.addEventListener("keyup", function (evt) {
                if(evt.keyCode == "37" || evt.keyCode == "38" || evt.keyCode == "39" || evt.keyCode == "40") {//STOP
                    ws.send("FF000000FF");
                    sendCommand = 1;
                }
            });

              //Key Pressed for Sliders
              document.addEventListener("keydown", function (evt) {
                if (evt.keyCode == "81") {   // Q increases Servo 1
                   sliderupper(0);
                }
                else if (evt.keyCode == "65") {  // A decreases Servo 1
                    sliderdowner(0);
                }
                else if (evt.keyCode == "87") {  // W increases Servo 2
                    sliderupper(1);
                }
                else if (evt.keyCode == "83") {  // S increases Servo 2
                    sliderdowner(1);
                }
                else if (evt.keyCode == "69") {  // E increases Servo 3
                    sliderupper(2);
                }
                else if (evt.keyCode == "68") {  // D decreases Servo 3
                    sliderdowner(2);
                }
                else if (evt.keyCode == "82") {  // R increases Servo 4
                    sliderupper(3);
                }
                else if (evt.keyCode == "70") {  // F decreases Servo 4
                    sliderdowner(3);
                }
                else if (evt.keyCode == "84") {  // T increases Servo 5
                    sliderupper(4);
                }
                else if (evt.keyCode == "71") {  // G decreases Servo 5
                    sliderdowner(4);
                }
                else if (evt.keyCode == "89") {  // Y increases Servo 6
                    sliderupper(5);
                }
                else if (evt.keyCode == "72") {  // H decreases Servo 6
                    sliderdowner(5);
                }
            });
    
            google.maps.event.addDomListener(window, 'load', init);
        
            function init() {
                // Basic options for a simple Google Map
                // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
                var mapOptions = {
                    // How zoomed in you want the map to start at (always required)
                    zoom: 6,

                    // The latitude and longitude to center the map (always required)
                    center: new google.maps.LatLng(56.713,21.1644),
                    styles: [{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#c5e3bf"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#4c6455"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#e9e9e9"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"invert_lightness":true},{"lightness":"-100"}]}]
                };

                // Get the HTML DOM element that will contain your map 
                // We are using a div with id="map" seen below in the <body>
                var mapElement = document.getElementById('map');

                // Create the Google Map using our element and options defined above
                var map = new google.maps.Map(mapElement, mapOptions);

            }