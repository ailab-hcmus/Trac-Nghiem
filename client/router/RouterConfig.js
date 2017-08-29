Router.onBeforeAction(function () {

    if(!Meteor.user() && !Meteor.loggingIn()){
        Router.go('/');
    } else {
        this.next();
    }
}, {except: ['HomePage', 'Practise', 'Test', 'ResultQuiz', 'dev-test', 'ResetPassword']});