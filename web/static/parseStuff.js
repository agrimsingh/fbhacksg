/**
 * Created by Huy on 8/2/2015.
 */
Parse.initialize("5GQQaiAeDGbF5JeL6LqHuH9HiLq3HUHXmUUz93wS", "KqA8NhV2I1ZRE4qx7Y9YrEphVOcz8ajtQpmIAeuV");

var myApp = angular.module('myApp', []);

myApp.controller('loginController', function ($scope) {
    $scope.login = function() {
        Parse.User.logIn($scope.username, $scope.password, {
            success: function() {
                window.location = 'index.html';
            },
            error: function(user, error) {
                console.log(JSON.stringify(error));
                alert('Login failed')
            }
        });
    };
});