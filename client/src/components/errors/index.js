const defs = require("../../defaults");

let displayError = (obj, e) => {
    obj.setState({
        error: e,
    });
}

let errorCheck = function (obj) {
    return function(res) {
        if (res.ok) {
            return res.json();
        }
        displayError(obj, defs.DEFAULT_ERROR_S);
    }
}

module.exports = {displayError, errorCheck};