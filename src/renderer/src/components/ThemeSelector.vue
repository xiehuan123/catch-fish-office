<template>
  <div class="theme-selector">
    <div  :class="seletId===theme.id && 'activit'"  v-for="theme in props.themeList" :key="theme.id"   :style="{backgroundColor:theme.color  }" @click="handleSelect(theme.id)"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref,defineProps,defineEmits } from 'vue'

const props = defineProps({
    themeId: Number,
    themeList:Array
})

const seletId = ref(props.themeId)

const emit=defineEmits(['select'])
console.log(seletId.value);

const handleSelect=(id:number)=>{
    console.log("选择的主题id",id);
    seletId.value=id 
    emit('select',id)
}
</script>

<style scoped lang="scss">
.theme-selector{
    display: flex;
    justify-content: space-between;
    gap: 10px;
    >div{
        width: 30px;
        height: 30px;
    }
}
.activit{
    border: 2px solid #fff;
  
}
</style>