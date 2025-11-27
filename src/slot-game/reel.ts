import { Container, Sprite, Ticker, Texture, Graphics } from "pixi.js";
import { REEL_SYMBOLS, SYMBOL_TO_ALIAS, GAME_CONSTANTS } from "../constants";
import { Sound } from "@pixi/sound";
import { LoadedAssets } from "../interfaces/loaded-assets.interface";

export class Reel extends Container {
  private reel: Sprite;

  private symbols: Sprite[] = [];
  private symbolHeight: number;
  private symbolWidth: number;

  private isSpinning: boolean = false;
  private isDecelerating: boolean = false; // flag for the slow-down phase
  private targetY: number = 0; // for the exact final Y position

  private spinResolver: ((value: string[]) => void) | null = null;
  private spinTimeout: number | null = null;

  private spinDuration: number = GAME_CONSTANTS.NORMAL_SPIN_DURATION_MS;
  private spinSpeed: number = GAME_CONSTANTS.SPIN_SPEED;

  private spinMusic: Sound;

  constructor(assets: LoadedAssets, reel: Sprite) {
    super();
    this.reel = reel;

    this.symbolHeight = this.reel.height / GAME_CONSTANTS.VISIBLE_SYMBOLS;
    this.symbolWidth = this.symbolHeight;
    this.initSymbolStrip(assets);

    this.spinMusic = assets.game.spin_music as Sound;
  }

  private initSymbolStrip(assets: LoadedAssets): void {
    // Create the infinitely scrolling strip
    const symbolTextures: { [key: string]: Texture } = {};
    for (const alias of Object.values(SYMBOL_TO_ALIAS)) {
      symbolTextures[alias] = assets.symbols[alias] as Texture;
    }

    let index = 0;
    // We'll map the symbols in the REEL_SYMBOLS array to sprites.
    REEL_SYMBOLS.forEach((symKey) => {
      const alias = SYMBOL_TO_ALIAS[symKey];
      const texture = symbolTextures[alias];
      const symbol = new Sprite(texture);
      symbol.width = this.symbolWidth;
      symbol.height = this.symbolHeight;
      symbol.anchor.set(0.5, 0); // Center horizontally, top anchored vertically
      symbol.position.set(this.reel.width / 2, index * this.symbolHeight); // Position symbols vertically
      this.symbols.push(symbol);
      this.addChild(symbol);
      index++;
    });

    // add also the first symbols at the end for seamless loop
    const firstSymbols = this.symbols.slice(0, GAME_CONSTANTS.VISIBLE_SYMBOLS);
    firstSymbols.forEach((symbol) => {
      const symbolClone = new Sprite(symbol.texture);
      symbolClone.width = this.symbolWidth;
      symbolClone.height = this.symbolHeight;
      symbolClone.anchor.set(0.5, 0);
      symbolClone.position.set(this.reel.width / 2, index * this.symbolHeight);
      this.addChild(symbolClone);
      index++;
    });

    // Add a mask here to only show the middle 3 symbols
    const reelMask = new Graphics();
    reelMask
      .rect(
        this.reel.x,
        this.reel.y,
        this.reel.width, // Use full width of the reel texture
        this.height,
      )
      .fill({ color: 0x000000 });
    this.mask = reelMask;
    this.addChild(reelMask);
  }

  // --- Spinning Logic ---

  public startSpin(resolve: (result: string[]) => void): void {
    if (this.isSpinning) return;

    this.spinResolver = resolve;

    this.isSpinning = true;
    this.spinDuration = GAME_CONSTANTS.NORMAL_SPIN_DURATION_MS;

    // Setup Audio
    this.spinMusic.play();

    // Ticker logic is key for animation
    Ticker.shared.add(this.updateSpin, this);

    // stop after timeout
    this.spinTimeout = setTimeout(() => {
      this.stopSpin(false);
    }, this.spinDuration);
  }

  public stopSpin(hideVisibleSymbols: boolean = true): void {
    if (!this.isSpinning || this.isDecelerating) return;

    // clear timeout if there is
    if (this.spinTimeout) {
      clearTimeout(this.spinTimeout);
      this.spinTimeout = null;
    }

    // Calculate the final, target Y position based on the current position
    let currentHeight = Math.floor(this.y / this.symbolHeight);
    if (hideVisibleSymbols) currentHeight -= GAME_CONSTANTS.VISIBLE_SYMBOLS;
    this.targetY = currentHeight * this.symbolHeight;

    // Start Deceleration
    this.isDecelerating = true;
  }

  private updateSpin(ticker: Ticker): void {
    // Simple fast spin logic (if not decelerating)
    if (this.isSpinning && !this.isDecelerating) {
      const deltaY = this.spinSpeed * ticker.deltaMS;
      this.y -= deltaY;

      const originalStripHeight = REEL_SYMBOLS.length * this.symbolHeight;
      if (this.y <= -originalStripHeight) {
        this.y += originalStripHeight;
      }

      // Deceleration/Snapping Logic
    } else if (this.isDecelerating && this.y > this.targetY) {
      const deltaY = this.spinSpeed * ticker.deltaMS;
      this.y -= deltaY;

      const originalStripHeight = REEL_SYMBOLS.length * this.symbolHeight;
      if (
        this.targetY <= -originalStripHeight &&
        this.y <= -originalStripHeight
      ) {
        this.targetY += originalStripHeight;
        this.y += originalStripHeight;
      }

      // Stop
    } else if (this.isDecelerating && this.y <= this.targetY) {
      // Final snap to the exact position
      this.y = this.targetY;

      // Cleanup and Resolve
      this.isSpinning = false;
      this.isDecelerating = false;

      // Setup Audio
      this.spinMusic.stop();

      Ticker.shared.remove(this.updateSpin, this);
      if (this.spinResolver) {
        const result = this.getVisibleResult();
        this.spinResolver(result); // Resolve the promise
        this.spinResolver = null;
      }
    }
  }

  public getVisibleResult(): string[] {
    // calculate which three symbols are visible based on final 'y' position.
    const currentSymbol = Math.abs(Math.round(this.y / this.symbolHeight));
    const result: string[] = [];
    for (let index = 0; index < GAME_CONSTANTS.VISIBLE_SYMBOLS; index++) {
      result.push(REEL_SYMBOLS[(currentSymbol + index) % REEL_SYMBOLS.length]);
    }
    return result;
  }
}
