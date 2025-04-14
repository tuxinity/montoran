import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

/**
 * Handler for Google OAuth callback API route
 */
export async function POST(request: NextRequest) {
  console.log("API route called");

  try {
    const { code, redirectUri } = await request.json();
    console.log("Received code and redirectUri:", {
      codeLength: code?.length,
      redirectUri,
    });

    if (!code || !redirectUri) {
      console.log("Missing required parameters");
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const tokenData = await exchangeCodeForToken(code, redirectUri);
    if (!tokenData) {
      return NextResponse.json(
        { message: "Failed to exchange code for tokens" },
        { status: 500 },
      );
    }

    const userData = await fetchGoogleUserInfo(tokenData.access_token);
    if (!userData) {
      return NextResponse.json(
        { message: "Failed to fetch user info from Google" },
        { status: 500 },
      );
    }

    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;
    if (!pbUrl) {
      return NextResponse.json(
        { message: "PocketBase URL is not configured" },
        { status: 500 },
      );
    }

    const pb = new PocketBase(pbUrl);

    const existingUser = await findUserByEmail(pb, userData.email);

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not registered",
          details:
            "This email is not registered in our system. Please contact administrator.",
        },
        { status: 404 },
      );
    }

    // User found, try to authenticate
    const authResult = await authenticateExistingUser(
      pb,
      existingUser,
      userData,
    );
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: 500 },
      );
    }

    // Return token and user data
    return NextResponse.json({
      token: authResult.token,
      user: {
        id: existingUser.id as string,
        email: userData.email,
        name: userData.name,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Server error:", err);
    return NextResponse.json(
      {
        message: "Server error",
        details: {
          message: err.message,
          name: err.name,
        },
      },
      { status: 500 },
    );
  }
}

/**
 * Exchange authorization code for access token from Google
 */
async function exchangeCodeForToken(code: string, redirectUri: string) {
  try {
    console.log("Exchanging code for tokens with Google...");
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      console.error("Google token exchange failed:", await response.text());
      return null;
    }

    const tokenData = await response.json();
    console.log("Token exchange successful, access token received");
    return tokenData;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
}

/**
 * Get user information from Google API
 */
async function fetchGoogleUserInfo(accessToken: string) {
  try {
    console.log("Fetching user info from Google...");
    const response = await fetch(GOOGLE_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Google user info fetch failed:", await response.text());
      return null;
    }

    const userData = await response.json();
    console.log("User info fetched successfully:", {
      email: userData.email,
      name: userData.name,
    });
    return userData;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

/**
 * Find user by email in PocketBase
 */
async function findUserByEmail(pb: PocketBase, email: string) {
  try {
    console.log("Checking if user exists in PocketBase by email...");
    const result = await pb.collection("users").getList(1, 1, {
      filter: `email='${email}'`,
    });

    if (result.items.length > 0) {
      console.log("User found by email:", result.items[0].id);
      return result.items[0];
    }

    console.log("User not found by email");
    return null;
  } catch (error) {
    console.error("Error searching for user:", error);
    return null;
  }
}

/**
 * Authenticate existing user
 */
async function authenticateExistingUser(
  pb: PocketBase,
  user: Record<string, unknown>,
  googleData: {
    email: string;
    name: string;
    picture?: string;
    id: string;
  },
) {
  console.log("User exists, trying to authenticate...");

  try {
    // Check if user ID is valid
    if (!user.id || typeof user.id !== "string") {
      console.error("Invalid user ID:", user.id);
      return {
        success: false,
        message: "Invalid user ID",
      };
    }

    // Create a custom token for the user
    const token = await createCustomToken(user.id as string, googleData.email);

    // Set the token in PocketBase auth store
    pb.authStore.save(token, {
      id: user.id as string,
      collectionId: user.collectionId as string,
      collectionName: "users",
      ...user,
    });

    return {
      success: true,
      token: pb.authStore.token,
    };
  } catch (error: unknown) {
    console.error("Error authenticating existing user:", error);
    return {
      success: false,
      message: "Failed to authenticate existing user",
    };
  }
}

/**
 * Create custom token for authentication
 * Note: This is a simple implementation, not secure for production
 */
async function createCustomToken(userId: string, email: string) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    id: userId,
    email: email,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    type: "auth",
  };

  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString("base64")
    .replace(/=+$/, "");

  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/=+$/, "");

  // In production, use crypto to properly sign the token
  const signature = Buffer.from(`${encodedHeader}.${encodedPayload}`)
    .toString("base64")
    .replace(/=+$/, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
