import React from 'react';

function About() {
  return (
    <div className="p-6 max-w-6xl mx-auto mt-10   ">

    {/* Title */}
    <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 border-b-4 border-indigo-600 pb-2">
      About the Somali Regional State Education Bureau
    </h1>
  
    {/* Education Philosophy Section */}
    <section className="mb-8">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Education Philosophy</h2>
      <p className=" leading-relaxed">
        Producing competent citizens who benefit themselves and their country.
      </p>
    </section>
  
    {/* Vision Section */}
    <section className="mb-8">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Vision</h2>
      <p className=" leading-relaxed">
        Building an education system that assures quality and equity of education by the year 2030, aimed at producing competent citizens.
      </p>
      <p className=" leading-relaxed mt-2">
        To see the production of competent citizens who are capable of embracing their nationality and striving for the prosperity of their country by 2030 G.C.
      </p>
    </section>
  
    {/* Mission Section */}
    <section className="mb-8">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Mission</h2>
      <p className=" leading-relaxed">
        Through nurturing the execution capacity of the education sector, designing and assuring standards of efficiency, expanding well-equipped colleges of teacher education, and publicizing all our activities, we ensure productive, equitable, participatory, and quality education.
      </p>
      <p className=" leading-relaxed mt-2">
        Providing citizens with education supported by technology from pre-elementary to secondary education as part of lifelong education and training, built on fairness, inclusivity, accessibility, quality, and good governance.
      </p>
    </section>
  
    {/* Values Section */}
    <section className="mb-8">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Values</h2>
      <ul className="list-disc pl-6  space-y-2">
        <li>Ownership</li>
        <li>Effectiveness and Efficiency</li>
        <li>Quality</li>
        <li>Responsibility</li>
        <li>Equity</li>
        <li>Participatory</li>
        <li>Exemplary</li>
        <li>Commitment</li>
        <li>Excellence</li>
        <li>Servant Leadership</li>
      </ul>
    </section>
  
    {/* Leadership Section */}
    <section className="mb-8">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">Bureau Leadership</h2>
      <div className=" p-6 rounded-lg shadow-md">
        <p className="text-lg  mb-3">
          <span className="font-semibold text-indigo-600">Bureau Head:</span> Mr. Abdullahi Abdi
        </p>
        <p className="text-lg  mb-3">
          <span className="font-semibold text-indigo-600">Deputy Bureau Head:</span> Mr. Omer Aden
        </p>
        <p className="text-lg  mb-3">
          <span className="font-semibold text-indigo-600">Deputy Bureau Head:</span> Mr. Guled Ahmed Ali
        </p>
        <p className="text-lg  mb-3">
          <span className="font-semibold text-indigo-600">Deputy Bureau Head:</span> Mr. Mahamed Muse Gure
        </p>
        <p className="text-lg ">
          <span className="font-semibold text-indigo-600">Human Resource Management:</span> Mr. Mahamud Hassan
        </p>
      </div>
    </section>
  
  </div>
  
  );
}

export default About;
