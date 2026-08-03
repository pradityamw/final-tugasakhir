import { useState, useEffect } from "react";

/**
 * NgrokImage - komponen gambar yang bisa menembus Ngrok browser warning.
 * Ngrok memblokir <img> tag biasa karena tidak bisa kirim custom header.
 * Komponen ini fetch gambar via axios/fetch dengan header bypass,
 * lalu konversi ke blob URL agar bisa ditampilkan.
 */
const NgrokImage = ({ src, alt, className, style, ...props }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    
    let objectUrl = null;
    
    const fetchImage = async () => {
      try {
        const response = await fetch(src, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        
        if (!response.ok) {
          setError(true);
          return;
        }
        
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error("NgrokImage fetch error:", err);
        setError(true);
      }
    };
    
    fetchImage();
    
    // Cleanup blob URL saat komponen unmount atau src berubah
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

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
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
};

export default NgrokImage;
