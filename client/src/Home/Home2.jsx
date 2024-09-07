import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import photo1 from '../assets/photo1.svg';
import photo2 from '../assets/photo2.svg';
import photo3 from '../assets/photo3.svg';
import image1 from '../assets/student/image1.jpg';
import image2 from '../assets/student/image2.jpg';
import image3 from '../assets/student/image3.jpg';

// Custom arrow components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
    aria-label="Previous"
  >
    &#10094;
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-gray-800 text-white rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
    aria-label="Next"
  >
    &#10095;
  </button>
);

// Slideshow images
const slideshowImages = [
  { src: image1, alt: 'Image 1', caption: 'Unlock Your True Potential' },
  { src: image2, alt: 'Image 2', caption: 'Inspire and Achieve Greatness' },
  { src: image3, alt: 'Image 3', caption: 'Empower Your Team for Success' },
  { src: photo1, alt: 'Image 4', caption: 'Innovative HRM Strategies Await' },
//   { src: photo2, alt: 'Image 5', caption: 'Transformative Talent Management Workshops' },
//   { src: photo3, alt: 'Image 6', caption: 'Elevate Your Employee Engagement' },
];

// Slider settings
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  lazyLoad: 'ondemand',
  customPaging: (i) => (
    <div className="relative w-16 h-16">
      <img
        src={slideshowImages[i].src}
        alt={`thumbnail ${i + 1}`}
        className="w-full h-full object-cover rounded-full border-2 border-gray-300"
      />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slideshowImages[i].caption}
      </div>
    </div>
  ),
  appendDots: (dots) => (
    <div className="p-4">
      <ul className="flex justify-center space-x-2 group">{dots}</ul>
    </div>
  ),
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  pauseOnHover: true,
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSlideChange = (oldIndex, newIndex) => {
    setCurrentSlide(newIndex);
  };

  const handleClick = () => {
    setShowOverlay(!showOverlay);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4`}>
      <section className={`relative max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden ${isFullScreen ? 'w-screen h-screen' : ''}`}>
        <button
          onClick={toggleFullScreen}
          className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg focus:outline-none hover:bg-gray-700"
          aria-label={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        >
          {/* Fullscreen icon or text can be added here */}
        </button>
        <div className=''>
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to Our Teachers' System</h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore the benefits and features of our innovative and user-friendly
            platform.
          </p>
        <Slider
          {...settings}
          beforeChange={handleSlideChange}
          className="relative"
        >
          {slideshowImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                onClick={handleClick}
              />
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-roboto font-bold p-6 transition-opacity duration-700 ${currentSlide === index ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}>
                <p className="text-center">{image.caption}</p>
              </div>
            </div>
          ))}
        </Slider>
        </div>

        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">More Information</h2>
              <p>{slideshowImages[currentSlide].caption}</p>
              <button
                onClick={() => setShowOverlay(false)}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
