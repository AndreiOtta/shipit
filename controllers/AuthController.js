shipitapp.controller('AuthController', function($scope, $http, $location, CurrentUser){
	$scope.errorMsg = '';

	$scope.login = function (email, password) {
		$http.post('http://shipit.tavara.ro/api/auth', { email: email, password: password })
		.success(function(data) {
			CurrentUser.setCurrentUser(data, email);
			$location.path('/');
		})
		.error(function(error) {
			CurrentUser.clearCurrentUser();
			$scope.errorMsg = error;
		});
	}

	$scope.register = function (name, email, password, confirmPassword) {
		if (password.trim() != '' && password === confirmPassword) {
			$http.post('http://shipit.tavara.ro/api/users', { name: name, email: email, password: password })
			.success(function(data){
				CurrentUser.setCurrentUser(data, email);
				$location.path('/');
			})
			.error(function(error){
				$scope.errorMsg = error;
			})
		} 
		else {
			$scope.errorMsg = "Password error!";
		};
	}

	$scope.changePassword = function (oldPassword, newPassword, confirmPassword) {
		if (oldPassword != newPassword && newPassword.trim() != '' && newPassword === confirmPassword) {
			$http.get('http://shipit.tavara.ro/api/users/' + CurrentUser.id)
			.success(function(data){
				var user = data;
				if (user) {
					$http.put('http://shipit.tavara.ro/api/users', { name: user.name, email: user.email, password: newPassword })
					.success(function(data){
						CurrentUser.setCurrentUser(data, user.email);
						$location.path('/');
					})
					.error(function(error){
						$scope.errorMsg = error;
					});
				};
			})
			.error(function(error){
				$scope.errorMsg = error;
			});
		} 
		else {
			$scope.errorMsg = "Password error!";
		};
	}
});