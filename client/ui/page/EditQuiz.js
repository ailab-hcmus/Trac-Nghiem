import Questions from '/imports/api/Questions';
import {QuestionHelper} from '/imports/utils/Question';

Template.EditQuiz.onCreated(function () {
});

Template.EditQuiz.onRendered(function () {
});

Template.EditQuiz.onDestroyed(function () {
});

Template.EditQuiz.helpers({
    quiz: function () {
        return Template.instance().data;
    },
    questions: function () {
        return Questions.find({_id: {$in: Template.instance().data.Questions}}).fetch();
    },
    randomQuestions: function () {
        return Template.instance().data.RandomQuestions;
    },
    refineQuestion: function (question, index) {
        question.index = index;
        return question;
    },
    refineRandomQuestion: function (question, quizId, index) {
        question.quizId = quizId;
        question.index = index;
        return question;
    },
    getPreviewTemplateName: function (questionType) {
        return QuestionHelper.getPreviewTemplateName(questionType);
    }
});

Template.EditQuiz.events({
});