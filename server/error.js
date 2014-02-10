'use strict';
//================================================================================
// Module
//================================================================================
module.exports = function(err, req, res, next) {
    console.log('--global error:', err, err.stack);
    var errorResponse = {
        error: err
    };
    res.send(errorResponse);
};