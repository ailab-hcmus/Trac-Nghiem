import {QuestionHelper} from '/imports/utils/Question';
import Categories from '/imports/api/Categories';
import Questions from '/imports/api/Questions';

Template.ImportFromQuestionBankPopup.onCreated(function () {
    this.selectedCategory = new ReactiveVar("");
    this.deppend = new Tracker.Dependency();
});

Template.ImportFromQuestionBankPopup.onRendered(function () {
    let self = this;

    self.autorun(function () {
        self.subscribe("Category.getCategoryForQuestion");
        self.subscribe("Question.getAll");
    });
});

Template.ImportFromQuestionBankPopup.onDestroyed(function () {
});

Template.ImportFromQuestionBankPopup.helpers({
    getQuestion: function () {
        Template.instance().deppend.depend();
        let selectedCategory = Template.instance().selectedCategory.get();

        if(!selectedCategory)
            return [];

        return Questions.find({"Category.Id": selectedCategory}).fetch();
    },
    refineQuestion: function (question, index) {
        question.index = index;
        return question;
    },
    getPreviewTemplateName: function (questionType) {
        return QuestionHelper.getPreviewTemplateName(questionType);
    },
    getModalId: function () {
        if(!!Template.instance().data && !!Template.instance().data.__modalId)
            return Template.instance().data.__modalId;
        else
            return "import-question-from-question-bank";
    },
    categories: function () {
        return Categories.find().fetch();
    }
});

Template.ImportFromQuestionBankPopup.events({
    'change #category-selector': function (event, template) {
        event.preventDefault();
        template.selectedCategory.set($(event.target).val());
        template.deppend.changed();
    },
    'click #import': function (event, template) {
        _.each($('input[name=question-import]'), function (input) {
            if($(input).is(":checked")) {
                Meteor.call("Quiz.insertQuestion", template.data.quizId, $(input).data().id, function (error, result) {
                })
            }
        })
    }
});