import React from 'react';
import image1 from '../assets/student/image1.jpg';
import image2 from '../assets/student/image2.jpg';

const Home = () => {
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

      {/* Feature Section */}
      <section className="py-16  ">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {[
            {
              title: "Innovative Curriculum",
              description: "Implementing cutting-edge educational programs designed to foster creativity and critical thinking among students."
            },
            {
              title: "Inclusive Education",
              description: "Creating an environment that ensures equal learning opportunities for all students, regardless of background."
            },
            {
              title: "Professional Development",
              description: "Offering continuous training and growth opportunities for educators to enhance teaching effectiveness."
            },
            {
              title: "Community Engagement",
              description: "Building strong partnerships with communities to support and enrich the educational experience."
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6   hover: h-[250px] rounded shadow hover:shadow-lg transition duration-300">
              <div className="text-2xl font-bold mb-2">{feature.title}</div>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16  ">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center space-x-0 md:space-x-10 px-8">
          <div className="w-full md:w-[400px] mb-8 md:mb-0">
            <img 
              src={image2} 
              alt="About Us Image" 
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold ">About Us</h2>
            <p className="text-lg leading-relaxed">
              We are a team of talented designers and developers creating amazing websites with React and Tailwind CSS. Our mission is to deliver high-quality web solutions that help businesses thrive in the digital world.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Approach and Core Principles Section */}
      <section className="py-16 ">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-10 uppercase ">
            Our Educational Approach and Core Principles
          </h2>

          {[
            {
              title: "Education Philosophy of the Regional Education Bureau",
              description: "Producing competent citizens who benefit themselves and their country."
            },
            {
              title: "Vision of the Regional Education Bureau",
              description: "Building an education system that assures quality and equity by the year 2030, aimed at producing competent citizens capable of understanding their nationality and striving for the prosperity of their country."
            },
            {
              title: "Mission of the Regional Education Bureau",
              description: "Through nurturing the execution capacity of the education sector, designing and assuring standards of efficiency, expanding well-equipped colleges of teacher education, and publicizing all our activities, we ensure productive, equitable, participatory, and quality education. We aim to provide citizens with technology-supported education from pre-elementary to secondary education as part of lifelong learning. This system is built on fairness, inclusiveness, accessibility, and ensures quality and good governance."
            },
            {
              title: "Values of the Regional Education Bureau",
              description: (
                <ul className="list-disc list-inside space-y-2 text-lg">
                  <li>Ownership</li>
                  <li>Effectiveness and efficiency</li>
                  <li>Quality</li>
                  <li>Responsibility</li>
                  <li>Equity</li>
                  <li>Participatory</li>
                  <li>Exemplary</li>
                  <li>Commitment</li>
                  <li>Excellence</li>
                  <li>Servant Leadership</li>
                </ul>
              )
            }
          ].map((item, index) => (
            <div key={index} className="mb-10  p-6 rounded-lg shadow-md   transition duration-300">
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-lg leading-relaxed">{item.description}</p>
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
