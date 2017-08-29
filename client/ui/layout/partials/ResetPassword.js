import {Random} from 'meteor/random';
import {UISchema} from '/imports/utils/UISchema';

Template.ResetPasswordForm.onCreated(function () {
    this.formId = Random.id();
});

Template.ResetPasswordForm.onRendered(function () {
});

Template.ResetPasswordForm.onDestroyed(function () {
});

Template.ResetPasswordForm.helpers({
    schema: UISchema.ResetPasswordWithEmail,
    getFormId: function () {
        return Template.instance().formId;
    }
});

Template.ResetPasswordForm.events({
    'submit': function (event, template) {
        event.preventDefault();

        let data = AutoForm.getFormValues(template.formId).insertDoc;

        Meteor.call("Account.sendResetPasswordEmail", data.email, function(error){
            if (!!error) {
                sAlert.error("Lỗi: ", error.reason);
            }
            else {
                sAlert.success("Email đã được gởi, bạn vui lòng kiểm tra lại email");
                AutoForm.resetForm(template.formId);
                $("#" + template.data.modalId).modal('hide');
            }
        });
    }
});

Template.ResetPassword.onCreated(function () {
    this.formId = Random.id();
});

Template.ResetPassword.onRendered(function () {
});

Template.ResetPassword.onDestroyed(function () {
});

Template.ResetPassword.helpers({
    schema: UISchema.ResetPassword,
    getFormId: function () {
        return Template.instance().formId;
    }
});

Template.ResetPassword.events({
    'submit': function (event, template) {
        event.preventDefault();

        let data = AutoForm.getFormValues(template.formId).insertDoc;

        Accounts.resetPassword(Router.current().params.token, data.password, function (error) {
            if (!!error) {
                sAlert.error("Lỗi: ", error.reason);
            }
            else {
                sAlert.success("Thay đổi mật khẩu thành công");
                Router.go('HomePage');
            }
        });
    }
});