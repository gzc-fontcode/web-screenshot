<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getScreenshotUrl } from './utils/localStorage'
// getScreenshotUrl().then(res => {
//     console.log(res);
// })
getScreenshotUrl().then((res) => {
    imgUrl.value = res
})
const imgUrl = ref()
const form = reactive({
    format: 'jpeg',
})
function saveScreenshot() {
  const format = form.format
  const filename = 'screenshot';
    if (imgUrl.value) {
      const dataUrl = imgUrl.value;
      const base64Data = dataUrl.split(',')[1];
      const blob = base64ToBlob(base64Data, `image/${format}`);

      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: `${filename}.${format}`,
        saveAs: true
      }, function(downloadId) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log('Download started with ID:', downloadId);
        }
        URL.revokeObjectURL(url);  // Release the object URL
      });
    }
}

function base64ToBlob(base64, mime) {
  const byteChars = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteChars.length; offset += 512) {
    const slice = byteChars.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mime });
}
</script>

<template>
    <el-row :gutter="20">
        <el-col :span="14">
            <img :src="imgUrl" alt="图片" width="100%" />
        </el-col>
        <el-col :span="6">
            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="格式">
                    <el-select v-model="form.format" placeholder="请选择保存图片的格式">
                        <el-option label="jpeg" value="jpeg" />
                        <el-option label="png" value="png" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveScreenshot">保存</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss">
.el-row {
    justify-content: space-around;
}
</style>
