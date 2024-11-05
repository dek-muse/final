import React from 'react';
import image1 from '../assets/student/image1.jpg';
import image2 from '../assets/student/image2.jpg';
import image3 from '../assets/sawirkamacalinka.svg'
import Slider from 'react-slick'; // Import Slider

  
import { FaBook, FaBullseye, FaRocket, FaCheckCircle, FaRegLightbulb, FaHandsHelping, FaPeopleArrows, FaGraduationCap, FaLaptop, FaChartLine, FaTabletAlt } from 'react-icons/fa';



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
    <div className="font-sans  ">
      {/* Header Section */}
      
      {/* Hero Section */}
{/* Hero Section */}
<section className="h-auto md:h-[500px] flex flex-col md:flex-row items-center justify-between py-12 mt-12">
  <div className="px-8 md:max-w-[50%] space-y-6 py-8 md:py-0">
    <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase text-left">
      Welcome to the Somali Regional State Education Bureau
    </h1>
    <p className="text-base md:text-lg text-left leading-relaxed">
      We’re dedicated to creating a vibrant educational environment for students, educators, and communities across the Somali region. Discover key resources, stay updated on our initiatives, and explore opportunities for professional growth. Our mission is to provide high-quality education that empowers learners and shapes a brighter future. Join us in advancing education and building a more inclusive tomorrow.
    </p>
  </div>

  {/* Image Section */}
  <div className="w-full md:w-[50%] px-0 md:px-8 mt-6 md:mt-0 flex flex-col md:flex-row justify-between gap-12">
    {/* Left Image */}
    <div className="md:w-1/2 flex justify-center md:justify-start mb-4 md:mb-0">
      <img
        src={image1}
        alt="Hero Image 1"
        className="object-cover h-[300px] md:h-[450px] w-full rounded-2xl shadow-lg"
      />
    </div>

    {/* Right Images */}
    <div className="flex flex-col md:w-1/2">
      <div className="mb-4 flex justify-center">
        <img
          src={image2}
          alt="Hero Image 2"
          className="object-cover h-[200px] md:h-[250px] w-full rounded-2xl shadow-lg"
        />
      </div>
      <div className="flex justify-center">
        <img
          src={image3}
          alt="Hero Image 3"
          className="object-cover h-[200px] md:h-[250px] w-full rounded-2xl shadow-lg"
        />
      </div>
    </div>
  </div>
</section>




<div className="py-[300px]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center p-12">
        {/* Left Side - Image */}
        <div className="mb-8 lg:mb-0 lg:mr-8">
          <img 
            src={image3} 
            alt="About Us Image" 
            className="w-[400px]"
          />
        </div>

        {/* Right Side - Text Content */}
        <div className="flex-1 grid grid-cols-1 gap-6">
          {/* Education Philosophy Card */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Educational Approach and Core Principles</h2>

          <div className="p-6 transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <FaBook className="mr-2 text-blue-500" /> {/* Education Philosophy Icon */}
              Education Philosophy
            </h3>
            <p>
              Competent citizens benefiting themselves and their country.
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-6 transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <FaBullseye className="mr-2 text-green-500" /> {/* Vision Icon */}
              Vision
            </h3>
            <p>
              Quality and equitable education by 2030, producing capable citizens committed to their nation's prosperity.
            </p>
          </div>

          {/* Mission Card */}
          <div className="p-6 transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <FaRocket className="mr-2 text-red-500" /> {/* Mission Icon */}
              Mission
            </h3>
            <p>
              Nurturing execution capacity and ensuring quality education supported by technology from pre-elementary to secondary.
            </p>
          </div>

          {/* Uncomment Values Card if needed */}
          {/* <div className="p-6 transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Values</h3>
            <ul className="list-disc list-inside">
              <li>Ownership</li>
              <li>Effectiveness</li>
              <li>Quality</li>
              <li>Responsibility</li>
              <li>Equity</li>
              <li>Participatory</li>
              <li>Exemplary</li>
              <li>Commitment</li>
              <li>Excellence</li>
            </ul>
          </div> */}
        </div>
      </div>
    </div>


    {/* Tips on Our Principles Section */}
    <section className="py-16 w-full">
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
      <footer className="   py-8">
        <div className="text-center">© 2024 Somali Regional State Education Bureau</div>
      </footer>
    </div>
  );
};

export default Home;