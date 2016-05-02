/**
 * Created by Jonas on 2016-04-27.
 */

/**
 * LOGIN-CONTROLLER
 */
myApp.controller("loginCtrl", ['$scope','$location','$rootScope','userService', function($scope, $location, $rootScope, userService) {
    $scope.errorMessage = "";
    $scope.username = "";
    $scope.password = "";
    var counter = 0;

    $scope.attemptLogin = function() {

        $.ajax({
            type: 'post',
            url: '/api/user/login/' + $scope.username,
            data: "password=" + $scope.password,
            dataType: "json",
            traditional: true,

            success: function (data) {
                if (data.login == true && data.user.admin == false){
                    sessionStorage.setItem('userId', data.user.id);
                    $location.path("/student");
                }
                else if (data.login == true && data.user.admin == true){
                    sessionStorage.setItem('userId', data.user.id);
                    $location.path("/admin");
                }
                else if (data.login == false){
                    console.log(data);
                }

                userService.login(data.user.firstName, data.user._id, data.user.admin, data.user.testToTake);

                if(!$scope.$$phase) {
                    //https://github.com/yearofmoo/AngularJS-Scope.SafeApply
                    $scope.$apply()
                }

            },
            error: function (errormessage) {
                if (errormessage.responseJSON.message == "Kontrollera användarnamn och lösenord"){
                    counter++;
                }
                if (counter == 3){
                    $scope.loginError = false;
                    $scope.sendPasswordBtn = true;
                    counter = 0;
                }else {
                    $scope.errorMessage = errormessage.responseJSON.message;
                    $scope.loginError = true;
                }


                if(!$scope.$$phase) {
                    //https://github.com/yearofmoo/AngularJS-Scope.SafeApply
                    $scope.$apply();
                }
            }
        });
    };
}]);

/**
 * INDEX-CONTROLLER:
 */
myApp.controller('indexCtrl', function ($scope, $location, userService) {

    $scope.clickLogo = function() {
        if (userService.admin == true){
            $location.path("/admin");
        }
        else if (userService.admin == false){
            $location.path("/student");
        }
    };

    $scope.$on('updateNavbarBroadcast', function () {

        if (sessionStorage.getItem('userId') != null) {
            $scope.showLogout = true;

            if (userService.admin == true) {
                $scope.showAdminNav = true;
                $scope.showUserDetailsNav = true;
            }
            else if (userService.admin == false) {
                $scope.showStudentNav = true;
                $scope.showUserDetailsNav = true;
            }
        }
        else {
            $scope.showLogout = false;
            $scope.showAdminNav = false;
            $scope.showStudentNav = false;
            $scope.showUserDetailsNav = false;
        }
    });

    $scope.logout = function () {
        sessionStorage.clear();
        userService.updateNavbar();
    }

});

/**
 * STUDENT-CONTROLLER:
 */
myApp.controller('studentCtrl', function ($scope, UserManager, ExamManager, userService) {
    userService.updateNavbar();

    $scope.user = "";

    UserManager.getUser(userService.id, function (data) {
        $scope.user = data;

        $scope.tests = [];
        $scope.user.testToTake.forEach(function(testId) {
            ExamManager.getExam(testId, function (test) {
                $scope.tests.push(test);
            });
        });
    });

    $scope.selectExam = function (data) {
        console.log(data);
    }
});

/**
 * ADMIN-CONTROLLER:
 */
myApp.controller('adminCtrl', function ($scope, StudentClassManager, UserManager, ExamManager, userService) {
    userService.updateNavbar();

    //Current user:
    $scope.user = "";

    //All exams:
    $scope.tests = [];

    //The selected exam (for sharing):
    $scope.selectedTest = "";

    //Usertable:
    $scope.users = [];

    //All studentclasses:
    $scope.studentClasses = [];

    //Array holding students, studentclasses and a boolean if selected or not in the table:
    $scope.selectedStudents = [];

    //For sorting the usertable when sharing an exam:
    $scope.sortType     = 'name';
    $scope.sortReverse  = false;
    $scope.searchUser   = '';

    //Get the user who has logged in:
    UserManager.getUser(userService.id, function (data) {
        $scope.user = data;
    });

    //Get all users (shows in table):
    UserManager.getAllUsers(function (data) {
        $scope.users = data;

        //Loop trough users and add to the array "selectedStudents":
        $scope.users.forEach(function (student) {
            $scope.selectedStudents.push(
                {
                    user: student,
                    studentClass: "",
                    selected: false
                }
            )
        });

        //Get all studentClasses:
        StudentClassManager.getAllStudentClasses(function (data) {
            $scope.studentClasses = data;

            //Add classes to the array "selectedStudents":
            $scope.selectedStudents.forEach(function (student) {
                $scope.studentClasses.forEach(function (studentClass) {
                    studentClass.students.forEach(function (studentId) {
                        if (student.user._id == studentId){
                            student.studentClass = studentClass.name;
                        }
                    })
                })

            });
        });
    });

    //Get all exams:
    ExamManager.getAllExams(function (test) {
        $scope.tests = test;
    });

    //Get selected exam when sharing an exam:
    $scope.selectExam = function (data) {
        ExamManager.getExam(data._id, function (data) {
            $scope.selectedTest = data;
        });
    };

    //Listener for the button "share exam":
    $scope.shareExam = function () {
        console.log($scope.selectedStudents);

        //Loop trough the array selectedStudents:
        $scope.selectedStudents.forEach(function (student) {

            //If the variable "selected" is true, then the student was selected in the list:
           if (student.selected == true) {

               //Push to the array "testToTake" and update the student in the database:
               student.user.testToTake.push($scope.selectedTest._id);
               UserManager.setUser(student);
           }
        });
    };

    //Selected row in table:
    $('.table').on('click', '.clickable-row', function() {
        if($(this).hasClass('active-row')){
            $(this).removeClass('active-row');
        } else {
            $(this).addClass('active-row').siblings().removeClass('active-row');
        }
    });
});

/**
 * USERDETAIL-CONTROLLER:
 */
myApp.controller('userDetailCtrl', function ($scope, $route, UserManager, userService) {
    $scope.user = "";

    $scope.firstNameDisabled = true;
    $scope.lastNameDisabled = true;
    $scope.passwordDisabled = true;
    $scope.emailDisabled = true;

    UserManager.getUser(userService.id, function (data) {
        $scope.user = data;
    });

    $scope.changeFirstName = function () {
        $scope.firstNameDisabled = false;
    };

    $scope.changeLastName = function () {
        $scope.lastNameDisabled = false;
    };

    $scope.changePassword = function () {
        $scope.passwordDisabled = false;
    };

    $scope.changeEmail = function () {
        $scope.emailDisabled = false;
    };

    $scope.updateUser = function () {
        UserManager.setUser($scope.user);
        $route.reload();
    };

});
