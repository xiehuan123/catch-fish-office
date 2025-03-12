<template>

    <div class="footer">
        <StatusOverview title="本月总工作日" :value="props.workDays" unit="天"></StatusOverview>
        <StatusOverview title="已入职" :value="props.daysWorked" unit="天"></StatusOverview>
        <StatusOverview :title="`离[${props.holidayName}]还有`" :value="props.daysToHoliday" unit="天"></StatusOverview>
        <StatusOverview title="离发薪日还有" :value="props.daysToPayDay" unit="天"></StatusOverview>
        <div class="setting" @click="handleSetting">

        </div>
    </div>
</template>

<script setup lang="ts">
import StatusOverview from './StatusOverview.vue';
import { ref, computed, defineProps,defineEmits } from 'vue'
const props = defineProps({
    // 考勤日
    workDays: Number,
    // 已入职天数
    daysWorked: Number,
    // 最近的节假日
    holidayName:String,
    // 天数
    daysToHoliday:Number,
    // 离发薪日
    daysToPayDay: Number,
    
})
const emit=defineEmits(['setting'])
const handleSetting = () => {
    emit('setting')
}
</script>

<style lang="scss" scoped>
.footer {
    position: relative;
    width: 1298px;
    height: 496px;
    box-sizing: border-box;
    background: url("/img/b_bg.png");
    background-size: cover;
    padding-left: 135px;
    display: flex;
    .setting{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 110px;
        height: 110px;
        background: var(--sgUrl);
        background-size: cover;
    }

}
</style>