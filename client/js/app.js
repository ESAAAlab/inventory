/// https://github.com/btford/angular-express-blog

$(document).on('ready', function() {
  console.log('sanity check!');
});

var inventory = angular.module('inventory', ['ngMaterial']);

inventory.controller('clientsController', function ($scope,$http) {
  $scope.querySearch = function(query) {
    var results = query ? $scope.clientData.filter($scope.createFilterFor(query)) : $scope.clientData;
    return results;
  };

  $scope.createFilterFor = function(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(data) {
      var res = angular.lowercase(data.last_name).indexOf(lowercaseQuery) === 0;
      return res;
    };
  };

  $scope.formData = [];
  $scope.clientData = [];
  $scope.filteredClient = [];

  $http.get('/api/v1/clients')
  .success(function(data) {
    $scope.clientData = data;
  })
  .error(function(error) {
      console.log('Error: ' + error);
  });
}).config(function($mdThemingProvider) {
  // Configure a dark theme with primary foreground yellow
  $mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('blue')
    .dark();
});