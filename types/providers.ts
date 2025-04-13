import { socialProviderList } from "better-auth/social-providers";

export type authProvidersType = (typeof socialProviderList)[number];
