import { Text, TextStyle, Sprite, Container, Texture } from "pixi.js";
import { GAME_CONSTANTS } from "../constants";

export class UISystem extends Container {
  private balanceText: Text;
  private winText: Text;
  private spinPriceText: Text;

  private reel: Sprite;
  private reelTexture: Texture;
  private winBackgroundTexture: Texture;
  private winBackgrounds: Sprite[];

  private spinButton: Sprite;
  private spinButtonDisabledTexture: Texture;
  private spinButtonEnabledTexture: Texture;

  constructor(assets: any, appWidth: number, appHeight: number) {
    super();
    this.reelTexture = assets.ui.reel;
    this.winBackgroundTexture = assets.ui.win_bg;
    this.spinButtonEnabledTexture = assets.ui.play;
    this.spinButtonDisabledTexture = assets.ui.play_disabled;

    const textStyle = new TextStyle({
      fill: "gold",
      fontSize: 50,
      fontFamily: assets.general.font.family,
    });

    // Balance Text
    this.balanceText = new Text({ text: "Balance: ", style: textStyle });
    this.balanceText.anchor.set(1, 1);
    this.balanceText.position.set(appWidth, appHeight); // Padded from bottom-left
    this.addChild(this.balanceText);

    // Win Text
    this.winText = new Text({ text: "Win: ", style: textStyle });
    this.winText.anchor.set(1, 1);
    this.winText.position.set(appWidth, appHeight - 60); // Above balance
    this.addChild(this.winText);

    // Spin Price Text (Positioned on the right, under the spin button)
    this.spinPriceText = new Text({
      text: "Price of spin: ",
      style: textStyle,
    });
    this.spinPriceText.anchor.set(1, 1);
    this.spinPriceText.position.set(appWidth, appHeight - 120);
    this.addChild(this.spinPriceText);

    // Spin Button
    this.spinButton = new Sprite(this.spinButtonEnabledTexture);
    this.spinButton.anchor.set(1, 0);
    this.spinButton.position.set(appWidth, 0);
    this.spinButton.eventMode = "static";
    this.spinButton.cursor = "pointer";
    this.addChild(this.spinButton);

    // Reel
    this.reel = new Sprite(this.reelTexture);
    const aspectRatio = this.reelTexture.width / this.reelTexture.height;
    this.reel.height = appHeight;
    this.reel.width = appHeight * aspectRatio;
    this.reel.anchor.set(0, 0);
    this.addChild(this.reel);

    // Reel win background
    this.winBackgrounds = [];
    for (let index = 0; index < GAME_CONSTANTS.VISIBLE_SYMBOLS; index++) {
      const winBackground = new Sprite(this.winBackgroundTexture);
      winBackground.width = this.reel.width;
      winBackground.height = this.reel.height / GAME_CONSTANTS.VISIBLE_SYMBOLS;
      winBackground.anchor.set(0.5, 0); // Center horizontally, top anchored vertically
      winBackground.position.set(
        this.reel.width / 2,
        index * winBackground.height
      );
      winBackground.visible = false;
      this.winBackgrounds.push(winBackground);
      this.addChild(winBackground);
    }

  }

  public getSpinButton(): Sprite {
    return this.spinButton;
  }

  public getReel(): Sprite {
    return this.reel;
  }

  public getReelWinBackgrounds(): Sprite[] {
    return this.winBackgrounds;
  }

  public updateSpinPrice(spinPrice: number): void {
    this.spinPriceText.text = `Price of spin: $${spinPrice}`;
  }

  public updateBalance(balance: number): void {
    this.balanceText.text = `Balance: $${balance}`;
  }

  public updateWin(winAmount: number): void {
    this.winText.text = `Win: $${winAmount}`;
  }

  public updateWinBackgrounds(result: number[]): void {
    for (let index = 0; index < this.winBackgrounds.length; index++) {
        this.winBackgrounds[index].visible = result.find(r => r === index) != null;
    }
  }

  public setSpinButtonEnabled(isEnabled: boolean): void {
    this.spinButton.texture = isEnabled
      ? this.spinButtonEnabledTexture
      : this.spinButtonDisabledTexture;
    this.spinButton.eventMode = isEnabled ? "static" : "none";
    this.spinButton.cursor = isEnabled ? "pointer" : "default";
  }
}
