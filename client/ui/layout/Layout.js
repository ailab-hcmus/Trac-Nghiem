import {AdminLTE} from '/imports/utils/AdminLTE';
import {MathJaxHelper} from '/imports/utils/MathJax';

Template.Layout.onCreated(function () {
});

Template.Layout.onRendered(function () {
    AdminLTE.fix();
});

Template.Layout.onDestroyed(function () {
});

Template.Layout.helpers({
});

Template.Layout.events({
});