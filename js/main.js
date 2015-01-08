var shipitapp = angular.module("shipit", ['ngRoute']);

shipitapp.config(function ($routeProvider){
	$routeProvider
		.when('/',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/idea_list.html'
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
		.when('/ideas/:ideaID',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/idea_view.html'
		})
		.when('/ideas/submit',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/idea_form.html'
		})
		.when('/ideas/change/:ideaID',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/idea_form.html'
		})
		.when('/ideas/withdraw/:ideaID',
		{
			controller: 'IdeaListController',
			templateUrl: '/partials/idea_remove.html'
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
		currentUser = {};
	}

	currentUser.isLoggedIn = function() {
		return currentUser.id != undefined;
	}

	return currentUser;
});