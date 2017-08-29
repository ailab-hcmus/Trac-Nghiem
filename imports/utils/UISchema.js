import {CategorySchema} from '/imports/utils/Schemas';
import Categories from '/imports/api/Categories';
import {QuestionType} from '/imports/utils/Question';

let defaultQuestionTemplateSchema = {
    Level: {
        label: "Độ khó",
        type: Number,
        allowedValues: [0,1,2,3,4],
        defaultValue: 2,
        autoform: {
            type: 'select',
            afFieldInput: {
                options: function () {
                    return [
                        {value: 0, label: "Rất dễ"},
                        {value: 1, label: "Dễ"},
                        {value: 2, label: "Bình thường"},
                        {value: 3, label: "Khó"},
                        {value: 4, label: "Rất khó"}
                    ]
                }
            }
        }
    },
    Category: {
        type: String,
        label: "Chủ đề câu hỏi",
        autoform: {
            type: 'select',
            afFieldInput: {
                options: function () {
                    if(Categories.find().count() === 0){
                        Meteor.subscribe("Category.getCategoryForQuestion");
                    }

                    return _.map(Categories.find().fetch(), function (category) {
                        return {
                            label: category.Name,
                            value: category._id
                        };
                    })
                }
            }
        }
    },
    CorrectPoints: {
        type: Number,
        defaultValue: 1,
        label: "Điểm cộng",
        autoform: {
            defaultValue: 1
        }
    },
    IncorrectPoints: {
        type: Number,
        defaultValue: 0,
        label: "Điểm trừ",
        autoform: {
            defaultValue: 0
        }
    }
};

export const UISchema = {
};

UISchema.Register = new SimpleSchema({
    username: {
        type: String,
        label: "Tên đăng nhập"
    },
    email: {
        type: String,
        label: "Email",
        regEx: SimpleSchema.RegEx.Email
    },
    password: {
        type: String,
        label: "Mật khẩu",
        autoform: {
            afFieldInput: {
                type: "password"
            }
        },
    },
    confirmPassword: {
        label: "Nhập lại mật khẩu",
        type: String,
        min: 5,
        max: 30,
        autoform: {
            afFieldInput: {
                type: "password"
            }
        },
        custom: function () {
            if (this.value !== this.field('password').value) {
                return "passwordMismatch";
            }
        }
    },
    profile: {
        type: Object,
        label: "Thông tin cá nhân",
        optional: true
    },
    'profile.fullName': {
        type: String,
        label: "Họ và Tên",
        optional: true
    },
    'profile.dateOfBirth': {
        type: Date,
        label: "Ngày tháng năm sinh",
        optional: true
    },
    'profile.gender': {
        type: "String",
        label: "Giới tính",
        allowedValues: ["Nam", "Nữ"],
        optional: true
    }
});

UISchema.Login = new SimpleSchema({
    username: {
        type: String,
        label: "Tên đăng nhập"
    },
    password: {
        type: String,
        label: "Mật khẩu",
        autoform: {
            afFieldInput: {
                type: "password"
            }
        }
    }
});

UISchema.ResetPasswordWithEmail = new SimpleSchema({
    email: {
        type: "String",
        regEx: SimpleSchema.RegEx.Email,
        label: "Email"
    }
});

UISchema.ResetPassword = new SimpleSchema({
    password: {
        type: String,
        label: "Mật khẩu",
        autoform: {
            afFieldInput: {
                type: "password"
            }
        },
    },
    confirmPassword: {
        label: "Nhập lại mật khẩu",
        type: String,
        min: 5,
        max: 30,
        autoform: {
            afFieldInput: {
                type: "password"
            }
        },
        custom: function () {
            if (this.value !== this.field('password').value) {
                return "passwordMismatch";
            }
        }
    },
});

UISchema.MultipleChoiceContent = new SimpleSchema({
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
                        ['help', ['help']],
                        ['insert', ['equation']]
                    ]
                },
            },
        }
    },
    Options: {
        type: [Object],
        label: "Các lựa chọn"
    },
    "Options.$.Id": {
        type: String,
        autoValue: function () {
            return Random.id();
        },
        autoform: {
            type: 'hidden'
        }
    },
    "Options.$.Content": {
        type: String,
        label: "Nội dung"
    },
    "Options.$.IsAnswer": {
        type: Boolean,
        label: "Là câu trả lời đúng",
        defaultValue: false
    },
    "Options.$.Feedback": {
        type: String,
        label: "Giải thích",
        optional: true
    }
});

UISchema.Category = new SimpleSchema({
    Name: {
        type: String,
        label: "Tên loại câu hỏi"
    },
    Description: {
        type: String,
        label: "Thông tin thêm",
        optional: true
    }
});

UISchema.MultipleChoice = new SimpleSchema(_.extend({}, defaultQuestionTemplateSchema, {
    Content: {
        type: UISchema.MultipleChoiceContent,
        label: "Nội dung câu hỏi"
    },
    QuestionType: {
        type: String,
        autoValue: function () {
            return "MultipleChoice"
        },
        autoform: {
            type: 'hidden',
            afFieldInput: {
                value: "MultipleChoice"
            }
        }
    }
}));

UISchema.TrueFalseContent = new SimpleSchema({
    Question: {
        type: String,
        label: "Nội dung câu hỏi",
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
    Answer: {
        type: Boolean,
        label: "Đúng"
    },
    Feedback: {
        type: String,
        label: "Hướng dẫn trả lời",
        optional: true
    }
});

UISchema.TrueFalse = new SimpleSchema(_.extend({}, defaultQuestionTemplateSchema, {
    Content: {
        type: UISchema.TrueFalseContent,
        label: "Nội dung câu hỏi"
    },
    QuestionType: {
        type: String,
        autoValue: function () {
            return "TrueFalse"
        },
        autoform: {
            type: 'hidden',
            afFieldInput: {
                value: "TrueFalse"
            }
        }
    }
}));

UISchema.MatchingContent = new SimpleSchema({
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
    MatchingPairs: {
        type: [Object]
    },
    "MatchingPairs.$.Id": {
        type: String,
        defaultValue: Random.id(),
        autoform: {
            type: 'hidden',
            afFieldInput: {
                value: "Matching"
            }
        }
    },
    "MatchingPairs.$.ColumnA": {
        type: String,
        label: "Cột A"
    },
    "MatchingPairs.$.ColumnB": {
        type: String,
        label: "Cột B"
    },
    "MatchingPairs.$.Feedback": {
        type: String,
        label: "Giải thích",
        optional: true
    }
});

UISchema.Matching = new SimpleSchema(_.extend({}, defaultQuestionTemplateSchema, {
    Content: {
        type: UISchema.MatchingContent,
        label: "Nội dung câu hỏi"
    },
    QuestionType: {
        type: String,
        autoValue: function () {
            return "Matching"
        },
        autoform: {
            type: 'hidden',
            afFieldInput: {
                value: "Matching"
            }
        }
    }
}));

UISchema.EssayContent = new SimpleSchema({
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
    Feedback: {
        type: String,
        label: "Hướng dẫn trả lời",
        optional: true
    }
});

UISchema.Essay = new SimpleSchema(_.extend({}, defaultQuestionTemplateSchema, {
    Content: {
        type: UISchema.EssayContent,
        label: "Nội dung câu hỏi"
    },
    QuestionType: {
        type: String,
        autoValue: function () {
            return "Essay"
        },
        autoform: {
            type: 'hidden',
            afFieldInput: {
                value: "Essay"
            }
        }
    }
}));

UISchema.FillInTheBlankContent = new SimpleSchema({
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
        type: [Object],
        label: "Các câu trả lời đc chấp nhận"
    },
    "AcceptedAnswers.$.Answer": {
        type: String,
        label: "Câu trả lời"
    },
    "AcceptedAnswers.$.Feedback": {
        type: String,
        label: "Giải thích",
        optional: true
    }
});

UISchema.FillInTheBlank = new SimpleSchema(_.extend({}, defaultQuestionTemplateSchema, {
    Content: {
        type: UISchema.FillInTheBlankContent,
        label: "Nội dung câu hỏi"
    },
    QuestionType: {
        type: String,
        autoValue: function () {
            return "FillInTheBlank"
        },
        autoform: {
            type: 'hidden',
            afFieldInput: {
                value: "FillInTheBlank"
            }
        }
    }
}));


UISchema.RandomQuestion = new SimpleSchema({
    Category: {
        type: String,
        label: "Loại câu hỏi",
        autoform: {
            type: 'select',
            afFieldInput: {
                options: function () {
                    if(Categories.find().count() === 0){
                        Meteor.subscribe("Category.getCategoryForQuestion");
                    }

                    return _.map(Categories.find().fetch(), function (category) {
                        return {
                            label: category.Name,
                            value: category._id
                        };
                    })
                }
            }
        }
    },
    NumberOfQuestion: {
        type: Number,
        label: "Số lượng câu hỏi"
    },
    Level: {
        type: Number,
        allowedValues: [0,1,2,3,4],
        label: "Độ khó",
        autoform: {
            type: 'select',
            afFieldInput: {
                options: function () {
                    return [
                        {value: 0, label: "Rất dễ"},
                        {value: 1, label: "Dễ"},
                        {value: 2, label: "Bình thường"},
                        {value: 3, label: "Khó"},
                        {value: 4, label: "Rất khó"}
                    ]
                }
            }
        }
    },
    QuestionType: {
        type: String,
        label: "Loại câu hỏi",
        autoform: {
            type: 'select',
            afFieldInput: {
                options: function () {
                    return _.union(QuestionType, [{
                        value: "",
                        label: "Tất cả"
                    }])
                },
            },
            firstOption: ""
        },
        optional: true
    }
});

UISchema.Quiz = new SimpleSchema({
    Name: {
        type: String,
        label: "Tên bài kiểm trả",
        min: 5
    },
    Pin: {
      type: String,
        label: "Mã PIN",
        optional: true
    },
    Description: {
        type: String,
        optional: true,
        label: "Thông tin chi tiết",
        min: 5
    },
    StartTime: {
        type: Date,
        label: "Thời gian bắt đầu",
        optional: true
    },
    EndTime: {
        type: Date,
        label: "Thời gian kết thúc",
        optional: true
    },
});