import React from 'react';
// // import png from '../../public/png.png';
// import schools from '../../public/schools.png';
// import pn from '../../public/pn.png';
import image1 from '../assets/student/image1.jpg'
import image2 from '../assets/student/image2.jpg'

const Home = () => {
  return (
    <div className="font-sans">
      {/* Header Section */}
      

      {/* Hero Section */}
      <section className=" h-[500px] flex items-center justify-between">
  <div className="px-8 max-w-[50%]">
    <h1 className="text-3xl font-bold mb-4 uppercase text-left">Welcome to Somali Regional State Education Bureau,</h1>
    <p className="mb-6 text-lg text-left">
      Sed autem laudantium dolores. Voluptatem itaque ea consequatur
      eveniet. Eum quas beatae cumque eum quaeerat.
    </p>
    <div className="flex space-x-4">
      <button className="bg-transparent border dark:border-black border-white hover:bg-[] hover:text-[#36736C]   font-semibold py-3 px-8 rounded transition duration-300">
       Call Us
      </button>
    </div>
  </div>
  
  {/* Image Section */}
  <div className="w-[50] px-20 h-full">
    <img 
      src={image1} 
      alt="Hero Image" 
      className="object-cover h-[450px] w-full rounded-2xl" 
    />
  </div>
</section>


      {/* Feature Section */}
      <section className="  py-28">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-7">
          <div className="text-center p-6  hover:bg-[#b19d60] h-[250px] rounded shadow hover:shadow-lg transition duration-300">
            <div className="text-2xl font-bold mb-2">Lorem Ipsum</div>
            <p>
              Voluptatum deleniti atque corrupti quos dolores et quas molestias
              excepturi.
            </p>
          </div>
          <div className="text-center p-6 hover:bg-[#b19d60] rounded shadow hover:shadow-lg transition duration-300">
            <div className="text-2xl font-bold mb-2">Sed ut perspiciatis</div>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore.
            </p>
          </div>
          <div className="text-center p-6 hover:bg-[#b19d60] rounded shadow hover:shadow-lg transition duration-300">
            <div className="text-2xl font-bold mb-2">Magni Dolores</div>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia.
            </p>
          </div>
          <div className="text-center p-10 hover:bg-[#b19d60] rounded shadow hover:shadow-lg transition duration-300">
            <div className="text-2xl font-bold mb-2">Nemo Enim</div>
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="    py-20">
  <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center space-x-7 md:items-start px-4">
    <div className="w-full md:w-[400px] mb-6 md:mb-0">
      <img 
        src={image2} 
        alt="About Us Image" 
        className="rounded-lg shadow-lg mx-auto"
      />
    </div>
    <div className="w-full md:w-1/2 text-center md:text-left">
      <h2 className="text-4xl font-bold mb-6">About Us</h2>
      <p className="text-lg max-w-3xl mx-auto md:mx-0">
        We are a team of talented designers and developers creating
        amazing websites with React and Tailwind CSS. Our mission is to
        deliver high-quality web solutions that help businesses thrive in
        the digital world.
      </p>
    </div>
  </div>
</section>




<footer>
</footer>

    </div>
  );
};

export default Home;