/**CONSTANTS */
const TL_TOGGLE_INTERVAL= 1000* 10;
var log=  require("noogger");
/*
var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1:27017/smart-traffic',{ server: { reconnectTries: Number.MAX_VALUE, poolSize: 1000 } });
*/
var faye= require('faye');
var connector = new faye.Client('http://localhost:8008/faye');




// Running the connector
var http = require('http');
faye = require('faye');

var PORT=  8008;
var server = http.createServer(),
bayeux = new faye.NodeAdapter({mount: '/'});

bayeux.on('subscribe', function(clientId, channel) { 
  // log.notice(clientId+" subscribed on channel "+channel); 
});
bayeux.on('unsubscribe', function(clientId, channel) { 
  // log.warning(clientId+" unsubscribed on channel "+channel); 
});
bayeux.on('publish', function(clientId, channel,data) { 
  // log.debug(clientId+" publish on channel "+channel); 
});
bayeux.attach(server);
server.listen(PORT);
log.info("Connector running on Port "+PORT);


    /*
    Command syntax:
      "F1#R" -> Traffic light 1 set to Red
      "F1#O" -> Traffic light 1 set to Orange
      "F1#G" -> Traffic light 1 set to Grean

    A state variable can is an array of commands for each traffic light 
    eg: ["F1#R","F3#R","F2#G","F4#G"]

*/

var toggle= true;
var currentState= [];
function startTrafficLights() {
  
  setInterval(() => {

    currentState.forEach((state, idx) => {
      if(state.includes('G') )
      currentState[idx]=state.replace('G','O');
    });
    connector.publish('/TL_TOGGLE',currentState);
    setTimeout(() => {
      if(toggle)
        connector.publish('/TL_TOGGLE',["F1#R","F3#R","F2#G","F4#G"]);
      else
        connector.publish('/TL_TOGGLE',["F1#G","F3#G","F2#R","F4#R"]);

        toggle=!toggle;

    }, 2000);

  }, TL_TOGGLE_INTERVAL);
}

startTrafficLights();

connector.subscribe('/TL_TOGGLE', function (state) {
    currentState=state;
    log.warning(state.join(':'));
    port.write(state.join(':'), function(err) {
        if (err) {
          return log.error('command:'+cmd+' Error on write: ', err.message);
        }
      });
});

const SERIAL_PORT= "COM3";
// const SERIAL_PORT= "/dev/ttyACM0";

var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
var port = new SerialPort(SERIAL_PORT, function(err){
        if(err) console.log("error:", err.message);
        else console.log("Open successful!");
});

const parser = port.pipe( new Readline({ delimiter: '\r\n' }));


parser.on('data',  function (raw) {
    // log.debug('data received: '+raw);
});
