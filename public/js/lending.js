// USERS
// EVENT MANAGEMENT
inventory.controller('rootLendingController', function($scope) {
  $scope.$on('rootLoadUserDetails', function(event, args) {
    $scope.$broadcast('loadUserDetails', args);
  });

  $scope.$on('rootClearUserDetails', function(event, args) {
    $scope.$broadcast('clearUserDetails', args);
  });

  $scope.$on('rootReloadUserSearchResults', function(event, args) {
    $scope.$broadcast('reloadUserSearchResults', args);
  });
});

inventory.controller('usersController', function ($scope,$http,toastService,utilsService,asyncLoadingService) {
  $scope.formData = [];
  $scope.users = [];
  $scope.user = {};
  $scope.filteredUser = [];
  $scope.isFinishedLoadingSearchQuery = true;

  $scope.querySearch = function(query,force) {
    if (query !== undefined && query !== '' && query !== null) {
      $scope.isFinishedLoadingSearchQuery = false;
      $http.get('/api/v1/user/search/'+utilsService.cleanString(query))
      .success(function(data) {
        $scope.users = data;
        $scope.isFinishedLoadingSearchQuery = true;
      })
      .error(function(error) {
          console.log('Error: ' + error);
      });
    } else {
      if (force) {
        $scope.isFinishedLoadingSearchQuery = false;
        $http.get('/api/v1/users/')
        .success(function(data) {
          $scope.users = data;
          console.log($scope.users[0]);
          $scope.isFinishedLoadingSearchQuery = true;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
      }
    }
  };

  $scope.deleteUser = function(id) {
    asyncLoadingService.clearUser(id).then(function(data){
      toastService.showToast(true,'Utilisateur supprimé avec succés');
      $scope.querySearch($scope.searchText);
    });
  };

  $scope.duplicateUser = function(user) {
    var newUser = (JSON.parse(JSON.stringify(user)));
    newUser.id = null;
    newUser.lastName = newUser.lastName+' - copie';
    $http.post('/api/v1/user',newUser)
    .success(function(data) {
      console.log(data);
      toastService.showToast(true,'Copie réussie');
      $scope.$emit('rootLoadUserDetails', {'id':data.id});
      $scope.querySearch($scope.searchText);
    })
    .error(function(error) {
      toastService.showToast(false,'Erreur lors de la copie');
      console.log('Error: ' + error);
    });
  };

  $scope.loadUser = function(id) {
    $scope.$emit('rootLoadUserDetails', {'id':id});
  };

  $scope.$on('reloadUserSearchResults', function(event, args) {
    $scope.querySearch($scope.searchText);
  });
});

inventory.controller('lendingController', function ($scope,$http,toastService,asyncLoadingService,utilsService) {
  $scope.user = {'id':null};
  $scope.studentYears = [];
  $scope.userTypes = [];

  $scope.parseSQLResult = function(data) {
    $scope.user = data;
  };

  $scope.clearUser = function() {
    $scope.user = {'id':null};
  };

  $scope.loadUser = function(id) {
    console.log("loading");
    $http.get('/api/v1/user/'+id)
    .success(function(data) {
      $scope.parseSQLResult(data);
    })
    .error(function(error) {
      console.log('Error: ' + error);
    });
  };

  $scope.saveUser = function() {
    if ($scope.user.id === null) {
      // ADD A NEW USER
      $http.post('/api/v1/user',$scope.user)
      .success(function(data) {
        toastService.showToast(true,'Ajout réussi');
        $scope.parseSQLResult(data);
        $scope.$emit('rootReloadUserSearchResults',{});
      })
      .error(function(error) {
        toastService.showToast(false,'Erreur lors de l\'ajout');
        console.log('Error: ' + error);
      });
    } else {
      // UPDATE EXISTING USER
      $http.put('/api/v1/user/'+$scope.user.id,$scope.user)
      .success(function(data) {
        toastService.showToast(true,'Mise à jour réussie');
        $scope.parseSQLResult(data);
        $scope.$emit('rootReloadUserSearchResults',{});
      })
      .error(function(error) {
        toastService.showToast(false,'Erreur lors de la mise à jour');
        console.log('Error: ' + error);
      });
    }
  };

  $scope.$on('loadUserDetails', function(event, args) {
    $scope.loadUser(args.id);
  });

  $scope.$on('clearUserDetails', function(event, args) {
    $scope.clearUser();
  });

  $scope.deleteUser = function(id) {
    asyncLoadingService.clearUser(id).then(function(data){
      toastService.showToast(true,'Outil supprimé avec succés');
      $scope.clearUser();
      $scope.$emit('rootReloadUserSearchResults',{});
    });
  };

  asyncLoadingService.getStudentYears().then(function(data){
    $scope.studentYears = data;
  });

  asyncLoadingService.getUserTypes().then(function(data){
    $scope.userTypes = data;
  });
});