'use client';

import { Phone, Mail } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white py-2.5 text-sm fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Left side - Info text */}
          <div className="hidden md:flex items-center gap-2 text-gray-200">
            <span className="text-xs lg:text-sm font-medium">
              Soluciones metalmecánicas para minería, industria y construcción
            </span>
          </div>

          {/* Right side - Contact info */}
          <div className="flex items-center gap-4 lg:gap-6 ml-auto">
            {/* Email */}
            <a
              href="mailto:contacto@inprometal.com.pe"
              className="hidden lg:flex items-center gap-2 hover:text-accent transition-colors duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">contacto@inprometal.com.pe</span>
            </a>

            {/* Phone */}
            <a
              href="tel:+51966060911"
              className="flex items-center gap-2 hover:text-accent transition-colors duration-200"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">+51 966 060 911</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
