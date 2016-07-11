'use strict';
 
angular.module('myApp.home', ['ngRoute','ngResource'])

.constant('datastore_api', 'http://localhost:1234/api')

// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])
.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])

// Home controller
.factory('homeFactory', function($resource){
    return $resource(
        'http://localhost:51295/api/Captures/:capId',
        {capId: '@id' },
        {get: {
          method: 'GET',
          headers: { "Content-Type": "application/json", "Accept" : "application/json" }
          }
        }
    );
})

.factory('humanTemplateFactory', function($resource, datastore_api){
    return $resource(
            datastore_api + '/HumanTemplate/',
            {token: 'apiToken'},
            {get: {
              method: 'GET',
              headers: {
                  "Content-Type": "application/json",
                  "Accept" : "application/json" }
              }
            }
    );
})

.factory('authFactory', function($resource, datastore_api){
    return $resource(
        datastore_api + '/ApiKey/',
        {apiKey: 'apiKey'},
        {get: {
          method: 'GET',
          headers: {
              "Content-Type": "application/json",
              "Accept" : "application/json" }
          }
        }
    );
})

.controller('HomeCtrl', 
        ['$scope','$resource','homeFactory','authFactory', 'humanTemplateFactory', '$window',
        function($scope,$resource,homeFactory, authFactory, humanTemplateFactory, $window, $document) {
    // var firebaseObj = new Firebase("https://luminous-torch-4398.firebaseio.com");
    // var loginObj = $firebaseSimpleLogin(firebaseObj);
    
    $scope.Auth = function($scope, apiKey) {
        event.preventDefault();
        console.log(apiKey);
        console.log($window);
        var apiToken = authFactory.get({'apiKey': apiKey}).$promise;
        apiToken.then(function onSuccess(resource){
            console.log(resource.token);
            $window.sessionStorage.setItem('token', resource.token);
        });

    }

    $scope.HumanTemplate = function($scope) {
        event.preventDefault();
        var apiToken = $window.sessionStorage.getItem('token');
        var humanTemplate = humanTemplateFactory.get({'token': apiToken}).$promise;
        humanTemplate.then(function onSuccess(resource){
            loadTemplate(resource);
            /*
            console.log(resource.Base64Image);
            var canvas = document.getElementById("humanTemplate");
            var ctx = canvas.getContext("2d");
            var image = new Image();
            image.onload = function() {
                    ctx.drawImage(image, 0, 0);
            };
            image.src = "data:image/png;base64," + resource.Base64Image;
            */
        });
    }

    $scope.Lookup = function($scope, person) {
        event.preventDefault();  // To prevent form refresh
        var user = homeFactory.get({
            capId: person.captureid,

        }).$promise;
        user.then(function onSuccess(response){
            console.log(response.InfoString)
        })
    }
}]);
