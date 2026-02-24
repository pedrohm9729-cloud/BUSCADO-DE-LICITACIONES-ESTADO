'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronRight, ChevronLeft, CheckCircle, Building2, Cylinder, Wrench, HardHat, LayoutGrid, Upload } from 'lucide-react';
import Image from 'next/image';

const quoteSchema = z.object({
  projectType: z.string().min(1, 'Seleccione el tipo de proyecto'),
  dimensions: z.string().min(1, 'Ingrese las dimensiones aproximadas'),
  tonnage: z.string().optional(),
  material: z.string().min(1, 'Seleccione el material'),
  urgency: z.string().min(1, 'Seleccione la urgencia'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  company: z.string().min(2, 'El nombre de la empresa es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Número de teléfono inválido'),
  additionalInfo: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const PROJECT_TYPES = [
  { value: 'Estructura Metálica', label: 'Estructura Metálica', icon: Building2 },
  { value: 'Tanque o Recipiente', label: 'Tanque / Recipiente', icon: Cylinder },
  { value: 'Mantenimiento/Reparación', label: 'Mantenimiento', icon: Wrench },
  { value: 'Montaje Industrial', label: 'Montaje Industrial', icon: HardHat },
  { value: 'Otro', label: 'Otro Servicio', icon: LayoutGrid },
];

const MATERIALS = [
  'Acero al Carbono (A36, A572)',
  'Acero Inoxidable (304, 316)',
  'Acero Galvanizado',
  'No estoy seguro / Asesoría técnica',
];

const URGENCY_OPTIONS = [
  { value: 'estandar', label: 'Estándar', sub: '4-6 semanas' },
  { value: 'urgente', label: 'Urgente', sub: '2-3 semanas' },
  { value: 'muy-urgente', label: 'Muy Urgente', sub: 'menos de 2 semanas' },
];

const STEP_LABELS = [
  'Tipo de Proyecto',
  'Dimensiones',
  'Material',
  'Urgencia',
  'Contacto',
];

export default function QuoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedProjectType, setSelectedProjectType] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setStep(1);
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setSelectedProjectType('');
    setSelectedMaterial('');
    setSelectedUrgency('');
    setFiles([]);
    reset();
  }, [reset]);

  useEffect(() => {
    const trigger = document.getElementById('quote-modal');
    const handleOpen = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeModal();
    };
    trigger?.addEventListener('click', handleOpen);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      trigger?.removeEventListener('click', handleOpen);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Create FormData to support file uploads
      const formData = new FormData();

      // Add all form fields
      formData.append('projectType', data.projectType);
      formData.append('dimensions', data.dimensions);
      if (data.tonnage) formData.append('tonnage', data.tonnage);
      formData.append('material', data.material);
      formData.append('urgency', data.urgency);
      formData.append('name', data.name);
      formData.append('company', data.company);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      if (data.additionalInfo) formData.append('additionalInfo', data.additionalInfo);

      // Add files
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Send to our API route
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => closeModal(), 3500);
      } else {
        throw new Error(result.message || 'Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Hubo un error al enviar tu solicitud. Por favor intenta nuevamente o contáctanos por WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) { setStep(step + 1); setSubmitError(null); }
  };
  const prevStep = () => {
    if (step > 1) { setStep(step - 1); setSubmitError(null); }
  };

  const progress = Math.round((step / totalSteps) * 100);

  // Input / textarea shared classes
  const inputCls =
    'w-full px-4 py-3 rounded-lg bg-slate-800/80 border border-slate-600/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 transition-colors text-sm';
  const labelCls = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2';

  return (
    <>
      {/* Hidden trigger */}
      <div id="quote-modal" className="hidden" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(5, 8, 15, 0.85)' }}
            onClick={closeModal}
          >
            {/* Background image overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAOZFTVSlaTYvOCmjQRuHOgKeBitoXexbTjmS-qacHDEDM6NN2DrXaMZh4M0TtzoGGLmAEeiGf2pbOGqg63p4lFtnAld6ps7dxGc3X-ZV9OLJU0Zz9CwZe_iGiIRy9m-dpoMbKM9r4OFZme18FbAo-bGXRITd4_SL32zkHcRYt26PwXd8hr4aiJzTvZ_rVaAMS4sZL180JAoTvYp4DQA9vWtd-OFTkNuW49VnXpaBO4JYQ_2YG_jAy_rIgv4Xrc7RbWyyn8L4CR6Cc)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Glass Panel */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-700/60 shadow-2xl"
              style={{
                background: 'rgba(15, 20, 30, 0.97)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b border-slate-700/50"
                style={{ background: 'rgba(15, 20, 30, 0.98)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logos/logo blanco y negro.png"
                      alt="INPROMETAL"
                      width={130}
                      height={40}
                      className="h-7 w-auto"
                    />
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-slate-500 hover:text-white hover:bg-slate-700/60 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!submitted && (
                  <>
                    {/* Step label */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Solicitar Cotización</p>
                        <p className="text-white font-bold text-base leading-tight mt-0.5">
                          {STEP_LABELS[step - 1]}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                        Paso {step} de {totalSteps}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>

                  </>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10"
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">¡Solicitud Recibida!</h3>
                      <p className="text-slate-400 text-sm">
                        Nos pondremos en contacto contigo dentro de 24 horas.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Step 1 — Project Type Cards */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="text-slate-400 text-sm mb-5">
                            Selecciona el tipo de trabajo que necesitas.
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            {PROJECT_TYPES.map(({ value, label, icon: Icon }) => {
                              const isSelected = selectedProjectType === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedProjectType(value);
                                    setValue('projectType', value);
                                  }}
                                  className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 group"
                                  style={{
                                    background: isSelected
                                      ? 'rgba(59, 130, 246, 0.12)'
                                      : 'rgba(30, 41, 59, 0.5)',
                                    borderColor: isSelected
                                      ? 'rgba(59, 130, 246, 0.6)'
                                      : 'rgba(71, 85, 105, 0.4)',
                                  }}
                                >
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                                    style={{
                                      background: isSelected
                                        ? 'rgba(59, 130, 246, 0.25)'
                                        : 'rgba(71, 85, 105, 0.3)',
                                    }}
                                  >
                                    <Icon
                                      className="w-5 h-5 transition-colors"
                                      style={{ color: isSelected ? '#60a5fa' : '#94a3b8' }}
                                    />
                                  </div>
                                  <span
                                    className="font-semibold text-sm transition-colors"
                                    style={{ color: isSelected ? '#f5f5f5' : '#94a3b8' }}
                                  >
                                    {label}
                                  </span>
                                  {isSelected && (
                                    <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                                      style={{ background: '#3b82f6' }}>
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {errors.projectType && (
                            <p className="text-red-400 text-xs mt-3">{errors.projectType.message}</p>
                          )}
                        </motion.div>
                      )}

                      {/* Step 2 — Dimensions */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-5"
                        >
                          <p className="text-slate-400 text-sm mb-1">
                            Indícanos las dimensiones aproximadas del proyecto.
                          </p>
                          <div>
                            <label className={labelCls}>Dimensiones Aproximadas *</label>
                            <input
                              {...register('dimensions')}
                              type="text"
                              placeholder="Ej: 10m x 8m x 6m"
                              className={inputCls}
                            />
                            {errors.dimensions && (
                              <p className="text-red-400 text-xs mt-1.5">{errors.dimensions.message}</p>
                            )}
                          </div>
                          <div>
                            <label className={labelCls}>Tonelaje Estimado <span className="text-slate-600 normal-case tracking-normal">(opcional)</span></label>
                            <input
                              {...register('tonnage')}
                              type="text"
                              placeholder="Ej: 50 toneladas"
                              className={inputCls}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3 — Material */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="text-slate-400 text-sm mb-5">
                            ¿Qué tipo de material necesitas?
                          </p>
                          <div className="space-y-3">
                            {MATERIALS.map((material) => {
                              const isSelected = selectedMaterial === material;
                              return (
                                <button
                                  key={material}
                                  type="button"
                                  onClick={() => {
                                    setSelectedMaterial(material);
                                    setValue('material', material);
                                  }}
                                  className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border transition-all duration-200"
                                  style={{
                                    background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(30, 41, 59, 0.5)',
                                    borderColor: isSelected ? 'rgba(59, 130, 246, 0.6)' : 'rgba(71, 85, 105, 0.4)',
                                  }}
                                >
                                  <div
                                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                                    style={{
                                      borderColor: isSelected ? '#3b82f6' : '#475569',
                                    }}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: isSelected ? '#f5f5f5' : '#94a3b8' }}>
                                    {material}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {errors.material && (
                            <p className="text-red-400 text-xs mt-3">{errors.material.message}</p>
                          )}
                        </motion.div>
                      )}

                      {/* Step 4 — Urgency */}
                      {step === 4 && (
                        <motion.div
                          key="step4"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ duration: 0.25 }}
                        >
                          <p className="text-slate-400 text-sm mb-5">
                            ¿Cuál es la urgencia de tu proyecto?
                          </p>
                          <div className="space-y-3">
                            {URGENCY_OPTIONS.map(({ value, label, sub }) => {
                              const isSelected = selectedUrgency === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedUrgency(value);
                                    setValue('urgency', value);
                                  }}
                                  className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border transition-all duration-200"
                                  style={{
                                    background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(30, 41, 59, 0.5)',
                                    borderColor: isSelected ? 'rgba(59, 130, 246, 0.6)' : 'rgba(71, 85, 105, 0.4)',
                                  }}
                                >
                                  <div
                                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                    style={{ borderColor: isSelected ? '#3b82f6' : '#475569' }}
                                  >
                                    {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }} />}
                                  </div>
                                  <div>
                                    <span className="text-sm font-semibold block" style={{ color: isSelected ? '#f5f5f5' : '#cbd5e1' }}>
                                      {label}
                                    </span>
                                    <span className="text-xs" style={{ color: isSelected ? '#60a5fa' : '#64748b' }}>
                                      {sub}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {errors.urgency && (
                            <p className="text-red-400 text-xs mt-3">{errors.urgency.message}</p>
                          )}
                        </motion.div>
                      )}

                      {/* Step 5 — Contact Info */}
                      {step === 5 && (
                        <motion.div
                          key="step5"
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <p className="text-slate-400 text-sm mb-1">
                            Déjanos tus datos para enviarte la cotización.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Nombre *</label>
                              <input {...register('name')} type="text" placeholder="Juan Pérez" className={inputCls} />
                              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                              <label className={labelCls}>Empresa *</label>
                              <input {...register('company')} type="text" placeholder="Empresa S.A." className={inputCls} />
                              {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Email *</label>
                              <input {...register('email')} type="email" placeholder="correo@empresa.com" className={inputCls} />
                              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                              <label className={labelCls}>Teléfono *</label>
                              <input {...register('phone')} type="tel" placeholder="+51 9xx xxx xxx" className={inputCls} />
                              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>Información Adicional <span className="text-slate-600 normal-case tracking-normal">(opcional)</span></label>
                            <textarea
                              {...register('additionalInfo')}
                              rows={3}
                              className={inputCls + ' resize-none'}
                              placeholder="Detalles adicionales sobre tu proyecto..."
                            />
                          </div>

                          {/* File Upload */}
                          <div>
                            <label className={labelCls}>Archivos Adjuntos <span className="text-slate-600 normal-case tracking-normal">(opcional)</span></label>
                            <label className="flex flex-col items-center justify-center gap-2 w-full cursor-pointer rounded-xl border border-dashed border-slate-600/60 bg-slate-800/30 hover:bg-slate-800/60 transition-colors py-5 px-4 text-center">
                              <Upload className="w-6 h-6 text-slate-500" />
                              <span className="text-xs text-slate-500">
                                {files.length > 0
                                  ? `${files.length} archivo${files.length > 1 ? 's' : ''} seleccionado${files.length > 1 ? 's' : ''}`
                                  : 'Click para adjuntar planos o documentos'
                                }
                              </span>
                              <span className="text-xs text-slate-600">PDF, DWG, JPG, PNG — Máx. 10MB por archivo</span>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                  const selectedFiles = Array.from(e.target.files || []);
                                  setFiles(selectedFiles);
                                }}
                              />
                            </label>
                            {files.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {files.map((file, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-800/50 px-3 py-2 rounded-lg">
                                    <span className="text-slate-300 truncate">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                                      className="text-red-400 hover:text-red-300 ml-2"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Error */}
                      {submitError && (
                        <div className="mt-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10">
                          <p className="text-red-400 text-xs">{submitError}</p>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-700/50">
                        <button
                          type="button"
                          onClick={prevStep}
                          disabled={step === 1}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-600/50 text-slate-400 hover:text-white hover:border-slate-500 transition-colors text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </button>

                        {step < totalSteps ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff' }}
                          >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-7 py-2.5 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff' }}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Enviando...
                              </>
                            ) : (
                              <>Enviar Solicitud</>
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
