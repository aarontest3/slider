/**
 * Created by madbid on 7/13/14.
 */


var Slider = function() {
    "use strict";

    var container;
    var slider;
    var sliderWidth;
    var scrollWidth

    var slides = [];
    var slideWidth;

    var nearingEnd = false;

    return {
        getContainer:getContainer,
        getSlider:getSlider,
        getSliderWidth:getSliderWidth,
        getSlideWith:getSlideWidth,
        getNumSlides:getNumSlides,
        getScrollWidth:getScrollWidth,
        apply:apply,
    }

    //getters
    function getContainer()   { return container;     }
    function getSlider()      { return slider;        }
    function getSliderWidth() { return sliderWidth;   }
    function getNumSlides()   { return slides.length; }
    function getSlideWidth()  { return slideWidth;    }
    function getScrollWidth() { return scrollWidth;   }
	
	function snap(direction) {

		var $scrollLeft = slider[0].scrollLeft;
		var lastSlideVisibleLen = sliderWidth % slideWidth;
		var lastSlideHiddenLen = $scrollLeft - lastSlideVisibleLen;
		var offset = $scrollLeft % slideWidth;

		slider.animate({ scrollLeft : wholeScroll(direction) }, 100);

		function wholeScroll(dir) {
			var distance;
			if(dir === "left") {
				if(offset === 0) {
                    distance = $scrollLeft + sliderWidth - lastSlideVisibleLen;
				} else {
                   distance = ($scrollLeft - (slideWidth - offset)) + sliderWidth - lastSlideVisibleLen;
                    //distance = ($scrollLeft + sliderWidth + offset);
                }
			} else {
				if(offset === 0) {
                    distance = $scrollLeft - sliderWidth + lastSlideVisibleLen;
                } else {
                    distance = ($scrollLeft - sliderWidth + lastSlideVisibleLen) - offset;
                }
			}
			return distance
		}

        function slideScroll(dir) {
            var distance;
            if(dir === "left") {
                distance = (offset !== 0) ? $scrollLeft + slideWidth - offset : $scrollLeft + slideWidth;
            } else {
                distance = (offset !== 0) ? $scrollLeft - offset  : $scrollLeft - slideWidth;
            }
            return distance
        }

	}
	
	function decideSnap() {
		var $scrollLeft = slider[0].scrollLeft;
		var lastSlideVisibleLen = sliderWidth % slideWidth;
		var lastSlideHiddenLen = $scrollLeft - lastSlideVisibleLen;
		var offset = $scrollLeft % slideWidth;
		
		var firstSlideHiddenLen = ($scrollLeft % sliderWidth) % slideWidth;

		
		if(firstSlideHiddenLen !== 0) {
			if(firstSlideHiddenLen > (slideWidth/2)) {
				snap("left")
			} else {
				snap("right")
			}
		}
	}
	
	function addListeners(slider, container) {
		slider.on('click', function () {
            decideSnap();
        });
		
		slider.on('swipeleft', function () {
            snap("left");
        });

        slider.on('swiperight', function () {
            snap("right" );
        });

        container.find("button.forward").on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            snap("left");
        });

        container.find("button.back").on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            snap("right");
        });

		slider.on('scroll', function () {

            var scrollLeft = slider[0].scrollLeft;
            var scrollWidth = slider[0].scrollWidth;

            if(scrollLeft + slider.width() > scrollWidth - sliderWidth ) {
                if(nearingEnd === false) {
                    console.log("approaching the end");
                }
                nearingEnd = true;
            } else {
                nearingEnd = false;
            }

            if (scrollLeft > 0) {
                container.find("button.back").removeClass("disabled");
            } else {
                container.find("button.back").addClass("disabled");
            }

            if(scrollLeft + sliderWidth > scrollWidth) {
                if(!container.find("button.forward").hasClass("disabled")) {
                    container.find("button.forward").addClass("disabled");
                }
            } else {
                if(container.find("button.forward").hasClass("disabled")) {
                    container.find("button.forward").removeClass("disabled");
                }
            }
        });
	}
		
    //pass the parent container
    function apply(c) {

        container = c;
        /* slider = container.children().eq(0); */
		slider = container.find(".slider");
        sliderWidth = slider.width();

        scrollWidth = slider[0].scrollWidth;
        slides = slider.children();
        slideWidth = slider.children().eq(0).width();
		
		addListeners(slider, container);

    }

};