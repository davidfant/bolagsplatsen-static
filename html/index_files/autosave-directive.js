angular.module('OAWA.Directives.AutoSave', [])
    .directive('autoSave', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                require: 'form',
                scope: {
                    autoSaveModel: '=',
                    autoSaveFn: '=',
                    autoSaveStatus: '='
                },
                link: function($scope, $element, $attrs) {
                    var timeout = null;

                    $scope.autoSaveStatus = "Sparat";

                    function save(newVal, oldVal) {
                            if (newVal != oldVal) {
                                $scope.autoSaveStatus = "Sparar annonsen...";
                                if (timeout) {
                                    $timeout.cancel(timeout)
                                }
                                timeout = $timeout(saveUpdates, 1000); // 1000 = 1 second
                            }
                    }

                    function saveUpdates(newVal, oldVal) {
                            var promise = $scope.autoSaveFn();
                            promise.then(function() {
                                $scope.autoSaveStatus = "Annonsen är sparad";
                            }, function(reason) {
                                $scope.autoSaveStatus = "Kunde inte spara";
                                $('#curtain').css( "display", "block");
                                $('#popup-save-error').fadeIn('fast');
                            });
                    }

                    $scope.$watch('autoSaveModel', save, true);
                }
            }
        }
    ]);
