Template.FinalHeader.onCreated(function () {
});

Template.FinalHeader.onRendered(function () {
});

Template.FinalHeader.onDestroyed(function () {
});

Template.FinalHeader.helpers({
});

Template.FinalHeader.events({
    "submit #header-login-form": function (event, template) {
        event.preventDefault();

        let username = $("input[name=username]").val();
        let password = $("input[name=password]").val();

        Meteor.loginWithPassword(username, password, function (error) {
            if (!!error) {
                sAlert.error("Tên đăng nhập hoặc mật khẩu không đúng");
            }
            else {
                sAlert.success("Đăng nhập thành công");
                AutoForm.resetForm(template.formId);
                $("#" + template.data.modalId).modal('hide');
            }
        })
    },
    "click .logout": function (event, template) {
        event.preventDefault();

        Meteor.logout(function (error) {
            if(!!error)
                sAlert.error("Đăng xuất thất bại");
            else
                sAlert.success("Đăng xuất thành công");
        })
    }
});