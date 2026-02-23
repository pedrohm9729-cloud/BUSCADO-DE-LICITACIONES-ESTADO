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
    Nota: En una implementación real, aquí descargaríamos el CSV diario del OSCE.
    Para este prototipo avanzado, simulamos la extracción de la fuente oficial
    y generamos el archivo data.json que alimentará el dashboard.
    """
    print("Iniciando extracción de datos SEACE...")
    
    # Simulación de data real filtrada que el bot encontraría hoy
    real_opportunities = [
        {
            "id": "LP-SM-2-2024-MUNI-1",
            "title": "MEJORAMIENTO DEL SERVICIO DE TRANSITABILIDAD CON PUENTE RETICULADO",
            "agency": "MUNICIPALIDAD DISTRITAL",
            "location": "JUNIN",
            "budgetMin": 850000,
            "budgetMax": 1200000,
            "deadline": "2024-11-20",
            "publishDate": datetime.now().strftime("%Y-%m-%d"),
            "cubso": "7215",
            "match": 98,
            "status": "Abierta"
        },
        {
            "id": "AS-SM-15-2024-GR-2",
            "title": "ADQUISICIÓN DE PERFILES ESTRUCTURALES Y PLANCHAS DE ACERO",
            "agency": "GOBIERNO REGIONAL",
            "location": "LIMA",
            "budgetMin": 45000,
            "budgetMax": 60000,
            "deadline": "2024-11-12",
            "publishDate": datetime.now().strftime("%Y-%m-%d"),
            "cubso": "9514",
            "match": 95,
            "status": "Abierta"
        }
    ]
    
    return real_opportunities

def main():
    try:
        data = fetch_seace_data()
        with open("data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Éxito: Se encontraron {len(data)} nuevas oportunidades.")
    except Exception as e:
        print(f"Error en el robot: {e}")

if __name__ == "__main__":
    main()
