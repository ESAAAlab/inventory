// USERS
// EVENT MANAGEMENT
inventory.controller('rootLendingController', function($scope) {
  $scope.$on('rootLoadUserDetails', function(event, args) {
    console.log(args);
    $scope.$broadcast('loadUserDetails', args);
  });

  $scope.$on('rootClearUserDetails', function(event, args) {
    $scope.$broadcast('clearUserDetails', args);
  });

  $scope.$on('rootReloadUserSearchResults', function(event, args) {
    $scope.$broadcast('reloadUserSearchResults', args);
  });
});

inventory.controller('singleLendingController', function ($scope,$http,$stateParams,toastService,asyncLoadingService,utilsService) {
  $scope.user = {'id':null};
  $scope.studentYears = [];
  $scope.userTypes = [];
  $scope.userInventory = [];

  $scope.parseSQLUser = function(data) {
    $scope.user = data;
  };

  $scope.parseSQLInventory = function(data) {
    $scope.userInventory = data;
  };

  $scope.clearUser = function() {
    $scope.user = {'id':null};
  };

  $scope.loadUser = function(id) {
    console.log("laoding user");
    $http.get('/api/v1/user/'+id)
    .success(function(data) {
      $scope.parseSQLUser(data);
      $scope.loadUserInventory(id);
    })
    .error(function(error) {
      console.log('Error: ' + error);
    });
  };

  $scope.loadUserInventory = function(userId) {
    $http.get('/api/v1/transaction/user/'+userId)
    .success(function(data) {
      $scope.parseSQLInventory(data);
    })
    .error(function(error) {
      console.log('Error: ' + error);
    });
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

  $scope.loadUser($stateParams.id);

  asyncLoadingService.getStudentYears().then(function(data){
    $scope.studentYears = data;
  });

  asyncLoadingService.getUserTypes().then(function(data){
    $scope.userTypes = data;
  });

  // Item Search
  $scope.formData = [];
  $scope.items = [];
  $scope.item = {};
  $scope.filteredItem = [];
  $scope.isFinishedLoadingSearchQuery = true;

  // Tool Search
  $scope.querySearch = function(query,force) {
    if (query !== undefined && query !== '' && query !== null) {
      $scope.isFinishedLoadingSearchQuery = false;
      $http.get('/api/v1/inventory/search/'+utilsService.cleanString(query))
      .success(function(data) {
        $scope.items = data;
        $scope.isFinishedLoadingSearchQuery = true;
      })
      .error(function(error) {
          console.log('Error: ' + error);
      });
    } else {
      if (force) {
        $scope.isFinishedLoadingSearchQuery = false;
        $http.get('/api/v1/inventory/')
        .success(function(data) {
          $scope.items = data;
          $scope.isFinishedLoadingSearchQuery = true;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
      }
    }
  };

  $scope.addTransaction = function(userId, itemId) {
    var params = {};
    params.userId = $scope.user.id;
    params.itemId = itemId;
    $http.post('/api/v1/transaction',params)
    .success(function(data) {
      toastService.showToast(true,'Nouvelle Transaction');
      $scope.loadUserInventory(userId);
    })
    .error(function(error) {
      toastService.showToast(false,'Erreur lors de la transaction');
      console.log('Error: ' + error);
    });
  };

  $scope.endTransaction = function(id) {
    $http.put('/api/v1/transaction/'+id)
    .success(function(data) {
      toastService.showToast(true,'Outil rendu');
      $scope.loadUserInventory($scope.user.id);
    });
  };

  $scope.loadItem = function(id) {
    $scope.$emit('rootLoadItemDetails', {'id':id});
  };

  $scope.checkStockAvailable = function(item) {
    return utilsService.checkStockAvailable(item);
  };

  $scope.$on('reloadItemSearchResults', function(event, args) {
    $scope.querySearch($scope.searchText);
  });
});
