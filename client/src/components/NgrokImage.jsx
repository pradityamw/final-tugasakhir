import { useState, useEffect } from "react";

/**
 * NgrokImage - komponen gambar yang menembus Ngrok browser warning,
 * dan secara otomatis menangani fallback jika URL ngrok mati / offline.
 */
const NgrokImage = ({ src, alt, className, style, ...props }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);
  const [directSrc, setDirectSrc] = useState(null);

  useEffect(() => {
    setError(false);
    setBlobUrl(null);
    setDirectSrc(null);

    if (!src) {
      setError(true);
      return;
    }

    let objectUrl = null;
    let isMounted = true;

    const tryFetch = async (targetUrl, isNgrok) => {
      const headers = isNgrok ? { "ngrok-skip-browser-warning": "true" } : {};
      const response = await fetch(targetUrl, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.blob();
    };

    const fetchImage = async () => {
      try {
        const isNgrok = typeof src === "string" && src.includes("ngrok");
        let blob;

        try {
          blob = await tryFetch(src, isNgrok);
        } catch (primaryErr) {
          // Jika URL ngrok mati / error, coba fallback ke local VITE_BASE_URL
          const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:2000";
          if (isNgrok) {
            try {
              const urlObj = new URL(src);
              const fallbackUrl = `${baseUrl}${urlObj.pathname}`;
              blob = await tryFetch(fallbackUrl, false);
            } catch (fallbackErr) {
              throw primaryErr;
            }
          } else if (typeof src === "string" && src.startsWith("/")) {
            const fallbackUrl = `${baseUrl}${src}`;
            blob = await tryFetch(fallbackUrl, false);
          } else {
            throw primaryErr;
          }
        }

        if (isMounted && blob) {
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        }
      } catch (err) {
        if (isMounted) {
          // Jika fetch blob gagal, fallback ke direct src
          let finalDirect = src;
          const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:2000";
          if (typeof src === "string" && src.includes("ngrok")) {
            try {
              const urlObj = new URL(src);
              finalDirect = `${baseUrl}${urlObj.pathname}`;
            } catch (e) {}
          }
          setDirectSrc(finalDirect);
        }
      }
    };

    if (typeof src === "string" && (src.startsWith("data:") || src.startsWith("blob:"))) {
      setDirectSrc(src);
    } else {
      fetchImage();
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  const handleDirectError = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:2000";
    if (directSrc && directSrc.includes("ngrok")) {
      try {
        const urlObj = new URL(directSrc);
        const fallbackUrl = `${baseUrl}${urlObj.pathname}`;
        if (fallbackUrl !== directSrc) {
          setDirectSrc(fallbackUrl);
          return;
        }
      } catch (e) {}
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

  if (directSrc) {
    return (
      <img
        src={directSrc}
        alt={alt || "product"}
        className={className}
        style={style}
        onError={handleDirectError}
        {...props}
      />
    );
  }

  if (!blobUrl) {
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
      src={blobUrl}
      alt={alt || "product"}
      className={className}
      style={style}
      onError={handleDirectError}
      {...props}
    />
  );
};

export default NgrokImage;
