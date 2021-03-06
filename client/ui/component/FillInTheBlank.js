import {Random} from 'meteor/random';
import {UISchema} from '/imports/utils/UISchema';
import Categories from '/imports/api/Categories';

Template.InsertUpdateFillInTheBlank.onCreated(function () {
    this.formId = Random.id();
});

Template.InsertUpdateFillInTheBlank.onRendered(function () {
    let self = this;

    this.autorun(function () {
        self.subscribe("Category.getCategoryForQuestion");
    })
});

Template.InsertUpdateFillInTheBlank.onDestroyed(function () {
});

Template.InsertUpdateFillInTheBlank.helpers({
    schema: function () {
        return UISchema.FillInTheBlank;
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

Template.InsertUpdateFillInTheBlank.events({
    'submit': function (event, template) {
        event.preventDefault();

        if (!AutoForm.validateForm(template.formId))
            return;

        let question = AutoForm.getFormValues(template.formId).insertDoc;
        if (!question.Category)
            return;
        let category = Categories.findOne(question.Category);

        question.Category = {
            Id: category._id,
            Name: category.Name
        };

        if (!!template.data && !!template.data._id) {
            Meteor.call("Question.update", template.data._id, question, function (error, result) {
                if (!!error) {
                    sAlert.error("Cập nhật câu hỏi thất bại");
                } else {
                    sAlert.success("Cập nhật câu hỏi thành công");
                    if (!!template.data && template.data.modalId)
                        $("#" + template.data.modalId).modal('hide');
                }
            });
        } else if (!!template.data && !!template.data.quizId) {
            Meteor.call("Question.insertIntoQuiz", question, template.data.quizId, function (error, result) {
                if (!!error) {
                    sAlert.error("Thêm câu hỏi thất bại");
                } else {
                    sAlert.success("Thêm câu hỏi thành công");
                    AutoForm.resetForm(template.formId);
                    if (!!template.data && template.data.modalId)
                        $("#" + template.data.modalId).modal('hide');
                }
            });
        } else {
            Meteor.call("Question.insert", question, function (error, result) {
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
    },
    'click a[data-toggle="collapse"]': function (event, template) {
        event.preventDefault();

        if($(".collapse").hasClass("in")) {
            $(".collapse").removeClass("in");
        } else {
            $(".collapse").addClass("in");
        }
    }
});

/*-----------------------------------------------------------------*/

Template.InsertUpdateFillInTheBlankPopup.helpers({
    passedData: function () {
        let data = Template.instance().data;
        if(!!Template.instance().data && !!Template.instance().data.__modalId)
            data.modalId = Template.instance().data.__modalId;
        else
            data.modalId = "insert-update-fill-in-the-blank-modal";

        return data;
    },
    getModalId: function () {
        if(!!Template.instance().data && !!Template.instance().data.__modalId)
            return Template.instance().data.__modalId;
        else
            return "insert-update-fill-in-the-blank-modal";
    }
});

/*-----------------------------------------------------------------*/

Template.FillInTheBlankPreview.onCreated(function () {
    this.modalId = Random.id();
});

Template.FillInTheBlankPreview.helpers({
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

Template.FillInTheBlankPreview.events({
    'click .btn-danger': function (event, template) {
        event.preventDefault();

        Meteor.call("Question.remove", template.data._id, function(error) {
            if(!!error)
                sAlert.error("Xóa câu hỏi thất bại");
            else
                sAlert.success("Xóa câu hỏi thành công");
        })
    }
});

Template.FillInTheBlankPractise.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});

Template.FillInTheBlankTest.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});

Template.FillInTheBlankPrint.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});

Template.FillInTheBlankResult.helpers({
    refineIndex: function (index) {
        if (typeof index === typeof 0)
            return index + 1;
        return "";
    }
});
