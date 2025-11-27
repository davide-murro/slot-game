import { Application, Container } from "pixi.js";
import { UISystem } from "./ui-system";
import { Reel } from "./reel";
import { GAME_CONSTANTS } from "../constants";
import { Sound } from "@pixi/sound";
import { LoadedAssets } from "../interfaces/loaded-assets.interface";

export class SlotGame extends Container {
  private ui: UISystem;
  private reel: Reel;

  private backgroundMusic: Sound;
  private winMusic: Sound;

  private currentWin: number = 0;
  private spinPrice: number = GAME_CONSTANTS.SPIN_PRICE;
  private balance: number = GAME_CONSTANTS.INITIAL_BALANCE;
  private isSpinning: boolean = false;

  constructor(app: Application, assets: LoadedAssets) {
    super();

    // Create and add UI
    this.ui = new UISystem(assets, app.renderer.width, app.renderer.height);
    this.addChild(this.ui);

    // Create and add Reel
    const reelContainer = this.ui.getReel();
    this.reel = new Reel(assets, reelContainer);
    this.addChild(this.reel);

    // Initialize data
    this.ui.updateBalance(this.balance);
    this.ui.updateWin(this.currentWin);
    this.ui.updateSpinPrice(this.spinPrice);

    // Setup interaction
    this.initSpinButton();

    // Setup Audio
    this.backgroundMusic = assets.general.background_music as Sound;
    this.backgroundMusic.loop = true;
    window.addEventListener("pointerdown", () => {
      if (!this.backgroundMusic.isPlaying) this.backgroundMusic.play();
    });

    this.winMusic = assets.game.win_music as Sound;

    // Add self to stage
    app.stage.addChild(this);
  }

  private initSpinButton(): void {
    const button = this.ui.getSpinButton();

    // Use 'pointerdown' to allow quick stop on the same button click
    button.on("pointerdown", () => {
      if (this.isSpinning) {
        this.handleQuickStop();
      } else {
        this.handleSpin();
      }
    });

    this.ui.setSpinButtonEnabled(this.balance >= this.spinPrice);
  }

  private addBalance(change: number): void {
    this.balance += change;
    this.ui.updateBalance(this.balance);
  }

  // --- Game Logic ---

  private async handleSpin(): Promise<void> {
    if (this.isSpinning || this.balance < this.spinPrice) return;

    this.isSpinning = true;
    this.currentWin = 0;
    this.ui.updateWin(this.currentWin);
    this.ui.updateWinBackgrounds([]);
    this.addBalance(-this.spinPrice); // Deduct spin price

    // Start the reel spin animation
    const spinPromise = new Promise<string[]>((resolve) => {
      this.reel.startSpin(resolve);
    });
    const resultSymbols = await spinPromise;

    // Spin finished
    this.isSpinning = false;

    // Process result
    this.processResult(resultSymbols);

    // Update UI
    this.ui.setSpinButtonEnabled(this.balance >= this.spinPrice);
  }

  private handleQuickStop(): void {
    if (!this.isSpinning) return;
    this.reel.stopSpin();
  }

  private processResult(result: string[]): void {
    // e.g., result = ['SYM1', 'SYM2', 'SYM1']
    const counts: { [key: string]: number } = {};
    result.forEach((sym) => {
      counts[sym] = (counts[sym] || 0) + 1;
    });

    let multiplier: number = 0;
    let winPositions: number[] = [];

    // Find max count
    const maxCount = Math.max(...Object.values(counts));

    // set position and multiplier
    if (maxCount >= 2) {
      const maxCountSymbol = Object.keys(counts).find(
        (sym) => counts[sym] === maxCount,
      );

      multiplier = maxCount;
      winPositions = result
        .map((sym, idx) => (sym === maxCountSymbol ? idx : -1))
        .filter((idx) => idx !== -1);
    }

    // set data
    this.currentWin = this.spinPrice * multiplier;
    this.ui.updateWin(this.currentWin);
    this.ui.updateWinBackgrounds(winPositions);

    // if win
    if (this.currentWin > 0) {
      this.addBalance(this.currentWin);
      this.winMusic.play();
    }
  }
}
