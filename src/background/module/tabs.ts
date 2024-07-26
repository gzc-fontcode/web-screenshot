import { getScreenshotFormat } from '../../utils/localStorage'

export const tabs = {
    // 截取可见部分
    async handleCaptureVisibleTab() {
        const format = getScreenshotFormat() || 'jpeg'
        const screenshotUrl = await chrome.tabs.captureVisibleTab(null, { format: format })
        console.log(screenshotUrl)
        return screenshotUrl
    },
    // 截取整个页面
    async handleCaptureAllTab() {
        const tabList = await chrome.tabs.query({ active: true, currentWindow: true })
        let activeTab = tabList[0].id
        return new Promise((reslove) => {
            chrome.scripting.executeScript(
                {
                    target: { tabId: activeTab },
                    function: async () => {
                        try {
                            let doc = document.documentElement
                            let totalHeight = doc.scrollHeight
                            let viewportHeight = window.innerHeight
                            let currentPosition = 0
                            // 
                            let images: string[] = []
                            while (currentPosition < totalHeight) {
                                window.scrollTo(0, currentPosition)
                                await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for scrolling to finish
                                // 截取可见区域
                                let image: string = await new Promise((resolve) => {
                                    const port = chrome.runtime.connect({ name: 'screenshot' })
                                    port.postMessage({ action: 'captureVisibleTab' })
                                    port.onMessage.addListener(function (response) {
                                        if (response.status === 'success') {
                                            resolve(response.dataUrl)
                                        } else {
                                            console.error(
                                                'Failed to capture screenshot:',
                                                response.message
                                            )
                                        }
                                    })
                                })

                                images.push(image)
                                currentPosition += viewportHeight
                            }
                            window.scrollTo(0, 0) // Restore the scroll position
                            console.log('images', images)
                            return new Promise((resolve) => {
                                let canvas = document.createElement('canvas')
                                let context = canvas.getContext('2d')
                                let totalHeight = images.length * window.innerHeight
                                canvas.width = window.innerWidth
                                canvas.height = totalHeight
                                let imgElements = images.map((src, index) => {
                                    return new Promise((resolve) => {
                                        let img = new Image()
                                        img.src = src
                                        img.onload = () => {
                                            context?.drawImage(img, 0, index * window.innerHeight)
                                            resolve(1)
                                        }
                                    })
                                })
                                Promise.all(imgElements).then(() => {
                                    resolve(canvas.toDataURL('image/jpeg'))
                                    // resolve(images)
                                })
                            })
                        } catch (error) {
                            console.error(error)
                        }
                    },
                },
                async (results: any) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message)
                    } else {
                        console.log('results', results)
                        // const screenshotUrl = await tabs.stitchImages(results)
                        // chrome.tabs.create({ url: results[0].result })
                        reslove(results[0].result)
                    }
                }
            )
        })
    },
    // 分段截取
    async captureEntirePage(format: string) {
        let doc = document.documentElement
        let totalHeight = doc.scrollHeight
        let viewportHeight = window.innerHeight
        let currentPosition = 0
        let images: string[] = []
        while (currentPosition < totalHeight) {
            window.scrollTo(0, currentPosition)
            await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for scrolling to finish

            let image = await new Promise((resolve) => {
                chrome.tabs.captureVisibleTab(null, { format: format }, resolve)
            })

            images.push(image)
            currentPosition += viewportHeight
        }

        window.scrollTo(0, 0) // Restore the scroll position
        console.log('images', images)

        return images
    },
    // 图片拼接
    stitchImages(images: string[]) {
        return new Promise((resolve) => {
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            let totalHeight = images.length * window.innerHeight

            canvas.width = window.innerWidth
            canvas.height = totalHeight

            let imgElements = images.map((src, index) => {
                return new Promise((resolve) => {
                    let img = new Image()
                    img.src = src
                    img.onload = () => {
                        context?.drawImage(img, 0, index * window.innerHeight)
                        resolve(1)
                    }
                })
            })

            Promise.all(imgElements).then(() => {
                resolve(canvas.toDataURL('image/png'))
            })
        })
    },
}
