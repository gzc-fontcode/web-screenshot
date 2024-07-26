import { setScreenshotUrl } from "../../utils/localStorage";
import { tabs } from "./tabs"

export const commands = {
    // 初始化
    init() {
        this.onCommandAwake()
    },
    // 添加监听事件
    onCommandAwake() {
        chrome.commands.onCommand.addListener(async (command) => {
            if (command === "captureVisibleTab") {
                await chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, (dataUrl) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message)
                    } else {
                        setScreenshotUrl(dataUrl)
                        chrome.runtime.openOptionsPage()
                    }
                })
            }else if (command === 'captureAllTab') {
                const dataUrl = await tabs.handleCaptureAllTab()
                setScreenshotUrl(dataUrl)
                chrome.runtime.openOptionsPage()
            }else if(command === 'captureAreaTab') {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.captureVisibleTab((screenshotUrl) => {
                        chrome.tabs.sendMessage(tabs[0].id as number, {
                          type: 'areaCaptureStart',
                          screenshotUrl
                        },(response) => {
                            setScreenshotUrl(response.dataUrl)
                            chrome.runtime.openOptionsPage()
                            return true
                        });
                      });
                })
            }
          });
    }
}