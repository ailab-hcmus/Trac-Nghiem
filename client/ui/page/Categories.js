import Categories from '/imports/api/Categories';

Template.Categories.onCreated(function () {
    this.page = new ReactiveVar(0);
    this.selectedCategory = new ReactiveVar("");
});

Template.Categories.onRendered(function () {
    let self = this;

    this.autorun(function () {
        self.subscribe("Category.getAll", self.page.get);
    })
});

Template.Categories.onDestroyed(function () {
});

Template.Categories.helpers({
    categories: function () {
        return Categories.find().fetch();
    },
    selectedCategory: function () {
        let id = Template.instance().selectedCategory.get();
        if(!!id) {
            return Categories.findOne(id);
        } else {
            return {};
        }
    }
});

Template.Categories.events({
    'click .btn-danger.btn-xs': function (event, template) {
        event.preventDefault();

        let quizId = $(event.target).data().id;

        Meteor.call("Category.remove", quizId, function (error) {
            if (!!error)
                sAlert.error("Xóa bài trắc nghiệm thất bại");
            else
                sAlert.success("Xóa bài trắc nghiệm thành công");
        })
    },
    'click .update-category': function (event, template) {
        // event.preventDefault();
        template.selectedCategory.set($(event.target).data().id);
    },
    'click .insert-category': function (event, template) {
        // event.preventDefault();
        template.selectedCategory.set("");
    }
});