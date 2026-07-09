declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
  export function useScroll(options?: any): any;
  export function useTransform(input: any, inputRange: any, outputRange: any): any;
}

declare module "next-auth" {
  export type DefaultSession = {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: string;
  };

  export type AuthOptions = {
    providers: any[];
    callbacks?: {
      jwt?: (params: any) => Promise<any> | any;
      session?: (params: any) => Promise<any> | any;
    };
    pages?: Record<string, string>;
  };

  export function getServerSession(options?: AuthOptions): Promise<any>;
  export default function NextAuth(options: AuthOptions): any;
}

declare module "next-auth/providers/spotify" {
  export default function SpotifyProvider(options: any): any;
}

declare module "next-auth/react" {
  export function signIn(provider?: string, options?: Record<string, unknown>): Promise<void>;
}
