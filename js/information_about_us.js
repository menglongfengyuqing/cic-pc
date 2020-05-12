/**
 * Created by fern on 2018/11/6.
 */
$(document).ready(function() {

    $('.fancybox').fancybox();

    /*营业执照*/
    $("#module_01").click(function() {

        $.fancybox.open({
            "href": "images/disclosure/pic_01.jpg",
            "title": "营业执照"
        });

    });
    // tab

  
});
$(".information-banner li").click(function () {
    $(this).addClass('cur').siblings().removeClass('cur');
   $(".information-about-us-wrap .about-us-group").eq($(this).index()).addClass('cur').siblings().removeClass("cur");
});
var swiper = new Swiper('#swiper-01 .swiper-container', {
    pagination: '#swiper-01 .swiper-pagination',
    slidesPerView: 3,
    prevButton: '#swiper-01 .swiper-button-prev',
    nextButton: '#swiper-01 .swiper-button-next',
    spaceBetween: 30,
    observer:true,
    observeParents:true
});
var myswiper = new Swiper('#swiper-02 .swiper-container', {
    pagination: '#swiper-02 .swiper-pagination',
    slidesPerView: 3,
    prevButton: '#swiper-02 .swiper-button-prev',
    nextButton: '#swiper-02 .swiper-button-next',
    spaceBetween: 0,
    observer:true,
    observeParents:true
});


