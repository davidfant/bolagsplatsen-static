var app = angular.module('addAdApp', ['ngRoute', 'OAWA.Directives.AutoSave', 'OAWA.Directives.TreeSelector','blueimp.fileupload', 'localytics.directives']);


app.controller('MainCtrl', ['$http', '$scope', '$attrs', function ($http, $scope, $attrs) {
    $scope.ad = {};
    $scope.saveStatus = "";

    var get = function() {
        return $http.get('/api/private/ad', { params: { id: $attrs.adId, c: new Date().getTime() } }).then(function (response) {
            $scope.ad = response.data.ad;
            $scope.ad.images = response.data.images;
            $scope.ad.documents = response.data.documents;
            $scope.ad.images_queue = [];
            $scope.ad.documents_queue = [];
            $scope.ad.places = response.data.places;
            $scope.ad.place_paths = response.data.place_paths;
            $scope.ad.categories = response.data.categories;

            var category_paths = [];
            angular.forEach(response.data.category_paths, function(path, key) {
                var restrictCategoryPosition = path.map(function(x) {return x.id; }).indexOf(response.data.ad.category_restrict_id);
                this.push(path.splice(0, restrictCategoryPosition));
            }, category_paths);

            $scope.ad.category_paths = category_paths;
            $scope.ad.is_business = ($scope.ad.category_root_id == 2);
            $scope.ad.business = response.data.business;
            $scope.ad.is_franchise = (response.data.ad.category_root_id == 11);
            $scope.ad.franchise = response.data.franchise;
            $scope.ad.is_realestate = (response.data.ad.category_root_id == 12);
            $scope.ad.is_realestate_realestate = (response.data.ad.category_restrict_id == 288);
            $scope.ad.is_realestate_land = (response.data.ad.category_restrict_id == 296);
            $scope.ad.is_realestate_lease = (response.data.ad.category_restrict_id == 304);
            $scope.ad.realestate = response.data.realestate;
            $scope.ad.is_capital = (response.data.ad.category_root_id == 4);
            $scope.ad.capital = response.data.capital;
            $scope.ad.is_customer_admin = (response.data.customer_users.length > 0);
            $scope.ad.customer_users = response.data.customer_users;

            if(response.data.places.length) {
                $scope.ad.country = response.data.places[0].id
            }
            
            $scope.edit = $("body").hasClass("admin");


        }, function(errResponse) {
            console.log('Error while fetching ad');
        });
    };

    $scope.$watch('ad.categories', function () {
        if ($scope.ad.categories) {
            $scope.ad.is_business_hotel = $.grep($scope.ad.categories, function (category) { return (category.id >= 137 && category.id <= 147); });
            $scope.ad.is_business_store = $.grep($scope.ad.categories, function (category) { return (category.id >= 148 && category.id <= 179); });
            $scope.ad.is_business_beauty_salon = $.grep($scope.ad.categories, function (category) { return (category.id == 129 || category.id == 130); });
            $scope.ad.is_business_restaurant = $.grep($scope.ad.categories, function (category) { return (category.id >= 113 && category.id <= 127); });
        }
    });

    $scope.partialSave = function () {
        return $http.put('/api/private/ad', $scope.ad);
    };

    $scope.submitForm = function () {
        $scope["add-ad-form"].$submitted = true;

        if ($scope["add-ad-form"].$valid) {
            $http.put('/api/private/ad', $scope.ad).
            success(function (data, status, headers, config) {
                location.href = "/lagg-in-annons/steg-4";
            }).
            error(function (data, status, headers, config) {
                console.log('Error while saving ad');
            });
        } else {
            $('html, body').animate({ scrollTop: $(".ng-invalid:not(form)").first().parents(".field").offset().top - 50 }, 500);
        }
    };

    $scope.isInvalid = function(field){
        return $scope["add-ad-form"][field] && $scope["add-ad-form"][field].$invalid && ($scope["add-ad-form"][field].$dirty || $scope["add-ad-form"].$submitted);
    };

    get();

    $http.get("/api/public/places", {params: {"parent-id": 1, c: new Date().getTime()}}).then(function(response) {
        if(response.data.length)
        {
            $scope.countries = response.data;
        }
    }, function(errResponse) {
        console.log('Error while fetching tree');
    });

    $scope.result_options = [
        { label: 'Vinst', value: '+' },
        { label: 'Förlust', value: '-' }
    ];

    $scope.stars_options = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 }
    ];

}]);

app.controller('UploadDocumentFileController', [
    '$scope', '$http',
    function ($scope, $http) {
        $scope.options = {
            url: "/api/public/upload_document"
        };

        // File is uploaded
        $scope.$on('fileuploaddone', function(e, data){
            $scope.ad.documents_queue.push(data.result.files[0]);
        });

        $scope.deleteDocument = function(index){
            $scope.ad.documents.splice(index, 1);
        };
    }
]);

app.controller('UploadImageFileController', [
    '$scope', '$http',
    function ($scope, $http) {
        $scope.options = {
            url: "/api/public/upload_image"
        };

        // File is uploaded
        $scope.$on('fileuploaddone', function(e, data){
            data.result.files[0]["order"] = 2;
            $scope.ad.images_queue.push(data.result.files[0]);
        });

        $scope.deleteImage = function(index){
            $scope.ad.images.splice(index, 1);
        };
    }
]);

app.controller('UploadDeleteDocumentFileController', [
    '$scope', '$http', '$filter',
    function ($scope, $http, $filter) {
        var file = $scope.file,
            state;
        if (file.url) {
            file.$state = function () {
                return state;
            };
            file.$destroy = function () {

                for(var i = $scope.ad.documents_queue.length; i--;)
                {
                    if($scope.ad.documents_queue[i].name === file.name)
                    {
                        $scope.ad.documents_queue.splice(i, 1);
                    }
                }

                $scope.clear(file);
                state = 'resolved';
            };
        } else if (!file.$cancel && !file._index) {
            file.$cancel = function () {
                $scope.clear(file);
            };
        }
    }
]);

app.controller('UploadDeleteImageFileController', [
    '$scope', '$http', '$filter',
    function ($scope, $http, $filter) {
        var file = $scope.file,
            state;
        if (file.url) {
            file.$state = function () {
                return state;
            };
            file.$destroy = function () {

                for(var i = $scope.ad.images_queue.length; i--;)
                {
                    if($scope.ad.images_queue[i].name === file.name)
                    {
                        $scope.ad.images_queue.splice(i, 1);
                    }
                }

                $scope.clear(file);
                state = 'resolved';
            };

        } else if (!file.$cancel && !file._index) {
            file.$cancel = function () {
                $scope.clear(file);
            };
        }
    }
]);

app.controller('UploadSelectImageFileController', [
    '$scope',
    function ($scope) {
        var file = $scope.file;

        file.$change = function () {
            for(var i = $scope.ad.images_queue.length; i--;)
            {
                if($scope.ad.images_queue[i].name !== file.name)
                {
                    $scope.ad.images_queue[i].order = 2;
                }
            }

            for(var i = $scope.ad.images.length; i--;)
            {
                if($scope.ad.images[i].source !== file.source)
                {
                    $scope.ad.images[i].order = 2;
                }
            }
        };
    }
]);

app.directive('validNumber', function(){
return {
        require: 'ngModel',
        priority: 1,
        link: function(scope, elm, attrs, ctrl){
            var validator = function(value){
                if (value == '' || value == null || typeof value == 'undefined') {
                    if(attrs.required)
                    {
                        ctrl.$setValidity('required', false);
                    }
                    else
                    {
                        ctrl.$setValidity('required', true);
                    }
                } else {
                    ctrl.$setValidity('number', /^([0-9]+)([,\.][0-9]+)?$/.test(value));
                    ctrl.$setValidity('required', true);
                }
                return value;
            };

            // replace all other validators!
            ctrl.$parsers = [validator];
            ctrl.$formatters = [validator];
        }
    }
});

app.directive('validPlace', function(){
return {
        require: 'ngModel',
        priority: 1,
        link: function(scope, elm, attrs, ctrl){
            var validator = function(value){
                if (value == '' || value == null || typeof value == 'undefined') {
                    ctrl.$setValidity('place', false);
                } else {
                    var validPlace = false;
                    for (i = 0; i < value.length; i++) { 
                        if(value[i].id != 190) {
                            validPlace = true;
                        }
                    }
                    ctrl.$setValidity('place', validPlace);
                    ctrl.$setValidity('required', true);
                }
                return value;
            };

            // replace all other validators!
            ctrl.$parsers = [validator];
            ctrl.$formatters = [validator];
        }
    }
});
