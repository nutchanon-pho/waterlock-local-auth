'use strict';

// var jade = require('jade');
var ejs = require('ejs');
var path = require('path');

/**
 * Returns the email jade template as html
 * @param  {Token} token
 * @return {String} html
 */
exports.getHtmlEmail = function(token, toEmail, callback){
  var config = require('./waterlock-local-auth').config;
  var authConfig = require('./waterlock-local-auth').authConfig;
  if(typeof config === 'undefined'){
    throw new Error('No config file defined, try running [waterlock install config]');
  }

  var resetUrl;
  if (config.pluralizeEndpoints) {
    resetUrl = config.baseUrl + '/auths/reset?token='+token.token;
  }else {
    resetUrl = config.baseUrl + '/auth/reset?token='+token.token;
  }


  var viewVars = authConfig.passwordReset.template.vars;
  viewVars.url = resetUrl;
  viewVars.email = toEmail;

  var templatePath = path.normalize(__dirname+'/../../../'+authConfig.passwordReset.template.file);
  ejs.renderFile(templatePath, viewVars, function(err, str){
    if(err){
      throw new Error(err);
    } else {
      return callback(str);
    }
  });
};

/**
 * Callback for mailing operation
 * @param  {Object} error
 * @param  {Object} response
 */
exports.mailCallback = function(error, info){
   if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
};
