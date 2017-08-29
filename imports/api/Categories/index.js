import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {OwnerSchema} from '/imports/utils/Schemas';
import {Meteor} from 'meteor/meteor';

export const CategorySchema = new SimpleSchema({
    Name: {
        type: String,
        min: 5,
        max: 200
    },
    Description: {
        type: String,
        min: 5,
        optional: true
    },
    Owner: {
        type: OwnerSchema,
    },
    Reserve: {
        type: Object,
        optional: true
    },
    Active: {
        type: Boolean,
        defaultValue: true
    }
});

const Categories = new Meteor.Collection(Meteor.settings.public.CollectionPrefix + "categories");
Categories.attachSchema(CategorySchema);

Categories.allow({
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

Categories.deny({
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

Categories.helpers({
    isOwner: function (userId) {
        return this.Owner.Id === userId;
    },
    update: function (newCategory) {
        Categories.update(this._id, {$set: newCategory});
    }
});

export default Categories;