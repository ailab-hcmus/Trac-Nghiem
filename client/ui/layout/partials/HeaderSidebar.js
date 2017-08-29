Template.HeaderSidebar.onCreated(function () {
});

Template.HeaderSidebar.onRendered(function () {
});

Template.HeaderSidebar.onDestroyed(function () {
});

Template.HeaderSidebar.helpers({
    getEmail: function (user) {
        return user.emails[0].address;
    }
});

Template.HeaderSidebar.events({
    'click #sign-out': function (event, template) {
        event.preventDefault();
        Meteor.logout();
    }
});