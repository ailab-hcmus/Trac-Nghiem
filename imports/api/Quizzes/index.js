import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CategorySchema, TagSchema, OwnerSchema, GuestSchema} from '/imports/utils/Schemas';
import {QuestionSchema} from '/imports/api/Questions';
import {Random} from 'meteor/random'
import {Meteor} from 'meteor/meteor';

export const RandomQuestionSchema = new SimpleSchema({
    Id: {
        type: String,
        autoValue: function () {
            return Random.id();
        }
    },
    Category: {
        type: String
    },
    NumberOfQuestion: {
        type: Number
    },
    Level: {
        type: Number,
        allowedValues: [0,1,2,3,4]
    },
    QuestionType: {
        type: String,
        optional: true
    }
});

export const QuizSchema = new SimpleSchema({
    Name: {
        type: String,
        min: 5
    },
    Owner: {
        type: OwnerSchema,
        autoValue: function () {
            return {
                Id: Meteor.userId(),
                FullName: Meteor.user().profile.fullName
            }
        }
    },
    Pin: {
        type: String,
        optional: true,
    },
    Description: {
        type: String,
        optional: true,
        min: 5
    },
    StartTime: {
        type: Date,
        optional: true
    },
    EndTime: {
        type: Date,
        optional: true
    },
    Duration: {
        type: Number,
        defaultValue: 0
    },
    Questions: {
        type: [String], // save question id
        defaultValue: [],
        optional: true
    },
    RandomQuestions: {
        type: [RandomQuestionSchema],
        defaultValue: []
    },
    Settings: {
        type: Object
    },
    "Settings.IsRandomQuestion": {
        type: Boolean,
        defaultValue: true
    },
    "Settings.IsUsingAllOfBank": {
        type: Boolean,
        defaultValue: true
    },
    "Settings.IsAllowViewAnswer": {
        type: Boolean,
        defaultValue: true
    },
    Active: {
        type: Boolean,
        defaultValue: true
    }
});

const Quizzes = new Meteor.Collection(Meteor.settings.public.CollectionPrefix + "quizs");
Quizzes.attachSchema(QuizSchema);

Quizzes.helpers({
    isOwner: function (userId) {
        return this.Owner.Id === userId;
    },
    insertQuestion: function (questionId) {
        check(questionId, String);
        this.Questions.push(questionId);
        Quizzes.update(this._id, {$set: {Questions: this.Questions}});
    }
});

Quizzes.allow({
    insert: function (userId, doc) {
        return false;
    },
    update: function (userId, doc) {
        return false;
    },
    remove: function (userId, doc) {
        return false;
    },
});

Quizzes.deny({
    insert: function (userId, doc) {
        return true;
    },
    update: function (userId, doc) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    },
});

Quizzes.helpers({
    cantModify: function (userId) {
        return this.Owner.Id == userId;
    },
    insertQuestion: function (question) {
        if(!this.Questions)
            this.Questions = [];

        delete question.Owner;
        this.Questions.push(question);

        Quizzes.update(this._id, {$set: {Questions: this.Questions}});
    },
    insertRandomQuestion: function (randomQuestion) {
        randomQuestion = RandomQuestionSchema.clean(randomQuestion);
        RandomQuestionSchema.validate(randomQuestion);
        let randomQuestions = this.RandomQuestions || [];
        randomQuestions.push(randomQuestion);
        Quizzes.update(this._id, {$set: {RandomQuestions: randomQuestions}});
    },
    updateRandomQuestion: function (questionId,randomQuestion) {
        randomQuestion = RandomQuestionSchema.clean(randomQuestion);
        RandomQuestionSchema.validate(randomQuestion);
        randomQuestion.Id = questionId;
        _.extend(_.findWhere(this.RandomQuestions, {Id: questionId}), randomQuestion);

        Quizzes.update(this._id, {$set: {RandomQuestions: this.RandomQuestions}});
    },
    removeRandomQuestion: function (questionId) {
        this.RandomQuestions =  _.without(this.RandomQuestions, _.findWhere(this.RandomQuestions, {Id: questionId}));
        Quizzes.update(this._id, {$set: {RandomQuestions: this.RandomQuestions}});
    }
});

export default Quizzes;