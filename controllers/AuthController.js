shipitapp.controller('AuthController', function($scope, $http, $location, $cookies, CurrentUser){
	init();

	function init(){
		clearScope();
		if ($location.path().indexOf('/changepass') >= 0 && !CurrentUser.isLoggedIn()) {
			$location.path('/login');
		};
	}

	function clearScope(){
		$scope.loginModel = {};
		$scope.registerModel = {};
		$scope.changepassModel = {};
		$scope.errorMsg = '';
	}

	$scope.goto_home = function() {
		$location.path('/');
	}

	$scope.goto_register = function() {
		$location.path('/register');
	}

	$scope.goto_changepass = function() {
		$location.path('/changepass');
	}

	$scope.login = function () {
		$http.post(server_name + '/auth', { email: $scope.loginModel.email, password: $scope.loginModel.pass })
		.success(function(data) {
			if (data > 0) {
				CurrentUser.setCurrentUser(data, $scope.loginModel.email);
				$cookies.LoggedUserId = data;
				$cookies.LoggedUserEmail = $scope.loginModel.email;
				clearScope();
				$scope.goto_home();
			}
			else {
				$scope.errorMsg = 'Incorrect email address or password';
				$scope.loginModel.pass = '';
			}
		})
		.error(function(error) {
			CurrentUser.clearCurrentUser();
			$scope.errorMsg = error;
			$scope.loginModel.pass = '';
		});
	}

	$scope.register = function () {
		if (!$scope.registerModel.name || $scope.registerModel.name.trim() === '' || $scope.registerModel.name.length < 3) {
			$scope.errorMsg = 'Please provide a longer name';
			return;
		};
		if (!$scope.registerModel.email || $scope.registerModel.email.trim() === '') {
			$scope.errorMsg = 'Please provide an email address';
			return;
		};
		if (!$scope.registerModel.pass || $scope.registerModel.pass.trim() == '' || $scope.registerModel.pass.length < 3) {
			$scope.errorMsg = 'Please provide a longer password';
			return;
		};
		if ($scope.registerModel.pass === $scope.registerModel.confirm) {
			$http.post(server_name + '/users', { name: $scope.registerModel.name, email: $scope.registerModel.email, password: $scope.registerModel.pass })
			.success(function(data){
				if (data > 0) {
					CurrentUser.setCurrentUser(data, $scope.registerModel.email);
					clearScope();
					$scope.goto_home();
				}
				else {
					$scope.errorMsg = 'Email address already registered';
					$scope.registerModel.pass = $scope.registerModel.confirm = '';
				}
			})
			.error(function(error){
				$scope.errorMsg = error;
				$scope.registerModel = {};
			})
		} 
		else {
			$scope.errorMsg = "Passwords do not match";
			$scope.registerModel.pass = $scope.registerModel.confirm = '';
		};
	}

	$scope.changePassword = function () {
		if (!$scope.changepassModel.newpass || $scope.changepassModel.newpass.length < 3) {
			$scope.errorMsg = 'Please provide a longer password';
			return;
		};
		if ($scope.changepassModel.newpass && $scope.changepassModel.newpass.trim() != '' && $scope.changepassModel.newpass === $scope.changepassModel.confirm) {
			$http.get(server_name + '/users/' + CurrentUser.id)
			.success(function(data){
				var user = data;
				if (user) {
					$http.put(server_name + '/users/' + user.Id, { Id: user.Id, name: user.Name, email: user.Email, password: $scope.changepassModel.newpass })
					.success(function(data){
						clearScope();
						$scope.goto_home();
					})
					.error(function(error){
						$scope.errorMsg = error;
						$scope.changepassModel = {};
					});
				};
			})
			.error(function(error){
				$scope.errorMsg = error;
				$scope.changepassModel = {};
			});
		} 
		else {
			$scope.errorMsg = "Password error!";
			$scope.changepassModel = {};
		};
	}
});