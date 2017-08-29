import {Meteor} from 'meteor/meteor';
import {CategorySchema} from '/imports/api/Categories';
import Categories from '/imports/api/Categories';

Meteor.methods({
    "Category.insert": function(category) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(category, Object);

        let insertData = CategorySchema.clean(category);
        let owner = Meteor.users.findOne(this.userId);

        insertData.Owner = {
            Id: this.userId,
            FullName: owner.profile.fullName
        };

        let id = Categories.insert(insertData);

        if(!!id)
            return id;
        else
            throw new Meteor.Error("system", "Can't create document");
    },
    "Category.update": function(categoryId, newCategory) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(categoryId, String);
        check(newCategory, Object);

        let currentData = Categories.findOne(categoryId);

        if(!!currentData) {
            if(currentData.isOwner(this.userId)){
                let updateData = CategorySchema.clean(newCategory);
                updateData.Owner = currentData.Owner;
                currentData.update(newCategory);
            } else {
                throw new Meteor.Error("notOwner", "You don't have permission to edit");
            }
        } else {
            throw new Meteor.Error("notFound", "Document not found");
        }
    },
    "Category.remove": function (id) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(id, String);
        let currentData = Categories.findOne(id);

        if (!!currentData) {
            if (currentData.isOwner(this.userId)) {
                Categories.remove(id);
            } else {
                throw new Meteor.Error("notOwner", "You don't have permission to edit");
            }
        } else {
            throw new Meteor.Error("notFound", "Document not found");
        }
    }
});