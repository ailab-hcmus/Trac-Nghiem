import {Random} from 'meteor/random';
import {UISchema} from '/imports/utils/UISchema';

Template.InsertUpdateCategory.onCreated(function () {
    this.formId = Random.id();
});

Template.InsertUpdateCategory.onRendered(function () {
});

Template.InsertUpdateCategory.onDestroyed(function () {
});

Template.InsertUpdateCategory.helpers({
    schema: function () {
        return UISchema.Category
    },
    getFromId: function () {
        return Template.instance().formId;
    },
    getData: function () {
        console.log(Template.instance().data);
        return Template.instance().data;
    }
});

Template.InsertUpdateCategory.events({
    'submit': function (event, template) {
        event.preventDefault();

        if(!AutoForm.validateForm(template.formId))
            return;

        let category = AutoForm.getFormValues(template.formId).insertDoc;
        if(!!template.data && !!template.data._id) {
            Meteor.call("Category.update", template.data._id,category, function (error, result) {
                if(!!error) {
                    sAlert.error("Cập nhật chủ đề thất bại");
                } else {
                    sAlert.success("Cập nhật chủ đề thành công");
                    $("#" + template.data.modalId).modal('hide');
                }
            });
        } else {
            Meteor.call("Category.insert", category, function (error, result) {
                if(!!error) {
                    sAlert.error("Thêm chủ đề thất bại");
                } else {
                    sAlert.success("Thêm chủ đề thành công");
                    AutoForm.resetForm(template.formId);
                    $("#" + template.data.modalId).modal('hide');
                }
            });
        }
    }
});