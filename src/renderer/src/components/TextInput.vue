<template>
  <div class="text-input">
    <input
      v-if="!props.disblaed"
      v-model="inputValue"
      type="number"
      :placeholder="placeholder"
      :min="props.min"
      :max="props.max"
      class="input-with-limit"
      @input="handleInput"
      @blur="handleBlur"
    />
    <span v-if="props.disblaed">{{ props.modelValue }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 9999
  },
  maxlength: {
    type: Number,
    default: 4 // 默认4位
  },
  disblaed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'input'])

const inputValue = ref(props.modelValue)
onMounted(() => {
  console.log('mounted', props.modelValue)
})
// 格式化小时，确保两位数
const handleInput = () => {
  if (inputValue.value > props.max) inputValue.value = props.max
  inputValue.value = padZero(inputValue.value)
  console.log(inputValue.value, 'input')

  emit('input', parseInt(inputValue.value))
}
const handleBlur = () => {
  console.log()

  if (inputValue.value === '' || inputValue.value < props.min) {
    inputValue.value = padZero(props.min)
  }
  emit('update:modelValue', parseInt(inputValue.value))
}
// 填充零
const padZero = (num) => {
  return num.toString().padStart(props.maxlength, '0')
}

// 初始化双向绑定的值
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal
  }
)
</script>

<style lang="scss" scoped>
.text-input {
  width: 109px;
  height: 48px;
  padding: 10px 20px;
  border-radius: 30.5px;
  border: solid 1px #ccc;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    width: 100%;
    height: 100%;
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
