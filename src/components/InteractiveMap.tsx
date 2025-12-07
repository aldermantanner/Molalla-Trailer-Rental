import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background-color: #16a34a; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const primaryMarkerIcon = L.divIcon({
  className: 'custom-marker-primary',
  html: '<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const baseMarkerIcon = L.divIcon({
  className: 'custom-marker-base',
  html: '<div style="background-color: #dc2626; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.5); position: relative;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const molallaCoords: [number, number] = [45.1484, -122.5784];

    const map = L.map(mapRef.current, {
      center: molallaCoords,
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.circle(molallaCoords, {
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.1,
      weight: 2,
      radius: 48280,
    }).addTo(map);

    const cities = [
      { name: 'Molalla', coords: [45.1484, -122.5784] as [number, number], type: 'base' },
      { name: 'Canby', coords: [45.2629, -122.6926] as [number, number], type: 'primary' },
      { name: 'Oregon City', coords: [45.3573, -122.6068] as [number, number], type: 'primary' },
      { name: 'Woodburn', coords: [45.1437, -122.8554] as [number, number], type: 'extended' },
      { name: 'Silverton', coords: [45.0048, -122.7834] as [number, number], type: 'extended' },
      { name: 'Estacada', coords: [45.2893, -122.3357] as [number, number], type: 'extended' },
      { name: 'Wilsonville', coords: [45.2998, -122.7737] as [number, number], type: 'extended' },
      { name: 'West Linn', coords: [45.3651, -122.6123] as [number, number], type: 'extended' },
      { name: 'Lake Oswego', coords: [45.4207, -122.6706] as [number, number], type: 'extended' },
      { name: 'Gladstone', coords: [45.3812, -122.5945] as [number, number], type: 'extended' },
      { name: 'Milwaukie', coords: [45.4462, -122.6395] as [number, number], type: 'extended' },
      { name: 'Sandy', coords: [45.3976, -122.2612] as [number, number], type: 'extended' },
    ];

    cities.forEach((city) => {
      const icon = city.type === 'base' ? baseMarkerIcon : city.type === 'primary' ? primaryMarkerIcon : markerIcon;

      const marker = L.marker(city.coords, { icon }).addTo(map);

      let popupContent = '';
      if (city.type === 'base') {
        popupContent = `<div style="text-align: center; font-weight: bold; color: #dc2626;">
          <div style="font-size: 16px;">${city.name}</div>
          <div style="font-size: 12px; font-weight: normal; color: #374151; margin-top: 4px;">Our Base Location</div>
        </div>`;
      } else if (city.type === 'primary') {
        popupContent = `<div style="text-align: center; font-weight: bold; color: #22c55e;">
          <div style="font-size: 14px;">${city.name}</div>
          <div style="font-size: 11px; font-weight: normal; color: #374151; margin-top: 2px;">Primary Service Area</div>
        </div>`;
      } else {
        popupContent = `<div style="text-align: center;">
          <div style="font-size: 14px; font-weight: 600; color: #374151;">${city.name}</div>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Extended Service Area</div>
        </div>`;
      }

      marker.bindPopup(popupContent);
    });

    const bounds = L.latLngBounds(cities.map(city => city.coords));
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-b-xl"
      style={{ background: '#f0f0f0' }}
    />
  );
}
