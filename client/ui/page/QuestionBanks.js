import Questions from '/imports/api/Questions';
import {QuestionDefaultModalId} from '/imports/utils/Question';

Template.QuestionBanks.onCreated(function () {
    this.selectedQuestion = new ReactiveVar("");
});

Template.QuestionBanks.onRendered(function () {
});

Template.QuestionBanks.onDestroyed(function () {
});

Template.QuestionBanks.helpers({
    questions: function () {
        return Template.instance().data;
    },
    getSelectedQuestion: function () {
        let id = Template.instance().selectedQuestion.get();
        return Questions.findOne(id);
    },
    getDefaultModalId: function (questionType) {
        return QuestionDefaultModalId[questionType];
    }
});

Template.QuestionBanks.events({
    'click .btn-danger.btn-xs': function (event, template) {
        event.preventDefault();

        let questionId = $(event.target).data().id;

        Meteor.call("Question.remove", questionId, function (error) {
            if (!!error)
                sAlert.error("Xóa câu hỏi thất bại");
            else
                sAlert.success("Xóa câu hỏi thành công");
        })
    },
    'click .btn-primary.btn-xs': function (event, template) {
        template.selectedQuestion.set($(event.target).data().id);
    }
});