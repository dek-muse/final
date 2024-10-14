import React from 'react';
import image1 from '../assets/student/image1.jpg';
import image2 from '../assets/student/image2.jpg';
import image3 from '../assets/student/image3.jpg';
import mrabdullahiabdi from '../assets/about/mrabdullahiabdi.png'
import mrguledAhmedAli from '../assets/about/mrguledAhmedAli.png'
import MrMahamudHassan from '../assets/about/MrMahamudHassan.png'
import MrOmerAden from '../assets/about/MrOmerAden.png'
import MrMahamedMuseGure from '../assets/about/MrMahamedMuseGure.png'
import UgasFuadUgasAfi from '../assets/about/UgasFuadUgasAfi.png'
import { FaCheckCircle, FaRegLightbulb, FaHandsHelping, FaPeopleArrows, FaGraduationCap, FaLaptop, FaChartLine, FaTabletAlt } from 'react-icons/fa'; // Import icons



const Home = () => {
  const teamMembers = [
    {
      name: 'Mr. Abdullahi Abdi',
      role: 'Bureau Head',
      image: mrabdullahiabdi,
    },
    {
      name: 'Mr. Guled Ahmed Ali',
      role: 'Deputy Bureau Head',
      image: mrguledAhmedAli,
    },
    {
      name: 'Mr. Mahamud Hassan',
      role: 'Human Resource Management',
      image: MrMahamudHassan,
    },
    {
      name: 'Mr. Omer Aden',
      role: 'Deputy Bureau Head',
      image: MrOmerAden,
    },
    {
      name: 'Mr. Mahamed Muse Gure',
      role: 'Deputy Bureau Head',
      image: MrMahamedMuseGure,
    },
    {
      name: 'Ugas Fu\'ad Ugas Afi',
      role: 'School Improvement Program',
      image: UgasFuadUgasAfi,
    },
  ];
  return (
    <div className="font-sans  ">
      {/* Header Section */}
      
      {/* Hero Section */}
      <section className="h-auto md:h-[500px] flex flex-col md:flex-row items-center justify-between ">
        <div className="px-8 md:max-w-[50%] space-y-6 py-8 md:py-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase text-left ">
            Welcome to the Somali Regional State Education Bureau
          </h1>
          <p className="text-base md:text-lg text-left leading-relaxed">
            We’re dedicated to creating a vibrant educational environment for students, educators, and communities across the Somali region. Discover key resources, stay updated on our initiatives, and explore opportunities for professional growth. Our mission is to provide high-quality education that empowers learners and shapes a brighter future. Join us in advancing education and building a more inclusive tomorrow.
          </p>
          <div>
            <button className="bg-[#36736C]  font-semibold py-3 px-8 rounded transition duration-300 hover:bg-[#285a54]">
              Call Us
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-[50%] px-0 md:px-8 mt-6 md:mt-0">
          <img 
            src={image1} 
            alt="Hero Image" 
            className="object-cover h-[300px] md:h-[450px] w-full rounded-2xl shadow-lg" 
          />
        </div>
      </section>



      <div className=" py-[300px]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
        {/* Left Side - Image */}
        <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-8">
        <img 
              src={image2} 
              alt="About Us Image" 
              className="rounded-lg shadow-lg mx-auto"
            />
        </div>

        {/* Right Side - Text Content */}
         {/* Right Side - Text Content */}
         <div className="flex-1 grid grid-cols-1 gap-6">
          {/* Education Philosophy Card */}
          <h2 className="text-2xl font-bold text-center  mb-8">Our Educational Approach and Core Principles</h2>

          <div className=" p-6  transition-shadow duration-300">
            <h3 className="text-xl font-semibold  mb-2">Education Philosophy</h3>
            <p className="">
              Competent citizens benefiting themselves and their country.
            </p>
          </div>

          {/* Vision Card */}
          <div className=" p-6  transition-shadow duration-300">
            <h3 className="text-xl font-semibold  mb-2">Vision</h3>
            <p className="">
              Quality and equitable education by 2030, producing capable citizens committed to their nation's prosperity.
            </p>
          </div>

          {/* Mission Card */}
          <div className=" p-6  transition-shadow duration-300">
            <h3 className="text-xl font-semibold  mb-2">Mission</h3>
            <p className="">
              Nurturing execution capacity and ensuring quality education supported by technology from pre-elementary to secondary.
            </p>
          </div>

          {/* Values Card */}
          {/* <div className=" p-6  transition-shadow duration-300">
            <h3 className="text-xl font-semibold  mb-2">Values</h3>
            <ul className="list-disc list-inside ">
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
      {/* </div> */}
        
      </div>
    </div>


   {/* Values Section */}
<section className="py-16 ">
      <div className="max-w-[130rem] mx-auto text-center mb-1Z">
    <h2 className="text-4xl font-bold mb-4 uppercase ">Values of the Regional Education Bureau</h2>
        <p className="text-lg text-gray-600 mb-8">Our core values guide our mission and vision, ensuring a commitment to excellence in education.</p>

   </div>
  <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-8">
    {[
      {
        title: "Ownership",
        description: "Encouraging stakeholders to take responsibility for their roles in the educational process."
      },
      {
        title: "Effectiveness and Efficiency",
        description: "Striving to maximize resources and deliver results that enhance student learning."
      },
      {
        title: "Quality",
        description: "Maintaining high standards in education to ensure exceptional outcomes for students."
      },
      {
        title: "Responsibility",
        description: "Fostering accountability among all education stakeholders."
      },
      {
        title: "Equity",
        description: "Ensuring fair access to educational opportunities for every student."
      },
      {
        title: "Participatory",
        description: "Promoting involvement from all community members in the educational journey."
      },
      {
        title: "Exemplary",
        description: "Setting high benchmarks for performance and behavior within the educational system."
      },
      {
        title: "Commitment",
        description: "Dedication to continuous improvement and student success."
      },
      {
        title: "Excellence",
        description: "Pursuing excellence in every aspect of education and administration."
      }
    ].map((value, index) => (
      <div key={index} className="text-center p-6 h-[250px] rounded-lg shadow-lg  hover:bg-[#b19d60]  transition duration-300 transform hover:scale-105">
        <div className="text-2xl font-bold mb-2 dark:text-blue-600 text-[#2d1346]">{value.title}</div>
        <p className="  ">{value.description}</p>
      </div>
    ))}
  </div>
</section>

 
 {/* Tips on Our Principles Section */}
 <section className="py-16   w-full">
  <div className="max-w-[130rem] mx-auto text-center mb-1Z">
    <h2 className="text-4xl font-bold mb-4 ">TIPS ON OUR PRINCIPLES/TYPES OF BUSINESS DELIVERY</h2>
    <p className="text-lg  mb-8">Discover our core principles that guide our approach to education and business delivery.</p>
  </div>
  <div className="   grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-2">
    {[
      {
        title: "System Strengthening and Governance",
        description: "Implementing robust systems and frameworks to ensure effective governance.",
        icon: <FaChartLine size={40} className="dark:text-blue-600 text-[#2d1346]" />
      },
      {
        title: "National Unity With Diversity",
        description: "Promoting national unity while celebrating cultural diversity.",
        icon: <FaHandsHelping size={40} className="dark:text-blue-600 text-[#2d1346]" />
      },
      {
        title: "Quality Enhancement and Relevance to Job Market",
        description: "Ensuring educational programs are aligned with current job market demands.",
        icon: <FaRegLightbulb size={40} className="dark:text-blue-600 text-[#2d1346]" />
      },
      {
        title: "Access, Equity and Internal Efficiency",
        description: "Enhancing access to education while ensuring fairness and efficiency.",
        icon: <FaPeopleArrows size={40} className="dark:text-blue-600 text-[#2d1346]" />
      },
      {
        title: "Youth and Adult Non-Formal Education",
        description: "Providing alternative educational pathways for youth and adults.",
        icon: <FaGraduationCap size={40} className="dark:text-blue-600 text-[#2d1346] " />
      },
      {
        title: "Digital Technology for Education Transformation",
        description: "Leveraging digital tools to enhance learning experiences.",
        icon: <FaLaptop size={40} className="dark:text-blue-600 text-[#2d1346]" />
      },
      {
        title: "Enhanced Education and Training",
        description: "Continuous improvement of educational programs to meet evolving needs.",
        icon: <FaTabletAlt size={40} className="dark:text-blue-600 text-[#2d1346]" />
      },
      {
        title: "Quality Assurance",
        description: "Maintaining high standards in education and training processes.",
        icon: <FaCheckCircle size={40} className="dark:text-blue-600 text-[#2d1346]" />
      }
    ].map((tip, index) => (
      <div key={index} className="flex flex-col items-center text-center p-6 h-[250px] rounded-lg shadow-lg   hover:bg-[#b19d60] transition duration-300 transform hover:scale-105">
        <div className="flex items-center mb-4">
          <div className="mr-2">{tip.icon}</div>
          <div className="text-xl font-bold text-blue-[700]">{tip.title}</div>
        </div>
        <p className="text-gray-[700] text-sm">{tip.description}</p>
      </div>
    ))}
  </div>
</section>

    

 



      <div className="py-8">
      <h2 className="text-3xl font-bold text-center  mb-8">Our Expert Team</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center">
            <img
              className="w-40 h-40 rounded-full mx-auto"
              src={member.image}
              alt={member.name}
            />
            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
            <p className="">{member.role}</p>
            <div className="flex justify-center mt-4 space-x-4">
              <a href="#" className="  hover:">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="  hover:">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="  hover:">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="  hover:">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>


      {/* Footer Section */}
      <footer className="   py-8">
        <div className="text-center">© 2024 Somali Regional State Education Bureau</div>
      </footer>
    </div>
  );
};

export default Home;