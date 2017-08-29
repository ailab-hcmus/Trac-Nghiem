import {Meteor} from 'meteor/meteor';
import QuestionBanks from '/imports/api/QuestionBanks';

let PAGE_SIZE = Meteor.settings.public.pageSize;

Meteor.publish("QuestionBank.getAll", function (page = 0) {
    check(page, Number);

    if (!!this.userId) {
        return QuestionBanks.find(
            {
                "Owner.Id": this.userId,
                Active: true
            },
            {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                fields: {
                    Name: 1,
                    Owner: 1,
                    Assistants: 1,
                    Questions: 1
                }
            });
    }

    this.ready();
});

Meteor.publish("QuestionBank.getAllForTabular", function () {
    if (!!this.userId) {
        return QuestionBanks.find(
            {
                "Owner.Id": this.userId,
                Active: true
            },
            {
                fields: {
                    Name: 1,
                    Owner: 1,
                    Assistants: 1,
                    Questions: 1
                }
            });
    }

    this.ready();
});

Meteor.publish("QuestionBank.get", function (id) {
    check(id, String);

    if (!!this.userId) {
        return QuestionBanks.find(
            {
                _id: id,
                "Owner.Id": this.userId,
                Active: true
            },
            {
                fields: {
                    Name: 1,
                    Owner: 1,
                    Assistants: 1,
                    Questions: 1
                }
            });
    }

    this.ready();
});