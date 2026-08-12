import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] relative overflow-hidden font-body pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-red font-bold uppercase tracking-[0.2em] text-sm mb-4"
          >
            STUDIO DESK
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 font-heading"
          >
            Get in Touch with sBloom Studio.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500"
          >
            Connect directly with our team for studio inquiries, bookings, and collaborations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-10 h-full"
          >
            {/* Address */}
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-brand-red">
                <FiMapPin className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Studio Location</h4>
                <p className="text-slate-500 leading-relaxed">
                  Q887+M98 Health City Chinnagadili, Plot 9A<br />
                  Chinna Gadhili, Arilova, Visakhapatnam<br />
                  Andhra Pradesh 530040, India
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-brand-red">
                <FiPhone className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Studio Contact Number</h4>
                <p className="text-slate-500">+91 8985950451</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-brand-red">
                <FiMail className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Inquiry Email</h4>
                <p className="text-slate-500 mb-1">hello@sbloomstudio.com</p>
                <p className="text-slate-500">bookings@sbloomstudio.com</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-brand-red">
                <FiClock className="text-2xl" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Business Hours</h4>
                <p className="text-slate-500">Monday - Saturday</p>
                <p className="text-slate-500">9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Map Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full min-h-[500px] relative group"
          >
            {/* Click overlay to open in Google Maps */}
            <a
              href="https://www.google.com/maps/place/Medcy+Multi-Specialty+Hospital+%7C+Health+City,+Arilova/@17.7646477,83.3050348,17z/data=!3m1!4b1!4m6!3m5!1s0x3a395dc2cc4f84fb:0xf28ec13d234c0564!8m2!3d17.7646477!4d83.3076097!16s%2Fg%2F11kqdwp435?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label="Open location in Google Maps"
            >
              <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors rounded-[1.5rem] m-4"></div>
            </a>

            <iframe
              src="https://maps.google.com/maps?q=Medcy%20Multi-Specialty%20Hospital,%20Health%20City,%20Arilova,%20Visakhapatnam&t=&z=15&ie=UTF8&iwloc=B&output=embed"
              className="w-full h-full rounded-[1.5rem] border-0 relative z-0 pointer-events-none"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="sBloom Studio Location"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
