/* 
 * Random password generator (JavaScript)
 * 
 * Copyright (c) 2022 Project Nayuki
 * All rights reserved. Contact Nayuki for licensing.
 * https://www.nayuki.io/page/random-password-generator-javascript
 * 
 * Modified by Jay @ Designly 03/2022
 * Converted to class
 * https://designly.biz
 * https://github.com/designly1
 * 
 */

var PassGen = class PassGen {
    constructor(config) {
        // Available character sets
        const characterSets = {
            "numbers": "0123456789",
            "lowercase": "abcdefghijklmnopqrstuvwxyz",
            "uppercase": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "symbols": "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
            "space": " "
        };

        // Default configuration
        const defaultConfig = {
            "charSets": ["numbers", "lowercase", "uppercase", "symbols"],
            "length": 10,
            "lengthMethod": "length",
            "entropy": 128,
            "errorCallback": null,
            "outputCallback": null,
            "copyPasswordCallback": null,
            "debugConsole": false
        };

        this.currentPassword = "";
        this.stats = "";
        this.cryptoObject = null;
        this.config = {};

        // Merge user config with default config
        Object.assign(this.config, defaultConfig, config);


        // Initialize character set
        this.charSet = "";
        var that = this;
        this.config.charSets.forEach(function (set) {
            that.charSet += characterSets[set];
        });

        this.initCrypto();
    }

    error(message) {
        // Console debug
        if (this.config.debugConsole) {
            console.log("ERROR: " + message);
        }

        if (typeof this.config.errorCallback == 'function') {
            this.config.errorCallback(message);
        } else {
            alert(message);
        }
    }

    outputPassword() {
        // Console debug
        if (this.config.debugConsole) {
            console.log("Generated password: " + this.currentPassword);
            console.log("Statistics: " + this.stats);
        }

        if (typeof this.config.outputCallback == 'function') {
            this.config.outputCallback(this.currentPassword, this.stats);
        } else {
            alert(this.currentPassword);
        }
    }

    initCrypto() {
        if ("crypto" in window) this.cryptoObject = crypto;
        else {
            if (!("msCrypto" in window)) return;
            this.cryptoObject = msCrypto;
        }
        if ("getRandomValues" in this.cryptoObject && "Uint32Array" in window && "function" != typeof Uint32Array) {
            this.cryptoObject = null;
        }
    }

    getPasswordCharacterSet() {
        // Concatenate characters from every checked entry
        var rawCharset = this.charSet;

        rawCharset = rawCharset.replace(/ /g, "\u00A0"); // Replace space with non-breaking space

        // Parse UTF-16, remove duplicates, convert to array of strings
        var charset = [];
        for (var i = 0; i < rawCharset.length; i++) {
            var c = rawCharset.charCodeAt(i);
            if (c < 0xD800 || c >= 0xE000) { // Regular UTF-16 character
                var s = rawCharset.charAt(i);
                if (charset.indexOf(s) == -1)
                    charset.push(s);
                continue;
            }
            if (0xD800 <= c && c < 0xDC00 && i + 1 < rawCharset.length) { // High surrogate
                var d = rawCharset.charCodeAt(i + 1);
                if (0xDC00 <= d && d < 0xE000) { // Low surrogate
                    var s = rawCharset.substring(i, i + 2);
                    i++;
                    if (charset.indexOf(s) == -1)
                        charset.push(s);
                    continue;
                }
            }
            throw new RangeError("Invalid UTF-16");
        }
        return charset;
    }

    generate() {
        // Get and check character set
        var charset = this.getPasswordCharacterSet();
        if (charset.length == 0) {
            this.error("Error: Character set is empty");
            return;
        } else if (this.config.lengthMethod == "entropy" && charset.length == 1) {
            this.error("Error: Need at least 2 distinct characters in set");
            return;
        }

        // Calculate desired length
        var length;
        if (this.config.lengthMethod == "length")
            length = parseInt(this.config.length);
        else if (this.config.lengthMethod == "entropy")
            length = Math.ceil(parseFloat(this.config.entropy) * Math.log(2) / Math.log(charset.length));
        else
            throw new Error("Assertion error");

        // Check length
        if (length < 0) {
            this.error("Negative password length");
            return;
        } else if (length > 10000) {
            this.error("Password length too large");
            return;
        }

        // Generate password
        this.currentPassword = this.generatePassword(charset, length);

        // Calculate and format entropy
        var entropy = Math.log(charset.length) * length / Math.log(2);
        var entropystr;
        if (entropy < 70)
            entropystr = entropy.toFixed(2);
        else if (entropy < 200)
            entropystr = entropy.toFixed(1);
        else
            entropystr = entropy.toFixed(0);

        // Set output statistics
        this.stats = "Length = " + length + " chars, \u00A0\u00A0Charset size = " +
            charset.length + " symbols, \u00A0\u00A0Entropy = " + entropystr + " bits";

        // Output password
        this.outputPassword();
        return;
    }

    generatePassword(charset, len) {
        var result = "";
        for (var i = 0; i < len; i++)
            result += charset[this.randomInt(charset.length)];
        return result;
    }


    // Returns a random integer in the range [0, n) using a variety of methods.
    randomInt(n) {
        var x = this.randomIntMathRandom(n);
        x = (x + this.randomIntBrowserCrypto(n)) % n;
        return x;
    }


    // Not secure or high quality, but always available.
    randomIntMathRandom(n) {
        var x = Math.floor(Math.random() * n);
        if (x < 0 || x >= n)
            throw new Error("Arithmetic exception");
        return x;
    }


    // Uses a secure, unpredictable random number generator if available; otherwise returns 0.
    randomIntBrowserCrypto(n) {
        if (this.cryptoObject === null)
            return 0;
        // Generate an unbiased sample
        var x = new Uint32Array(1);
        do this.cryptoObject.getRandomValues(x);
        while (x[0] - x[0] % n > 4294967296 - n);
        return x[0] % n;
    }

    // Copies password to clipboard
    copy() {
        if ("clipboard" in navigator)
            navigator.clipboard.writeText(this.currentPassword);
        else {
            var container = document.querySelector("article");
            var textarea = document.createElement("textarea");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            container.insertBefore(textarea, container.firstChild);
            textarea.value = this.currentPassword;
            textarea.focus();
            textarea.select();
            document.execCommand("copy");
            container.removeChild(textarea);
        }

        // Copy password callback (e.g. to notify password has been copied)
        if (typeof this.copyPasswordCallback == 'function') {
            this.copyPasswordCallback(this);
        }
    }
}