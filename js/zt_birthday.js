$(document).ready(function(){



    $('.jQ_sliderPrev').on('click', function(){
        $('#img-slider').roundabout('animateToNextChild');

        return false;
    });

    $('.jQ_sliderNext').on('click', function(){
        $('#img-slider').roundabout('animateToPreviousChild');

        return false;
    });

    $('body').on('keyup', function(e) {
        var keyCode = e.which || e.keyCode;

        if(keyCode == 37) {
            $('#img-slider').roundabout('animateToPreviousChild');
            e.preventDefault();
            return false;
        } else if(keyCode == 39) {
            $('#img-slider').roundabout('animateToNextChild');
            e.preventDefault();
            return false;
        }
    });

    $('.jQ_sliderSwitch li').on('click', function() {
        var $elem = $(this);
        var index = $elem.index();

        $('#img-slider').roundabout('animateToChild', index);

        return false;
    });

    $('#img-slider').roundabout({
             minScale: 0.4,
        maxScale: 0.9,
        duration: 1000,//运动速度
        minOpacity: 0,
       maxOpacity: 1,
       autoplayDuration: 2000,// 自动播放的时间
     autoplay:true,
     enableDrag:true
    }).bind({
        animationEnd: function(e) {
            var index = $('#img-slider').roundabout('getChildInFocus');
            $('.jQ_sliderSwitch li').removeClass('active');
            $('.jQ_sliderSwitch li').eq(index).addClass('active');
        }
    });

});