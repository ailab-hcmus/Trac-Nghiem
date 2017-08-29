import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';

import {ProfileSchema} from '/imports/api/Accounts';

Accounts.onCreateUser(function (option, user) {
    let profile = ProfileSchema.clean(option.profile);
    ProfileSchema.validate(profile);

    user.profile = profile;
    return user;
});

Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: true
});

Accounts.emailTemplates.siteName = "Team Building";
Accounts.emailTemplates.from = "Team Building <onlinetutoring.demo@gmail.com>";

Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "[Team Building] Verify Your Email Address";
};

Accounts.emailTemplates.verifyEmail.text = function (user, url) {
    let emailAddress = user.emails[0].address,
        urlWithoutHash = url.replace('#/', ''),
        supportEmail = "onlinetutoring.demo@gmail.com",
        emailBody = "To verify your email address (" + emailAddress +") visit the following link:\n\n" +
            urlWithoutHash + "\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: " +
            supportEmail +".";

    return emailBody;
};

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    let emailAddress = user.emails[0].address,
        urlWithoutHash = url.replace('#/', ''),
        supportEmail = "onlinetutoring.demo@gmail.com",
        emailBody = "Hello, \n To reset your password, visit the following link:\n\n" +
            urlWithoutHash + "\n\n Thanks."

    return emailBody;
};