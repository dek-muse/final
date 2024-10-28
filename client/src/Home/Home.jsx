import React from 'react';
import image1 from '../assets/student/image1.jpg';
import image2 from '../assets/student/image2.jpg';
import mrabdullahiabdi from '../assets/about/mrabdullahiabdi.png';
// import mrguledAhmedAli from '../assets/about/mrguledAhmedAli.png';
import MrMahamudHassan from '../assets/about/MrMahamudHassan.png';
import MrOmerAden from '../assets/about/MrOmerAden.png';
import MrMahamedMuseGure from '../assets/about/MrMahamedMuseGure.png';
import UgasFuadUgasAfi from '../assets/about/UgasFuadUgasAfi.png';
import { FaCheckCircle, FaRegLightbulb, FaHandsHelping, FaPeopleArrows, FaGraduationCap, FaLaptop, FaChartLine, FaTabletAlt } from 'react-icons/fa';

const Home = () => {
  const teamMembers = [
    { name: 'Mr. Abdullahi Abdi', role: 'Bureau Head', image: mrabdullahiabdi },
    // { name: 'Mr. Guled Ahmed Ali', role: 'Deputy Bureau Head', image: mrguledAhmedAli },
    { name: 'Mr. Mahamud Hassan', role: 'Human Resource Management', image: MrMahamudHassan },
    { name: 'Mr. Omer Aden', role: 'Deputy Bureau Head', image: MrOmerAden },
    { name: 'Mr. Mahamed Muse Gure', role: 'Deputy Bureau Head', image: MrMahamedMuseGure },
    { name: "Ugas Fu'ad Ugas Afi", role: 'School Improvement Program', image: UgasFuadUgasAfi },
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="h-auto md:h-[500px] flex flex-col md:flex-row items-center justify-between">
        <div className="px-8 md:max-w-[50%] space-y-6 py-8 md:py-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase text-left">
            Welcome to the Somali Regional State Education Bureau
          </h1>
          <p className="text-base md:text-lg text-left leading-relaxed">
            We’re dedicated to creating a vibrant educational environment for students, educators, and communities across the Somali region.
          </p>
          <div>
            <button className="bg-[#36736C] font-semibold py-3 px-8 rounded transition duration-300 hover:bg-[#285a54]">
              Call Us
            </button>
          </div>
        </div>
        {/* Image Section */}
        <div className="w-full md:w-[50%] px-0 md:px-8 mt-6 md:mt-0">
          <img src={image1} alt="Hero" className="object-cover h-[300px] md:h-[450px] w-full rounded-2xl shadow-lg" />
        </div>
      </section>

      {/* About Section */}
      <div className="py-32">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="flex-shrink-0 mb-8 lg:mb-0 lg:mr-8">
            <img src={image2} alt="About Us" className="rounded-lg shadow-lg mx-auto" />
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-8">Our Educational Approach and Core Principles</h2>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Education Philosophy</h3>
              <p>Competent citizens benefiting themselves and their country.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Vision</h3>
              <p>Quality and equitable education by 2030, producing capable citizens committed to their nation's prosperity.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Mission</h3>
              <p>Nurturing execution capacity and ensuring quality education supported by technology from pre-elementary to secondary.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 uppercase">Values of the Regional Education Bureau</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our core values guide our mission and vision, ensuring a commitment to excellence in education.
          </p>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {[
            { title: "Ownership", description: "Encouraging stakeholders to take responsibility for their roles." },
            { title: "Effectiveness and Efficiency", description: "Striving to maximize resources for learning." },
            { title: "Quality", description: "Maintaining high standards in education for exceptional outcomes." },
            { title: "Responsibility", description: "Fostering accountability among all stakeholders." },
            { title: "Equity", description: "Ensuring fair access to education for every student." },
            { title: "Participatory", description: "Promoting community involvement in education." },
            { title: "Exemplary", description: "Setting high benchmarks within the educational system." },
            { title: "Commitment", description: "Dedication to continuous improvement and student success." },
          ].map((value, index) => (
            <div key={index} className="text-center p-6 rounded-lg shadow-lg hover:bg-[#b19d60] transition duration-300 transform hover:scale-105">
              <h3 className="text-2xl font-bold text-[#2d1346] mb-2">{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">TIPS ON OUR PRINCIPLES/TYPES OF BUSINESS DELIVERY</h2>
          <p className="text-lg mb-8">
            Discover our core principles that guide our approach to education and business delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {[
            { title: "System Strengthening and Governance", description: "Effective governance systems.", icon: <FaChartLine size={40} className="text-[#2d1346]" /> },
            { title: "National Unity With Diversity", description: "Promoting unity while celebrating diversity.", icon: <FaHandsHelping size={40} className="text-[#2d1346]" /> },
            { title: "Quality Enhancement", description: "Aligning education with job market demands.", icon: <FaRegLightbulb size={40} className="text-[#2d1346]" /> },
            { title: "Access and Equity", description: "Ensuring fairness and efficiency in education.", icon: <FaPeopleArrows size={40} className="text-[#2d1346]" /> },
            { title: "Youth and Adult Education", description: "Alternative pathways for lifelong learning.", icon: <FaGraduationCap size={40} className="text-[#2d1346]" /> },
            { title: "Digital Technology", description: "Enhancing learning through digital tools.", icon: <FaLaptop size={40} className="text-[#2d1346]" /> },
          ].map((tip, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg shadow-lg hover:bg-[#b19d60] transition duration-300 transform hover:scale-105">
              <div className="mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold">{tip.title}</h3>
              <p>{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Expert Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img className="w-40 h-40 rounded-full mx-auto" src={member.image} alt={member.name} />
              <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
