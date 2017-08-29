import Quizzes from '/imports/api/Quizzes';

Template.Quizzes.onCreated(function () {
    this.selectedQuiz = new ReactiveVar("");
});

Template.Quizzes.onRendered(function () {
    this.subscribe("Quiz.getAll");
});

Template.Quizzes.onDestroyed(function () {
});

Template.Quizzes.helpers({
    quizzes: function () {
        return Quizzes.find().fetch();
    },
    getSelectedQuiz: function () {
        return Template.instance().selectedQuiz.get();
    },
});

Template.Quizzes.events({
    'click .btn-danger': function (event, template) {
        event.preventDefault();

        let quizId = $(event.target).data().id;

        Meteor.call("Quiz.remove", quizId, function (error) {
            if (!!error)
                sAlert.error("Xóa bài trắc nghiệm thất bại");
            else
                sAlert.success("Xóa bài trắc nghiệm thành công");
        })
    },
    'click .btn-default.get-link': function (event, template) {
        template.selectedQuiz.set($(event.target).data().id);
    },
    'click #link-exercise-email': function (event, template) {
        event.preventDefault();
        let receiver = []
        for (i=0;i<$('.link-exercise-email-recieve').length;i++)
            receiver.push($($('.link-exercise-email-recieve').get(i)).val())
        let pin = Quizzes.findOne(template.selectedQuiz.get()).Pin;
        let content = "";
        if (pin) {
            content = 'Link bài tập: ' + $('#link-exercise').val() + '. Mã PIN: ' + pin + '.';
        } else {
            content = 'Link bài tập: '+$('#link-exercise').val();
        }

        Meteor.call('sendEmail',
            receiver.toString(),
            Meteor.settings.public.Email.host_mail,
            'Bài tập Online',
            content, function (err, res) {
                if (err) {
                    sAlert.error("Không thể gửi Email");
                } else {
                    sAlert.success("Đã gửi");
                }
            }
        )
    },
    'click #link-test-email': function (event, template) {
        event.preventDefault();
        let receiver = []
        for (i=0;i<$('.link-test-email-recieve').length;i++)
            receiver.push($($('.link-test-email-recieve').get(i)).val())

        let pin = Quizzes.findOne(template.selectedQuiz.get()).Pin;
        let content = "";
        if (pin) {
            content = 'Link bài kiểm tra: '+$('#link-exercise').val() + '. Mã PIN: ' + pin + '.';
        } else {
            content = 'Link bài kiểm tra: '+$('#link-exercise').val();
        }

        Meteor.call('sendEmail',
            receiver.toString(),
            Meteor.settings.public.Email.host_mail,
            'Bài tập Online',
            content, function (err, res) {
                if (err) {
                    sAlert.error("Không thể gửi Email");
                } else {
                    sAlert.success("Đã gửi")
                }
            }
        )
    },
    'click #add-link-exercise-email': function (event, template) {
        event.preventDefault();
        $(event.currentTarget).parent().append('<input style="margin-top: 5px" type="text" class="form-control link-exercise-email-recieve" placeholder="Email nhận">')
    },
    'click #add-link-test-email': function (event, template) {
        event.preventDefault();
        $(event.currentTarget).parent().append('<input style="margin-top: 5px" type="text" class="form-control link-test-email-recieve" placeholder="Email nhận">')
    }
});