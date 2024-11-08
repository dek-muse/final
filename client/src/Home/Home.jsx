import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { FaBook, FaBullseye, FaRocket, FaCheckCircle, FaHandsHelping, FaRegLightbulb, FaBalanceScale, FaUsers, FaStar, FaRegHandshake, FaFlag, FaMedal, FaMale, FaFemale, FaRegGrin } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import homeimage from '../assets/homeimage.svg';
 
// Ensure the file exists and path is correct

import { NavLink } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Animated count component
const AnimatedCount = ({ count }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: count,
    delay: 200,
    config: { tension: 150, friction: 14, duration: 3000 }
  });
  return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>;
};

const Home = () => {
  const [teachers, setTeachers] = useState([]);
  const [counts, setCounts] = useState({
    sex: { Male: 0, Female: 0 },
    nativeStatus: { Region: 0, 'Non-region': 0 },
    teacherType: { Primary: 0, Preprimary: 0, Secondary: 0, College: 0, Boarding: 0 },
    retirementStatus: { active: 0, retired: 0 },
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to indicate if data is being fetched
  const [inView, setInView] = useState(false); // State to track section visibility
  const countSectionRef = useRef(null); // Reference for the count section

  useEffect(() => {
    // Fetch teacher data
    const fetchTeachersData = async () => {
      try {
        const response = await axios.get('https://finalbakend.vercel.app/');
        if (Array.isArray(response.data)) {
          setTeachers(response.data);
          setCounts(processCounts(response.data)); 
        } else {
          throw new Error('Invalid data format'); // Trigger error if data is invalid
        }
      } catch (err) {
        setError('Sorry, there was an issue fetching the data.');
        setCounts({
          sex: { Male: 0, Female: 0 },
          nativeStatus: { Region: 0, 'Non-region': 0 },
          teacherType: { Primary: 0, Preprimary: 0, Secondary: 0, College: 0, Boarding: 0 },
          retirementStatus: { active: 0, retired: 0 },
        }); // Set default values (0) if error occurs
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchTeachersData();
  }, []);

  const processCounts = (data) => {
    const counts = {
      sex: { Male: 0, Female: 0 },
      nativeStatus: { Region: 0, 'Non-region': 0 },
      teacherType: { Primary: 0, Preprimary: 0, Secondary: 0, College: 0, Boarding: 0 },
      retirementStatus: { active: 0, retired: 0 },
    };

    const updateCount = (category, item) => {
      if (item) counts[category][item] = (counts[category][item] || 0) + 1;
    };

    data.forEach((teacher) => {
      updateCount('sex', teacher.sex);
      updateCount('nativeStatus', teacher.nativeStatus);
      updateCount('teacherType', teacher.teacherType);

      const { status } = getRetirementStatus(teacher.birthDate);
      updateCount('retirementStatus', status);
    });

    return counts;
  };

  // Calculate total teachers
  const totalTeachers = teachers.length;

  const getRetirementStatus = (birthDate) => {
    const retirementAge = 60;
    const currentYear = new Date().getFullYear();
    const birthYear = new Date(birthDate).getFullYear();
    const age = currentYear - birthYear;
    return { status: age >= retirementAge ? 'retired' : 'active' };
  };

  // Monitor section visibility using Intersection Observer API
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect(); // Stop observing after first trigger
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of section is visible
    );

    if (countSectionRef.current) {
      observer.observe(countSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const values = [
    { icon: <FaHandsHelping className="text-blue-500 text-4xl mx-auto mb-4" />, title: "Ownership", description: "Encouraging stakeholders to take responsibility for their roles in the educational process." },
    { icon: <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />, title: "Effectiveness and Efficiency", description: "Striving to maximize resources and deliver results that enhance student learning." },
    { icon: <FaMedal className="text-red-500 text-4xl mx-auto mb-4" />, title: "Quality", description: "Maintaining high standards in education to ensure exceptional outcomes for students." },
    { icon: <FaRegLightbulb className="text-yellow-500 text-4xl mx-auto mb-4" />, title: "Responsibility", description: "Fostering accountability among all education stakeholders." },
    { icon: <FaBalanceScale className="text-purple-500 text-4xl mx-auto mb-4" />, title: "Equity", description: "Ensuring fair access to educational opportunities for every student." },
    { icon: <FaUsers className="text-indigo-500 text-4xl mx-auto mb-4" />, title: "Participatory", description: "Promoting involvement from all community members in the educational journey." },
    { icon: <FaStar className="text-pink-500 text-4xl mx-auto mb-4" />, title: "Exemplary", description: "Setting high benchmarks for performance and behavior within the educational system." },
    { icon: <FaRegHandshake className="text-teal-500 text-4xl mx-auto mb-4" />, title: "Commitment", description: "Dedication to continuous improvement and student success." },
    { icon: <FaFlag className="text-orange-500 text-4xl mx-auto mb-4" />, title: "Excellence", description: "Pursuing excellence in every aspect of education and administration." }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "20px",
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

    // Calculate retired teachers
    const retiredTeachers = counts.retirementStatus.retired;

  return (
    <div className="font-sans">
  {/* Hero Section */}
  <header className=" h-[600px]   flex flex-col items-center -m-6 rounded-bl-[300px]">
    <main className="flex flex-col md:flex-row items-center justify-between gap-2 w-full max-w-screen-lg mt-[100px] px-6">
      <div className="text-center md:text-left space-y-6 md:w-2/1">
        <h2 className="text-[32px] font-bold leading-tight   drop-">
          Welcome to the Somali Regional State Education Bureau
        </h2>
        <p className="text-[18px] font-blod font-light text-black">
          Our goal is to create a supportive educational environment that uplifts students, teachers, and communities across the Somali region. Join us in advancing education and building a more inclusive future.
        </p>
        <div className="flex justify-center md:justify-start space-x-6 mt-6">
          <NavLink to="/about">
            <button className=" bg-indigo-400 hover:text-black px-8 py-3 rounded-full font-semibold capitalize transition duration-300 transform hover:bg-indigo-100 hover:scale-105">
              Learn More...
            </button>
          </NavLink>
        </div>
      </div>

      <img src={homeimage} alt="Home Illustration" className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] mt-6 md:mt-0 l-[200px]" />
    </main>
  </header>

  {/* Vision, Mission and Core Values Section */}
  <div className="flex flex-col items-center text-center py-16 mt-20 px-4">
    <h2 className="text-3xl font-bold mb-12 ">Our Educational Approach and Core Principles</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
      {/* Education Philosophy Card */}
      <div className="p-8 transition duration-300 ease-in-out transform hover:scale-105 ">
        <FaBook className="text-blue-500 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Education Philosophy</h3>
        <p className="">Competent citizens benefiting themselves and their country.</p>
      </div>

      {/* Vision Card */}
      <div className="p-8 transition duration-300 ease-in-out transform hover:scale-105 ">
        <FaBullseye className="text-green-500 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Vision</h3>
        <p className="">Quality and equitable education by 2030, producing capable citizens committed to their nation's prosperity.</p>
      </div>

      {/* Mission Card */}
      <div className="p-8 transition duration-300 ease-in-out transform hover:scale-105 ">
        <FaRocket className="text-red-500 text-4xl mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Mission</h3>
        <p className="">Nurturing execution capacity and ensuring quality education supported by technology from pre-elementary to secondary.</p>
      </div>
    </div>
  </div>

  {/* Teacher Statistics Section */}
  <div className="px-4 sm:px-6 lg:px-8 py-16 " ref={countSectionRef}>
    <h2 className="text-3xl font-bold text-center mb-12 ">Teacher Statistics</h2>



    <div className="grid grid-cols-1 md:grid-cols-2 justify-between lg:grid-cols-4 gap-8">
  {/* New "Total Teachers" Section */}
  <div className="p-6 text-center mb-6  transition duration-300 ease-in-out transform hover:scale-105">
    <FaUsers className="text-indigo-500 text-4xl mb-4 mx-auto" />
    <h3 className="text-2xl font-bold mb-2">Total Teachers</h3>
    <p className="text-indigo-500 text-4xl"><AnimatedCount count={totalTeachers} /></p>
  </div>

  {/* Male Teachers Card */}
  <div className="p-6 text-center  transition duration-300 ease-in-out transform hover:scale-105">
    <FaMale className="text-indigo-600 text-4xl mb-4 mx-auto" />
    <h3 className="text-2xl font-bold mb-2  ">Male Teachers</h3>
    <p className="text-indigo-500 text-4xl"><AnimatedCount count={counts.sex.Male} /></p>
  </div>

  {/* Female Teachers Card */}
  <div className="p-6 text-center  transition duration-300 ease-in-out transform hover:scale-105">
    <FaFemale className="text-indigo-600 text-4xl mb-4 mx-auto" />
    <h3 className="text-2xl font-bold mb-2  ">Female Teachers</h3>
    <p className="text-indigo-500 text-4xl"><AnimatedCount count={counts.sex.Female} /></p>
  </div>
    {/* New "Retired Teachers" Section */}
    {/* New "Retired Teachers" Section */}
<div className="p-6   text-center mb-6 transition duration-300 ease-in-out transform hover:scale-105">
  <FaRegGrin className="text-indigo-500 text-4xl mb-4 mx-auto" />
  <h3 className="text-2xl font-bold mb-2">Retired Teachers</h3>
  <p className="text-indigo-500 text-4xl"><AnimatedCount count={retiredTeachers} /></p>
</div>


</div>
</div>
{/*  middle section */}
<div className="space-y-20 px-6 md:px-12 lg:px-24 py-16 font-sans">
  {/* Section 1 */}
  <div className="flex flex-col md:flex-row items-center gap-10">
    <div className="w-full md:w-1/2">
    
      <img src={homeimage} alt="Education Illustration" className="w-full "/>

    </div>
    <div className="w-full md:w-1/2 mt-8">
      <div className="flex items-center mb-4">
        <div className="w-6 h-1 bg-blue-500 mr-4"></div>
        <h1 className="text-4xl font-bold uppercase">Important Education</h1>
      </div>
      <p className="text-lg leading-relaxed ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, illo blanditiis. Dignissimos, provident rerum!
        Eligendi, quidem labore cumque, eveniet tenetur aut aspernatur beatae harum unde mollitia consequuntur magni
        illum recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, provident rerum! Eligendi,
        quidem labore cumque.
      </p>
    </div>
  </div>

  {/* Section 2 */}
  <div className="flex flex-col md:flex-row items-center gap-10">
    <div className="w-full md:w-1/2 mt-8 md:order-2">
      <img src={homeimage} alt="Education Illustration" className="w-full " />
    </div>
    <div className="w-full md:w-1/2">
      <div className="flex items-center mb-4">
        <div className="w-6 h-1 bg-blue-500 mr-4"></div>
        <h1 className="text-4xl font-bold uppercase">Important Education</h1>
      </div>
      <p className="text-lg leading-relaxed ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, illo blanditiis. Dignissimos, provident rerum!
        Eligendi, quidem labore cumque, eveniet tenetur aut aspernatur beatae harum unde mollitia consequuntur magni
        illum recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, provident rerum! Eligendi,
        quidem labore cumque.
      </p>
    </div>
  </div>

  {/* Section 3 */}
  <div className="flex flex-col md:flex-row items-center gap-10">
    <div className="w-full md:w-1/2">
      <img src={homeimage} alt="Education Illustration" className="w-full " />
    </div>
    <div className="w-full md:w-1/2 mt-8">
      <div className="flex items-center mb-4">
        <div className="w-6 h-1 bg-blue-500 mr-4"></div>
        <h1 className="text-4xl font-bold uppercase">Important Education</h1>
      </div>
      <p className="text-lg leading-relaxed ">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, illo blanditiis. Dignissimos, provident rerum!
        Eligendi, quidem labore cumque, eveniet tenetur aut aspernatur beatae harum unde mollitia consequuntur magni
        illum recusandae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, provident rerum! Eligendi,
        quidem labore cumque.
      </p>
    </div>
  </div>
</div>


  {/* Core Values Section */}
  <section className="py-16 mt-20 ">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold ">Values of the Regional Education Bureau</h2>
      </div>

      <Slider {...settings} className="max-w-5xl mx-auto">
        {/* Array of Values */}
        {[
          {
            icon: <FaHandsHelping className="text-blue-500 text-4xl mx-auto mb-4" />,
            title: "Ownership",
            description: "Encouraging stakeholders to take responsibility for their roles in the educational process."
          },
          {
            icon: <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />,
            title: "Effectiveness and Efficiency",
            description: "Striving to maximize resources and deliver results that enhance student learning."
          },
          {
            icon: <FaMedal className="text-red-500 text-4xl mx-auto mb-4" />,
            title: "Quality",
            description: "Maintaining high standards in education to ensure exceptional outcomes for students."
          },
          {
            icon: <FaRegLightbulb className="text-yellow-500 text-4xl mx-auto mb-4" />,
            title: "Responsibility",
            description: "Fostering accountability among all education stakeholders."
          },
          {
            icon: <FaBalanceScale className="text-purple-500 text-4xl mx-auto mb-4" />,
            title: "Equity",
            description: "Ensuring fair access to educational opportunities for every student."
          },
          {
            icon: <FaUsers className="text-indigo-500 text-4xl mx-auto mb-4" />,
            title: "Participatory",
            description: "Promoting involvement from all community members in the educational journey."
          },
          {
            icon: <FaStar className="text-pink-500 text-4xl mx-auto mb-4" />,
            title: "Exemplary",
            description: "Setting high benchmarks for performance and behavior within the educational system."
          },
          {
            icon: <FaRegHandshake className="text-teal-500 text-4xl mx-auto mb-4" />,
            title: "Commitment",
            description: "Dedication to continuous improvement and student success."
          },
          {
            icon: <FaFlag className="text-orange-500 text-4xl mx-auto mb-4" />,
            title: "Excellence",
            description: "Pursuing excellence in every aspect of education and administration."
          }
        ].map((value, index) => (
          <div 
            key={index} 
            className="slide-item p-8  text-center transition transform duration-300 hover:scale-105"
          >
            {value.icon}
            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
            <p className="">{value.description}</p>
          </div>
        ))}
      </Slider>
    </section>

    <div className="connetus">
  <div className="bg-indigo-500 text-white rounded py-16 px-6 lg:px-12 font-sans">
    <div className="max-w-7xl mx-auto text-center">
      {/* Section Header */}
      <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
      <p className="text-lg text-gray-200 mb-8">
        Stay updated with the latest news by subscribing to our email list.
      </p>

      {/* Single Email Input Form */}
      <form className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>
    </div>
  </div>
</div>


</div>

  );
};

export default Home;