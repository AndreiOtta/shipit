shipitapp.controller('IdeaListController', function($scope, $http, $location, $cookies, CurrentUser){
	init();

	function init() {
		if ($cookies.LoggedUserId && $cookies.LoggedUserEmail) {

			CurrentUser.setCurrentUser($cookies.LoggedUserId, $cookies.LoggedUserEmail);
		};
		
		getIdeas();
		
		$scope.UserLoggedIn = CurrentUser.isLoggedIn();
		var userEmail = $scope.UserLoggedIn ? CurrentUser.email : '';
		if (userEmail != '') {
			$scope.User = userEmail.split('@')[0];
			$scope.Domain = "@" + userEmail.split('@')[1];
		};
	};

	function getIdeas() {
		// $http.get(server_name + '/projects')
		// .success(function(data){
		// 	$scope.ideas = data;
		// 	$scope.selectedIdea = null;
		// });
		$scope.ideas = [
			{ Id: 1, Name: 'Test Idea 1', selected: false, ProjectUsers: [{UserId: 1, IsOwner: false}, {UserId: 2, IsOwner: true}, {UserId: 3, IsOwner: false}, {UserId: 4, IsOwner: false}]},
			{ Id: 2, Name: 'Another Test Idea', selected: false, ProjectUsers: [{UserId: 5, IsOwner: true}]},
			{ Id: 3, Name: 'Best Test Idea', selected: false, ProjectUsers: [{UserId: 6, IsOwner: false}, {UserId: 3, IsOwner: true}, {UserId: 7, IsOwner: false}]},
			{ Id: 4, Name: 'Test Idea Like no other', selected: false, ProjectUsers: [{UserId: 8, IsOwner: false}, {UserId: 9, IsOwner: true}]},
		];
		$scope.selectedIdea = null;
	}

	$scope.goto_help = function() {
		$location.path('/help');
	}

	$scope.goto_home = function() {
		$location.path('/');
	}

	$scope.getMemberCount = function(idea){
		idea.ProjectUsers = idea.ProjectUsers || [];
		return  idea.ProjectUsers.length <= 1 ? "1" : (idea.ProjectUsers.length >= 7 ? "7" : idea.ProjectUsers.length);
	}

	$scope.selectIdea = function(idea) {
		if (!$scope.selectedIdea || $scope.selectedIdea.Id != idea.Id) {
			angular.forEach($scope.ideas, function(item){
				if (item.Id != idea.Id) {
					item.selected = false;
				};
			});
			$scope.selectedIdea = idea;
		}
		idea.selected = true;
	}

	$scope.logout = function() {
		$cookies.LoggedUserId = null;
		$cookies.LoggedUserEmail = null;
		$scope.UserLoggedIn = false;
		CurrentUser.clearCurrentUser();
	}

	$scope.goto_addIdea = function () {
		// if ($scope.UserLoggedIn) {
			$location.path('/ideas/submit');
		// } 
		// else {
		// 	$location.path('/login');
		// };
	}

	$scope.goto_viewIdea = function () {
		$location.path('/ideas/view/' + $scope.selectedIdea.Id);
	}

	$scope.goto_changeIdea = function () {
		var isCurrentUserOwner = $.grep($scope.selectedIdea.ProjectUsers, function(user){ return user.UserId == CurrentUser.id && user.IsOwner}).length > 0;
		if ($scope.UserLoggedIn) {
			if (isCurrentUserOwner) {
				$location.path('/ideas/change/' + $scope.selectedIdea.Id);
			}
			else
			{
				$scope.errorMsg = 'You cannot change this idea because you are not the owner';
			}
		} 
		else {
			$location.path('/login');
		};
	}

	$scope.goto_changepass = function() {
		$location.path('/changepass');
	}
});