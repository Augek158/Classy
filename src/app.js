"use strict";
(function (){

	function ImageListCtrl($scope, $http) {
		var lock = false,
		    offset = 0;
		   			
		   	$scope.photos = [];

	   		$scope.scroll = function() {
	   			var height = document.querySelector('.image-list').offsetHeight,
	   				scrollPos = documentScrollTop();

	   			if(((height - scrollPos) < 2000) &! lock){
	   				addMoreItems();
	   			}
	   		};

	   		function addMoreItems() {
	   			lock = true;
	   			angular.element('.spinner').show();

		   		$http.jsonp("http://api.tumblr.com/v2/blog/www.theclassyissue.com/posts/?api_key=AsOKR0IvBh7u5K5IgoGkwSX0UB0Lj0I9j4Y2GjXsaDQGkSX4og&callback=JSON_CALLBACK&type=photo&offset=" + offset)
		   			 .success(function(data){
			   			getPhotoUrls(data.response);
			   			lock = false;
			   			angular.element('.spinner').hide();
			   	   }).error(function(data){
			   			$scope.photos = "Server call failed with error: " + status;
			   	   });
		   		offset += 20;
	   		};

	   		function getPhotoUrls(result) {
				for (var index in result.posts){
					var photo = result.posts[index].photos[0].original_size;
			 		$scope.photos.push(photo.url);
				}
			};

			function documentScrollTop() {
			     return (document.documentElement.scrollTop + document.body.scrollTop
			     == document.documentElement.scrollTop) ?
			     document.documentElement.scrollTop : document.body.scrollTop;
			}; 

	   		addMoreItems();
	};

	angular.module('classyApp', ['infinite-scroll'])
		   .controller('ImageListCtrl', ImageListCtrl);
})();