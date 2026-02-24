'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  company: z.string().min(2, 'El nombre de la empresa es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Número de teléfono inválido'),
  projectType: z.string().min(1, 'Seleccione un tipo de proyecto'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  isUrgent: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(result.message || 'Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.');
    }
  };

  return (
    <>
      {/* Contact Hero */}
      <section className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-dark to-slate-800" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-slate-900/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom py-16">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-sm text-slate-400 mb-6"
          >
            <span>Inicio</span>
            <span>/</span>
            <span className="text-slate-300">Contacto</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white mb-4"
          >
            Potencie su próximo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              proyecto industrial
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base text-slate-400 max-w-xl"
          >
            Estamos listos para ofrecerle precisión, calidad y el soporte técnico que su empresa necesita.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative py-24 bg-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(148,163,184,0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(148,163,184,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Ubicación Central Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-black text-white">Ubicación Central</h3>
                </div>
                <div className="text-slate-300 text-sm space-y-1">
                  <p>Cam. Real 21, Villa María del Triunfo</p>
                  <p>Lima 15823, Perú</p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.8847584394707!2d-76.94209072468179!3d-12.189389943961985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b9a6f8c6f6f3%3A0x8e9f8c6f8c6f8c6f!2sCam.%20Real%2021%2C%20Villa%20Mar%C3%ADa%20del%20Triunfo%2015823!5e0!3m2!1ses!2spe!4v1234567890123!5m2!1ses!2spe"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>

              {/* Canales Directos Card */}
              <div className="bg-[#1a2f4f] border border-blue-900/50 rounded-xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xl font-black text-white mb-4">Canales Directos</h3>

                {/* Phone */}
                <div>
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase mb-1">
                    <Phone className="w-4 h-4" />
                    <span>Teléfono</span>
                  </div>
                  <a href="tel:+51966060911" className="text-2xl font-black text-white hover:text-cyan-300 transition-colors">
                    +51 966 060 911
                  </a>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase mb-1">
                    <Mail className="w-4 h-4" />
                    <span>Email Corporativo</span>
                  </div>
                  <a href="mailto:administracion@inprometal.com.pe" className="text-white hover:text-cyan-300 transition-colors break-all">
                    administracion@inprometal.com.pe
                  </a>
                </div>

                {/* Schedule */}
                <div>
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Horario Laboral</span>
                  </div>
                  <p className="text-white">Lun - Vie: 8:00 - 18:00</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="text-center pt-4">
                <p className="text-slate-400 text-sm mb-3">Siga nuestro trabajo en redes profesionales</p>
                <div className="flex justify-center gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 p-3 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <button className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 p-3 rounded-lg transition-all">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-black text-white mb-3">Solicitud de Cotización</h2>
                <p className="text-slate-300 mb-8">
                  Complete el siguiente formulario y un ingeniero de nuestro equipo se contactará con usted en menos de 24 horas hábiles.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-2">
                      ¡Mensaje Enviado!
                    </h3>
                    <p className="text-slate-300">
                      Gracias por contactarnos. Te responderemos en breve.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name & Company */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Nombre Completo
                        </label>
                        <input
                          {...register('name')}
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border ${
                            errors.name ? 'border-red-500' : 'border-slate-700'
                          } text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                          placeholder="Ej: Juan Pérez"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Empresa
                        </label>
                        <input
                          {...register('company')}
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border ${
                            errors.company ? 'border-red-500' : 'border-slate-700'
                          } text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                          placeholder="Nombre de su organización"
                        />
                        {errors.company && (
                          <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Correo Electrónico
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border ${
                            errors.email ? 'border-red-500' : 'border-slate-700'
                          } text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                          placeholder="email@empresa.com"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">
                          Teléfono de Contacto
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border ${
                            errors.phone ? 'border-red-500' : 'border-slate-700'
                          } text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                          placeholder="+56 9 1234 5678"
                        />
                        {errors.phone && (
                          <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Tipo de Proyecto
                      </label>
                      <select
                        {...register('projectType')}
                        className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border ${
                          errors.projectType ? 'border-red-500' : 'border-slate-700'
                        } text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      >
                        <option value="" className="bg-slate-800">Estructuras Metálicas</option>
                        <option value="puente-grua" className="bg-slate-800">Puente Grúa / Sistema de Izaje</option>
                        <option value="maquinaria" className="bg-slate-800">Componentes de Maquinaria</option>
                        <option value="rack" className="bg-slate-800">Rack Industrial</option>
                        <option value="mobiliario" className="bg-slate-800">Mobiliario Metálico</option>
                        <option value="otro" className="bg-slate-800">Otro</option>
                      </select>
                      {errors.projectType && (
                        <p className="text-red-400 text-sm mt-1">{errors.projectType.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Descripción del Requerimiento
                      </label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg bg-slate-800/50 border ${
                          errors.message ? 'border-red-500' : 'border-slate-700'
                        } text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none`}
                        placeholder="Cuéntenos sobre su proyecto, dimensiones, materiales o plazos estimados..."
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Google Maps Link */}
                    <div className="pt-2 border-t border-slate-700/50">
                      <a
                        href="https://maps.app.goo.gl/S9PeGRWsdxpZoo3g9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-bold transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        VER EN GOOGLE MAPS
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Urgent Checkbox */}
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        {...register('isUrgent')}
                        type="checkbox"
                        id="urgent"
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-primary focus:ring-2 focus:ring-primary"
                      />
                      <label htmlFor="urgent" className="text-sm text-slate-300">
                        Este proyecto es de carácter{' '}
                        <span className="text-red-500 font-bold">urgente</span>
                      </label>
                    </div>

                    {/* Privacy Note */}
                    <p className="text-xs text-slate-500">
                      Al enviar, usted acepta nuestra política de privacidad y tratamiento de datos industriales.
                    </p>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                      <span>{isSubmitting ? 'Enviando...' : 'ENVIAR SOLICITUD DE COTIZACIÓN'}</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
