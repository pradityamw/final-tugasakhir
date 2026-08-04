import { useState, useEffect } from "react";

/**
 * NgrokImage - Komponen gambar yang otomatis menangani:
 * 1. Ngrok browser warning (menggunakan fetch + blob URL)
 * 2. URL biasa / localhost / data URL (langsung <img> tag)
 * 3. Fallback jika URL ngrok mati (otomatis ganti ke VITE_BASE_URL)
 */
const NgrokImage = ({ src, alt, className, style, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);

  const getBaseUrl = () => import.meta.env.VITE_BASE_URL || "http://localhost:2000";

  useEffect(() => {
    setError(false);
    setBlobUrl(null);
    setCurrentSrc(null);

    if (!src) {
      setError(true);
      return;
    }

    const isNgrok = typeof src === "string" && src.includes("ngrok");

    // Jika bukan ngrok (localhost, data URL, relative path, atau domain standar)
    if (!isNgrok) {
      if (typeof src === "string" && src.startsWith("/")) {
        setCurrentSrc(`${getBaseUrl()}${src}`);
      } else {
        setCurrentSrc(src);
      }
      return;
    }

    // Jika URL adalah Ngrok, fetch dengan header bypass agar tidak kena warning page
    let objectUrl = null;
    let isMounted = true;

    const fetchNgrokImage = async () => {
      try {
        const response = await fetch(src, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        if (isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        }
      } catch (err) {
        // Jika fetch Ngrok gagal (misal domain ngrok mati), fallback ke VITE_BASE_URL
        if (isMounted) {
          try {
            const urlObj = new URL(src);
            const fallback = `${getBaseUrl()}${urlObj.pathname}`;
            setCurrentSrc(fallback);
          } catch (e) {
            setError(true);
          }
        }
      }
    };

    fetchNgrokImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  const handleError = () => {
    if (currentSrc) {
      const baseUrl = getBaseUrl();
      if (currentSrc.includes("ngrok")) {
        try {
          const urlObj = new URL(currentSrc);
          const fallback = `${baseUrl}${urlObj.pathname}`;
          if (fallback !== currentSrc) {
            setCurrentSrc(fallback);
            return;
          }
        } catch (e) {}
      } else if (!currentSrc.startsWith(baseUrl) && currentSrc.includes("/img-proxy/")) {
        try {
          const urlObj = new URL(currentSrc);
          const fallback = `${baseUrl}${urlObj.pathname}`;
          if (fallback !== currentSrc) {
            setCurrentSrc(fallback);
            return;
          }
        } catch (e) {}
      }
    }
    setError(true);
  };

  if (error) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
          color: "#9ca3af",
          fontSize: "12px",
          ...style,
        }}
        {...props}
      >
        No Image
      </div>
    );
  }

  // Render blobUrl (untuk Ngrok) atau currentSrc (untuk non-ngrok / fallback)
  const imageSource = blobUrl || currentSrc;

  if (!imageSource) {
    return (
      <div
        className={className}
        style={{
          backgroundColor: "#f3f4f6",
          animation: "pulse 2s infinite",
          ...style,
        }}
        {...props}
      />
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt || "product"}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
};

export default NgrokImage;
