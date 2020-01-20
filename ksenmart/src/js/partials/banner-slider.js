$(document).ready(function(){
    $('.banners-slider').slick({
      infinite: false,
      dots: false,
      prevArrow: '<button class="prev arrow"></button>',
      nextArrow: '<button class="next arrow"></button>',
      responsive: [
        {
            breakpoint: 1024,
            settings: {
          
              dots: true,
              // prevArrow: false,
              // nextArrow: false,
              arrows: false
              
            }
        },
        // {
        //     breakpoint: 600,
        //     settings: {
        //     slidesToShow: 2,
        //     slidesToScroll: 2
        //     }
        // },
        {
            breakpoint: 320,
            settings: {
              dots: true,
              prevArrow: false,
              nextArrow: false,
              arrows: false        
            }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ]
    });
  });