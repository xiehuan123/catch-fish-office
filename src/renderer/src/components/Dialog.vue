<template>
  <div class="dialog-overlay" v-if="visible">
    <div class="dialog" >
      <div class="dialog-header">
        <slot name="header"></slot>
        <span @click="close"></span>
      </div>
      <div class="dialog-body">
        <slot name="body"></slot>
      </div>
      <div class="dialog-footer">
        <slot name="footer"></slot>
        <button  @click="handleSave">Save</button>
      </div>

    </div>
  </div>


</template>

<script lang="ts" setup>

import { defineProps,computed,defineEmits,ref } from 'vue'
const emit = defineEmits(['submit','update:modelValue'])
const formRef = ref(null)
const props = defineProps<{
  modelValue: boolean
}>()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
})

const close = () => {
  visible.value = false
  // 刷新当前页面
  window.location.reload()
}
const handleSave=()=>{

  emit('submit')

  close()

}
</script>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  .dialog {
      position: absolute;
      width: 1203px;
      border: 1px solid #ccc;
      border-radius: 10px;
      overflow: hidden;
      background-color: rgba(0, 0, 0, .7);
      padding: 20px;
      box-sizing: border-box;
      z-index: 9999;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  
      .dialog-header {
        position: relative;
        height: 50px;
  
        span {
          display: inline-block;
          width: 40px;
          height: 40px;
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          background: url(../assets/close.png) no-repeat;
          background-size: cover;
        }
      }
  
      .dialog-footer {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  
      button {
        width: 250px;
        height: 53px;
        line-height: 53px;
        border-radius: 42px;
        background-color: var(--themeColor);
        text-align: center;
        color: #000;
        font-size: 24px;
      }
    }
}

</style>