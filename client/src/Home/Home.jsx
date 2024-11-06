import React from 'react';
import image1 from '../assets/student/image1.jpg';
import image2 from '../assets/student/image2.jpg';
import image3 from '../assets/sawirkamacalinka.svg'
import Slider from 'react-slick'; // Import Slider
import { FaPerson } from 'react-icons/fa6';
import homeimage from '../assets/homeimage.svg'

import { FaBook, FaBullseye, FaRocket, FaCheckCircle, FaRegLightbulb, FaHandsHelping, FaPeopleArrows, FaGraduationCap, FaLaptop, FaChartLine, FaTabletAlt } from 'react-icons/fa';
  
// import { FaBook, FaBullseye, FaRocket, FaCheckCircle, FaRegLightbulb, FaHandsHelping, FaPeopleArrows, FaGraduationCap, FaLaptop, FaChartLine, FaTabletAlt } from 'react-icons/fa';



const Home = () => {
  const values = [
    { title: "Ownership", description: "Encouraging stakeholders to take responsibility for their roles in the educational process." },
    { title: "Effectiveness and Efficiency", description: "Striving to maximize resources and deliver results that enhance student learning." },
    { title: "Quality", description: "Maintaining high standards in education to ensure exceptional outcomes for students." },
    { title: "Responsibility", description: "Fostering accountability among all education stakeholders." },
    { title: "Equity", description: "Ensuring fair access to educational opportunities for every student." },
    { title: "Participatory", description: "Promoting involvement from all community members in the educational journey." },
    { title: "Exemplary", description: "Setting high benchmarks for performance and behavior within the educational system." },
    { title: "Commitment", description: "Dedication to continuous improvement and student success." },
    { title: "Excellence", description: "Pursuing excellence in every aspect of education and administration." }
  ];

  const tips = [
    { title: "System Strengthening and Governance", description: "Implementing robust systems and frameworks to ensure effective governance.", icon: <FaChartLine size={40} className="text-[#2d1346]" /> },
    { title: "National Unity With Diversity", description: "Promoting national unity while celebrating cultural diversity.", icon: <FaHandsHelping size={40} className="text-[#2d1346]" /> },
    { title: "Quality Enhancement and Relevance to Job Market", description: "Ensuring educational programs are aligned with current job market demands.", icon: <FaRegLightbulb size={40} className="text-[#2d1346]" /> },
    { title: "Access, Equity and Internal Efficiency", description: "Enhancing access to education while ensuring fairness and efficiency.", icon: <FaPeopleArrows size={40} className="text-[#2d1346]" /> },
    { title: "Youth and Adult Non-Formal Education", description: "Providing alternative educational pathways for youth and adults.", icon: <FaGraduationCap size={40} className="text-[#2d1346]" /> },
    { title: "Digital Technology for Education Transformation", description: "Leveraging digital tools to enhance learning experiences.", icon: <FaLaptop size={40} className="text-[#2d1346]" /> },
    { title: "Enhanced Education and Training", description: "Continuous improvement of educational programs to meet evolving needs.", icon: <FaTabletAlt size={40} className="text-[#2d1346]" /> },
    { title: "Quality Assurance", description: "Maintaining high standards in education and training processes.", icon: <FaCheckCircle size={40} className="text-[#2d1346]" /> }
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };;
  return (
    <div className="font-sans">

    {/* Hero Section */}
    <div className="bg-indigo-500 h-[630px] text-white flex flex-col items-center -m-6 rounded-bl-[200px]">
  
      <main className="flex flex-col md:flex-row items-center justify-between w-full max-w-screen-lg mt-[100px] px-6">
        {/* Text Content */}
        <div className="text-center md:text-left space-y-6 md:w-1/2">
          <h2 className="text-5xl font-bold leading-tight">
            Take Your Learning <br /> To The Next Level.
          </h2>
          <p className="text-[17px] text-indigo-100">
            Gain critical student insights while freeing teachers from the pains of grading. Simply add Eduo to your learning platform.
          </p>
          <div className="flex justify-center md:justify-start space-x-6 mt-4">
            <button className="bg-white text-indigo-500 px-6 py-3 rounded-full font-semibold capitalize transition duration-300 hover:bg-indigo-100">
              Learn More
            </button>
            <button className="flex items-center text-indigo-200 space-x-2 hover:text-white">
              <span>What’s Eduo?</span>
              <span className="bg-indigo-700 p-2 rounded-full">▶</span>
            </button>
          </div>
        </div>
  
        {/* Image */}
        <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
          <div className="relative overflow-hidden p-6">
            <img
              src={homeimage} // Replace with actual image path
              alt="Woman with laptop"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </main>
  
      {/* Statistics Section */}
      <section className="flex justify-center space-x-9 mt-16">
        <div className="text-center bg-white text-[#01ff23] py-[30px] px-[20px] rounded-[20px] shadow-xl">
          <FaPerson size={35} />
          <p className="text-[20px] font-bold">16,032</p>
          <p className="text-sm">Schools</p>
        </div>
        <div className="text-center bg-white text-[#ff3939] py-[30px] px-[20px] rounded-[20px] shadow-xl">
          <FaPerson size={35} />
          <p className="text-[20px] font-bold">100M</p>
          <p className="text-sm">Users</p>
        </div>
        <div className="text-center bg-white text-indigo-800 py-[30px] px-[20px] rounded-[20px] shadow-xl">
          <FaPerson size={35} />
          <p className="text-[20px] font-bold">119</p>
          <p className="text-sm">Countries</p>
        </div>
      </section>
  
    </div>
  
    {/* About Us Section */}
    <div className="py-[100px]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center p-12">
        {/* Left Side - Image */}
        <div className="mb-8 lg:mb-0 lg:mr-8">
          <img 
            src={image3} 
            alt="About Us Image" 
            className="w-[400px] rounded-lg shadow-lg"
          />
        </div>
  
        {/* Right Side - Text Content */}
        <div className="flex-1 grid grid-cols-1 gap-6">
          <h2 className="text-2xl font-bold text-center mb-8">Our Educational Approach and Core Principles</h2>
  
          {/* Education Philosophy Card */}
          <div className="p-6 transition-shadow duration-300 hover:shadow-lg bg-white rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <FaBook className="mr-2 text-blue-500" />
              Education Philosophy
            </h3>
            <p>
              Competent citizens benefiting themselves and their country.
            </p>
          </div>
  
          {/* Vision Card */}
          <div className="p-6 transition-shadow duration-300 hover:shadow-lg bg-white rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <FaBullseye className="mr-2 text-green-500" />
              Vision
            </h3>
            <p>
              Quality and equitable education by 2030, producing capable citizens committed to their nation's prosperity.
            </p>
          </div>
  
          {/* Mission Card */}
          <div className="p-6 transition-shadow duration-300 hover:shadow-lg bg-white rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <FaRocket className="mr-2 text-red-500" />
              Mission
            </h3>
            <p>
              Nurturing execution capacity and ensuring quality education supported by technology from pre-elementary to secondary.
            </p>
          </div>
        </div>
      </div>
    </div>
  
    {/* Tips on Our Principles Section */}
    <section className="py-16 w-full bg-gray-50">
      <div className="max-w-[130rem] mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 uppercase">Tips on Our Principles / Types of Business Delivery</h2>
        <p className="text-lg mb-8">Discover our core principles that guide our approach to education and business delivery.</p>
      </div>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
        {tips.map((tip, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 h-[250px] rounded-lg shadow-lg hover:bg-[#b19d60] transition duration-300 transform hover:scale-105">
            <div className="mb-4">{tip.icon}</div>
            <div className="text-xl font-bold text-[#2d1346] mb-2">{tip.title}</div>
            <p className="text-gray-700 text-sm">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  
    {/* Footer Section */}
    <footer className="py-8 bg-indigo-700 text-white">
      <div className="text-center">© 2024 Somali Regional State Education Bureau</div>
    </footer>
  
  </div>
  
  );
};

export default Home;