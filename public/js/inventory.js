// INVENTORY ITEMS
// EVENT MANAGEMENT
inventory.controller('rootItemController', function($scope) {
  $scope.$on('rootLoadItemDetails', function(event, args) {
    $scope.$broadcast('loadItemDetails', args);
  });

  $scope.$on('rootClearItemDetails', function(event, args) {
    $scope.$broadcast('clearItemDetails', args);
  });

  $scope.$on('rootReloadItemSearchResults', function(event, args) {
    $scope.$broadcast('reloadItemSearchResults', args);
  });
});

inventory.controller('itemsController', function ($scope,$http,toastService,utilsService,asyncLoadingService) {
  $scope.formData = [];
  $scope.items = [];
  $scope.item = {};
  $scope.filteredItem = [];
  $scope.isFinishedLoadingSearchQuery = true;

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

  $scope.deleteItem = function(id) {
    asyncLoadingService.clearItem(id).then(function(data){
      toastService.showToast(true,'Outil supprimé avec succés');
      $scope.querySearch($scope.searchText);
    });
  };

  $scope.duplicateItem = function(item) {
    var newItem = (JSON.parse(JSON.stringify(item)));
    newItem.id = null;
    newItem.name = newItem.name+' - copie';
    $http.post('/api/v1/inventory',newItem)
    .success(function(data) {
      toastService.showToast(true,'Copie réussie');
      $scope.$emit('rootLoadItemDetails', {'id':data.id});
      $scope.querySearch($scope.searchText);
    })
    .error(function(error) {
      toastService.showToast(false,'Erreur lors de la copie');
      console.log('Error: ' + error);
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

inventory.controller('singleItemController', function ($scope,$http,toastService,asyncLoadingService,utilsService) {
  $scope.item = {'id':null};
  $scope.itemCategories = [];
  $scope.itemLocations = [];

  $scope.units = [{'unit':'pc'},{'unit':'g'},{'unit':'Kg'},{'unit':'L'}];

  $scope.checkUnit = function() {
    // If unit equals pc or g
    if ($scope.item.stockUnit == $scope.units[0].unit || $scope.item.stockUnit == $scope.units[1].unit) {
      $scope.item.stockStep = 1;
      return true;
    } else {
      return false;
    }
  };

  $scope.parseSQLResult = function(data) {
    if (data.acquisitionDate !== undefined && data.acquisitionDate !== null) {
      data.acquisitionDate = new Date(data.acquisitionDate);
    }
    $scope.item = data;
  };

  $scope.clearItem = function() {
    $scope.item = {'id':null};
  };

  $scope.loadItem = function(id) {
    $http.get('/api/v1/inventory/'+id)
    .success(function(data) {
      $scope.parseSQLResult(data);
    })
    .error(function(error) {
      console.log('Error: ' + error);
    });
  };

  $scope.saveItem = function() {
    if ($scope.item.id === null) {
      // ADD A NEW ITEM
      $http.post('/api/v1/inventory',$scope.item)
      .success(function(data) {
        toastService.showToast(true,'Ajout réussi');
        $scope.parseSQLResult(data);
        $scope.$emit('rootReloadItemSearchResults',{});
      })
      .error(function(error) {
        toastService.showToast(false,'Erreur lors de l\'ajout');
        console.log('Error: ' + error);
      });
    } else {
      // UPDATE EXISTING ITEM
      $http.put('/api/v1/inventory/'+$scope.item.id,$scope.item)
      .success(function(data) {
        toastService.showToast(true,'Mise à jour réussie');
        $scope.parseSQLResult(data);
        $scope.$emit('rootReloadItemSearchResults',{});
      })
      .error(function(error) {
        toastService.showToast(false,'Erreur lors de la mise à jour');
        console.log('Error: ' + error);
      });
    }
  };

  $scope.$on('loadItemDetails', function(event, args) {
    $scope.loadItem(args.id);
  });

  $scope.$on('clearItemDetails', function(event, args) {
    $scope.clearItem();
  });

  $scope.checkStockAvailable = function(item) {
    return utilsService.checkStockAvailable(item);
  };

  $scope.deleteItem = function(id) {
    asyncLoadingService.clearItem(id).then(function(data){
      toastService.showToast(true,'Outil supprimé avec succés');
      $scope.clearItem();
      $scope.$emit('rootReloadItemSearchResults',{});
    });
  };

  asyncLoadingService.getCategories().then(function(data){
    $scope.itemCategories = data;
  });

  asyncLoadingService.getLocations().then(function(data){
    $scope.itemLocations = data;
  });
});
