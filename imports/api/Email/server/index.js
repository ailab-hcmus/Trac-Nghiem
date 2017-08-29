import { Email } from 'meteor/email'
Meteor.methods({
    sendEmail(to, from, subject, text) {
        check([to, from, subject, text], [String]);
        this.unblock();
        Email.send({to, from, subject, text });
    }
});