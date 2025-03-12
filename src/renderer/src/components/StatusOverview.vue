<template>

    <div class="status-overview">
        <div class="status-title">
            {{ props.title }}
        </div>
        <div class="status-content">
            {{ props.value }}
        </div>
        <div class="status-unit">
            {{ props.unit }}
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, computed, defineProps } from 'vue'
const props = defineProps({
    title: String,
    value: Number,
    unit: String,
})

</script>

<style lang="scss" scoped>
.status-overview {
    width: 291px;
    height: 496px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border: solid 1px rgba(255, 255, 255, .1);
    .status-title {
        margin-top: 68px;
        width: 168px;
        font-size: 24px;
        font-weight: 400;
        color: rgba(255, 255, 255, .7);
        padding-bottom: 16px;
        border-bottom: 1px solid transparent;
        border-image: linear-gradient(90deg, rgba(153, 153, 153, 0) 0%, #FFFFFF 50%, rgba(153, 153, 153, 0) 100%);
        border-image-slice: 1;

    }

    .status-content {

        font-size: 64px;
        font-weight: 510;
        margin-top: 84px;
        color: var(--themeColor);

    }

    .status-unit {

        width: 168px;
        padding-bottom: 99px;
        color: #fff;
        border-bottom: 1px solid transparent;
        border-image: linear-gradient(90deg, rgba(153, 153, 153, 0) 0%, #FFFFFF 50%, rgba(153, 153, 153, 0) 100%);
        border-image-slice: 1;
    }
}
</style>