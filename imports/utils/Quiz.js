import {Meteor} from 'meteor/meteor';

import Quizzes from '/imports/api/Quizzes';
import Questions from '/imports/api/Questions';
import {QuizSchema} from '/imports/api/Quizzes';

import {QuestionRefineData} from '/imports/utils/Question';

export const QuizHelper = {
    insert: function (quizContent) {
        quizContent = QuizSchema.clean(quizContent);
        QuizSchema.validate(quizContent);

        return Quizzes.insert(quizContent);
    },
    insertQuestion: function (quizId, questionId) {
        let quiz = Quizzes.findOne(quizId);

        if (quiz.isOwner(Meteor.userId()))
            quiz.insertQuestion(questionId);
    },

    remove: function (quizId) {
        let quiz = Quizzes.findOne(quizId);

        if (!!quiz) {
            if (quiz.isOwner(Meteor.userId()))
                Quizzes.remove(quizId);
            else
                throw new Meteor.Error("notHavePermission", "You don't have permission");
        } else {
            throw new Meteor.Error("notFound", "Quiz not found");
        }
    },

    insertRandomQuestion: function (quizId, question) {
        let quiz = Quizzes.findOne(quizId);

        if (!!quiz) {
            if (quiz.isOwner(Meteor.userId())) {
                quiz.insertRandomQuestion(question);
            }
            else
                throw new Meteor.Error("notHavePermission", "You don't have permission");
        } else {
            throw new Meteor.Error("notFound", "Quiz not found");
        }
    },
    updateQuiz: function (quizId, quizContent) {
        return Quizzes.update(quizId, {$set: {Name: quizContent.Name,
        Pin: quizContent.Pin,
            Description: quizContent.Description,
            StartTime: quizContent.StartTime,
            EndTime: quizContent.EndTime}});
    },
    updateRandomQuestion: function (quizId, questionId, questionContent) {
        let quiz = Quizzes.findOne(quizId);

        if (!!quiz) {
            if (quiz.isOwner(Meteor.userId())) {
                quiz.updateRandomQuestion(questionId, questionContent);
            }
            else
                throw new Meteor.Error("notHavePermission", "You don't have permission");
        } else {
            throw new Meteor.Error("notFound", "Quiz not found");
        }
    },

    removeRandomQuestion: function (quizId, questionId) {
        let quiz = Quizzes.findOne(quizId);

        if (!!quiz) {
            if (quiz.isOwner(Meteor.userId())) {
                quiz.removeRandomQuestion(questionId);
            }
            else
                throw new Meteor.Error("notHavePermission", "You don't have permission");
        } else {
            throw new Meteor.Error("notFound", "Quiz not found");
        }
    },

    refineDataForTest: function (quizId) {
        let quiz = Quizzes.findOne(quizId);

        if (!quiz)
            throw new Meteor.Error("notFound", "Quiz not found");

        let questions = Questions.find({_id: {$in: quiz.Questions}}).fetch();

        let randomQuestions = [];
        _.each(quiz.RandomQuestions, function (randomQuestion) {
            let selector  = {
                Level: randomQuestion.Level
            };
            if(!!randomQuestion.QuestionType)
                selector.QuestionType= randomQuestion.QuestionType;

            randomQuestions = _.union(randomQuestions, Questions.find(selector, {limit: randomQuestion.NumberOfQuestion}).fetch());
        });
        questions = _.union(questions, randomQuestions);

        let newQuestions = _.map(questions, function (question) {
            return {
                Id: question._id,
                QuestionType: question.QuestionType,
                Content: QuestionRefineData[question.QuestionType](question.Content)
            }
        });

        return {
            Name: quiz.Name,
            Description: quiz.Description,
            Duration: quiz.Duration,
            Questions: newQuestions
        }
    }
};