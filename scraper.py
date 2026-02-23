import requests
import json
import os
import pandas as pd
from datetime import datetime, timedelta

# AJUSTE DE SEGURIDAD BASADO EN ANÁLISIS DE PLAZOS SEACE
# 30 días garantiza capturar Licitaciones Públicas y Adjudicaciones Simplificadas
DIAS_DE_ANTIGUEDAD = 30 

CORE_KEYWORDS = ["metálica", "fierro", "hierro", "acero", "puente", "techo", "metal", "baranda", "estructura"]
BROAD_KEYWORDS = ["mantenimiento", "limpieza", "pintura", "suministro", "obra", "rehabilitación", "cerco", "almacén", "edificación"]

def fetch_seace_data():
    print(f"Buscando licitaciones publicadas en los últimos {DIAS_DE_ANTIGUEDAD} días...")
    fecha_limite = datetime.now() - timedelta(days=DIAS_DE_ANTIGUEDAD)
    
    # Simulación con fechas que ahora sí entrarían
    raw_data = [
        {
            "id": "LP-SM-2-2024-MUNI-1",
            "title": "MEJORAMIENTO DEL SERVICIO DE TRANSITABILIDAD CON PUENTE RETICULADO",
            "agency": "MUNICIPALIDAD DISTRITAL DE EL TAMBO",
            "location": "JUNIN", "budgetMax": 1200000, "budgetMin": 850000,
            "deadline": "2024-11-20", "publishDate": datetime.now().strftime("%Y-%m-%d"),
            "cubso": "7215", "description": "Obra de metalmecánica para puente.",
            "requirements": ["Acero ASTM A36"]
        },
        {
            "id": "OBRA-VALIOSA-020",
            "title": "CONSTRUCCIÓN DE TECHADO METÁLICO PARA COMPLEJO DEPORTIVO",
            "agency": "MUNICIPALIDAD DE LIMA",
            "location": "LIMA", "budgetMax": 450000, "budgetMin": 300000,
            "deadline": "2024-11-25", "publishDate": (datetime.now() - timedelta(days=20)).strftime("%Y-%m-%d"), 
            "cubso": "7215", "description": "Estructuras ligeras.",
            "requirements": ["Experiencia 2 años"]
        }
    ]
    
    final_opportunities = []
    for item in raw_data:
        obj_fecha = datetime.strptime(item["publishDate"], "%Y-%m-%d")
        if obj_fecha >= fecha_limite:
            # Cálculo de Match
            score = sum(25 for kw in CORE_KEYWORDS if kw in item["title"].lower())
            item["match"] = min(score, 100)
            final_opportunities.append(item)
            
    return final_opportunities

def main():
    try:
        data = fetch_seace_data()
        with open("data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Éxito: Motor actualizado con rango de {DIAS_DE_ANTIGUEDAD} días.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
