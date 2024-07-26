import { connect } from "./module/connect";
import { contextMenus } from "./module/contextMenus";
import { commands } from "./module/commands";

chrome.runtime.onInstalled.addListener((details) => {
  connect.init()
  contextMenus.init()
  commands.init()
});


  