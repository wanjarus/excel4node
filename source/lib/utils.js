let _bitXOR = (a, b) => {
    let maxLength = a.length > b.length ? a.length : b.length;

    let padString = '';
    for (let i = 0; i < maxLength; i++) {
        padString += '0';
    }

    a = String(padString + a).substr(-maxLength);
    b = String(padString + b).substr(-maxLength);

    let response = '';
    for(let i = 0; i < a.length; i++) {
        response += a[i] === b[i] ? 0 : 1;
    }
    return response;
};

let generateRId = () => {
    let text = 'R';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let _rotateBinary = (bin) => {
    return bin.substr(1, bin.length - 1) + bin.substr(0, 1);
};

let _getHashForChar = (char, hash) => {    
    hash = hash ? hash : '0000';
    let charCode = char.charCodeAt(0);
    let hashBin = parseInt(hash, 16).toString(2);
    let charBin = parseInt(charCode, 10).toString(2);
    hashBin = String('000000000000000' + hashBin).substr(-15);
    charBin = String('000000000000000' + charBin).substr(-15);
    let nextHash = _bitXOR(hashBin, charBin);
    nextHash = _rotateBinary(nextHash);
    nextHash = parseInt(nextHash, 2).toString(16);

    return nextHash;
};

//  http://www.openoffice.org/sc/excelfileformat.pdf section 4.18.4
let getHashOfPassword = (str) => {
    let curHash = '0000';
    for (let i = str.length - 1; i >= 0; i--) {
        curHash = _getHashForChar(str[i], curHash);
    }
    let curHashBin = parseInt(curHash, 16).toString(2);
    let charCountBin = parseInt(str.length, 10).toString(2);
    let saltBin = parseInt('CE4B', 16).toString(2);

    let firstXOR = _bitXOR(curHashBin, charCountBin);
    let finalHashBin = _bitXOR(firstXOR, saltBin);
    let finalHash = String('0000' + parseInt(finalHashBin, 2).toString(16).toUpperCase()).slice(-4);

    return finalHash;
};

/**
 * Translates a column number into the Alpha equivalent used by Excel
 * @function getExcelAlpha
 * @param {Number} colNum Column number that is to be transalated
 * @param {Boolean} capitalize States whether return string should be capital, defaults to true
 * @returns {String} The Excel alpha representation of the column number
 * @example
 * // returns B
 * getExcelAlpha(2);
 */
let getExcelAlpha = (colNum, capitalize) => {
    capitalize = capitalize ? capitalize : true;
    var remaining = colNum;
    var aCharCode = capitalize ? 65 : 97;
    var columnName = '';
    while (remaining > 0) {
        var mod = (remaining - 1) % 26;
        columnName = String.fromCharCode(aCharCode + mod) + columnName;
        remaining = (remaining - 1 - mod) / 26;
    } 
    return columnName;
};

/**
 * Translates a Excel cell represenation into row and column numerical equivalents 
 * @function getExcelRowCol
 * @param {String} str Excel cell representation
 * @returns {Object} Object keyed with row and col
 * @example
 * // returns {row: 2, col: 3}
 * getExcelRowCol('C2')
 */
let getExcelRowCol = (str) => {
    var numeric = str.split(/\D/).filter(function (el) {
        return el !== '';
    })[0];
    var alpha = str.split(/\d/).filter(function (el) {
        return el !== '';
    })[0];
    var row = parseInt(numeric, 10);
    var col = alpha.toUpperCase().split('').reduce(function (a, b, index, arr) {
        return a + (b.charCodeAt(0) - 64) * Math.pow(26, arr.length - index - 1);
    }, 0);
    return { row: row, col: col };
};

/**
 * Translates a date into Excel timestamp
 * @function getExcelTS
 * @param {Date} date Date to translate
 * @returns {Number} Excel timestamp
 * @example
 * // returns 29810.958333333332
 * getExcelTS(new Date('08/13/1981'));
 */
let getExcelTS = (date) => {
    var epoch = new Date(1899, 11, 31);
    var dt = date.setDate(date.getDate() + 1);
    var ts = (dt-epoch) / (1000 * 60 * 60 * 24);
    return ts;
};
/*
 * Helper Functions
 */

module.exports = {
    generateRId: generateRId,
    getHashOfPassword: getHashOfPassword,
    getExcelAlpha: getExcelAlpha,
    getExcelRowCol: getExcelRowCol,
    getExcelTS: getExcelTS
};