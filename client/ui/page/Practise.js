import Questions from '/imports/api/Questions';
import {QuestionHelper} from '/imports/utils/Question';
import {MathJaxHelper} from '/imports/utils/MathJax';

Template.Practise.onCreated(function () {
    this.index = new ReactiveVar(0);
    this.isShowAnswer = new ReactiveVar(false);
});

Template.Practise.onRendered(function () {
    MathJaxHelper.init();
    MathJaxHelper.render();
});

Template.Practise.onDestroyed(function () {
});

Template.Practise.helpers({
    isHaveQuestion: function () {
        return Template.instance().index.get() < Questions.find().count() - 1;
    },
    getCurrentQuestion: function() {
        let question = Questions.find().fetch()[Template.instance().index.get()];
        question.___isShowAnswer = Template.instance().isShowAnswer.get();
        question.index = Template.instance().index.get();
        return question;
    },
    index: function () {
        return Template.instance().index.get() - 1;
    },
    isShowAnswer: function () {
        return Template.instance().isShowAnswer.get();
    },
    getPractiseTemplateName: function (questionType) {
        return QuestionHelper.getPractiseTemplateName(questionType);
    }
});

Template.Practise.events({
    'click .btn-answer': function (event, template) {
        event.preventDefault();
        template.isShowAnswer.set(true);
    },
    'click .btn-next': function (event, template) {
        event.preventDefault();
        template.isShowAnswer.set(false);
        template.index.set(template.index.get() + 1);
    },
    'click .btn-end': function (event, template) {
        event.preventDefault();
        Router.go('/');
    }
});