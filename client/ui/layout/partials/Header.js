Template.Header.onCreated(function () {
});

Template.Header.onRendered(function () {
});

Template.Header.onDestroyed(function () {
});

Template.Header.helpers({
    getEmail: function (user) {
        return user.emails[0].address;
    }
});

Template.Header.events({
    'click #sign-out': function (event, template) {
        event.preventDefault();
        Meteor.logout();
    }
});