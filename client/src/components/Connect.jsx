import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

function Contact() {
  return (
    <div className="p-8 max-w-6xl mx-auto mt-10 ">

  {/* Contact Us Title */}
  <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center border-b-4 border-indigo-500 pb-4">
    CONTACT US
  </h1>

  {/* Contact Info Section */}
  <div className="p-6 ">
    <h2 className="text-3xl font-semibold  mb-6">Our Contact Info</h2>

    {/* Address */}
    <p className="text-lg mb-4 flex items-center">
      <FaMapMarkerAlt className="text-indigo-500 mr-3" />
      <span className="font-semibold">Address:</span> Jigjiga, Somali Region, Ethiopia
    </p>

    {/* Plus Code */}
    <p className="text-lg mb-4 flex items-center">
      <FaMapMarkerAlt className="text-indigo-500 mr-3" />
      <span className="font-semibold">Plus Code:</span> 9Q4W+F4H, Jigjiga
    </p>

    {/* Phone 1 */}
    <p className="text-lg mb-4 flex items-center">
      <FaPhone className="text-indigo-500 mr-3" />
      <span className="font-semibold">Phone 1:</span>
      <a 
        href="tel:+251915224186" 
        className=" hover:text-indigo-800 hover:underline transition duration-300 ml-2"
      >
        +251 915 224 186
      </a>
    </p>

    {/* Phone 2 */}
    <p className="text-lg mb-4 flex items-center">
      <FaPhone className="text-indigo-500 mr-3" />
      <span className="font-semibold">Phone 2:</span>
      <a 
        href="tel:+251915741616" 
        className=" hover:text-indigo-800 hover:underline transition duration-300 ml-2"
      >
        +251 915 741 616
      </a>
    </p>

    {/* Email 1 */}
    <p className="text-lg mb-4 flex items-center">
      <FaEnvelope className="text-indigo-500 mr-3" />
      <span className="font-semibold">Email 1:</span>
      <a 
        href="mailto:info@srs-educb.gov.et" 
        className=" hover:text-indigo-800 hover:underline transition duration-300 ml-2"
      >
        info@srs-educb.gov.et
      </a>
    </p>

    {/* Email 2 */}
    <p className="text-lg flex items-center">
      <FaEnvelope className="text-indigo-500 mr-3" />
      <span className="font-semibold">Email 2:</span>
      <a 
        href="mailto:srs.edub@gmail.com" 
        className=" hover:text-indigo-800 hover:underline transition duration-300 ml-2"
      >
        srs.edub@gmail.com
      </a>
    </p>
  </div>

  {/* Map Section */}
  <div className="p-6 ">
    <h2 className="text-3xl font-semibold  mb-6">Find Us on the Map</h2>
    <div className="w-full h-64  rounded-md overflow-hidden shadow-md">
      <iframe
        className="w-full h-full"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d491.86639268880044!2d42.7949642!3d9.3560638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x162e3700674cf025%3A0x2dc41fc2e7f33b89!2sXafiiska%20Waxbarashada%20DDS%3A%20SRS%20Buruea%20of%20Education!5e0!3m2!1sen!2sus!4v1697055786!5m2!1sen!2sus"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="SRS Bureau of Education Map"
      ></iframe>
    </div>
    <p className="text-center   mt-4">
      <a
        href="https://www.google.com/maps/place/Xafiiska+Waxbarashada+DDS:+SRS+Buruea+of+Education/@9.3558954,42.7949642,17.74z/data=!4m6!3m5!1s0x162e3700674cf025:0x2dc41fc2e7f33b89!8m2!3d9.3560638!4d42.795286!16s%2Fg%2F11lttgd1hb?hl=am&entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D"
        className=" hover:text-indigo-800 hover:underline transition duration-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Google Maps
      </a>
    </p>
  </div>
</div>

  );
}

export default Contact;
