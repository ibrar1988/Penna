angular.module('pennaApp').directive('gridMasonry', function(){
   return {
       restrict : 'A',
       link : function( $scope, $element,$attr){
           angular.element($element).masonry({
              gutter: 10,
              itemSelector: '.grid-item',
              percentPosition: true
            });
       }
   }; 
});
