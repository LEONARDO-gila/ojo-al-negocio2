// src/app/components/Mapa.tsx
import { useEffect, useRef, useState } from "react";
import { X, MapPin, Navigation } from "lucide-react";
import { obtenerNegocios, BusinessData } from "../data/NegociosEjemplo";
import DetalleNegocio from "./DetalleNegocio";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapaProps {
  onClose: () => void;
}

const getMarkerIcon = (categoria: string) => {
  const colors: Record<string, string> = {
    "Restaurante / Comida": "#ef4444",
    "Hotel / Hospedaje": "#3b82f6",
    "Tours y actividades": "#f59e0b",
    "Tienda / Retail": "#8b5cf6",
    "Spa / Belleza": "#ec4899",
    "Transporte": "#06b6d4",
    "Otro": "#6b7280",
  };

  const color = colors[categoria] || "#6b7280";
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 16px;
        color: white;
        font-weight: bold;
      ">
        ${categoria === "Restaurante / Comida" ? "🍽️" :
          categoria === "Hotel / Hospedaje" ? "🏨" :
          categoria === "Tours y actividades" ? "🗺️" :
          categoria === "Tienda / Retail" ? "🛍️" :
          categoria === "Spa / Belleza" ? "💆" :
          categoria === "Transporte" ? "🚗" : "📍"}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function Mapa({ onClose }: MapaProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [negocioSeleccionado, setNegocioSeleccionado] = useState<BusinessData | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    if (!mapRef.current || map) return;

    const mapInstance = L.map(mapRef.current, {
      center: [21.1619, -86.8515],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const negocios = obtenerNegocios();

    const ubicaciones: Record<string, [number, number]> = {
      "La Parrilla del Chef": [21.1619, -86.8515],
      "Hotel Caribe Sunset": [21.1375, -86.7422],
      "Aventuras Mayas Tours": [20.6296, -87.0793],
      "Spa del Mar": [20.5127, -86.9448],
      "Rent Car Cancún": [21.1619, -86.8515],
      "La Tienda del Pueblo": [20.6883, -88.2002],
      "Mariscos El Puerto": [20.8478, -86.8775],
      "Hotel Paraíso Maya": [20.6301, -87.0787],
      "Eco Tours Isla Mujeres": [21.2413, -86.7398],
      "Farmacia del Caribe": [21.1619, -86.8515],
    };

    const markers: L.Marker[] = [];

    negocios.forEach((negocio, index) => {
      let coords = ubicaciones[negocio.nombre];
      
      if (!coords) {
        const baseLat = 21.1619;
        const baseLng = -86.8515;
        coords = [
          baseLat + (index % 3) * 0.02 - 0.02,
          baseLng + (index % 2) * 0.02 - 0.01
        ];
      }

      const marker = L.marker(coords, {
        icon: getMarkerIcon(negocio.categoria),
        title: negocio.nombre,
      });

      const popupContent = `
        <div style="min-width: 200px; max-width: 280px; padding: 4px;">
          <h3 style="font-weight: 600; font-size: 16px; color: #1e293b; margin: 0 0 4px 0;">
            ${negocio.nombre}
          </h3>
          <p style="font-size: 13px; color: #64748b; margin: 0 0 4px 0;">
            ${negocio.giro}
          </p>
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin: 4px 0;">
            <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
              ${negocio.categoria}
            </span>
            ${negocio.verificado ? `
              <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                ✓ Verificado
              </span>
            ` : ''}
            ${negocio.calificacion ? `
              <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                ★ ${negocio.calificacion}
              </span>
            ` : ''}
          </div>
          <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">
            📍 ${negocio.direccion}
          </p>
          <button 
            onclick="window.verDetalle('${negocio.id}')"
            style="
              margin-top: 8px;
              background: #1e3a8a; 
              color: white; 
              border: none; 
              padding: 6px 16px; 
              border-radius: 6px; 
              font-size: 13px; 
              cursor: pointer;
              width: 100%;
              font-weight: 500;
            "
          >
            📋 Ver detalle completo
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(map);
      markers.push(marker);

      (window as any).verDetalle = (id: string) => {
        const negocioEncontrado = negocios.find(n => n.id === id);
        if (negocioEncontrado) {
          setNegocioSeleccionado(negocioEncontrado);
          setMostrarDetalle(true);
          marker.closePopup();
        }
      };
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Forzar actualización del mapa
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map]);

  const handleFavoritoToggle = (id: string) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("⚠️ Inicia sesión para agregar favoritos");
      return;
    }
    const user = JSON.parse(currentUser);
    const favs = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favs));
      alert("❤️ Agregado a favoritos");
    } else {
      const newFavs = favs.filter((f: string) => f !== id);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavs));
      alert("❌ Eliminado de favoritos");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-white shrink-0">
            <div className="flex items-center gap-3">
              <MapPin size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-blue-900">Mapa de Negocios</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                {obtenerNegocios().length} negocios
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative bg-gray-100">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ minHeight: "400px", height: "100%" }}
            />
            {!map && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                  <p className="text-gray-500">Cargando mapa...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm">
              💡 Haz clic en un marcador y luego en "Ver detalle completo"
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-white shrink-0 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">Categorías:</span>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">🍽️ Restaurante</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">🏨 Hotel</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">🗺️ Tours</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">🛍️ Tienda</span>
                <span className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">💆 Spa</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (map) {
                    map.setView([21.1619, -86.8515], 12);
                  }
                }}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Ver todos
              </button>
              <button
                onClick={() => {
                  if (map) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        map.setView([pos.coords.latitude, pos.coords.longitude], 14);
                      },
                      () => {
                        alert("⚠️ No se pudo obtener tu ubicación");
                      }
                    );
                  }
                }}
                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center gap-1"
              >
                <Navigation size={14} />
                Mi ubicación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      {mostrarDetalle && negocioSeleccionado && (
        <DetalleNegocio
          negocio={negocioSeleccionado}
          onClose={() => {
            setMostrarDetalle(false);
            setNegocioSeleccionado(null);
          }}
          onFavoritoToggle={handleFavoritoToggle}
        />
      )}
    </>
  );
}