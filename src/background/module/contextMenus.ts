import { setScreenshotUrl } from "../../utils/localStorage"
import { tabs } from "./tabs"

export const contextMenus = {
    init() {
        this.createMenus()
        this.onMenuClicked()
    },
    // 初始化上下文菜单
    createMenus() {
        chrome.contextMenus.create({
            id: 'captureVisibleTab',
            title: '截取可见部分',
            contexts: ['all'],
        })
        chrome.contextMenus.create({
            id: 'captureAllTab',
            title: '截取整个页面',
            contexts: ['all'],
        })
        chrome.contextMenus.create({
            id: 'captureAreaTab',
            title: '截取选定区域',
            contexts: ['all'],
        })
    },
    // 添加点击事件
    onMenuClicked() {
        chrome.contextMenus.onClicked.addListener(async (info, tab) => {
            if (info.menuItemId === 'captureVisibleTab') {
                await chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, (dataUrl) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message)
                    } else {
                        setScreenshotUrl(dataUrl)
                        chrome.runtime.openOptionsPage()
                    }
                })
            }else if (info.menuItemId === 'captureAllTab') {
                const dataUrl = await tabs.handleCaptureAllTab()
                setScreenshotUrl(dataUrl)
                chrome.runtime.openOptionsPage()
            }
            else if (info.menuItemId === 'captureAreaTab') {
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
        })
    },
}
