'use strict';
//================================================================================
// Module
//================================================================================
module.exports = function(err, req, res, next) {
    console.log('--global error:', err);
    var errorResponse = {
        error: err
    };
    res.send(errorResponse);
};