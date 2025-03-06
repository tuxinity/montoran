import Cookies from "js-cookie";
import { pb } from "./pocketbase";
import type { IAuthAPI } from "@/types/api";

const AuthApi: IAuthAPI = {
  isLoggedIn: (): boolean => {
    return pb.authStore.isValid;
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: { id: string; email: string } }> => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      Cookies.set("pb_auth", pb.authStore.token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return {
        token: authData.token,
        user: {
          id: authData.record.id,
          email: authData.record.email,
        },
      };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: () => {
    pb.authStore.clear();
    Cookies.remove("pb_auth");
  },
};

export default AuthApi;
