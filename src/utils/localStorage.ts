const FORMAT = 'screenshot-format'
const SCREENSHOTURL = 'screenshot-url'

export const setScreenshotFormat = (format: string) => {
    try {
		return chrome.storage.local.set({FORMAT, format})
	} catch (error) {
		console.error('[src] setScreenshotFormat error:', error)
		return false
	}
}

export const getScreenshotFormat = () => {
    try {
		return chrome.storage.local.get([FORMAT])
	} catch (error) {
		console.error('[src] getScreenshotFormat error:', error)
		return false
	}
}

export const removeScreenshotFormat = () => {
    try {
		chrome.storage.local.set({FORMAT: ''})
		return true
	} catch (error) {
		console.error('[src] removeScreenshotFormat error:', error)
		return false
	}
}

export const setScreenshotUrl = (dataUrl: string) => {
    try {
		return chrome.storage.local.set({[SCREENSHOTURL]: dataUrl}).then((res => {
			console.log('set', res);
			
		}))
	} catch (error) {
		console.error('[src] setScreenshotUrl error:', error)
		return false
	}
}

export const getScreenshotUrl = async () => {
    try {
		const url = await chrome.storage.local.get([SCREENSHOTURL])
		// console.log('url',url);
		return url[SCREENSHOTURL]
	} catch (error) {
		console.error('[src] getScreenshotUrl error:', error)
		return false
	}
}

export const removeScreenshotUrl = () => {
    try {
		chrome.storage.local.set({SCREENSHOTURL: ''})
		return true
	} catch (error) {
		console.error('[src] removeScreenshotUrl error:', error)
		return false
	}
}