import { authProvidersType } from "@/types/providers";

export const authProviders: {
  name: string;
  key: authProvidersType;
  icon: string;
  color: string;
  requirements: string[];
}[] = [
  {
    name: "GitHub",
    key: "github",
    icon: "github",
    color: "gray",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Google",
    key: "google",
    icon: "google",
    color: "red",
    requirements: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  },
  {
    name: "Discord",
    key: "discord",
    icon: "discord",
    color: "indigo",
    requirements: ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"],
  },
  {
    name: "Facebook",
    key: "facebook",
    icon: "facebook",
    color: "blue",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Microsoft",
    key: "microsoft",
    icon: "microsoft",
    color: "blue",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Twitter",
    key: "twitter",
    icon: "twitter",
    color: "sky",
    requirements: ["TWITTER_CLIENT_ID", "TWITTER_CLIENT_SECRET"],
  },
  {
    name: "LinkedIn",
    key: "linkedin",
    icon: "linkedin",
    color: "blue",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "GitLab",
    key: "gitlab",
    icon: "gitlab",
    color: "orange",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Reddit",
    key: "reddit",
    icon: "reddit",
    color: "orange",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Spotify",
    key: "spotify",
    icon: "spotify",
    color: "green",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Twitch",
    key: "twitch",
    icon: "twitch",
    color: "purple",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "TikTok",
    key: "tiktok",
    icon: "tiktok",
    color: "black",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Dropbox",
    key: "dropbox",
    icon: "dropbox",
    color: "blue",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "Roblox",
    key: "roblox",
    icon: "roblox",
    color: "red",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
  {
    name: "VK",
    key: "vk",
    icon: "vk",
    color: "blue",
    requirements: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  },
];
