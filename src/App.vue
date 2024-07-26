<script setup lang="ts">
import { ref } from 'vue'
import Setting from './components/Setting.vue'
import Action from './components/Action.vue'

const collapseActiveName = ref('0')

</script>

<template>
    <el-collapse v-model="collapseActiveName" accordion>
        <el-collapse-item title=" 设置" name="1">
          <Setting></Setting>
        </el-collapse-item>
        <el-collapse-item title=" 操作" name="2">
          <Action></Action>
        </el-collapse-item>
    </el-collapse>
</template>

<style lang="scss">
.el-collapse {
    margin: 5px 0;
    // --el-collapse-header-height: 25px;
    .el-collapse-item__header {
        height: 30px;
        &:hover {
            background-color: rgb(238, 238, 236);
        }
    }
}
</style>
