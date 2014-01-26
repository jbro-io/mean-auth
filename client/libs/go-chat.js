'use strict';

angular.module('GoChat', [
	'EventUtil',
	'goinstant'
])

.directive('chatbar', ['broadcast', function(broadcast){
	return {
		restrict: 'E',
		scope: {
			status: '=',
			user: '='
		},
		controller: function($scope){

			var myUser = {
				id: '0',
				name: {
					first: 'Jonathan',
					last: 'Broquist'
				}
			};

			$scope.windows = [];

			for(var i=1; i<4; i++)
			{
				$scope.windows.push({
					currentUser: myUser,
					incomingUser: {
						id: i.toString(),
						name: {
							first: 'Chat',
							last: 'Bot ' + i
						}
					}
				});
			}
		},
		templateUrl: 'partials/go-chat/chatbar.html'
	}
}])

.directive('chatwindow', ['GoAngular','$timeout', function(GoAngular, $timeout){
	return {
		restrict: 'E',
		scope: {
			index: '=',
			user: '=',
			incomingUser: '='
		},
		controller: function($scope){

			function scrollToBottom(){
				//TODO: convert to use native angular directives instead of jquery
				//scroll to last element
				var elements = $('#chatbox_'+ $scope.index +' .chatboxcontent');
				$('#chatbox_'+ $scope.index +' .chatboxcontent').scrollTop(elements[elements.length-1].scrollHeight);
			}

			//initial scroll to bottom
			$timeout(function(){
				scrollToBottom();
			}, 1500);

			//generate namespace from user ids
			var incomingUserId = parseInt($scope.incomingUser.id);
			var userId = parseInt($scope.user.id);
			var namespace = (userId < incomingUserId) ? userId + '_' + incomingUserId : incomingUserId + '_' + userId;

			//initialize goangular syncing
			var goAngular = new GoAngular($scope, namespace, {
					include:['messages']
				}).initialize().then(function(){
					scrollToBottom();
				});

			//scope variables
			$scope.messages = [];
			$scope.minimized = false;
			$scope.chatWindowHeight = '350px';

			$scope.addMessage = function(event){
				if(event) event.preventDefault();
				console.log('...adding message:', $scope.message);
				var message = {
					type: 'outbound',
					text: $scope.message,
					timestamp: new Date(),
					sender: $scope.user.name.first
				};

				$scope.messages.push(message);
				scrollToBottom();
				$scope.message = '';
			};

			$scope.toggleMinimized = function(){
				$scope.minimized = !$scope.minimized;
				$scope.chatWindowHeight = ($scope.minimized) ? '35px' : '350px';
			}

			$scope.close = function(){
				console.log('...closing chat window');
			}
		},
		templateUrl: 'partials/go-chat/chatwindow.html'
	}
}])

;