var shipitapp = angular.module("shipit", ['ngRoute', 'ngCookies']);
var server_name = "http://shipit.tavara.ro/api";

shipitapp.config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/idea_list.html'
		})
		.when('/help',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/help.html'
		})
		.when('/login',
		{
			controller: 'AuthController',
			templateUrl: '/partials/login.html'
		})
		.when('/register',
		{
			controller: 'AuthController',
			templateUrl: '/partials/register.html'
		})
		.when('/changepass',
		{
			controller: 'AuthController',
			templateUrl: '/partials/changepass.html'
		})
		.when('/ideas/view/:ideaID',
		{
			controller: 'IdeaController',
			templateUrl: '/partials/idea_view.html'
		})
		.when('/ideas/submit',
		{
			controller: 'IdeaController',
			templateUrl: '/partials/idea_form.html'
		})
		.when('/ideas/change/:ideaID',
		{
			controller: 'IdeaController',
			templateUrl: '/partials/idea_form.html'
		})
		.otherwise({ redirectTo: '/' });
});

shipitapp.factory('CurrentUser', function(){
	var currentUser = {};

	currentUser.setCurrentUser = function(newid, email){
		currentUser.id = newid;
		currentUser.email = email;
	};

	currentUser.clearCurrentUser = function(){
		currentUser.id = null;
		currentUser.email = null;
	}

	currentUser.isLoggedIn = function() {
		return currentUser.id > 0;
	}

	return currentUser;
});

shipitapp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});