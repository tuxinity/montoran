import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const model = searchParams.get("model");
    const year = searchParams.get("year");
    const imageUrl = searchParams.get("image");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Background with overlay */}
          {imageUrl && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.7)",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              zIndex: 10,
              padding: "20px",
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.2,
                marginBottom: "20px",
              }}
            >
              {year} {brand} {model}
            </h1>
            <p
              style={{
                fontSize: 30,
                color: "white",
                opacity: 0.9,
              }}
            >
              Available at Montoran
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate OG image`, {
      status: 500,
    });
  }
}
