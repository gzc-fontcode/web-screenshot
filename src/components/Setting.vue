<template>
    <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="格式">
            <el-select v-model="form.format" placeholder="请选择保存图片的格式">
                <el-option label="jpeg" value="jpeg" />
                <el-option label="png" value="png" />
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { setScreenshotFormat, getScreenshotFormat } from '../utils/localStorage'

const form = reactive({
    format: 'jpeg',
})

watch(() => form.format, () => {
    setScreenshotFormat(form.format)
})
</script>

<style lang="scss" scoped></style>
