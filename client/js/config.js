/**
 * Created by Jonas on 2016-04-22.
 */
var myApp = angular.module('myApp', ['ngRoute','datetimepicker']);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "partials/login.html",
            controller: "loginCtrl"
        })

        .when('/student', {
            templateUrl: 'partials/student_home.html',
            controller: 'studentCtrl'
        })

        .when('/admin', {
            templateUrl: 'partials/admin_home.html',
            controller: 'adminCtrl'
        })

        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        })

        .when('/user', {
            templateUrl: 'partials/user_details.html',
            controller: 'userDetailCtrl'
        })

        .when('/class', {
            templateUrl: 'partials/class.html',
            controller: 'classCtrl'
        })

        .when('/exam', {
            templateUrl: 'partials/exam.html',
            controller: 'examCtrl'
        })

        .when('/question', {
            templateUrl: 'partials/question.html',
            controller: 'questionCtrl'
        })

        .when('/submitted', {
            templateUrl: 'partials/submitted.html',
            controller: 'submittedCtrl'
        })

        .when("/login", {
            templateUrl: "partials/login.html",
            controller: "loginCtrl"
        })

        .when('/createexam', {
            templateUrl: "partials/create_exam.html",
            controller: "makeExamCtrl"
        })

        .otherwise({
            redirectTo: '/login'
        });
});

myApp.run(function($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {

        //If no logged user, redirect to /login
        if (sessionStorage.getItem('userId') == null) {

            //If the next page is login, do nothing.
            if ( next.templateUrl === "partials/login.html") {
            }
            //Else, change location to login:
            else {
                $location.path("/login");
            }
        }
    });
});
