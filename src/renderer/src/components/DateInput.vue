<template>
  <div class="date-input">
    <input
      v-model="hours"
      type="number"
      min="0"
      max="23"
      placeholder="00"
      class="time-input"
      @input="formatHours"
    />
    :
    <input
      v-model="minutes"
      type="number"
      min="0"
      max="59"
      placeholder="00"
      class="time-input"
      @input="formatMinutes"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '12:00'
  }
})

const emit = defineEmits(['update:modelValue'])

const time = ref(props.modelValue.split(':'))

const hours = ref(time.value[0])
const minutes = ref(time.value[1])

watch([hours, minutes], () => {
  emit('update:modelValue', `${padZero(hours.value)}:${padZero(minutes.value)}`)
})

// 格式化小时，确保两位数
const formatHours = () => {
  if (hours.value < 0) hours.value = 0
  if (hours.value > 23) hours.value = 23
  hours.value = padZero(hours.value)
}

// 格式化分钟，确保两位数
const formatMinutes = () => {
  if (minutes.value < 0) minutes.value = 0
  if (minutes.value > 59) minutes.value = 59
  minutes.value = padZero(minutes.value)
}

// 填充零
const padZero = (num) => {
  return num.toString().padStart(2, '0')
}

// 初始化双向绑定的值
watch(
  () => props.modelValue,
  (newVal) => {
    time.value = newVal.split(':')
    hours.value = time.value[0]
    minutes.value = time.value[1]
  }
)
</script>

<style lang="scss" scoped>
.date-input {
  width: 109px;
  height: 48px;
  padding: 10px 20px;
  border-radius: 30.5px;
  border: solid 1px #ccc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  color: #fff;
  input {
    width: 50%;
    box-sizing: border-box;
    outline: none;
    border: none;
    text-align: center;
    font-size: 20px;
    background-color: transparent;
    color: #fff;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
}
</style>
