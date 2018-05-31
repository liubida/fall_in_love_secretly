'use strict';

var Lover = function(jsonStr) {
    if (jsonStr) {
        var obj = JSON.parse(jsonStr);
        this.name = obj.name;
        this.birthday = obj.birthday;
    } else {
        this.name = "";
        this.birthday = "";
    }
};

Lover.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }, 
    value: function() {
        return this.name + '_' + this.birthday;
    }
};

var LoverContract = function() {
    //LocalContractStorage.defineProperty(this, "commision");
    LocalContractStorage.defineMapProperty(this, "pool", { 
        parse: function(jsonText) {
            return new Lover(jsonText);
        },
        stringify: function(obj) {
            return obj.toString();
        }
    });
};

LoverContract.prototype = {

    init: function() {
        this.adminAddress = "";
        this.commisionAddress = "";
    },

	_check_name: function(name) {
		if (!name) {
			return false;
        }
		return true;
	},

	_check_birthday: function(birthday) {
		if (!birthday) {
			return false;
        }
        var regex = /\d{4}\.\d{2}\.\d{2}/g 
        if (!regex.test(birthday)) {
            return false;
        }
		return true;
    },

    ask: function(a_name, a_birthday, b_name, b_birthday) {
        var from = Blockchain.transaction.from;
        var value = Blockchain.transaction.value;

		a_name = a_name.trim()
		a_birthday = a_birthday.trim()
		b_name = b_name.trim()
		b_birthday = b_birthday.trim()

		if (!this._check_name(a_name) || !this._check_name(b_name) || 
            !this._check_birthday(a_birthday) || !this._check_birthday(b_birthday)) {
            throw new Error('params is invalid');
            return
        }

        var alover = new Lover();
        alover.name = a_name
        alover.birthday = a_birthday

        var blover = new Lover();
        blover.name = b_name
        blover.birthday = b_birthday

        var msg = 'saved!';
        var l = this.pool.get(alover.value());
        if (l) {
            msg = 'already saved';
            return msg;
        }

        this.pool.put(alover.value(), blover);

        var l = this.pool.get(blover.value());
        if (!l) {
            return msg;
        }
        msg += l;
        if (l.name == alover.name && l.birthday == alover.birthday) {
            msg = 'bingo!';
        }

        return msg;
    },

};

module.exports = LoverContract;

