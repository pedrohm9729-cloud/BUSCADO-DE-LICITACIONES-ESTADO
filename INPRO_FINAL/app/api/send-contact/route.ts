import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { name, company, email, phone, projectType, message, isUrgent } = data;

    // Validate required fields
    if (!name || !company || !email || !phone || !projectType || !message) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Configure SMTP transporter (Hostinger)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .section h2 { margin-top: 0; color: #1e3a8a; font-size: 18px; }
          .field { margin-bottom: 12px; }
          .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
          .value { color: #1e293b; font-size: 16px; margin-top: 4px; }
          .urgent-badge { display: inline-block; background: #dc2626; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📧 Nueva Solicitud de Contacto</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">INPROMETAL</p>
            ${isUrgent ? '<p class="urgent-badge">⚡ URGENTE</p>' : ''}
          </div>
          <div class="content">
            <div class="section">
              <h2>👤 Información del Cliente</h2>
              <div class="field">
                <div class="label">Nombre Completo</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Empresa</div>
                <div class="value">${company}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Teléfono</div>
                <div class="value"><a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></div>
              </div>
            </div>

            <div class="section">
              <h2>📦 Tipo de Proyecto</h2>
              <div class="value">${projectType}</div>
            </div>

            <div class="section">
              <h2>💬 Mensaje</h2>
              <div class="value" style="white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>Mensaje recibido desde www.inprometal.com.pe</p>
            <p>Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to both recipients
    const recipients = process.env.SMTP_TO?.split(',') || ['operaciones@inprometal.com.pe', 'administracion@inprometal.com.pe'];

    await transporter.sendMail({
      from: `"INPROMETAL - Contacto" <${process.env.SMTP_USER}>`,
      to: recipients.join(', '),
      subject: `${isUrgent ? '⚡ URGENTE - ' : ''}Nueva Solicitud - ${projectType} - ${company}`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error al enviar el mensaje',
      },
      { status: 500 }
    );
  }
}
