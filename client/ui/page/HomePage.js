import Categories from '/imports/api/Categories';
import Questions from '/imports/api/Questions';

Template.HomePage.onCreated(function () {
});

Template.HomePage.onRendered(function () {
    let self = this;

    this.autorun(function () {
        self.subscribe("Category.getAll", 1);
        self.subscribe("Question.getAll", 1);
    })
});

Template.HomePage.onDestroyed(function () {
});

Template.HomePage.helpers({
});

Template.HomePage.events({
});