import Quizzes from '/imports/api/Quizzes';
import Questions from '/imports/api/Questions';
import Results from '/imports/api/Results';

const PublicController = PreloadController.extend({
    layoutTemplate: "NonSidebarLayout",
    loadingTemplate: "Loading"
});

const DefaultController = PreloadController.extend({
    layoutTemplate: "Layout",
    loadingTemplate: "Loading"
});

const Preload = {
    'verbose': false,  // Show loading messages in console
    'timeOut': 5000,
    'styles': [
        'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
        '/css/AdminLTE.min.css',
        '/css/skins/_all-skins.min.css',
        '/css/style.css'
    ],
    'sync': [
        'https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js',
        'https://oss.maxcdn.com/respond/1.4.2/respond.min.js',
        '/js/app.min.js',
        '/js/demo.js'
    ],
    'onAfterSync': function (fileName) {
        return true;
    }
};

const PreloadSidebarLayout = {
    verbose: false,  // Show loading messages in console
    timeOut: 5000,
    styles: [
        'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
        '/css/AdminLTE.min.css',
        '/css/skins/_all-skins.min.css',
        '/css/style.css'
    ],
    sync: [
        'https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js',
        'https://oss.maxcdn.com/respond/1.4.2/respond.min.js',
        '/js/app.min.js',
        '/js/demo.js'
    ]
};

const PreloadHomePage = {
    verbose: false,  // Show loading messages in console
    timeOut: 5000,
    styles: [
        '/css/style.css'
    ],
    sync: [
        'https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js',
        'https://oss.maxcdn.com/respond/1.4.2/respond.min.js',
        '/js/app.min.js',
        '/js/demo.js'
    ]
};

const PreloadMatJax = {
    verbose: false,  // Show loading messages in console
    timeOut: 5000,
    styles: [
        'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
        '/css/AdminLTE.min.css',
        '/css/skins/_all-skins.min.css',
        '/css/style.css'
    ],
    sync: [
        'https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js',
        'https://oss.maxcdn.com/respond/1.4.2/respond.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML',
        '/js/app.min.js',
        '/js/demo.js'
    ]
};

Router.route('/', {
    name: "HomePage",
    template: "HomePage",
    preload: PreloadHomePage,
    layoutTemplate: "FinalLayout",
    loadingTemplate: "Loading",
    controller: PreloadController
});

Router.route('/quizzes', {
    name: "Quizzes",
    template: "Quizzes",
    controller: DefaultController,
    preload: PreloadSidebarLayout,
});

Router.route('/quiz/edit/:_id', {
    name: "EditQuiz",
    template: "EditQuiz",
    controller: DefaultController,
    preload: PreloadSidebarLayout,
    waitOn: function () {
        return Meteor.subscribe('Quiz.get', this.params._id);
    },
    data: function () {
        return Quizzes.findOne(this.params._id);
    }
});

Router.route('/quiz/result/:_id', {
    name: "QuizResult",
    template: "QuizResult",
    controller: DefaultController,
    preload: PreloadSidebarLayout,
    waitOn: function () {
        return Meteor.subscribe('Quiz.get', this.params._id);
    },
    data: function () {
        return Quizzes.findOne(this.params._id);
    }
});

Router.route('/practise/:_id', function () {
    if (!Meteor.user() && !this.state.get('UserInfo')) {
        this.render('AskInfo', {
            data: function () {
                return {route: "Practise"}
            }
        });
    } else {
        this.render('Practise', {
            data: function () {
                return Quizzes.findOne(this.params._id);
            }
        })
    }
}, {
    name: "Practise",
    controller: PublicController,
    preload: PreloadMatJax,
    waitOn: function () {
        return Meteor.subscribe('Quiz.get', this.params._id);
    }
});

Router.route('/test/:_id', function () {
    if (!Meteor.user() && !this.state.get('UserInfo')) {
        this.render('AskInfo', {
            data: function () {
                return {Route: "Test"}
            }
        });
    } else {
        this.render('Test', {
            data: function () {
                return ReactiveMethod.call("Quiz.getQuiz", this.params._id);
            }
        })
    }
}, {
    name: "Test",
    controller: PublicController,
    preload: PreloadMatJax,
    waitOn: function () {
        return Meteor.subscribe('Quiz.get', this.params._id);
    },
});

Router.route('/print/:_id', {
    template: "Print",
    name: "Print",
    controller: PreloadController,
    loadingTemplate: "Loading",
    preload: PreloadMatJax,
    waitOn: function () {
    },
    data: function () {
        return ReactiveMethod.call("Quiz.getQuiz", this.params._id);
    }
});

Router.route('/question-banks/', {
    name: "QuestionBanks",
    template: "QuestionBanks",
    controller: DefaultController,
    preload: PreloadSidebarLayout,
    waitOn: function () {
        return Meteor.subscribe('Question.getAll');
    },
    data: function () {
        return Questions.find().fetch();
    }
});

Router.route('/result/:_id', {
    name: "ResultQuiz",
    template: "ResultQuiz",
    controller: PublicController,
    preload: PreloadMatJax,
    waitOn: function () {
        Meteor.subscribe("Results.get", this.params._id);
        Meteor.subscribe("Quiz.getAllForTabular");

        let result = Results.findOne(this.params._id);
        try {
            return Meteor.subscribe('Quiz.get', result.Quiz.Id);
        } catch (e) {
        }
        ;
    },
    data: function () {
        return Results.findOne(this.params._id);
    }
});

Router.route('/categories', {
    name: "Categories",
    template: "Categories",
    controller: DefaultController,
    preload: PreloadSidebarLayout,
});


Router.route('/category/insert', {
    name: "InsertUpdateCategory",
    template: "InsertUpdateCategory",
    controller: DefaultController,
    preload: PreloadSidebarLayout,
    waitOn: function () {
        Meteor.subscribe("Results.get", this.params._id);
        Meteor.subscribe("Quiz.getAllForTabular");

        let result = Results.findOne(this.params._id);
        try {
            return Meteor.subscribe('Quiz.get', result.Quiz.Id);
        } catch (e) {
        }
    },
    data: function () {
        return Results.findOne(this.params._id);
    }
});

import {Accounts} from 'meteor/accounts-base';
Router.route('/reset-password/:token', {
    name: "ResetPassword",
    template: "ResetPassword",
    preload: PreloadHomePage,
    layoutTemplate: "FinalLayout",
    loadingTemplate: "Loading",
    controller: PreloadController
});