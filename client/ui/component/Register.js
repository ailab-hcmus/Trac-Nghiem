import {Random} from 'meteor/random';

import {UISchema} from '/imports/utils/UISchema';

Template.Register.onCreated(function () {
    this.formId = Random.id();
});

Template.Register.onRendered(function () {
});

Template.Register.onDestroyed(function () {
});

Template.Register.helpers({
    getFormId: function () {
        return Template.instance().formId;
    },
    schema: UISchema.Register
});

Template.Register.events({
    'submit': function (event, template) {
        event.preventDefault();

        let data = AutoForm.getFormValues(template.formId).insertDoc;

        Meteor.call("Account.insert", data, function (error, result) {
            if (!!error)
                sAlert.error("Tạo tài khoản thất bại");
            else {
                sAlert.success("Tạo tài khoản thành công");
                AutoForm.resetForm(template.formId);
                $("#" + template.data.modalId).modal('hide');
            }
        })
    }
});