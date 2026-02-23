import requests
import json
import os
import pandas as pd
from datetime import datetime

# Configuración de búsqueda de INPROMETAL
KEYWORDS = ["metálica", "fierro", "hierro", "puente", "techo", "metal", "baranda", "estructura"]
NEGATIVE_KEYWORDS = ["consultoría", "limpieza", "seguridad", "alimento", "transporte de personal"]
CUBSO_TARGETS = ["7215", "9514"]

def fetch_seace_data():
    """
    En una implementación real, aquí descargaríamos el CSV diario del OSCE.
    Para este prototipo avanzado, generamos data rica para la vista de detalle.
    """
    print("Iniciando extracción de datos SEACE...")
    
    real_opportunities = [
        {
            "id": "LP-SM-2-2024-MUNI-1",
            "title": "MEJORAMIENTO DEL SERVICIO DE TRANSITABILIDAD CON PUENTE RETICULADO",
            "agency": "MUNICIPALIDAD DISTRITAL DE EL TAMBO",
            "location": "JUNIN",
            "budgetMin": 850000,
            "budgetMax": 1200000,
            "deadline": "2024-11-20",
            "publishDate": datetime.now().strftime("%Y-%m-%d"),
            "cubso": "7215",
            "description": "Ejecución de obra para el techado y reforzamiento de puente peatonal con estructuras de acero galvanizado. Incluye perfiles H e I.",
            "match": 98,
            "status": "Abierta",
            "requirements": [
                "Experiencia en obras similares (Puentes o Estructuras Pesadas)",
                "Capacidad financiera mayor a S/ 500k",
                "Certificación de calidad de materiales (Acero ASTM A36)"
            ]
        },
        {
            "id": "AS-SM-15-2024-GR-2",
            "title": "ADQUISICIÓN DE PERFILES ESTRUCTURALES Y PLANCHAS DE ACERO",
            "agency": "GOBIERNO REGIONAL DE LIMA - SEDE CENTRAL",
            "location": "LIMA",
            "budgetMin": 45000,
            "budgetMax": 60000,
            "deadline": "2024-11-12",
            "publishDate": datetime.now().strftime("%Y-%m-%d"),
            "cubso": "9514",
            "description": "Suministro de materiales de fierro negro y perfiles estructurales para el mantenimiento de almacenes regionales.",
            "match": 95,
            "status": "Abierta",
            "requirements": [
                "Registro Nacional de Proveedores (Bienes)",
                "Plazo de entrega no mayor a 15 días",
                "Cotización formal con IGV incluido"
            ]
        },
        {
            "id": "LIC-2024-3341",
            "title": "SERVICIO DE FABRICACIÓN DE BARANDAS METÁLICAS PARA PARQUE INDUSTRIAL",
            "agency": "CORE - GOBIERNO REGIONAL",
            "location": "CALLAO",
            "budgetMin": 120000,
            "budgetMax": 150000,
            "deadline": "2024-11-25",
            "publishDate": "2024-10-22",
            "cubso": "9514",
            "description": "Fabricación e instalación de 300 metros lineales de barandas de fierro con acabado en pintura epóxica.",
            "match": 90,
            "status": "Abierta",
            "requirements": [
                "Taller de fabricación propio",
                "Experiencia mínima de 2 años en servicios metalmecánicos",
                "Cumplimiento de normas de seguridad industrial"
            ]
        }
    ]
    
    return real_opportunities

def main():
    try:
        data = fetch_seace_data()
        with open("data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Éxito: Se encontraron {len(data)} nuevas oportunidades para INPROMETAL.")
    except Exception as e:
        print(f"Error en el robot: {e}")

if __name__ == "__main__":
    main()
