import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CategorySchema, TagSchema, OwnerSchema} from '/imports/utils/Schemas';
import {Random} from 'meteor/random'
import {Meteor} from 'meteor/meteor';
import {Match} from 'meteor/check';

export const MultipleChoiceContentSchema = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    Options: {
        type: [Object]
    },
    "Options.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id();
        }
    },
    "Options.$.Content": {
        type: String
    },
    "Options.$.IsAnswer": {
        type: Boolean,
        defaultValue: false
    },
    "Options.$.Feedback": {
        type: String,
        optional: true
    },
    Settings: {
        type: Object
    },
    "Settings.isRandomOption": {
        type: Boolean,
        defaultValue: false
    },
    "Settings.isMultipleAnswer": {
        type: Boolean,
        defaultValue: false
    }
});

export const MatchingContentSchema = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    MatchingPairs: {
        type: [Object]
    },
    "MatchingPairs.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id();
        }
    },
    "MatchingPairs.$.ColumnA": {
        type: String
    },
    "MatchingPairs.$.ColumnB": {
        type: String
    },
    "MatchingPairs.$.CorrectPoints": {
        type: Number,
        optional: true
    },
    "MatchingPairs.$.IncorrectPoints": {
        type: Number,
        optional: true
    },
    "MatchingPairs.$.Feedback": {
        type: String,
        optional: true
    },
    IncorrectMatches: {
        type: [Object],
        defaultValue: [],
        optional: true
    },
    "IncorrectMatches.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id(5);
        }
    },
    "IncorrectMatches.$.Content": {
        type: String
    },
    "IncorrectMatches.$.IncorrectPoints": {
        type: Number,
        optional: true
    },
    "IncorrectMatches.$.Feedback": {
        type: String,
        optional: true
    }
});

export const FreeTextContentSchema = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    AcceptedAnswer: {
        type: [Object]
    },
    "AcceptedAnswer.$.Answer": {
        type: String,
    },
    "AcceptedAnswer.$.Feedback": {
        type: String,
        optional: true
    },
    "AcceptedAnswer.$.Points": {
        type: Number,
        defaultValue: 1
    }
});

export const EssayContentSchema = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    Feedback: {
        type: String,
        optional: true
    }
});

export const TrueFalseSchema = new SimpleSchema({
    Question: {
        type: String,
    },
    Answer: {
        type: Boolean,
    },
    FeedBack: {
        type: String
    },
    CorrectPoints: {
        type: Number,
        label: "Điểm cộng",
        defaultValue: 1
    },
    IncorrectPoints: {
        type: Number,
        label: "Điểm trừ",
        defaultValue: 0
    }
});

export const QuestionSchema = new SimpleSchema({
    Owner: {
        type: OwnerSchema,
        autoValue: function () {
            return {
                Id: Meteor.userId(),
                FullName: Meteor.user().profile.fullName
            }
        }
    },
    QuestionType: {
        type: String,
    },
    Content: {
        type: Object,//Match.OneOf(MultipleChoiceContentSchema, FreeTextContentSchema, EssayContentSchema, MatchingContentSchema)
        blackbox: true
    },
    CorrectPoints: {
        type: Number,
        defaultValue: 1
    },
    IncorrectPoints: {
        type: Number,
        defaultValue: 0
    },
    Category: {
        type: CategorySchema,
        optional: true
    },
    Level: {
        type: Number,
        allowedValues: [0,1,2,3,4],
        defaultValue: 2
    },
    Tags: {
        type: [TagSchema],
        defaultValue: [],
        optional: true
    },
    Public: {
        type: Boolean,
        defaultValue: false
    },
    Active: {
        type: Boolean,
        defaultValue: true
    }
});

let QuestionContentType = {};
QuestionContentType.MultipleChoice = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    Options: {
        type: [Object]
    },
    "Options.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id();
        }
    },
    "Options.$.Content": {
        type: String
    },
    "Options.$.IsAnswer": {
        type: Boolean,
        defaultValue: false
    },
    "Options.$.Feedback": {
        type: String,
        optional: true
    },
    Settings: {
        type: Object
    },
    "Settings.isRandomOption": {
        type: Boolean,
        defaultValue: false
    },
    "Settings.isMultipleAnswer": {
        type: Boolean,
        defaultValue: false
    }
});

const Questions = new Meteor.Collection(Meteor.settings.public.CollectionPrefix + "questions");
Questions.attachSchema(QuestionSchema); 

Questions.allow({
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

Questions.deny({
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

Questions.helpers({
    isOwner: function (userId) {
        return this.Owner.Id === userId;
    },
    publicQuestion: function () {
        Questions.update(this._id, {$set: {Public: true}});
    }
});

export default Questions;