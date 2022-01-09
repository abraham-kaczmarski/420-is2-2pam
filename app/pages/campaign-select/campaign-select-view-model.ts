import {
  Button,
  EventData,
  Label,
  Observable,
  Page,
  StackLayout,
  Http,
} from "@nativescript/core";
import * as storage from "@nativescript/core/application-settings";

import { API_URL } from "~/global";

export class CampaignSelectViewModel extends Observable {
  private _page: Page;
  private _title: string;
  private _campaignList: StackLayout;
  private _cachedList: StackLayout;

  private _debug: string;

  constructor(page: Page) {
    super();

    this._page = page;
    this._title = "Campaign select";
    this._campaignList = page.getViewById("campaigns");
    this._cachedList = page.getViewById("cached-campaigns");
    this._debug = "No errors yet";

    const cached = storage.getAllKeys();

    cached.forEach((key) => {
      this.displayCachedCampaign(key);
    });

    Http.getJSON(API_URL).then(
      (campaigns: any) => {
        campaigns.forEach(
          (title, id) => !cached.includes(title) && this.addCampaign(id, title)
        );
      },
      (err) => {
        this.debug = err;
      }
    );
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    if (this._title !== value) {
      this._title = value;
      this.notifyPropertyChange("title", value);
    }
  }

  get debug(): string {
    return this._debug;
  }

  set debug(value: string) {
    if (this._debug !== value) {
      this._debug = value;
      this.notifyPropertyChange("debug", value);
    }
  }

  private addCampaign(id: number, title: string) {
    const button = new Button();
    button.text = title;
    button.addEventListener("tap", () => {
      Http.getJSON(`${API_URL}/${id}`).then((story) => {
        global.campaign = story;
        storage.setString(title, JSON.stringify(story));
        this._page.frame.navigate("pages/game-screen/game-screen");
      });
    });
    this._campaignList.addChild(button);
  }

  private displayCachedCampaign(key: string) {
    const button = new Button();
    const story = JSON.parse(storage.getString(key));
    button.text = `${key} (saved)`;
    button.addEventListener("tap", () => {
      global.campaign = story;
      this._page.frame.navigate("pages/game-screen/game-screen");
    });
    this._cachedList.addChild(button);
  }

  onMainMenu() {
    this._page.frame.navigate("main-menu");
  }
}