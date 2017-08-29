import {Meteor} from 'meteor/meteor';
import {QuestionBankSchema} from '/imports/api/QuestionBanks';
import QuestionBanks from '/imports/api/QuestionBanks';

Meteor.methods({
    "QuestionBank.insert": function (dataObject) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(dataObject, Object);
        let insertData = QuestionBankSchema.clean(dataObject);
        let owner = Meteor.users.findOne(this.userId);

        insertData.Owner = {
            Id: this.userId,
            Username: owner.username
        };

        let id = QuestionBanks.insert(insertData);

        if (!!id)
            return id;
        else
            throw new Meteor.Error("system", "Can't create document");
    },
    "QuestionBank.update": function (id, dataObject) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(id, String);
        check(dataObject, Object);

        let currentData = QuestionBanks.findOne(id);

        if (!!currentData) {
            if (currentData.Owner.Id === this.userId) {
                let updateDoc = QuestionBankSchema.clean(dataObject);
                updateDoc.Owner = currentData.Owner;
                QuestionBanks.update(id, {$set: updateDoc});
            } else {
                throw new Meteor.Error("notOwner", "You don't have permission to edit");
            }
        } else {
            throw new Meteor.Error("notFound", "Document not found");
        }
    },
    "QuestionBank.remove": function (id) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(id, String);
        let currentData = QuestionBanks.findOne(id);

        if (!!currentData) {
            if (currentData.isOwner(this.userId)) {
                QuestionBanks.remove(id);
            } else {
                throw new Meteor.Error("notOwner", "You don't have permission to edit");
            }
        } else {
            throw new Meteor.Error("notFound", "Document not found");
        }
    },
    "QuestionBank.addAssistant": function (id, assistantId) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(id, String);
        check(assistantId, String);
        let currentData = QuestionBanks.findOne(id);

        if (!!currentData) {
            if (currentData.Owner.Id == this.userId) {
                let assistant = Meteor.users.findOne(assistantId);

                if (!!assistant) {
                    let currentAssistants = currentData.Assistants;
                    currentAssistants.push({Id: assistantId, Username: assistant.username});
                    QuestionBanks.update(id, {$set: {Assistants: currentAssistants}});
                } else {
                    throw new Meteor.Error("notFound", "Assistant user not found");
                }
            } else {
                throw new Meteor.Error("notOwner", "You don't have permission to edit");
            }
        } else {
            throw new Meteor.Error("notFound", "Document not found");
        }
    },
    "QuestionBank.removeAssistant": function (id, assistantId) {
        if (!this.userId) {
            throw new Meteor.Error("notLogin", "User not logged");
        }

        check(id, String);
        check(assistantId, String);
        let currentData = QuestionBanks.findOne(id);

        if (!!currentData) {
            if (currentData.Owner.Id == this.userId) {
                let assistant = Meteor.users.findOne(assistantId);

                if (!!assistant) {
                    let currentAssistants = currentData.Assistants;
                    currentAssistants = _.without(currentAssistants, _.findWhere(currentAssistants, {Id: assistantId}));
                    QuestionBanks.update(id, {$set: {Assistants: currentAssistants}});
                } else {
                    throw new Meteor.Error("notFound", "Assistant user not found");
                }
            } else {
                throw new Meteor.Error("notOwner", "You don't have permission to edit");
            }
        } else {
            throw new Meteor.Error("notFound", "Document not found");
        }
    }
});