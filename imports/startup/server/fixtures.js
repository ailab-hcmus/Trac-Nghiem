import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

Meteor.startup(function () {
    if(!Meteor.users.findOne({username: "admin"})) {
        let userId = Accounts.createUser({username: "admin", password: "123@321", email: "admin@localhost", profile: {fullName: "Administrator"}});
        Roles.addUsersToRoles(userId, 'admin');
    }
});