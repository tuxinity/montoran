import PocketBase from "pocketbase";

const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (!pocketbaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_POCKETBASE_URL is not defined in environment variables"
  );
}

export const pb = new PocketBase(pocketbaseUrl);
