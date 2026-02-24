import Image from 'next/image';
import { Globe, Mail, Share2, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden border-t border-slate-800">
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 - Logo & Description */}
          <div>
            <div className="mb-4">
              <Image
                src="/logos/logo blanco y negro.png"
                alt="INPROMETAL"
                width={180}
                height={60}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Liderando la industria en fabricación metalmecánica de precisión e ingeniería estructural para sectores industriales pesados en todo el mundo.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.inprometal.com.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:administracion@inprometal.com.pe"
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#contacto"
                className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Explore */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a href="#servicios" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Diseño e Ingeniería
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Fabricación Metalmecánica
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Montaje Industrial
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Mantenimiento Especializado
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#nosotros" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#quienes-somos" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a href="#calidad" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Estándares de Calidad
                </a>
              </li>
              <li>
                <a href="#proyectos" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Proyectos Destacados
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p>Cam. Real 21, Villa María del Triunfo</p>
                  <p>Lima 15823, Perú</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0 text-blue-400" />
                <a href="tel:+51966060911" className="hover:text-white transition-colors">
                  +51 966 060 911
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-400" />
                <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <p className="text-slate-500 text-sm">
                © {currentYear} INPROMETAL. TODOS LOS DERECHOS RESERVADOS.
              </p>
              <p className="text-slate-600 text-xs mt-1">
                RUC: 20609746328 | H & V DESARROLLO Y FABRICACION DE PROYECTOS METALMECANICOS S.A.C.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                POLÍTICA DE PRIVACIDAD
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                TÉRMINOS DE SERVICIO
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
                CONFIGURACIÓN DE COOKIES
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
