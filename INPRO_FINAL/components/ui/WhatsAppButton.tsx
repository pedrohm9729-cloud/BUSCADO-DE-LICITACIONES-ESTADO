'use client';

import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const phoneNumber = '51966060911'; // WhatsApp oficial INPROMETAL
  const message = encodeURIComponent('Hola INPROMETAL, necesito cotizar un proyecto metalmecánico. ¿Están disponibles para atenderme?');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      aria-label="Contactar por WhatsApp"
    >
      {/* Text bubble */}
      <div className="bg-white text-gray-800 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
        ¿Necesitas ayuda?<br />
        Escríbenos
      </div>

      {/* WhatsApp button with official logo */}
      <div className="bg-[#25D366] hover:bg-[#20bd5a] p-4 rounded-full shadow-xl transition-colors duration-200 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.825.737 5.48 2.023 7.789L.692 30.52a.696.696 0 0 0 .867.867l6.73-1.331A15.921 15.921 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333A13.278 13.278 0 0 1 8.362 27.2a.697.697 0 0 0-.51-.094l-4.658.92.92-4.657a.697.697 0 0 0-.095-.51A13.278 13.278 0 0 1 2.667 16c0-7.364 5.97-13.333 13.333-13.333S29.333 8.637 29.333 16 23.364 29.333 16 29.333z"/>
          <path d="M23.404 19.566c-.337-.168-1.995-.984-2.304-1.097-.308-.112-.533-.168-.757.169-.224.337-.869 1.097-1.065 1.322-.196.224-.393.253-.73.084-.337-.168-1.421-.524-2.706-1.67-.999-.891-1.673-1.992-1.869-2.33-.196-.337-.021-.52.148-.688.151-.151.337-.393.505-.589.169-.196.224-.337.337-.561.112-.225.056-.421-.028-.59-.084-.168-.757-1.822-1.037-2.495-.273-.657-.551-.567-.757-.577-.196-.009-.421-.011-.645-.011s-.589.084-.897.421c-.309.337-1.177 1.151-1.177 2.805s1.205 3.253 1.373 3.478c.169.224 2.373 3.623 5.749 5.079.803.347 1.431.555 1.92.71.807.256 1.541.22 2.121.133.647-.097 1.995-.816 2.276-1.604.28-.788.28-1.463.196-1.604-.084-.14-.308-.224-.645-.393z"/>
        </svg>
      </div>
    </motion.a>
  );
}
