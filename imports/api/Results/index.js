import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CategorySchema, TagSchema, OwnerSchema, GuestSchema} from '/imports/utils/Schemas';
import {Random} from 'meteor/random'
import {Meteor} from 'meteor/meteor';

export const ResultSchema = new SimpleSchema({
    Quiz: {
        type: Object
    },
    "Quiz.Id": {
        type: String
    },
    "Quiz.Name": {
        type: String
    },
    Owner: {
        type: OwnerSchema,
        optional: true
    },
    Guest: {
        type: GuestSchema,
        optional: true
    },
    StartTime: {
        type: Date
    },
    EndTime: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    },
    Points: {
        type: Number
    },
    NumTrue: {
        type: Number
    },
    Records: {
        type: [Object]
    },
    "Records.$.QuestionId" :{
        type: String
    },
    "Records.$.Answer" :{
        type: Object,
        blackbox: true
    }
});

const Results = new Meteor.Collection(Meteor.settings.public.CollectionPrefix + "results");
Results.attachSchema(ResultSchema);

Results.helpers({
    getOwnerName: function () {
        if(!!this.Owner)
            return this.Owner.FullName;
        else if(!!this.Guest)
            return this.Guest.Name;
    }
});

Results.allow({
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

Results.deny({
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

export default Results;