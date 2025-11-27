import { GroupAssets } from "./group-assets.interface";

export interface LoadedAssets {
  [alias: string]: GroupAssets;
}
