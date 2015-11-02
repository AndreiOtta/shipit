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
		$http.get(server_name + '/projects')
		.success(function(data){
			$scope.ideas = data;
			$scope.selectedIdea = null;
		});
	}

	$scope.goto_help = function() {
		$location.path('/help');
	}

	$scope.goto_home = function() {
		$location.path('/');
	}

	$scope.getMemberCount = function(idea){
		idea.ProjectUsers = idea.ProjectUsers || [];
		return  idea.ProjectUsers.length <= 1 ? "(1 member)" : "(" + idea.ProjectUsers.length + " members)";
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

	$scope.joinTeam = function() {
		if (!$scope.UserLoggedIn) {
			$location.path('/login');
			return;
		} 
		else {
			var idea = $scope.selectedIdea;
			var isCurrentUserOwner = $.grep(idea.ProjectUsers, function(user){ return user.UserId == CurrentUser.id && user.IsOwner}).length > 0;
			var isCurrentUserMember = $.grep(idea.ProjectUsers, function(user){ return user.UserId == CurrentUser.id}).length > 0;
			if(isCurrentUserOwner || isCurrentUserMember) {
				$scope.errorMsg = "You're already a member of the selected team";
			}
			else {
				$http.post(server_name + '/projectusers', { IsOwner: false, UserId: CurrentUser.id, ProjectId: idea.Id })
				.success(function(data){
					if(data > 0) {
						getIdeas();
						$scope.errorMsg = '';
					}
					else {
						$scope.errorMsg = 'You have already joined this team';
					}
				})
				.error(function(error){
					$scope.errorMsg = 'Error in joining team';
				});
			}
		}
	}

	$scope.leaveTeam = function() {
		if (!$scope.UserLoggedIn) {
			$location.path('/login');
			return;
		} 
		else {
			var idea = $scope.selectedIdea;
			var isCurrentUserOwner = $.grep(idea.ProjectUsers, function(user){ return user.UserId == CurrentUser.id && user.IsOwner}).length > 0;
			var isCurrentUserMember = $.grep(idea.ProjectUsers, function(user){ return user.UserId == CurrentUser.id}).length > 0;
			if (isCurrentUserOwner) {
				$scope.errorMsg = "You cannot leave the team until you transfer ownership to another member";
			}
			else if (!isCurrentUserMember) {
				$scope.errorMsg = "You are not a member of the selected team";
			}
			else {
				var projectUserId = $.grep(idea.ProjectUsers, function(user){ return user.UserId == CurrentUser.id})[0].Id;
				$http.delete(server_name + '/projectusers/'+ projectUserId)
				.success(function(data){
					getIdeas();
					$scope.errorMsg = '';
				})
				.error(function(error){
					$scope.errorMsg = 'Error in leaving team';
				});
			}
		}
	}

	$scope.goto_addIdea = function () {
		if ($scope.UserLoggedIn) {
			$location.path('/ideas/submit');
		} 
		else {
			$location.path('/login');
		};
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