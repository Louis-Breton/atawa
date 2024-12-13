$(document).ready(function(){
  setTimeout(function(){
    $('.image-gallery_sub-slide').each(function(){
      var thumbNo = $(this).index();
      console.log(thumbNo);
      $(this).on('click', function(){
        $('.image-gallery_main').find('.w-slider-dot').eq(thumbNo-1).click();
      });
    });
  }, 250); // 250 milliseconds delay
});
