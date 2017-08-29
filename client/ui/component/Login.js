import {Random} from 'meteor/random';
import {UISchema} from '/imports/utils/UISchema';

Template.Login.onCreated(function () {
    this.formId = Random.id();
});

Template.Login.onRendered(function () {
});

Template.Login.onDestroyed(function () {
});

Template.Login.helpers({
    schema: UISchema.Login,
    getFormId: function () {
        return Template.instance().formId;
    }
});

Template.Login.events({
    'submit': function (event, template) {
        event.preventDefault();

        let data = AutoForm.getFormValues(template.formId).insertDoc;

        if (!data.username || !data.password)
            return;

        Meteor.loginWithPassword(data.username, data.password, function (error) {
            if (!!error) {
                sAlert.error("Tên đăng nhập hoặc mật khẩu không đúng");
            }
            else {
                sAlert.success("Đăng nhập thành công");
                AutoForm.resetForm(template.formId);
                $("#" + template.data.modalId).modal('hide');
            }
        })
    }
});