/**
 * Created by Mattias on 2016-05-01.
 */


var mailer = require('nodemailer');
var User = require('../models/User');
var Exam = require('../models/Exam');

var transporter = mailer.createTransport("SMTP", {
    pool: true,
    host : "smtp-mail.outlook.com",
    secureConnection : false,
    port : 587,
    auth : {
        user : 'newtonexam@outlook.com',
        pass : 'N3wt0n#x4m'
    }
});

module.exports.sendMail = function(recipients, callback) {
    var mailOptions = {
        from : '"Newton Testsystem" <newtonexam@hotmail.com>',
        to : '',
        subject : 'Du har ett test att skriva',
        html : '<h1>Du har ett test att skriva</h1> ' +
        'Var vänlig och logga in på <a href="http://localhost:3000">testportalen</a>' +
        ' för att se vilka test som finns tillgängliga för dig.'
    }

    var recMail = [];
    var recArray = [].concat(recipients.rec);
    recArray.forEach(function (rec) {
        User.getUser(rec, function (err, user) {
            recMail.push(user.email);
            if (recMail.length === recArray.length) {
                mailOptions.to = recMail;
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        callback({
                            success: false,
                            error: err
                        });
                    } else {
                        callback({success: true});
                    }
                });
            }
        });
    });
};

module.exports.sendPassword = function(recipient, callback) {
  User.getUserByLogin(recipient, function(err, user) {
      if (err) {
          console.log(err);
          callback({success: false, error: err})
      } else {
          var mailOptions = {
              from: '"Newton Testsystem" <newtonexam@hotmail.com>',
              to: user.email,
              subject: 'Ditt lösenord',
              html: '<h1>Här kommer ditt lösenord</h1> ' +
              'Någon har försökt att logga in på ditt konto 3 gånger utan att ha angivit rätt lösenord.' +
              '<p>Ditt användar-id är ' + user.id + '<br />' +
              'och ditt lösenord är: ' + user.password + '</p>' +
              '<p>Med vänlig hälsning<br />' +
              'Newton Yrkeshögskola'
          };
          transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                  console.log(err);
                  callback({
                      success: false,
                      error: err
                  });
              } else {
                  callback({success: true});
              }
          })
      }
  });
};

module.exports.sendCorrected = function(exam) {
  User.getUser(exam.student, function(err, student) {
      if(err){}
      else {
          var mailOptions = {
              from: '"Newton Testsystem" <newtonexam@hotmail.com>',
              to: student.email,
              subject: 'Du har ett rättat prov',
              html: '<h1>Ett prov har blivit rättat</h1> ' +
              'Ett prov som du har skrivit har blivit rättat.' +
              '<p>Logga in på med ditt konto för att se resultatet</p>' +
              '<p>Med vänlig hälsning<br />' +
              'Newton Yrkeshögskola'
          };
          transporter.sendMail(mailOptions, function(err, info) {
              if(err) {console.log(err);}
              else {console.log('Mail skickat');}
          });
      }
  });
};
