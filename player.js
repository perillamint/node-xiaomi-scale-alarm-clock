'use strict';

const _ = require('lodash');
const execFile = require('child_process').execFile;

class Player extends Object {
    constructor(player, playeropts, file) {
        super();
        this._player = player;
        this._playeropts = playeropts;
        this._file = file;
        this._playerProcess = null;
    }

    play() {
        var self = this;
        let playeropts = _.concat(this._playeropts, this._file);

        this._playerProcess =  execFile(this._player, playeropts);

        this._playerProcess.on('exit', () => {
            self._playerProcess = null;
        });
    }

    stop() {
        if(null !== this._playerProcess) {
            this._playerProcess.kill('SIGTERM');
        }

        this._playerProcess = null;
    }
}

module.exports = Player;
