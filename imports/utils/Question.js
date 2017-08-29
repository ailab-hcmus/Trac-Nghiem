import {Meteor} from 'meteor/meteor';

import {QuestionSchema} from '/imports/api/Questions';
import Questions from '/imports/api/Questions';

export const QuestionType = [];
QuestionType.push({
    value: "MultipleChoice",
    label: "Câu hỏi trắc nghiệm"
});
QuestionType.push({
    value: "TrueFalse",
    label: "Câu hỏi đúng sai"
});
QuestionType.push({
    value: "Matching",
    label: "Câu hỏi ghép cặp"
});
QuestionType.push({
    value: "Essay",
    label: "Câu hỏi tự luận"
});
QuestionType.push({
    value: "FillInTheBlank",
    label: "Câu hỏi điền vào chỗ trống"
});

export const QuestionTypeSchema = {};
QuestionTypeSchema.MultipleChoice = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    Options: {
        type: [Object]
    },
    "Options.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id();
        }
    },
    "Options.$.Content": {
        type: String
    },
    "Options.$.IsAnswer": {
        type: Boolean,
        defaultValue: false
    },
    "Options.$.Feedback": {
        type: String,
        optional: true
    },
    Settings: {
        type: Object
    },
    "Settings.isRandomOption": {
        type: Boolean,
        defaultValue: false
    },
    "Settings.isMultipleAnswer": {
        type: Boolean,
        defaultValue: false
    }
});
QuestionTypeSchema.TrueFalse = new SimpleSchema({
    Question: {
        type: String,
        label: 'Nội dung câu hỏi'
    },
    Answer: {
        type: Boolean,
        label: 'Đáp án đúng sai'
    },
    FeedBack: {
        type: String,
        label: 'Giải thích',
        optional: true
    },

}),
QuestionTypeSchema.Matching = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    MatchingPairs: {
        type: [Object]
    },
    "MatchingPairs.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id();
        }
    },
    "MatchingPairs.$.ColumnA": {
        type: String
    },
    "MatchingPairs.$.ColumnB": {
        type: String
    },
    "MatchingPairs.$.CorrectPoints": {
        type: Number,
        optional: true
    },
    "MatchingPairs.$.IncorrectPoints": {
        type: Number,
        optional: true
    },
    "MatchingPairs.$.Feedback": {
        type: String,
        optional: true
    }
});
QuestionTypeSchema.Essay = new SimpleSchema({
    Question: {
        type: String,
        min: 5
    },
    Feedback: {
        type: String,
        optional: true
    }
});
QuestionTypeSchema.FillInTheBlank = new SimpleSchema({
    Question: {
        type: String,
        label: "Nội dung câu hỏi",
        min: 5,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
                settings: {
                    height: 150,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline', 'clear']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'hr']],
                        ['view', ['fullscreen', 'codeview']],
                        ['help', ['help']]
                    ]
                },
            },
        }
    },
    AcceptedAnswers: {
        type: [Object]
    },
    "AcceptedAnswers.$.Answer": {
        type: String,
    },
    "AcceptedAnswers.$.Feedback": {
        type: String,
        optional: true
    }
});

export const QuestionValidation = {};
QuestionValidation.MultipleChoice = function (question, answerFromUser) {
    if (question._id !== answerFromUser.QuestionId) {
        throw new Meteor.Error("dataError");
    }

    let flag = true;

    let answers = _.map(_.filter(question.Content.Options, function (option) {
        return option.IsAnswer;
    }), function (option) {
        return option.Id;
    });

    if (_.difference(answers, answerFromUser.Answers.Answer).length > 0 || _.difference(answerFromUser.Answers.Answer, answers).length > 0)
        flag = false;

    if (question._id !== answerFromUser.QuestionId) {
        throw new Meteor.Error("dataError");
    }

    if (flag)
        return question.CorrectPoints;
    else
        return -question.IncorrectPoints;
};
QuestionValidation.Matching = function (question, answer) {
    if (question._id !== answer.QuestionId) {
        throw new Meteor.Error("dataError");
    }

    let flag = true;

    _.each(answer.Answers, function (answer) {
        let id = answer.ColumnA + answer.ColumnB;
        if (!_.findWhere(question.Content.MatchingPairs, {Id: id}))
            flag = false;
    });

    if (flag)
        return question.CorrectPoints;
    else
        return -question.IncorrectPoints;
};
QuestionValidation.FreeText = function (question, answer) {
    if (question._id != answer.QuestionId) {
        throw new Meteor.Error("dataError");
    }

    let flag = false;

    if (!!_.findWhere(question.Content.AcceptedAnswer, {Answer: answer.Answer}))
        flag = true;

    if (flag)
        return question.CorrectPoints;
    else
        return -question.IncorrectPoints;
};
QuestionValidation.Essay = function (question, answer) {
    if (question._id != answer.QuestionId) {
        throw new Meteor.Error("dataError");
    }
    return 1;
};
QuestionValidation.FillInTheBlank = function (question, answer) {
    if (question._id != answer.QuestionId) {
        throw new Meteor.Error("dataError");
    }

    let flag = false;

    if (!!_.findWhere(question.Content.AcceptedAnswers, {Answer: answer.Answer}))
        flag = true;

    if (flag)
        return question.CorrectPoints;
    else
        return -question.IncorrectPoints;
};

export const QuestionRefineData = {};
QuestionRefineData.MultipleChoice = function (content) {
    return {
        Question: content.Question,
        Options: _.map(content.Options, function (option) {
            return {
                Id: option.Id,
                Content: option.Content
            }
        })
    }
};
QuestionRefineData.Matching = function (content) {
    let columnA = [];
    let columnB = [];

    _.each(content.MatchingPairs, function (pair) {
        columnA.push({
            Id: pair.Id.substring(0, 5),
            Content: pair.ColumnA
        });
        columnB.push({
            Id: pair.Id.substring(5),
            Content: pair.ColumnB
        });
    });

    _.each(content.IncorrectMatches, function (incorrectMatch) {
        columnB.push({
            Id: incorrectMatch.Id,
            Content: incorrectMatch.Content
        });
    });

    return {
        Question: content.Question,
        Clue: columnA,
        Match: columnB
    }
};
QuestionRefineData.FreeText = function (content) {
    return {
        Question: content.Question
    }
};
QuestionRefineData.TrueFalse = function (content) {
    return {
        Question: content.Question
    }
};
QuestionRefineData.Essay = function (content) {
    return {
        Question: content.Question
    }
};
QuestionRefineData.FillInTheBlank = function (content) {
    return {
        Question: content.Question
    }
};

export const QuestionPreview = {};
QuestionPreview.MultipleChoice = "MultipleChoicePreview";
QuestionPreview.TrueFalse = "TrueFalsePreview";
QuestionPreview.Matching = "MatchingPreview";
QuestionPreview.Essay = "EssayPreview";
QuestionPreview.FillInTheBlank = "FillInTheBlankPreview";

export const QuestionTest = {};
QuestionTest.MultipleChoice = "MultipleChoiceTest";
QuestionTest.TrueFalse = "TrueFalseTest";
QuestionTest.Matching = "MatchingTest";
QuestionTest.FillInTheBlank = "FillInTheBlankTest";
QuestionTest.Essay = "EssayTest";
export const QuestionPrint = {};
QuestionPrint.MultipleChoice = "MultipleChoiceTest";
QuestionPrint.TrueFalse = "TrueFalseTest";
QuestionPrint.Matching = "MatchingPrint";
QuestionPrint.FillInTheBlank = "FillInTheBlankPrint";
QuestionPrint.Essay = "EssayTest";

export const QuestionResult = {};
QuestionResult.MultipleChoice = "MultipleChoiceResult";
QuestionResult.TrueFalse = "TrueFalseResult";
QuestionResult.Matching = "MatchingResult";
QuestionResult.FillInTheBlank = "FillInTheBlankResult";
QuestionResult.Essay = "EssayResult";

export const QuestionPractise = {};
QuestionPractise.MultipleChoice = "MultipleChoicePractise";
QuestionPractise.TrueFalse = "TrueFalsePractise";
QuestionPractise.Matching = "MatchingPractise";
QuestionPractise.FillInTheBlank = "FillInTheBlankPractise";
QuestionPractise.Essay = "EssayPractise";

export const QuestionDefaultModalId = {};
QuestionDefaultModalId.MultipleChoice = "insert-update-multiple-choice-modal";
QuestionDefaultModalId.TrueFalse = "insert-update-true-false-modal";
QuestionDefaultModalId.Matching = "insert-update-matching-modal";
QuestionDefaultModalId.FillInTheBlank = "insert-update-fill-in-the-blank-modal";
QuestionDefaultModalId.Essay = "insert-update-essay-modal";

export const QuestionHelper = {
    insert: (questionContent) => {
        questionContent = QuestionSchema.clean(questionContent);
        QuestionSchema.validate(questionContent);

        try {
            questionContent.Content = QuestionTypeSchema[questionContent.QuestionType].clean(questionContent.Content);
            QuestionTypeSchema[questionContent.QuestionType].validate(questionContent.Content);

            return Questions.insert(questionContent);
        } catch (e) {
            throw new Meteor.Error("notFound", "Question type not found");
        }
    },
    update: (questionId, questionContent) => {
        questionContent.Content = QuestionTypeSchema[questionContent.QuestionType].clean(questionContent.Content);

        try {
            questionContent.Content = QuestionTypeSchema[questionContent.QuestionType].clean(questionContent.Content);
            QuestionTypeSchema[questionContent.QuestionType].validate(questionContent.Content);
        } catch (e) {
            throw new Meteor.Error("notFound", "Question type not found");
        }

        questionContent = QuestionSchema.clean(questionContent);
        let currentQuestion = Questions.findOne(questionId);
        questionContent.Owner = currentQuestion.Owner;
        QuestionSchema.validate(questionContent);

        Questions.update(questionId, {$set: questionContent});
    },
    remove: (questionId) => {
        Questions.remove(questionId);
    },

    getPreviewTemplateName: function (questionType) {
        return QuestionPreview[questionType];
    },
    getTestTemplateName: function (questionType) {
        return QuestionTest[questionType];
    },
    getPrintTemplateName: function (questionType) {
        return QuestionPrint[questionType];
    },
    getPractiseTemplateName: function (questionType) {
        return QuestionPractise[questionType];
    },
    getDefaultModalId: function (questionType) {
        return QuestionDefaultModalId[questionType];
    },
    getQuestionResultTemplateName: function (questionType) {
        return QuestionResult[questionType];
    }
};