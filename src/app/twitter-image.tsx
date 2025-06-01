import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ArtiLink - Art Platform";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: "bold", marginBottom: 20 }}>
          ArtiLink
        </div>
        <div style={{ fontSize: 36, opacity: 0.9 }}>
          Discover • Share • Connect
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}