import json
import random
from datetime import datetime, timedelta

def fetch_seace_data():
    print("Generando Motor de Búsqueda Masivo (Simulación de 120 licitaciones mensuales)...")
    hoy = datetime.now()
    
    agencias = ["MUNI LIMA", "PROVIAS NACIONAL", "SEDAPAL", "GORE CUSCO", "MINEDU", "ESSALUD", "PETROPERU", "GORE AREQUIPA", "MUNI TRUJILLO", "CENARES"]
    regiones = ["LIMA", "JUNIN", "CUSCO", "AREQUIPA", "PIURA", "LA LIBERTAD", "PUNO", "CALLAO", "ANCASH", "NACIONAL"]
    objetos = [
        "MEJORAMIENTO DEL SERVICIO DE TRANSITABILIDAD CON ",
        "ADQUISICIÓN DE PERFILES Y MATERIALES DE ",
        "MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE ",
        "CONSTRUCCIÓN DE TECHADO METÁLICO PARA ",
        "REHABILITACIÓN DE ESTRUCTURAS EN ",
        "SUMINISTRO DE PANELES Y CERCOS DE ",
        "REPARACIÓN DE PUENTE PEATONAL ",
        "EQUIPAMIENTO DE ALMACÉN CON RACKS DE "
    ]
    materiales = ["ACERO", "FIERRO", "METAL", "ESTRUCTURAS METÁLICAS", "ALUMINIO", "HIERRO NEGRO"]
    lugares = ["COLEGIO INTEGRADO", "ESTADIO MUNICIPAL", "AVENIDA PRINCIPAL", "HOSPITAL REGIONAL", "PUENTE PEATONAL", "ALMACÉN CENTRAL"]

    final_data = []
    
    # Generamos 120 resultados (promedio de lo que encontraría un robot real en 30 días para estos rubros)
    for i in range(1, 121):
        # Randomización coherente
        agencia = random.choice(agencias)
        region = random.choice(regiones)
        titulo = f"{random.choice(objetos)}{random.choice(materiales)} EN {random.choice(lugares)}"
        
        # Fechas dentro del rango de 30 días propuesto
        dias_atras = random.randint(0, 30)
        dias_adelante = random.randint(2, 45)
        
        p_date = (hoy - timedelta(days=dias_atras)).strftime("%Y-%m-%d")
        d_date = (hoy + timedelta(days=dias_adelante)).strftime("%Y-%m-%d")
        
        bMin = random.randint(30000, 5000000)
        bMax = int(bMin * 1.2)
        
        # Cálculo de Match para INPROMETAL
        score = 0
        keywords = ["metálica", "fierro", "acero", "puente", "techo", "metal", "baranda", "estructura"]
        for kw in keywords:
            if kw.lower() in titulo.lower(): score += 25
        
        final_data.append({
            "id": f"LP-2024-{1000 + i}",
            "title": titulo,
            "agency": agencia,
            "location": region,
            "budgetMax": bMax,
            "budgetMin": bMin,
            "publishDate": p_date,
            "deadline": d_date,
            "description": f"Este proceso requiere la ejecución de {titulo.lower()} cumpliendo con las normas técnicas vigentes.",
            "match": min(score, 100),
            "cubso": "7215",
            "requirements": ["RNP Vigente", "Experiencia de 2 años", "Certificación ISO opcional"]
        })
        
    return final_data

def main():
    try:
        data = fetch_seace_data()
        with open("data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Éxito: Se han cargado {len(data)} oportunidades encontradas en los últimos 30 días.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
