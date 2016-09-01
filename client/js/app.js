/// https://github.com/btford/angular-express-blog

$(document).on('ready', function() {
  console.log('sanity check!');
});

var inventory = angular.module('inventory', []);

inventory.controller('todosController', function ($scope,$http) {
  $scope.formData = {};
  $scope.todoData = {};

  $http.get('/api/v1/todos')
        .success(function(data) {
            $scope.todoData = data;
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
});