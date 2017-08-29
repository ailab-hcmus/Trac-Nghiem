import {Meteor} from 'meteor/meteor';
import Questions from '/imports/api/Questions';
import QuestionBanks from '/imports/api/Questions';

let PAGE_SIZE = Meteor.settings.public.pageSize;

Meteor.publish("Question.getAll", function (page = 0) {
    if(!!this.userId) {
        return Questions.find({
            "Owner.Id": this.userId,
            Active: true
        }, {
            fields: {
                _id: 1,
                QuestionType: 1,
                Content: 1,
                CorrectPoints: 1,
                IncorrectPoints: 1,
                Category: 1,
                Tags: 1,
            }
        })
    }

    return this.ready();
});

// For Owner and Assistants
Meteor.publish("Question.getQuestionsFromQuestionBank", function (questionBankId, page = 0) {
    check(questionBankId, String);
    check(page, Number);

    let questionBank = QuestionBanks.findOne(questionBankId);

    if (!!this.userId && questionBank.cantModify(this.userId)) {
        return Questions.find(
            {
                _id: {$in: questionBank.Questions},
                Active: true
            },
            {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                fields: {
                    QuestionType: 1,
                    Content: 1,
                    CorrectPoints: 1,
                    IncorrectPoints: 1,
                    Category: 1,
                    Tags: 1
                }
            })
    }

    return this.ready();
});

// For Owner and Assistants
Meteor.publish("Question.getQuestionFromQuestionBank", function (questionBankId, questionId) {
    check(questionBankId, String);
    check(questionId, String);

    let questionBank = QuestionBanks.findOne(questionBankId);

    if (!!this.userId && questionBank.cantModify(this.userId) && questionBank.isHaveQuestion(questionId)) {
        return Questions.find(
            {
                _id: questionId,
                Active: true
            },
            {
                fields: {
                    QuestionType: 1,
                    Content: 1,
                    CorrectPoints: 1,
                    IncorrectPoints: 1,
                    Category: 1,
                    Tags: 1
                }
            })
    }

    return this.ready();
});