import { useRef, useState, useEffect } from "react";

import actuallife from "../../../assets/images/carousel/actuallife.jpg";
import arca from "../../../assets/images/carousel/ArcaKickI.jpg";
import boleros from "../../../assets/images/carousel/bolerospsicodelicos.jpg";
import madrileno from "../../../assets/images/carousel/elmadrileño.jpg";
import headphone from "../../../assets/images/carousel/Headphonemasterpiece.jpg";
import jpeg from "../../../assets/images/carousel/Jpegmafia.jpg";
import simz from "../../../assets/images/carousel/Little-Simz.webp";
import stereo from "../../../assets/images/carousel/StereoMadness.jpg";
import vigilante from "../../../assets/images/carousel/Vigilante.jpg";
import yves from "../../../assets/images/carousel/Yvestumor.jpg";
// ─── Datos de ejemplo — reemplaza con tus álbumes ────────────────────────────
// Para obtener spotifyUrl exacto: abre el álbum en Spotify → ··· → Compartir → Copiar enlace
const DEFAULT_ALBUMS = [
  {
    id: "1",
    title: "The Headphone Masterpiece",
    artist: "Cody Chesnutt",
    img: headphone,
    spotifyUrl: "https://open.spotify.com/search/Cody%20Chesnutt%20Headphone%20Masterpiece",
  },
  {
    id: "2",
    title: "Vigilante",
    artist: "Willie Colón & Héctor Lavoe",
    img: vigilante,
    spotifyUrl: "https://open.spotify.com/search/Vigilante%20Willie%20Colon%20Lavoe",
  },
  {
    id: "3",
    title: "Ciberfunk",
    artist: "Stereomadness",
    img: stereo,
    spotifyUrl: "https://open.spotify.com/search/Stereomadness%20Ciberfunk",
  },
  {
    id: "4",
    title: "Actual Life 3",
    artist: "Fred again..",
    img: actuallife,
    spotifyUrl: "https://open.spotify.com/search/Fred%20again%20Actual%20Life%203",
  },
  {
    id: "5",
    title: "Heaven To A Tortured Mind",
    artist: "Yves Tumor",
    img: yves,
    spotifyUrl: "https://open.spotify.com/search/Yves%20Tumor%20Heaven%20To%20A%20Tortured%20Mind",
  },
  {
    id: "6",
    title: "Kick I",
    artist: "Arca",
    img: arca,
    spotifyUrl: "https://open.spotify.com/search/Arca%20Kick%20I",
  },
  {
    id: "7",
    title: "LP!",
    artist: "JPEGMAFIA",
    img: jpeg,
    spotifyUrl: "https://open.spotify.com/search/JPEGMAFIA%20LP",
  },
  {
    id: "8",
    title: "Sometimes I Might Be Introvert",
    artist: "Little Simz",
    img: simz,
    spotifyUrl: "https://open.spotify.com/search/Little%20Simz%20Sometimes%20I%20Might%20Be%20Introvert",
  },
  {
    id: "9",
    title: "Boleros Psicodélicos",
    artist: "Adrian Quesada",
    img: boleros,
    spotifyUrl: "https://open.spotify.com/search/Adrian%20Quesada%20Boleros%20Psicodelicos",
  },
  {
    id: "10",
    title: "El Madrileño",
    artist: "C. Tangana",
    img: madrileno,
    spotifyUrl: "https://open.spotify.com/search/C%20Tangana%20El%20Madrileno",
  },
];

// ─── Icono de Spotify ─────────────────────────────────────────────────────────
function SpotifyIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

// ─── Tarjeta de álbum individual ──────────────────────────────────────────────
function AlbumCard({ album, itemSize }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    window.open(album.spotifyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${album.title} — ${album.artist}`}
      style={{
        position: "relative",
        width: itemSize,
        flexShrink: 0,
        cursor: "pointer",
        transform: hovered ? "scale(1.18)" : "scale(1)",
        transition: "transform 0.7s cubic-bezier(.22,.68,0,1.4)",
        zIndex: hovered ? 50 : 1,
      }}
    >
      {/* Portada */}
      <img
        src={album.img}
        alt={`${album.title} por ${album.artist}`}
        loading="lazy"
        style={{
          width: itemSize,
          height: itemSize,
          objectFit: "cover",
          display: "block",
          borderRadius: 1,
          boxShadow: hovered
            ? "0 12px 40px rgba(0,0,0,0.35)"
            : "0 4px 16px rgba(0,0,0,0.18)",
          transition: "box-shadow 0.35s ease",
        }}
      />

      {/* Badge Spotify */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 20,
          right: 8,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#1DB954",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.6)",
          transition:
            "opacity 0.2s ease, transform 0.25s cubic-bezier(.22,.68,0,1.4)",
          pointerEvents: "none",
        }}
      >
        <SpotifyIcon size={14} />
      </div>

      {/* Info debajo */}
      <div
        style={{
          position: "relative",
          bottom: -30,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
          marginBottom: 100,
        }}
      >
        <p
          style={{
            fontSize: 18,
            fontFamily: 'ClashDisplay-Bold, sans-serif',
            fontWeight: 600,
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "0 4px",
          }}
        >
          {album.title}
        </p>
        <p
          style={{
            fontSize: 16,
            margin: 0,
            whiteSpace: "nowrap",
            fontFamily: 'ClashDisplay-Bold, sans-serif',
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "0 4px",
            opacity: 0.55,
          }}
        >
          {album.artist}
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
/**
 * AlbumCarousel
 *
 * Props:
 * @param {Array}   albums      - Array de { id, title, artist, img, spotifyUrl }
 * @param {number}  itemSize    - Tamaño en px de cada álbum (default: 160)
 * @param {number}  gap         - Espacio entre álbumes en px (default: 16)
 * @param {number}  speed       - Duración de la animación en segundos (default: 30)
 * @param {string}  label       - Texto encima del carrusel (default: "Good Sound")
 * @param {boolean} showLabel   - Mostrar o no el label (default: true)
 * @param {string}  fadeColor   - Color de fondo de tu página para el efecto fade (default: "#ffffff")
 */
export default function AlbumCarousel({
  albums = DEFAULT_ALBUMS,
  itemSize = 300,
  gap = 30,
  speed = 30,
  label = "❝Albumes recomendados por el equipo de CRATE para empezar a escribir tus primeras reseñas❞",
  showLabel = true,
}) {
  const [paused, setPaused] = useState(false);

  // Duplicamos para bucle infinito sin saltos
  const doubled = [...albums, ...albums];

  // Inyectamos keyframes una sola vez
  useEffect(() => {
    const styleId = "album-carousel-keyframes";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes albumScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      {/* Label opcional */}
      {showLabel && (
        <p
          style={{
            textAlign: "center",
            fontSize: 30,
            fontFamily: 'ClashDisplay-Bold, sans-serif',
            textTransform: "uppercase",
            marginBottom: 30,
            marginTop: 0,
            marginLeft:450,
            marginRight:450,
            
          }}
        >
          {label}
        </p>
      )}

      {/* Contenedor con fades laterales */}
      <div
        style={{ position: "relative",
                overflow: "hidden",
                overflowY: "visible",
                padding: "50px 0 78px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade izquierdo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        {/* Fade derecho */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Track animado */}
        <div
          style={{
            display: "flex",
            gap,
            width: "max-content",
            animation: `albumScroll ${speed}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            position: "relative"
          }}
        >
          {doubled.map((album, i) => (
            <AlbumCard
              key={`${album.id}-${i}`}
              album={album}
              itemSize={itemSize}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCCIONES DE USO
// ─────────────────────────────────────────────────────────────────────────────
//
// 1. Copia este archivo a tu proyecto como AlbumCarousel.jsx
//
// 2. Importa y usa el componente:
//    import AlbumCarousel from "./AlbumCarousel";
//    <AlbumCarousel />
//
// 3. Para usar tus propios álbumes, pasa el prop `albums`:
//
//    const myAlbums = [
//      {
//        id: "1",
//        title: "Nombre del álbum",
//        artist: "Artista",
//        img: "https://...",                               // URL de la portada
//        spotifyUrl: "https://open.spotify.com/album/ID", // Enlace directo de Spotify
//      },
//      // ...más álbumes
//    ];
//
//    <AlbumCarousel albums={myAlbums} />
//
// 4. Props disponibles:
//    - albums      → tus álbumes (array)
//    - itemSize    → tamaño de cada portada en px (default: 160)
//    - gap         → espacio entre álbumes en px (default: 16)
//    - speed       → velocidad del scroll (más alto = más lento, default: 30)
//    - label       → texto encima del carrusel (default: "Good Sound")
//    - showLabel   → mostrar/ocultar el label (default: true)
//    - fadeColor   → color de fondo de tu página para el efecto fade (default: "#ffffff")
//                    Si tu fondo es oscuro: fadeColor="#111111"
//
// 5. IMPORTANTE — el fadeColor debe coincidir con el color de fondo de tu página.
//    Si no, los bordes del carrusel no se verán bien. Ejemplo:
//    <AlbumCarousel fadeColor="#0f0f0f" />
//
// 6. Para conectar con la Spotify Web API y obtener portadas oficiales:
//    https://developer.spotify.com/documentation/web-api
//    Necesitas un Client ID + Client Secret y hacer fetch a:
//    GET https://api.spotify.com/v1/albums/{id}
