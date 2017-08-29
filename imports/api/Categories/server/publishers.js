import {Meteor} from 'meteor/meteor';
import Categories from '/imports/api/Categories';

let PAGE_SIZE = Meteor.settings.public.pageSize;

Meteor.publish("Category.getCategoryForQuestion", function () {
    if(!!this.userId) {
        return Categories.find({}, {
            fields: {
                _id: 1,
                Name: 1
            }
        })
    }

    return this.ready();
});

// only Owner
Meteor.publish("Category.getAll", function(page = 0){
    check(page, Number);

    if (!!this.userId) {
        return Categories.find(
            {
                "Owner.Id": this.userId,
                Active: true
            },
            {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                fields: {
                    Name: 1,
                    Description: 1,
                    Reserve: 1
                }
            });
    }

    this.ready();
});

// only Owner
Meteor.publish("Category.getAllForTabular", function(){
    if (!!this.userId) {
        return Categories.find(
            {
                "Owner.Id": this.userId,
                Active: true
            },
            {
                fields: {
                    Name: 1,
                    Description: 1,
                    Reserve: 1
                }
            });
    }

    this.ready();
});

// only Owner
Meteor.publish("Category.get", function(id){
    check(id, String);

    if (!!this.userId) {
        return Categories.find(
            {
                _id: id,
                "Owner.Id": this.userId,
                Active: true
            },
            {
                fields: {
                    Name: 1,
                    Description: 1,
                    Reserve: 1
                }
            });
    }

    this.ready();
});