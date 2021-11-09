angular.module('OAWA.Directives.TreeSelector', [])
.directive('treeSelector', function($compile) {
    return {
      restrict : 'A',
      require: "ngModel",
      templateUrl: '/js/app/treeselector/tree-selector.html',
      scope: {
      paths: '=',
      url: '@url',
      rootId: '=',
      maxItems: '@maxItems',
      title: '@title'
      },
      link: function($scope, $element, $attrs, $ctrl) {

        $scope.notEqual = function(value, expected) {
          if (value != expected)
          {
              return true;
          }
        }

        $scope.deletePath = function(index) {
          $scope.paths.splice(index,1);
          $scope.updateItems();
        }

        $scope.add = function(index) {
          $scope.paths.push([{"id":0,"parent_id":$scope.rootId,"start":0,"end":0}]);
          $scope.updateItems();
        }

        $scope.updateItems = function()
        { 
          var items = [];
          for(var i=0; i<$scope.paths.length; i++)
          {
            for(var j=0; j<$scope.paths[i].length; j++)
            {
              var item = $scope.paths[i][j];
              if(item.id != 0)
              {
                items.push({"id": item.id, "start": item.start, "end": item.end});
                break;
              }
            }
          }

          $ctrl.$setViewValue(items);
        }      
                        
        // add a parser that will process each time the value is 
        // parsed into the model when the user updates it.
        $ctrl.$parsers.unshift(function(value) {
            // test and set the validity after update.
            var valid = false;
            if(value.length >= 1)
            {
              valid = true;
            }

            $ctrl.$setValidity('tree', valid);
           
            // if it's valid, return the value to the model, 
            // otherwise return undefined.
            return valid ? value : [];
        });

        // add a formatter that will process each time the value 
        // is updated on the DOM element.
        $ctrl.$formatters.unshift(function(value) {

            var valid = false;

            if(value instanceof Array && value.length >= 1)
            {
              valid = true;
            }

            $ctrl.$setValidity('tree', valid);
            
            // return the value or nothing will be written to the DOM.
            return value;
        });
      }
    }
})
.directive('node', function ($http, $timeout) {
    return {
      restrict : 'A',
        link: function($scope, $element, $attrs) {
            $element.on('change', function(event) {
              var orgItem = $.grep($scope.items, function(item){ return (item.id == $scope.item.id); })[0];
              $scope.item.start = orgItem.start;
              $scope.item.end = orgItem.end;
              $scope.item.title = orgItem.title;
              $scope.item.alias = orgItem.alias;
              if($scope.item.id != null)
              {
                for (var i = $scope.path.length - 1; i >= 0; i--) {
                  if ($scope.path[i].id==$scope.item.id) {
                    $scope.path.splice(0, i);  
                    break;
                  }
                }

              $http.get($scope.url, {params: {"parent-id": $scope.item.id, c: new Date().getTime()}}).then(function(response) {
                    if(response.data.length)
                    {
                        $scope.path.unshift({"id":0,"parent_id":$scope.item.id});
                    }
                }, function(errResponse) {
                    console.log('Error while fetching tree');
                });

              }
              $scope.updateItems();
            });
        },
        controller: function($scope, $attrs) {
          var parentId = $scope.$eval($attrs.parentId);
          var defaultId = $scope.$eval($attrs.defaultId);

          $http.get($scope.url, {params: {"parent-id": parentId, c: new Date().getTime()}}).then(function(response) {

            $scope.items = response.data;
            $scope.items.unshift({"id":0, "title":"Alla"});
            //$scope.currentCategory = $.grep($scope.categories, function(category){ return (category.id == defaultId); })[0];
            
            }, function(errResponse) {
                console.log('Error while fetching tree');
            });
          
        }
    }
});
