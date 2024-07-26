import { tabs } from './tabs'
import { getScreenshotFormat, setScreenshotUrl } from '../../utils/localStorage'
import { tr } from 'element-plus/es/locale'

export const connect = {
    init() {
        chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
            // 截取可见部分
            if (message.action === 'captureVisibleTab') {
                chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, (dataUrl) => {
                    sendResponse(dataUrl)
                })
            }
            return true
        })
        chrome.runtime.onConnect.addListener(function (port) {
            console.assert(port.name == 'screenshot')
            port.onMessage.addListener(async function (message) {
                // 截取可见部分
                if (message.action === 'captureVisibleTab') {
                    chrome.tabs.captureVisibleTab(null, { format: 'jpeg' }, (dataUrl) => {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message)
                            port.postMessage({
                                status: 'error',
                                message: chrome.runtime.lastError.message,
                            })
                        } else {
                            port.postMessage({ status: 'success', dataUrl: dataUrl })
                        }
                    })
                // 截取整个页面
                } else if (message.action === 'captureAllTab') {
                    try {
                        const dataUrl = await tabs.handleCaptureAllTab()
                        port.postMessage({ status: 'success', dataUrl: dataUrl })
                    } catch (error) {
                        console.error(error.message)
                        port.postMessage({ status: 'error', message: error.message })
                    }
                // 截取选定区域
                }else if(message.action === 'areaCapture') {
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
        })
    },
}
