var inventory = angular.module('inventory', ['ngMaterial','ui.router'])
.config(['$urlRouterProvider','$stateProvider','$locationProvider','$mdThemingProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('search', 'default').primaryPalette('blue-grey').accentPalette('deep-orange').backgroundPalette('blue-grey');
  $mdThemingProvider.theme('search-dark', 'default').primaryPalette('blue-grey').accentPalette('deep-orange').dark();
  $mdThemingProvider.theme('menu', 'default').primaryPalette('blue-grey').accentPalette('blue-grey');
  $mdThemingProvider.theme('menu-dark', 'default').primaryPalette('blue-grey').accentPalette('blue-grey').dark();
  $mdThemingProvider.theme('edit', 'default').primaryPalette('blue-grey').accentPalette('deep-orange');
  $mdThemingProvider.theme('edit-dark', 'default').primaryPalette('blue-grey').accentPalette('deep-orange').dark();
  $mdThemingProvider.theme('edit-dark-accent', 'default').primaryPalette('blue-grey').accentPalette('green').dark();
  $mdThemingProvider.theme('success-toast');
  $mdThemingProvider.theme('error-toast');

  $stateProvider
  .state('home', {
    url:'/home',
    templateUrl: '/static/partials/index.html'
  })
  .state('lending', {
    url:'/lending',
    templateUrl: '/static/partials/lending.html'
  })
  .state('lending.id', {
    url:'/:id',
    views:{
      "lendingInfos": {
        templateUrl: '/static/partials/lending.id.html'
      }
    }
  })
  .state( 'users', {
    url:'/users',
    templateUrl: '/static/partials/users.html'
  })
  .state( 'users.id', {
    url:'/:id',
    views:{
      "userInfos": {
        templateUrl: '/static/partials/users.id.html'
      }
    }
  })
  .state( 'inventory', {
    url:'/inventory',
    templateUrl: '/static/partials/inventory.html'
  })
  .state( 'inventory.id', {
    url:'/:id',
    views:{
      "inventoryInfos":{
        templateUrl: '/static/partials/inventory.id.html'
      }
    }
  });
  $urlRouterProvider.otherwise('/home');
  $locationProvider.html5Mode(true);
}]);

inventory.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
});

inventory.factory('toastService',function($mdToast){
  return {
    showToast: function(success,msg) {
      var successToast = $mdToast.simple()
        .position('top right')
        .hideDelay(1500)
        .parent(angular.element('#formContent'))
        .theme('success-toast');

      var errorToast = $mdToast.simple()
        .position('top right')
        .hideDelay(3000)
        .parent(angular.element('#formContent'))
        .theme('error-toast');

      if (success) {
        $mdToast.show(
          successToast.textContent(msg)
        );
      } else {
        $mdToast.show(
          errorToast.textContent(msg)
        );
      }
    }
  };
}).factory('asyncLoadingService', function($http){
  return {
    getCategories: function(){
      return $http.get('/api/v1/itemCategories')
      .then(
      function success(response) {
        var data = response.data;
        for (var i in data) {
          if (data[i].parentId!=data[i].id) {
            data[i].description = ' - '+data[i].description;
          }
        }
        return data;
      },function error(error) {
        console.log('Error: ' + error);
      });
    },
    getLocations: function(){
      return $http.get('/api/v1/itemLocations')
      .then(
      function success(response) {
        return response.data;
      },function error(error) {
        console.log('Error: ' + error);
      });
    },
    getUserTypes: function(){
      return $http.get('/api/v1/userTypes')
      .then(
      function success(response) {
        return response.data;
      },function error(error) {
        console.log('Error: ' + error);
      });
    },
    getStudentYears: function(){
      return $http.get('/api/v1/studentYears')
      .then(
      function success(response) {
        return response.data;
      },function error(error) {
        console.log('Error: ' + error);
      });
    },
    clearItem: function(id) {
      return $http.delete('/api/v1/inventory/'+id)
      .then(
      function success(response) {
        return response.data;
      },function error(error) {
        console.log('Error: ' + error);
      });
    },
    clearUser: function(id) {
      return $http.delete('/api/v1/user/'+id)
      .then(
      function success(response) {
        return response.data;
      },function error(error) {
        console.log('Error: ' + error);
      });
    }
  };
}).factory('utilsService', function(){
  return {
    cleanString: function(s) {
      return removeAccents(angular.lowercase(s));
    },
    checkStockAvailable: function(item) {
      if (item.stockAvailable <= 0) {
        return {'color':'red','font-weight':700};
      } else if (item.stockAvailable > 0 && item.stockAvailable <= item.stockMax/2) {
        return {'color':'orange'};
      } else if (item.stockAvailable >= item.stockMax) {
        return {'color':'green'};
      } else {
        return {};
      }
    }
  };
});
