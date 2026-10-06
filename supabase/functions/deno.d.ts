// Type declarations for Deno runtime APIs and HTTPS module specifiers in Supabase Edge Functions
declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
  };
}

declare module "https://*" {
  export const serve: any;
  export const createClient: any;
  const content: any;
  export default content;
}
