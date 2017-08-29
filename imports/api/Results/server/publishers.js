import {Meteor} from 'meteor/meteor';
import Results from '/imports/api/Results';
import Questions from '/imports/api/Questions';

Meteor.publishComposite("Results.get", function (id) {
    check(id, String);

    return {
        find() {
            return Results.find({
                _id: id,
            });

            this.ready();
        },
        children: [
            {
                find(result) {
                    let question = [];

                    _.each(result.Records, function (record) {
                        question.push(record.QuestionId);
                    });

                    return Questions.find({_id: {$in:question}})
                }
            }
        ]
    }
});