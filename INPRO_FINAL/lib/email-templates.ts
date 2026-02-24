export const EMAIL_TEMPLATES = {
    DAY_1: {
        subject: "Bienvenido a Licitador PE. Encuentra tu primera oportunidad hoy.",
        body: (companyName: string) => `
      Hola ${companyName},
      
      Tu cuenta gratuita de 15 días está activa. No pierdas tiempo en el SEACE buscando manualmente. 
      
      Ingresa ahora, busca tu rubro (ej. estructuras metálicas, tecnología, salud) y descubre qué procesos tienen más del 75% de Match con tu empresa.
      
      [Ingresar al Dashboard: https://licitador.pe/dashboard]
      
      Atentamente,
      El Equipo de Licitador PE
    `
    },
    DAY_4: {
        subject: "Deja que la IA analice las bases por ti 🤖",
        body: () => `
      ¿Sabías que no necesitas leer expedientes de 200 páginas? 
      
      Entra a cualquier licitación y usa nuestro botón 'Análisis Bid / No-Bid'. La IA te dirá al instante si cumples los requisitos. 
      Si es viable, muévela a tu columna 'En Cotización' en tu tablero Kanban para no perderla de vista.
      
      [Probar IA ahora: https://licitador.pe/dashboard]
    `
    },
    DAY_10: {
        subject: "El SEACE cambia fechas sin avisar. Nosotros no.",
        body: () => `
      En las ventas al Estado, perder una adenda significa la descalificación. 
      Tu tablero de 'Mis Licitaciones' te protege monitoreando cambios en tiempo real. 
      
      Revisa tu embudo hoy y asegúrate de no perder ninguna fecha de cierre.
      
      [Ver mi Tablero: https://licitador.pe/dashboard]
    `
    },
    DAY_15: {
        subject: "⚠️ Tu acceso a Licitador PE expira mañana.",
        body: () => `
      Mañana finaliza tu periodo de prueba. 
      
      Si no actúas, perderás el acceso a tu tablero Kanban, tu historial de licitaciones guardadas y el motor de IA para extraer cotizaciones. 
      Mantén la ventaja sobre tu competencia y no regreses al caos manual.
      
      [Seleccionar Plan y Reactivar Acceso: https://licitador.pe/billing]
    `
    }
};
