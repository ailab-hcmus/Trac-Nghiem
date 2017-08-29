import Results from '/imports/api/Results';

Template.QuizResult.onCreated(function () {
});

Template.QuizResult.onRendered(function () {
});

Template.QuizResult.onDestroyed(function () {
});

Template.QuizResult.helpers({
    results: function () {
        let quiz = Template.instance().data;
        if(!quiz)
            return [];

        return Results.find({"Quiz.Id": quiz._id}).fetch();
    },
    refineIndex: function (index) {
        return index + 1;
    }
});

Template.QuizResult.events({
});