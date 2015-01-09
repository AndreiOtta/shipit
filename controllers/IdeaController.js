shipitapp.controller('IdeaController', function($scope, $http, $location, $routeParams, $sce, $cookies, CurrentUser){
	init();

	function init() {
		if ($cookies.LoggedUserId && $cookies.LoggedUserEmail) {

			CurrentUser.setCurrentUser($cookies.LoggedUserId, $cookies.LoggedUserEmail);
		};

		clearScope();
		
		if (($location.path().indexOf('/ideas/change/') >= 0 || $location.path().indexOf('/ideas/submit') >= 0) && !CurrentUser.isLoggedIn()) {
			$location.path('/login');
			return;
		};			

		$scope.inEditMode = $location.path().indexOf('/change/') >= 0;
		$scope.inViewMode = $location.path().indexOf('/view/') >= 0;
		$scope.formModel = $scope.addIdeaModel;
		if ($scope.inEditMode || $scope.inViewMode) {
			var ideaID = ($routeParams.ideaID) ? parseInt($routeParams.ideaID) : 0;
			if (ideaID <= 0) {
				$scope.goto_home();
				return false;
			};
			
			//get idea and bind it
			$http.get('http://shipit.tavara.ro/api/projects/' + ideaID)
			.success(function(data) {
				$scope.selectedIdea = data;
				if ($scope.inEditMode) {
					$scope.changeIdeaModel.title = data.Name;
					$scope.changeIdeaModel.description = data.Description;
					$scope.changeIdeaModel.backers = $.grep(data.ProjectUsers, function(user) { return !user.IsOwner });
					$scope.formModel = $scope.changeIdeaModel;
				}
				else if ($scope.inViewMode) {
					$scope.viewIdeaModel.title = data.Name;
					$scope.viewIdeaModel.description = data.Description.replace(/\n/g,'<br/>');
					$scope.viewIdeaModel.backers = $.grep(data.ProjectUsers, function(user) { return !user.IsOwner });
				}
				$scope.isCurrentUserOwner = $.grep(data.ProjectUsers, function(user) { return user.IsOwner && (user.UserId == (CurrentUser.id || -1)) }).length > 0;
				$scope.viewIdeaModel.owner = $.grep(data.ProjectUsers, function(user) { return user.IsOwner })[0].User.Name || '';

				if ($scope.inEditMode && !$scope.isCurrentUserOwner) {
					$scope.goto_home();
					return;
				};
			})
			.error(function(error){
				clearScope();
				$scope.goto_home();
			});
		};
	};

	function clearScope(){
		$scope.addIdeaModel = { title: '', description: ''};
		$scope.changeIdeaModel = { title: '', description: ''};
		$scope.viewIdeaModel = { title: '', description: '', owner: ''};
		$scope.formModel = {};
		$scope.errorMsg = '';
	}

	$scope.changeMembership = function(backer) {
		if(!$scope.isCurrentUserOwner) {
			$scope.goto_home();
		}
		else {
			$http.put('http://shipit.tavara.ro/api/projectusers/' + backer.Id, { Id: backer.Id, IsOwner: backer.IsOwner, IsMember: !backer.IsMember, UserId: backer.UserId, ProjectId: backer.ProjectId })
			.success(function(data){
				backer.IsMember = !backer.IsMember;
				$scope.errorMsg = '';
			})
			.error(function(error){
				$scope.errorMsg = 'Error in changing membership';
			});
		}	
	}

	$scope.getDescriptionHtml = function(description) {
		return $sce.trustAsHtml(description);
	}

	$scope.saveIdea = function() {
		if ($scope.inEditMode) {
			$scope.changeIdea();
		}
		else $scope.addIdea();
	}

	$scope.addIdea = function () {
		if (!CurrentUser.isLoggedIn()) {
			$location.path('/login');
		}
		else {
			if (!$scope.addIdeaModel.title || $scope.addIdeaModel.title.trim() === '' || $scope.addIdeaModel.title.length < 4) {
				$scope.errorMsg = 'Please provide a longer name for your idea';
				return;
			};
			if ($scope.addIdeaModel.title && $scope.addIdeaModel.title.trim() != '') {
				$http.post('http://shipit.tavara.ro/api/projects', { name: $scope.addIdeaModel.title, description: $scope.addIdeaModel.description, userID: CurrentUser.id })
				.success(function(data){
					if (data > 0) {
						clearScope();
						$scope.goto_home();
					}
					else {
						$scope.errorMsg = 'Error in registering idea';
					}
				})
				.error(function(error){
					$scope.errorMsg = error;
				})
			} 
			else {
				$scope.errorMsg = "You must specify at least a title for your idea";
			};
		}
	}

	$scope.changeIdea = function () {
		if (!CurrentUser.isLoggedIn()) {
			$location.path('/login');
		} 
		else { 
			if(!$scope.isCurrentUserOwner) {
				$scope.goto_home();
			}
			else {
				if (!$scope.changeIdeaModel.title || $scope.changeIdeaModel.title.trim() === '' || $scope.changeIdeaModel.title.length < 4) {
					$scope.errorMsg = 'Please provide a longer name for your idea';
					return;
				};
				$scope.selectedIdea.Name = $scope.changeIdeaModel.title;
				$scope.selectedIdea.Description = $scope.changeIdeaModel.description;
				$scope.selectedIdea.ProjectUsers = []; //to avoid a save trigger on the users

				$http.put('http://shipit.tavara.ro/api/projects/' + $scope.selectedIdea.Id, $scope.selectedIdea)
				.success(function(data){
					clearScope();
					$scope.goto_home();
				})
				.error(function(error){
					$scope.errorMsg = error;
					$scope.changepassModel = {};
				});
			}
		};
	}

	$scope.goto_home = function() {
		$location.path('/');
	}
});