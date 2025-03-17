<template>
  <div
    :key="indexStore.currentTheme.id"
    class="max-container"
    :style="{
      '--themeColor': indexStore.currentTheme.color,
      '--bgUrl': `url(${indexStore.currentTheme.bgUrl})`,
      '--sgUrl': `url(${indexStore.currentTheme.sgUrl})`
    }"
  >
    <div class="title">
      <div class="name">Catch Fish Office</div>
      <div class="time">
        {{ indexStore.currentTime }}
      </div>
      <div class="logo">
        <logo></logo>
      </div>
    </div>

    <div class="main-container">
      <Card
        title="Hourly wage"
        :value="parseFloat((indexStore.salaryPerMinute * 60).toFixed(2))"
        unit="￥"
      ></Card>
      <Card title="Today’s wage" :value="indexStore.salaryEarned" unit="￥"></Card>
      <!-- <Card title="Yearly wage" :value="166238.03"  unit="￥"></Card> -->
      <Card title="Yearly wage" :value="indexStore.salaryYearEarned" unit="￥"></Card>
    </div>
    <div class="footer-container">
      <Footer
        :work-days="indexStore.workDays"
        :days-worked="indexStore.daysWorked"
        :holiday-name="indexStore.holidayName"
        :days-to-holiday="indexStore.daysToHoliday"
        :days-to-pay-day="indexStore.daysToPayDay"
        @setting="openSetting"
      >
      </Footer>
    </div>
    <div class="right-container">
      <ArcProgress
        :minutes-passed-ratio="indexStore.minutesPassedRatio"
        :minutes-passed="indexStore.minutesPassed"
        :name="indexStore.name"
        :days-to-end-time="indexStore.daysToEndTime"
        :width="indexStore.pageWidth"
        :height="indexStore.pageHeight"
        :root-font-size="indexStore.rootFontSize"
      >
      </ArcProgress>
    </div>
    <Dialog v-model="showDialog" @submit="indexStore.saveSetting">
      <template #header>
        <h2>Settings</h2>
      </template>
      <template #body>
        <div>
          <div class="row">
            <div class="item">
              <div class="item-label">入职日期</div>
              <div class="item-content">
                <TextInput
                  v-model="indexStore.entryDateYear"
                  :maxlength="4"
                  :min="2000"
                  :max="2060"
                />
                年
                <TextInput v-model="indexStore.entryDateMonth" :maxlength="2" :min="1" :max="12" />
                月
                <TextInput v-model="indexStore.entryDateDay" :maxlength="2" :min="1" :max="31" />
                日
              </div>
            </div>
          </div>

          <div class="row">
            <div class="item">
              <div class="item-label">上班时间</div>
              <div class="item-content">
                <DateInput v-model="indexStore.startTime" />
                <div class="line"></div>
                <DateInput v-model="indexStore.endTime" />
              </div>
            </div>
            <div class="item">
              <div class="item-label">午休时间段</div>
              <div class="item-content">
                <DateInput v-model="indexStore.lunchStartTime" />
                <div class="line"></div>
                <DateInput v-model="indexStore.lunchEndTime" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <div class="item-label">发薪日期(日)</div>
              <div class="item-content">
                <TextInput v-model="indexStore.payDay" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <div class="item-label">税前工资(元)</div>
              <div class="item-content">
                <TextInput
                  v-model="indexStore.salary"
                  :maxlength="5"
                  :max="99999"
                  @input="handlSalary"
                />
              </div>
            </div>

            <div class="item">
              <div class="item-label">公积金缴纳比例</div>
              <div class="item-content">
                <TextInput
                  v-model="indexStore.accumulationFundRate"
                  :maxlength="2"
                  :min="5"
                  :max="12"
                  @input="handlAccumulationFundRate"
                />
              </div>
            </div>

            <div class="item">
              <div class="item-label">税后工资(元)</div>
              <div class="item-content">
                <TextInput
                  v-model="indexStore.salaryAfterTax"
                  :maxlength="2"
                  :min="5"
                  :max="12"
                  :disblaed="true"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="item">
              <div class="item-label">主题色</div>
              <div class="item-content">
                <ThemeSelector
                  :theme-list="indexStore.themeList"
                  :theme-id="indexStore.currentTheme.id"
                  @select="handleSelect"
                >
                </ThemeSelector>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import Card from './components/Card.vue'
import logo from './components/logo.vue'
import Footer from './components/Footer.vue'
import ArcProgress from './components/ArcProgress.vue'

import Dialog from './components/Dialog.vue'
import TextInput from './components/TextInput.vue'

import DateInput from './components/DateInput.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import { useIndexStore } from './stores/index'

import { calculateBeijingAfterTaxSalary } from './utils/'
import { ref, onMounted } from 'vue'
const indexStore = useIndexStore()
console.log(indexStore.count)

const showDialog = ref(false)
const openSetting = () => {
  showDialog.value = true
}
const handleSelect = (id: number) => {
  indexStore.currentTheme = indexStore.themeList.find((item) => item.id === id)
}
onMounted(() => {
  indexStore.init()
})
// 保存设置
const handlSalary = (value: number) => {
  console.log('indexStore', indexStore.accumulationFundRate)

  indexStore.salaryAfterTax = calculateBeijingAfterTaxSalary(
    value,
    parseInt(indexStore.accumulationFundRate) / 100
  )
}
// 公积金比例改变
const handlAccumulationFundRate = (value: number) => {
  indexStore.salaryAfterTax = calculateBeijingAfterTaxSalary(
    parseInt(indexStore.salary),
    value / 100
  )
}
</script>
<style lang="scss" scoped>
.max-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-width: 1320px;
  min-height: 480px;
  background: var(--bgUrl);
  background-size: cover;
  overflow: hidden;

  .title {
    position: absolute;
    height: 77px;
    top: 72px;
    left: 72px;
    color: #fff;

    .name {
      font-size: 40px;
      font-weight: 510;
      line-height: 47.73px;
      text-align: left;
    }

    .time {
      font-size: 24px;
      font-weight: 274;
      line-height: 28.64px;
      text-align: left;
    }

    .logo {
      position: absolute;
      right: -58px;
      top: 3px;
    }
  }

  .main-container {
    position: absolute;
    top: 250px;
    left: 72px;
    display: flex;
    width: 1167px;
    justify-content: space-between;
  }

  .footer-container {
    position: absolute;
    bottom: 0;
  }

  .right-container {
    position: absolute;
    right: 0;
    transform: translateX(46%);
  }
}

.row {
  display: flex;
  justify-content: space-between;
  max-width: 700px;

  .item {
    margin-top: 10px;
    margin-bottom: 10px;
    min-width: 306px;

    .item-label {
      font-size: 20px;
      text-align: left;
      color: #fff;
    }

    .item-content {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .line {
        width: 20px;
        height: 1px;
        background-color: #fff;
      }
    }

    .theme-color {
      width: 100px;

      > div {
        width: 20px;
        height: 20px;
        outline: 2px #fff solid;
        background-color: #eaafff;
      }
    }
  }
}

h2 {
  font-size: 32px;
  color: #fff;
}
</style>
