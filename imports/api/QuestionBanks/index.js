import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {OwnerSchema} from '/imports/utils/Schemas';
import {Meteor} from 'meteor/meteor';

export const QuestionBankSchema = new SimpleSchema({
    Name: {
        type: String,
        min: 5,
        max: 200
    },
    Owner: {
        type: OwnerSchema,
    },
    Assistants: {
        type: [OwnerSchema],
        optional: true,
        defaultValue: []
    },
    Questions: {
        type: [String],
        defaultValue: []
    },
    Reserve: {
        type: Object,
        optional: true
    },
    Statistics: {
        type: Object,
        optional: true
    },
    Active: {
        type: Boolean,
        defaultValue: true
    }
});

const QuestionBanks = new Meteor.Collection(Meteor.settings.public.CollectionPrefix + "question_banks");
QuestionBanks.attachSchema(QuestionBankSchema);

QuestionBanks.allow({
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

QuestionBanks.deny({
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

QuestionBanks.helpers({
    cantModify: function (userId) {
        return this.Owner.Id == userId || !!_.findWhere(this.Assistants, {Id: userId});
    },
    insertQuestion: function (questionId) {
        this.Questions.push(questionId);
        QuestionBanks.update(this._id, {$set: {Questions: this.Questions}});
    },
    removeQuestion: function(questionId) {
        let newQuestions = _.without(this.Questions, _.findWhere(this.Questions, questionId));
        QuestionBanks.update(this._id, {$set: {Questions: newQuestions}});
    },
    isHaveQuestion: function (questionId) {
        return !!_.findWhere(this.Questions, questionId);
    },
    isOwner: function (userId) {
        return this.Owner.Id == userId;
    }
});

export default QuestionBanks;