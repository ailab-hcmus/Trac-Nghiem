import {Meteor} from 'meteor/meteor';
import Quizzes from '/imports/api/Quizzes';
import Questions from '/imports/api/Questions';
import Results from '/imports/api/Results';

import {publishComposite} from 'meteor/reywood:publish-composite';

let PAGE_SIZE = Meteor.settings.public.pageSize;

Meteor.publish("Quiz.getAll", function (page = 0) {
    check(page, Number);

    //if (!!this.userId) {
        return Quizzes.find(
            {
      //          "Owner.Id": this.userId,
                Active: true
            },
            {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
            });
    //}

    this.ready();
});

Meteor.publish("Quiz.getAllForTabular", function () {
    if (!!this.userId) {
        return Quizzes.find(
            {
                "Owner.Id": this.userId,
                Active: true
            },
            {
                fields: {
                    Name: 1,
                    Owner: 1,
                    Assistants: 1,
                    Questions: 1,
                    RandomQuestions: 1
                }
            });
    }

    this.ready();
});

publishComposite("Quiz.get", function (quizId) {
    let userId = this.userId;
    return {
        find() {
            check(quizId, String);

            return Quizzes.find(
                {
                    _id: quizId,
                    Active: true
                },
            );
        },
        children: [
            {
                find(quiz) {
                    return Questions.find({_id: {$in:quiz.Questions}})
                }
            },
            {
                find(quiz) {
                    return Results.find({'Quiz.Id': quiz._id});
                }
            }
        ]
    }
});