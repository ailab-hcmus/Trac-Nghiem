import {AdminLTE} from '/imports/utils/AdminLTE';
import {MathJaxHelper} from '/imports/utils/MathJax';

Template.NonSidebarLayout.onCreated(function () {
});

Template.NonSidebarLayout.onRendered(function () {
    AdminLTE.fix();
});

Template.NonSidebarLayout.onDestroyed(function () {
});

Template.NonSidebarLayout.helpers({
});

Template.NonSidebarLayout.events({
});