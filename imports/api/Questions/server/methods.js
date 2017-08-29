import {Meteor} from 'meteor/meteor';
import {
    QuestionSchema,
    MultipleChoiceContentSchema,
    MatchingContentSchema,
    FreeTextContentSchema,
    EssayContentSchema
} from '/imports/api/Questions';
import Questions from '/imports/api/Questions';
import QuestionBanks from '/imports/api/QuestionBanks';

import {QuestionHelper} from '/imports/utils/Question';
import {QuizHelper} from '/imports/utils/Quiz';

Meteor.methods({
    "Question.insert": function (questionContent) {
        check(questionContent, Object);

        if(!this.userId) {
            throw new Meteor.Error("notLogin", "User not login");
        }
        
        return QuestionHelper.insert(questionContent);
    },
    "Question.update": function (questionId, questionContent) {
        check(questionId, String);
        check(questionContent, Object);

        if(!this.userId) {
            throw new Meteor.Error("notLogin", "User not login");
        }

        QuestionHelper.update(questionId, questionContent);
    },
    "Question.remove": function (questionId) {
        check(questionId, String);

        if(!this.userId) {
            throw new Meteor.Error("notLogin", "User not login");
        }

        QuestionHelper.remove(questionId);
    },

    "Question.insertIntoQuiz": function (questionContent, quizId) {
        check(questionContent, Object);
        check(quizId, String);

        if(!this.userId) {
            throw new Meteor.Error("notLogin", "User not login");
        }

        let questionId = QuestionHelper.insert(questionContent);
        QuizHelper.insertQuestion(quizId, questionId);
    }
});