'use strict';

angular.module('core').directive('tdSort', ['$compile', '$state', '$timeout', function ($compile, $state, $timeout) {
    return {
        restrict: 'A', // allow as an element; the default is only an attribute
        scope: {
            'ngModel': '=',
            'ngDirection': '=',
            'ngSortBy': '@',
            'ngSortByFunct': '='
        },
        link: function (scope, element, attrs) {
            var arrowD = '<span class="glyphicon glyphicon-sort-by-attributes glyph-active"></span>';//'<i class="fa fa-arrow-down"></i>';
            var arrowU = '<span class="glyphicon glyphicon-sort-by-attributes-alt glyph-active"></span>';//'<i class="fa fa-arrow-up"></i>';
            var noArrow = '<span class="glyphicon glyphicon-sort glyph-non-active"></span>';//'<i class="fa fa-minus"></i>';
            var destroyWatch = false;

            if (_.isFunction(scope.ngSortByFunct)) {
                scope.ngSortBy = scope.ngSortByFunct;
            }

            scope.arrowHtml = noArrow;
            scope.ngDirection = false;

            var el = $compile('<div data-ng-bind-html="arrowHtml" class="pull-right"></div>')(scope);
            element.append(el);

            element.on('mousedown', function (value) {
                $timeout(function () {
                    scope.ngModel = scope.ngSortBy;
                    watchAfter();

                    if (scope.arrowHtml === arrowD) {
                        scope.arrowHtml = arrowU;
                        scope.ngDirection = true;
                    } else {
                        scope.arrowHtml = arrowD;
                        scope.ngDirection = false;
                    }
                });
            });

            function watchAfter () {
                if (!destroyWatch) {
                    destroyWatch = scope.$watch('ngModel', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            scope.arrowHtml = noArrow;
                            destroyWatch();
                            destroyWatch = false;
                        }
                    });
                }
            }
        }
    };
}]);
