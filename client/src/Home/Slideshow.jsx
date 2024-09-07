// Slideshow.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slideshowImages = [
  { src: '/path/to/image1.jpg', alt: 'Image 1' },
  { src: '/path/to/image2.jpg', alt: 'Image 2' },
  { src: '/path/to/image3.jpg', alt: 'Image 3' },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

function Slideshow() {
  return (
    <div className="p-6">
      <Slider {...settings}>
        {slideshowImages.map((image, index) => (
          <div key={index}>
            <img src={image.src} alt={image.alt} className="w-[100px] h-[100px]" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Slideshow;
