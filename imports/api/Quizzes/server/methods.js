import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {Random} from 'meteor/random';

import {QuizHelper} from '/imports/utils/Quiz';
import {QuestionValidation} from '/imports/utils/Question';
import Questions from '/imports/api/Questions';
import Quizzes from '/imports/api/Quizzes';
import {ResultSchema} from '/imports/api/Results';
import Results from '/imports/api/Results';

Meteor.methods({
    "Quiz.update": function (id, data) {
        check(id, String);

        check(data, Object);
        QuizHelper.updateQuiz(id, data);
    },
    "Quiz.insert": function (quizContent) {
        check(quizContent, Object);

        if(!this.userId) {
            throw new Meteor.Error("notLogin", "User not login");
        }

        QuizHelper.insert(quizContent);
    },
    "Quiz.insertQuestion": function (quizId, questionId) {
        check(quizId, String);
        check(questionId, String);

        if(!this.userId) {
            throw new Meteor.Error("notLogin", "User not login");
        }

        QuizHelper.insertQuestion(quizId, questionId);
    },
    "Quiz.remove": function (quizId) {
        check(quizId, String);

        QuizHelper.remove(quizId);
    },
    "Quiz.insertRandomQuestion": function (quizId, question) {
        check(quizId, String);
        check(question, Object);

        QuizHelper.insertRandomQuestion(quizId, question);
    },
    "Quiz.updateRandomQuestion": function (quizId, questionId, questionContent) {
        check(quizId, String);
        check(questionId, String);
        check(questionContent, Object);

        QuizHelper.updateRandomQuestion(quizId, questionId, questionContent);
    },
    "Quiz.removeRandomQuestion": function (quizId, questionId) {
        check(quizId, String);
        check(questionId, String);

        QuizHelper.removeRandomQuestion(quizId, questionId);
    },

    "Quiz.getQuiz": function (quizId) {
        check(quizId, String);

        return QuizHelper.refineDataForTest(quizId);
    },

    "Quiz.answer": function (quizId, dataObject, guest) {
        check(quizId, String);
        check(dataObject, Object);

        let owner = Meteor.users.findOne(this.userId);
        let quiz = Quizzes.findOne(quizId);

        if (!quiz)
            throw new Meteor.Error("notFound", "Quiz not found");

        let result = ResultSchema.clean(dataObject);
        //let result = dataObject;
        if (owner) {
            result.Owner = {
                Id: this.userId,
                FullName: owner.profile.fullName
            };
        } else {
            result.Guest = guest
        }

        let numTrue = 0;
        let points = 0;
        _.each(result.Records, function (record) {
            let questionId = record.QuestionId;
            let question = Questions.findOne(questionId);

            let point = QuestionValidation[question.QuestionType](question, record.Answer);
            points += point;
            if (point > 0)
                numTrue += 1;
        });

        result.Points = points;
        result.NumTrue = numTrue;

        let resultId = Results.insert(result);
        return {
            Points: points,
            NumTrue: numTrue,
            TotalQuestion: quiz.Questions.length,
            ResultId: resultId
        };
    }
});

