import {Random} from 'meteor/random';
import {UISchema} from '/imports/utils/UISchema';
import Categories from '/imports/api/Categories';

Template.InsertUpdateRandomQuestion.onCreated(function () {
    this.formId = Random.id();
});

Template.InsertUpdateRandomQuestion.onRendered(function () {
    let self = this;

    this.autorun(function () {
        self.subscribe("Category.getCategoryForQuestion");
    })
});

Template.InsertUpdateRandomQuestion.onDestroyed(function () {
});

Template.InsertUpdateRandomQuestion.helpers({
    schema: function () {
        return UISchema.RandomQuestion;
    },
    getFromId: function () {
        return Template.instance().formId;
    },
    getData: function () {
        let question = Template.instance().data;

        if (!!question && !!question.Category && !!question.Category.Id)
            question.Category = question.Category.Id;

        return question;
    }
});

Template.InsertUpdateRandomQuestion.events({
    'submit': function (event, template) {
        event.preventDefault();

        if (!AutoForm.validateForm(template.formId))
            return;

        let question = AutoForm.getFormValues(template.formId).insertDoc;
        if (!question.Category)
            return;

        if (!!template.data && !!template.data.quizId && !!template.data.Id) {
            Meteor.call("Quiz.updateRandomQuestion", template.data.quizId, template.data.Id, question, function (error, result) {
                if (!!error) {
                    sAlert.error("Cập nhật câu hỏi thất bại");
                } else {
                    sAlert.success("Cập nhật câu hỏi thành công");
                    if (!!template.data && template.data.modalId)
                        $("#" + template.data.modalId).modal('hide');
                }
            });
        } else if (!!template.data && !!template.data.quizId) {
            Meteor.call("Quiz.insertRandomQuestion", template.data.quizId, question, function (error, result) {
                if (!!error) {
                    sAlert.error("Thêm câu hỏi thất bại");
                } else {
                    sAlert.success("Thêm câu hỏi thành công");
                    AutoForm.resetForm(template.formId);
                    if (!!template.data && template.data.modalId)
                        $("#" + template.data.modalId).modal('hide');
                }
            });
        }
    }
});

/*-----------------------------------------------------------------*/

Template.InsertUpdateRandomQuestionPopup.helpers({
    passedData: function () {
        let data = Template.instance().data;
        if (!!Template.instance().data && !!Template.instance().data.__modalId)
            data.modalId = Template.instance().data.__modalId;
        else
            data.modalId = "insert-update-random-question-modal";

        return data;
    },
    getModalId: function () {
        if (!!Template.instance().data && !!Template.instance().data.__modalId)
            return Template.instance().data.__modalId;
        else
            return "insert-update-random-question-modal";
    }
});

/*-----------------------------------------------------------------*/

Template.RandomQuestionPreview.onCreated(function () {
    this.modalId = Random.id();
});

Template.RandomQuestionPreview.helpers({
    getFormId: function () {
        return Random.id();
    },
    schema: function () {
        return UISchema.RandomQuestion
    },
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    },
    getEditData: function () {
        let question = Template.instance().data;
        question.__modalId = Template.instance().modalId;

        return question;
    },
    getModalId: function () {
        return Template.instance().modalId;
    }
});

Template.RandomQuestionPreview.events({
    'click .btn-danger': function (event, template) {
        event.preventDefault();
        Meteor.call("Quiz.removeRandomQuestion", template.data.quizId, template.data.Id, function (error) {
            if (!!error) {
                sAlert.error("Xóa câu hỏi thất bại");
            }
            else
                sAlert.success("Xóa câu hỏi thành công");
        })
    }
});

Template.RandomQuestionPractise.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});

Template.RandomQuestionTest.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});

Template.RandomQuestionResult.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});
