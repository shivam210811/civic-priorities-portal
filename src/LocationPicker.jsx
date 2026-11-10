import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [30.901, 75.857];

const markerIcon = L.divIcon({
  className: "issue-location-marker",
  html: '<div style="width:22px;height:22px;border:4px solid #fff;border-radius:50% 50% 50% 0;background:#087f77;transform:rotate(-45deg);box-shadow:0 2px 8px #0005"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

async function reverseGeocode(latitude, longitude) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  );
  if (!response.ok) throw new Error("Could not find the address for this map point.");
  const data = await response.json();
  return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click: async (event) => {
      const latitude = Number(event.latlng.lat.toFixed(6));
      const longitude = Number(event.latlng.lng.toFixed(6));
      onPick({
        address: `${latitude}, ${longitude}`,
        latitude,
        longitude,
        mapsLink: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
      }, true);
      try {
        const address = await reverseGeocode(latitude, longitude);
        onPick({
          address,
          latitude,
          longitude,
          mapsLink: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
        }, false);
      } catch (error) {
        // Keep the coordinates selected if reverse geocoding is unavailable.
      }
    },
  });
  return null;
}

function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 0.7 });
  }, [position, map]);
  return null;
}

export default function LocationPicker({ value, onChange, disabled = false }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const position = useMemo(() => (
    value ? [value.latitude, value.longitude] : DEFAULT_CENTER
  ), [value?.latitude, value?.longitude]);

  useEffect(() => {
    if (search.trim().length < 3) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&q=${encodeURIComponent(search.trim())}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Location search is temporarily unavailable.");
        const data = await response.json();
        setResults(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unable to search this location.");
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const chooseResult = (item) => {
    const latitude = Number(Number(item.lat).toFixed(6));
    const longitude = Number(Number(item.lon).toFixed(6));
    onChange({
      address: item.display_name,
      latitude,
      longitude,
      mapsLink: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`,
    });
    setSearch(item.display_name);
    setResults([]);
    setError("");
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latitude = Number(coords.latitude.toFixed(6));
        const longitude = Number(coords.longitude.toFixed(6));
        const mapsLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
        let address = `${latitude}, ${longitude}`;
        try {
          address = await reverseGeocode(latitude, longitude);
        } catch (err) {
          setError("GPS location selected, but its address could not be loaded.");
        }
        onChange({ address, latitude, longitude, mapsLink });
        setSearch(address);
        setLocating(false);
      },
      (geoError) => {
        setLocating(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError("Please allow location permission in your browser.");
        } else if (geoError.code === geoError.TIMEOUT) {
          setError("Location request timed out. Please try again.");
        } else {
          setError("Unable to detect your current location.");
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const updateFromMap = (nextValue, keepSearch) => {
    onChange(nextValue);
    if (!keepSearch) setSearch(nextValue.address);
  };

  return (
    <div className="location-picker">
      <div className="location-search-row">
        <input
          className="field"
          type="search"
          value={search}
          disabled={disabled}
          placeholder="Search village, area, landmark or address"
          onChange={(event) => setSearch(event.target.value)}
          autoComplete="off"
        />
        <button
          type="button"
          className="btn btn-primary location-current-btn"
          onClick={useCurrentLocation}
          disabled={disabled || locating}
        >
          {locating ? "Locating..." : "📍 Use my location"}
        </button>
      </div>

      {searching && <p className="location-hint">Searching locations...</p>}
      {results.length > 0 && (
        <div className="location-results">
          {results.map((item) => (
            <button
              type="button"
              key={item.place_id}
              onClick={() => chooseResult(item)}
              disabled={disabled}
            >
              <span>📍</span>
              <span>{item.display_name}</span>
            </button>
          ))}
        </div>
      )}
      {error && <p className="location-error">{error}</p>}

      <div className="location-map-wrap">
        <MapContainer
          center={position}
          zoom={value ? 15 : 7}
          scrollWheelZoom
          style={{ height: "310px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter position={value ? position : null} />
          <MapClickHandler onPick={updateFromMap} />
          {value && (
            <Marker
              position={[value.latitude, value.longitude]}
              icon={markerIcon}
              draggable={!disabled}
              eventHandlers={{
                dragend: async (event) => {
                  const point = event.target.getLatLng();
                  const latitude = Number(point.lat.toFixed(6));
                  const longitude = Number(point.lng.toFixed(6));
                  const mapsLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
                  let address = `${latitude}, ${longitude}`;
                  try { address = await reverseGeocode(latitude, longitude); } catch (err) {}
                  onChange({ address, latitude, longitude, mapsLink });
                  setSearch(address);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="location-hint">Tap anywhere on the map or drag the pin to select the issue location.</p>

      {value && (
        <div className="location-selected">
          <strong>Selected location</strong>
          <span>{value.address}</span>
          <small>Latitude: {value.latitude} · Longitude: {value.longitude}</small>
          <a href={value.mapsLink} target="_blank" rel="noreferrer">Open selected point in map ↗</a>
          <button
            type="button"
            className="location-clear"
            onClick={() => { onChange(null); setSearch(""); }}
            disabled={disabled}
          >
            Clear location
          </button>
        </div>
      )}
    </div>
  );
}
