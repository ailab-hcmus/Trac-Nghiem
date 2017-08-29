import Questions from '/imports/api/Questions';
import {QuestionHelper} from '/imports/utils/Question';
import {MathJaxHelper} from '/imports/utils/MathJax';

Template.Print.onCreated(function () {
    this.startTime = new ReactiveVar(new Date());
    this.currentTime = new ReactiveVar(new Date());
});

Template.Print.onRendered(function () {
    let self = this;

    Meteor.setInterval(function () {
        self.currentTime.set(new Date());
    }, 1000);

    setTimeout(function () {
        window.print();
    }, 4000);

    MathJaxHelper.init();
    MathJaxHelper.render();
});

Template.Print.onDestroyed(function () {
});

Template.Print.helpers({
    timer: function () {
        let startTime = new Date(Template.instance().startTime.get());
        let currentTime = new Date(Template.instance().currentTime.get());
        let timer = currentTime - startTime;

        currentTime.setTime(timer);
        timer = currentTime;

        return {
            second: timer.getSeconds(),
            minute: timer.getMinutes(),
            hour: timer.getUTCMinutes()
        }
    },
    questions: function () {
        let questions = Template.instance().data;

        if (typeof questions == typeof [])
            return questions;
        else
            return [];
    },
    getTestTemplateName: function (questionType) {
        return QuestionHelper.getPrintTemplateName(questionType);
    },
    refineQuestion: function (question, index) {
        question.index = index;
        return question;
    }
});

Template.Print.events({
    'click #done': function (event, template) {
        event.preventDefault();

        let quiz = template.data;

        let data = {
            Quiz: {
                Id: Router.current().params._id,
                Name: quiz.Name
            },
            Records: [],
            StartTime: new Date(template.startTime.get()),
        };

        _.map(quiz.Questions, function (question) {

            let questionForm = $('#' + question.Id);
            switch (question.QuestionType) {
                case 'Essay': {
                    data.Records.push(
                        {
                            QuestionId: question.Id,
                            Answer: {
                                QuestionId: question.Id,
                                Answer: questionForm.find('input').val()
                            }
                        }
                    );
                    break;
                }
                case 'FreeText': {
                    data.Records.push(
                        {
                            QuestionId: question.Id,
                            Answer: {
                                QuestionId: question.Id,
                                Answer: questionForm.find('textarea').val()
                            }
                        }
                    );
                    break;
                }
                case 'MultipleChoice': {
                    let listAnswers = [];
                    _.each(question.Content.Options, function (answer) {
                        if (questionForm.find('input[name=' + answer.Id + ']').is(":checked")) {
                            listAnswers.push(answer.Id);
                        }
                    });
                    data.Records.push(
                        {
                            QuestionId: question.Id,
                            Answer: {
                                QuestionId: question.Id,
                                Answers: {Answer: listAnswers}
                            }
                        }
                    );
                    break;
                }
                case 'Matching': {
                    let listAnswers = [];
                    _.each(question.Content.Clue, function (answer) {
                        listAnswers.push(
                            {
                                ColumnA: answer.Id,
                                ColumnB: questionForm.find('select[name=' + answer.Id + ']').val()
                            }
                        );

                    });
                    data.Records.push(
                        {
                            QuestionId: question.Id,
                            Answer: {
                                QuestionId: question.Id,
                                Answers: listAnswers
                            }
                        }
                    );
                    break;
                }
                case "TrueFalse": {
                    data.Records.push({
                        QuestionId: question.Id,
                        Answer: {
                            QuestionId: question.Id,
                            Answers: questionForm.find('input[name="true-false"]:checked').val()
                        }
                    });
                    break;
                }
                case "FillInTheBlank": {
                    data.Records.push(
                        {
                            QuestionId: question.Id,
                            Answer: {
                                QuestionId: question.Id,
                                Answer: questionForm.find('input').val()
                            }
                        }
                    );
                    break;
                }
            }

        });

        Meteor.call('Quiz.answer', Router.current().params._id, data, function (err, data) {
            if (!err) {
                setTimeout(function () {
                    Router.go('ResultQuiz', {_id: data.ResultId});
                }, 1500);

            } else {
                sAlert.error(err.message);
            }
        });
    }
});