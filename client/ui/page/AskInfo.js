import Quizzes from '/imports/api/Quizzes'
Template.AskInfo.onRendered(function () {
    this.subscribe("Quiz.getAll");
    let currentQuiz = Quizzes.findOne(Router.current().params._id);
    if (!currentQuiz.Pin) {
        $("#pin-group").hide();
    }
});
Template.AskInfo.events({
    'click #doing_test': function (event, temp) {
        event.preventDefault();
        let name = $("#name").val();
        let email = $("#email").val();
        let pin = $("#pin").val();
        let currentQuiz = Quizzes.findOne(Router.current().params._id);
        if (currentQuiz.Pin) {
            if (name == "" || email == "" || pin == "") {
                sAlert.error("Vui lòng điền đầy đủ thông tin");
                return;
            }
        } else {
            if (name == "" || email == "") {
                sAlert.error("Vui lòng điền đầy đủ thông tin");
                return;
            }
        }
        if (currentQuiz.Pin != pin && currentQuiz.Pin) {
            sAlert.error("Mã PIN không đúng");
            return;
        }
        let controller = Iron.controller();
        controller.state.set("UserInfo", {Name: name,
        Email: email});

    },
    'click #go_home': function (event, temp) {
        event.preventDefault();
        Router.go('HomePage')
    },
})