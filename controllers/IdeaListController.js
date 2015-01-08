shipitapp.controller('IdeaListController', function($scope, $http, $location, CurrentUser){
	init();

	function init() {
		// $http.get('http://shipit.tavara.ro/api/users')
		// .success(function(data){
		// 	$scope.ideas = data;
		// });
		$scope.ideas = [
		{"Id":1,"Name":"Alin","Email":"text@test.com","Password":"","ProjectUsers":null}
		,{"Id":2,"Name":"Luncan","Email":"test@test.com","Password":"","ProjectUsers":null}
		,{"Id":3,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":4,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":5,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":6,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":7,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":8,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":9,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":10,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":11,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}
		,{"Id":12,"Name":"Alin","Email":"11@test.com","Password":"","ProjectUsers":null}];
		$scope.User = CurrentUser.isLoggedIn() ? 'Logged in as ' + CurrentUser.email : 'not logged in';
	};

	$scope.addIdea = function () {
		if (CurrentUser.isLoggedIn()) {
			$http.post('http://shipit.tavara.ro/api/auth', { email: '11@test.com', password: 'password'})
				.success(function(data) {
					alert(data);
				});
		} 
		else {
			$location.path('/login');
		};
	}
});