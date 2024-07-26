<template>
    <div class="action-list">
        <el-button text type="primary" @click="handleClick('captureVisibleTab')">
            截取可见部分
        </el-button>
        <el-button text type="primary" @click="handleClick('captureAllTab')">
            截取整个网页
        </el-button>
        <el-button text type="primary" @click="handleClick('areaCapture')">
            选定区域截图
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { setScreenshotUrl, getScreenshotUrl } from '../utils/localStorage'
const port = chrome.runtime.connect({ name: 'screenshot' })
const handleClick = (msg: string = 'captureVisibleTab') => {
    // chrome.runtime.sendMessage({ action: msg, from: 'popup' }, function (response) {
    //     // console.log('Response from background:', response)
    //     // chrome.tabs.create({ url: response })

    //     // setScreenshotUrl(response)
    //     // console.log('getScreenshotUrl', getScreenshotUrl());
    //     // chrome.runtime.openOptionsPage();
    // })
    port.postMessage({ action: msg })
    port.onMessage.addListener(function (response) {
        if (response.status === 'success') {
            setScreenshotUrl(response.dataUrl)
            console.log('getScreenshotUrl', getScreenshotUrl())
            chrome.runtime.openOptionsPage()
        } else {
            console.error('Failed to capture screenshot:', response.message)
        }
    })
}
</script>

<style lang="scss">

</style>
