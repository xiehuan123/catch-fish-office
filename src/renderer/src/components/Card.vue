<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  value: Number,
  unit: String
})

const iconShow = ref(true)

const computedValue = computed(() => {
  console.log('computedValue', iconShow.value ? props.value : '******')

  return iconShow.value ? props.value : '******'
})
const handlClick = () => {
  iconShow.value = !iconShow.value
  console.log(iconShow.value)
}
</script>

<template>
  <div class="card">
    <div class="icon" :class="iconShow ? 'eye' : 'eye-slash'" @click="handlClick"></div>
    <div class="card-title">
      {{ props.title }}
    </div>
    <div class="card-content">
      {{ computedValue }}
    </div>
    <div class="card-footer">
      {{ props.unit }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  width: 370px;
  height: 284px;
  border: 2.13px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  padding: 32px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.2);

  // border-image-slice: 1;
  //  border-image-source: linear-gradient(135.59deg, rgba(255, 255, 255, 0.49) 1.28%, rgba(255, 255, 255, 0.11) 96.26%);
  border-radius: 28px;
  backdrop-filter: blur(17.78645896911621px);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  .card-title {
    height: 38px;
    font-size: 32px;
    color: rgba(255, 255, 255, 0.7);
  }

  .card-content {
    height: 76px;
    font-size: 64px;
    color: #fff;
  }

  .card-footer {
    height: 38px;
    color: #fff;
    font-size: 32px;
  }
  .icon {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 20px;
    height: 20px;
  }
  .eye {
    background: url('/img/ph_eye-fill.png');
    background-size: cover;
  }
  .eye-slash {
    background: url('/img/ph_eye-close.png');
    background-size: cover;
  }
}
</style>
