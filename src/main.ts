import { Application, Assets } from "pixi.js";
import { SlotGame } from "./slot-game/slot-game";
import "@pixi/sound"; // Ensure the sound library is loaded
import { GroupAssets } from "./interfaces/group-assets.interface";
import { LoadedAssets } from "./interfaces/loaded-assets.interface";

(async () => {
  // --- Asset Loading ---
  await Assets.init({ manifest: "manifest.json" });
  const generalAssets: GroupAssets = await Assets.loadBundle("general");
  const uiAssets: GroupAssets = await Assets.loadBundle("ui");
  const gameAssets: GroupAssets = await Assets.loadBundle("game");
  const symbolsAssets: GroupAssets = await Assets.loadBundle("symbols");

  // Combine assets into a single object for easy passing to classes
  const assets: LoadedAssets = {
    general: generalAssets,
    ui: uiAssets,
    game: gameAssets,
    symbols: symbolsAssets,
  };

  // --- Application Init ---
  const container = document.getElementById("container");
  if (!container) {
    console.error("Container element not found!");
    return;
  }

  const app = new Application();
  await app.init({
    width: container.clientWidth,
    height: container.clientHeight,
    backgroundAlpha: 0, // makes canvas transparent
  });

  container.appendChild(app.canvas);

  // --- Game Creation ---
  // The SlotGame class handles all game logic and object instantiation.
  new SlotGame(app, assets);
})();
