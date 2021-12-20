import { Button, EventData, Observable, Page } from "@nativescript/core";

export class GameViewModel extends Observable {
  private _counter: number;
  private _message: string;

  constructor() {
    super();

    this._counter = 42;
    this.updateMessage();
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value;
      this.notifyPropertyChange("message", value);
    }
  }

  onTap() {
    this._counter--;
    this.updateMessage();
  }

  onMainMenu(args: EventData) {
    const button: Button = <Button>args.object;
    const page: Page = button.page;
    page.frame.navigate("main-menu");
  }

  private updateMessage() {
    if (this._counter <= 0) {
      this.message =
        "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
      this.message = `${this._counter} taps left`;
    }
  }
}