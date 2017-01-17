// For reference, keeping the pure JS we replaced when adding jQuery to compare
// differences. Faster than using a git time machine.
//
// var pointsArray = document.getElementsByClassName('point');

// var animatePoints = function(points) {
var animatePoints = function() {

  // var revealPoint = function(point) {
  //   point.style.opacity = 1;
  //   point.style.transform = "scaleX(1) translateY(0) translateX(0)";
  //   point.style.msTransform = "scaleX(1) translateY(0) translateX(0)";
  //   point.style.WebkitTransform = "scaleX(1) translateY(0) trnslateX(0)";
  // };

  var revealPoint = function() {
    $(this).css({
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  };

  // forEach(points, revealPoint);

  $.each($('.point'), revealPoint);

}

$(window).load(function() {
  // if (window.innerHeight > 950) {
  //   animatePoints(pointsArray);
  // }

  if ($(window).height() > 950) {
    animatePoints();
  }

  // var sellingPoints = document.getElementsByClassName('selling-points')[0];
  // var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  // window.addEventListener('scroll', function(event) {
  //   if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
  //     animatePoints(pointsArray);
  //   }
  // });

  $(window).scroll(function(event) {
    if ($(window).scrollTop() >= scrollDistance) {
      animatePoints();
    }
  });

});
