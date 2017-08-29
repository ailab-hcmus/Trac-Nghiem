import {Random} from 'meteor/random';
import {UISchema} from '/imports/utils/UISchema';

Template.InsertUpdateQuiz.onCreated(function () {
    this.formId = Random.id();

});

Template.InsertUpdateQuiz.onRendered(function () {
});

Template.InsertUpdateQuiz.onDestroyed(function () {
});

Template.InsertUpdateQuiz.helpers({
    schema: function () {
        return UISchema.Quiz
    },
    getFromId: function () {
        return Template.instance().formId;
    },
    getData: function () {
        return Template.instance().data.quiz;
    }
});

Template.InsertUpdateQuiz.events({
    'submit': function (event, template) {
        event.preventDefault();

        if(!AutoForm.validateForm(template.formId))
            return;
        let quiz = AutoForm.getFormValues(template.formId).insertDoc;
        if(!!template.data && !!template.data.quiz) {
            Meteor.call("Quiz.update", template.data.quiz._id, quiz,  function (error, result) {
                if(!!error) {
                    sAlert.error("Cập bài trắc nghiệm thất bại");
                } else {
                    sAlert.success("Cập bài trắc nghiệm thành công");
                    if (!!template.data && template.data.modalId)
                        $("#" + template.data.modalId).modal('hide');
                }
            });
        } else {
            Meteor.call("Quiz.insert", quiz, function (error, result) {
                if(!!error) {
                    sAlert.error("Thêm bài trắc nghiệm thất bại");
                } else {
                    sAlert.success("Thêm bài trắc nghiệm công");
                    AutoForm.resetForm(template.formId);
                    if (!!template.data && template.data.modalId)
                        $("#" + template.data.modalId).modal('hide');
                }
            });
        }
    }
});