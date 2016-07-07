'use strict';

const MiScale = require('node-xiaomi-scale');
const Player = require('./player.js');

const config = require('./config.json');

var miScale = new MiScale(config.miscale.addr);
var player = new Player(config.player.bin,
                        config.player.opts,
                        config.player.file);


function playAlarm() {
    miScale.on('data', (value) => {
        if(value.isStabilized && !value.loadRemoved) {
            player.stop();
            miScale.stopScanning();
            console.log("Have a nice day!");
            process.exit(0);
        }
    });

    player.play();
    console.log("Wake up!");
}

function checkCurrentTime() {
    let cur = new Date();

    let hh = cur.getHours();
    let mm = cur.getMinutes();
    let ss = cur.getSeconds();

    let now = [hh, mm, ss];
    let alarm = config.alarm.split(':');

    for(let i = 0; i < alarm.length; i++) {
        alarm[i] = parseInt(alarm[i]);
    }

    if(now[0] === alarm[0] &&
       now[1] === alarm[1]) {
        if(undefined === alarm[2] || now[2] === alarm[2]) {
            playAlarm();
        }
    }
}

miScale.startScanning();
console.log("Alarm scheduled at " + config.alarm);
setInterval(checkCurrentTime, 1000);
