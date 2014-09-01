(function () {
"use strict";

	function ImageListCtrl ($http) {
		var vm = this,
			lock = false,
		    offset = 0;
		   			
		   	vm.photos = [];

		   	// Handle scrolling
	   		vm.scroll = function () {
	   			var height = document.querySelector('.image-list').offsetHeight,
	   				scrollPos = documentScrollTop();

	   			if(((height - scrollPos) < 2000) &! lock){
	   				vm.addMoreItems();
	   			}
	   		};

	   		// Fetch items from Tumblr
	   		vm.addMoreItems = function () {
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

	   		// Take user to original post
	   		vm.goToPost = function (index) {
				window.location.href = vm.photos[index].postUrl;
			}

	   		// Retrieve photo urls
	   		function getPhotoUrls (result) {
				for (var index in result.posts){
					var post = result.posts[index];
					var photo = { 
						"imgUrl" : post.photos[0].original_size.url,
						"postUrl" : post.post_url
					};

			 		vm.photos.push(photo);
				}
			};

			// Scroll helper
			function documentScrollTop () {
			     return (document.documentElement.scrollTop + document.body.scrollTop
			     == document.documentElement.scrollTop) ?
			     document.documentElement.scrollTop : document.body.scrollTop;
			}; 
	};

	angular.module('classyApp', ['infinite-scroll'])
		   .controller('ImageListCtrl', ImageListCtrl);
})();