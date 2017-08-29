import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

import {AccountSchema} from '/imports/api/Accounts';

Meteor.methods({
    "Account.insert": function (accountInfo) {
        check(accountInfo, Object);

        let password;
        if(!!accountInfo.password)
            password = accountInfo.password;

        let email;
        if(!!accountInfo.email)
            email = accountInfo.email;

        let insertDoc = AccountSchema.clean(accountInfo);
        AccountSchema.validate(insertDoc);

        insertDoc.password = password;
        insertDoc.email = email;

        new SimpleSchema({
            email: {
                type: String,
                regEx: SimpleSchema.RegEx.Email
            }
        }).validate({email: insertDoc.email});

        Accounts.createUser(insertDoc);
    },
    "Account.sendResetPasswordEmail": function (email) {
        check(email, String);

        let account = Accounts.findUserByEmail(email);
        if(!!account) {
            Accounts.sendResetPasswordEmail(account._id, email);
        }
    }
});