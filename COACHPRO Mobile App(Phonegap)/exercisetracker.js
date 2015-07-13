$(document).ready(function(){
  setTimeout(hideSplash, 4000);
});

function hideSplash() {
  $.mobile.changePage("#loginPage", "fade");
}





function auth()
{

  var uName = $("#username").val();
  var pass = $("#password").val();

$.ajax({
    type: "POST",
    url: "http://coachpro.azurewebsites.net/api/compareLogin",
    data: { loginPlayerName: uName, loginPlayerPassword: pass }
  }).done(function( msg ) {
      console.log( "Received server response: " + msg.status );

      if(msg.status == "success"){
              $.mobile.changePage("#startTracking");

      }

      else if (msg.status == "noUser"){
                 $("#messageLogin").html("User not Found. Please Sign Up!"); 
              }
          else{
                 $("#messageLogin").html("Wrong Password. Try Again!"); 
          }

          
      

    

    }).fail(function(msg){
      console.log("Ajax fail: " + JSON.stringify(msg));
    });

}

function gps_distance(lat1, lon1, lat2, lon2)
{
  // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d;
}


var gps_Data = [];
var geolocationInt;


 function updateGeolocation() {
        if ( geolocationInt != undefined ) {
            navigator.geolocation.clearWatch(geolocationInt);
        }
        
            geolocationInt = navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, {enableHighAccuracy:true});
      }
    


    

    function geolocationSuccess(position) {
      var t_hours = $('#t-hr').text();
      var t_minutes = $('#t-min').text();
      var t_seconds = $('#t-sec').text();



      
                        var lat =  position.coords.latitude; 
                        var lon =  position.coords.longitude;
                        var speedGeo = position.coords.speed; 
                        var timestamp = new Date(position.timestamp);

gps_Data.push(position);
 total_distance = 0;

  for(i = 0; i < gps_Data.length; i++){
      
      if(i == (gps_Data.length - 1)){
          break;
      }
      
      total_distance += gps_distance(gps_Data[i].coords.latitude, gps_Data[i].coords.longitude, gps_Data[i+1].coords.latitude, gps_Data[i+1].coords.longitude);
  }
  
  var kmToMeters = total_distance*1000;
  var totDist = kmToMeters/10;
var metersDistance = totDist.toFixed(1);
 var uName = $("#username").val();

  
    $.ajax({
    type: "POST",
    url: "http://coachpro.azurewebsites.net/api/saveData",
    data: { userAjax:uName, date:timestamp, latv:lat, lonv:lon, distance:metersDistance, hoursVal:t_hours, minutesVal:t_minutes, secondsVal:t_seconds, acc:speedGeo}
  }).done(function( msg ) {


        setTimeout(function() {
        if (postingOn == true) {
          postData();
          startClock();
        }
        else{
          stopPostingData();
        }
      }, 4000);

    }).fail(function(msg){
      alert("Ajax fail: " + JSON.stringify(msg));
      postingOn = false;
       alert("fail send")


    });
}




    function geolocationError(error) {
        alert('code: '    + error.code   );
    } 

    
   
    function stopUpdateGeolocation() {
        navigator.geolocation.clearWatch(geolocationInt);
        geolocationInt = undefined;
       
    }








function postData() {
  postingOn=true;
  updateGeolocation();
  startClock();
}



function stopPostingData() {
  postingOn=false;
  stopUpdateGeolocation();
  stopClock();
  
}





var clicked = false;
var sec = 0;
var min = 0;
var hur = 0;


function startClock() {
  if (clicked === false) {
    clock = setInterval("stopWatch()", 1000);
    clicked = true;
  }
  else if (clicked === true) {
  }
}
function stopWatch() {
  sec++;
  document.getElementById("t-sec").innerHTML = sec;
    if(sec>59){
        min++;
        document.getElementById("t-min").innerHTML = min +":";
        sec = 0;
    }
    else if(min>59){
        hur++;
        document.getElementById("t-hr").innerHTML = hur +":";
        min = 0;
    }
}

function stopClock() {
  window.clearInterval(clock);
  sec = 0;
  document.getElementById("t-min").innerHTML=0 +":";
    document.getElementById("t-sec").innerHTML=0;
  clicked = false;
}










