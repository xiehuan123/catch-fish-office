import { defineStore } from 'pinia'
import { setupCanvas, getSunAngle,getDuration,getTimeDifference,  getNearestHoliday,getAttendanceDays,getSalaryDayDifference,getWorkingDays,calculateCumulativeEarnings} from '../utils'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
export const useIndexStore = defineStore('index', {
  state: () => ({
    // 上班开始时间
    startTime: "09:00",
 
    // 上班结束时间
    endTime: "18:00",
 
    // 当前已过分钟数
    minutesPassed: 0,
    // 上班时间总分钟数
    totalMinutes: 0,
    // 发薪日
    payDay: 20,
    
    // 午休开始时间
    lunchStartTime: "12:00",
    // 午休结束时间
    lunchEndTime: "13:00",
    // 午休开始分钟数
    lunchStartMinutes: 0,
    // 午休结束分钟
    lunchEndMinutes: 0,
    // 午休总分钟数
    lunchTotalMinutes: 0,
    // 薪资
    salary: 10000,
    // 税后薪资
    salaryAfterTax: 0,
    // 公积金比例
    accumulationFundRate: 5,
    // 实时展示当天已赚薪资
    salaryEarned: 0,
    // 当年挣了多少钱
    salaryYearEarned: 0,
    // 每分钟多少钱
    salaryPerMinute: 0,
    // 本月工作日天数
    workDays: 22,

    // 入职日期: "2024-07-01",
    entryDate: "2024-07-01",
    // 入职日期 年
    entryDateYear: "2024",
    // 入职日期 月
    entryDateMonth: "07",
    // 入职日期 日
    entryDateDay: "01",


    // 已入职天数
    daysWorked: 0,
    // 最近的节假日
    holidayName: '',
    // 离最近的节假日天数
    daysToHoliday: 0,
    // 发薪日日期
    payDayDate: 20,
    // 离发薪日
    daysToPayDay: 0,
    // 距离下班时间 
    daysToEndTime: 0,
    // 名称
    name: 'Get off work',
    // 当前时间
    currentTime: dayjs().format('YYYY/M/D ddd'),
    themeList:[
      { 
    id: 1, 
    name: 'purple',
    color: '#EAAFFF',
    bgUrl: new URL('/img/bg_purple.png', import.meta.url).href,
    sgUrl: new URL('/img/sg_purple.png', import.meta.url).href
  },
  { 
    id: 2, 
    name: 'green',
    color: '#89B55C',
    bgUrl: new URL('/img/bg_green.png', import.meta.url).href,
    sgUrl: new URL('/img/sg_green.png', import.meta.url).href
  },
  { 
    id: 3, 
    name: 'blue',
    color: '#5C8CB5',
    bgUrl: new URL('/img/bg_blue.png', import.meta.url).href,
    sgUrl: new URL('/img/sg_blue.png', import.meta.url).href
  }
    ],

    // 当前主题对象
    currentTheme:{ 
    id: 1, 
    name: 'purple',
    color: '#EAAFFF',
    bgUrl: new URL('/img/bg_purple.png', import.meta.url).href,
    sgUrl: new URL('/img/sg_purple.png', import.meta.url).href
  },
    //当前页面的事件宽度和高度
    pageWidth: 0,
    pageHeight: 0,
    rootFontSize:256
  }),
  actions: {
    init() {
        this.updateParams()
        this.resizeTo()
        window.addEventListener('resize', this.resizeTo)
        // 计算午休开始分钟数  午休开始时间-上班开始时间
        this.lunchStartMinutes = getDuration(this.startTime, this.lunchStartTime)
        // 计算午休结束分钟数  午休结束时间-上班开始时间
        this.lunchEndMinutes = getDuration(this.startTime, this.lunchEndTime)
        // 计算午休总分钟数
        this.lunchTotalMinutes =getDuration(this.lunchStartTime,this.lunchEndTime)
        // 计算每分钟多少钱
        this.salaryPerMinute =  (this.salary / this.workDays/(getDuration(this.startTime, this.endTime) - this.lunchTotalMinutes)).toFixed(2)
        // 上班时间总分钟数 包含午休
        this.totalMinutes = getDuration(this.startTime, this.endTime) 
        console.log("每分钟多少钱999999999999",this.salaryPerMinute,getDuration(this.startTime, this.endTime)-this.lunchTotalMinutes);
        
        console.log("午休开始时间分钟数",this.lunchStartMinutes);
        console.log("午休结束时间分钟数",this.lunchEndMinutes);
        console.log("午休总时间分钟数",this.lunchTotalMinutes);
        
    //   实时更新当前已过分钟数
      setInterval(() => {
        this.minutesPassed=getSunAngle( dayjs(this.startTime, 'HH:mm')  )
        this.daysToEndTime = getTimeDifference(dayjs() ,this.endTime+':00','HH:mm:ss') //时分秒
        console.log(this.endTime,7777);
        
        console.log("据下班时间",this.daysToEndTime,this.totalMinutes);
        
        console.log(this.minutesPassed);
        // 非上班时间不计算工资
        if (this.minutesPassed <=0 ||  this.minutesPassed >= this.totalMinutes) {
           return 
        }
         // 排除午休时间
         if (this.minutesPassed <= this.lunchStartMinutes  || this.minutesPassed >= this.lunchEndMinutes) {
            // 判断当前是否已过午休
            if (this.minutesPassed >= this.lunchStartMinutes ) {
                this.minutesPassed=this.minutesPassed-this.lunchTotalMinutes
                console.log("当前已过午休 总分钟数",this.minutesPassed);
            }
        
            
            // 实时更新当天已赚薪资
            this.salaryEarned =(this.minutesPassed * this.salaryPerMinute) .toFixed(2)
             console.log("当天已赚薪资",this.salaryYearEarned);
            this.salaryYearEarned=calculateCumulativeEarnings(this.salary,this.salaryPerMinute*480,this.salaryEarned)
           
            
        } 
      
        
      }, 1000)
    },
    // 更新相关参数
    updateParams() {
      const setting = JSON.parse(localStorage.getItem('setting')) || {}
      
      if(Object.keys(setting).length !== 0) {
        this.startTime = setting.startTime
        this.endTime = setting.endTime
        this.lunchStartTime = setting.lunchStartTime
        this.lunchEndTime = setting.lunchEndTime
        this.salary = setting.salary
        this.payDay = setting.payDay
        this.entryDateYear = setting.entryDateYear
        this.entryDateMonth = setting.entryDateMonth
        this.entryDateDay = setting.entryDateDay
        
        this.currentTheme = setting.currentTheme
        this.accumulationFundRate = setting.accumulationFundRate
     
      }
      // 本月考勤日
      this.workDays = getAttendanceDays()
      // 最近的节假日
      const { nearestHolidayDiff,holidayName } = getNearestHoliday()
      this.holidayName = holidayName
      this.daysToHoliday = nearestHolidayDiff
      // 离发薪日
      this.daysToPayDay = getSalaryDayDifference(this.payDay)
      // 入职天数
      this.daysWorked = getWorkingDays(`${this.entryDateYear}-${this.entryDateMonth}-${this.entryDateDay}`)

      console.log("本月考勤日",this.workDays);
      console.log("最近节假日",this.holidayName,this.daysToHoliday);
      console.log("发薪日",this.payDayDate);
      console.log("已入职天数",this.daysWorked);
      
      
    },
    // 保存设置
    saveSetting() {
      const setting={
        startTime: this.startTime,
        endTime: this.endTime,
        lunchStartTime: this.lunchStartTime,
        lunchEndTime: this.lunchEndTime,
        salary: this.salary,
        payDay: this.payDay,
         // 入职日期 年
        entryDateYear: this.entryDateYear,
        // 入职日期 月
        entryDateMonth: this.entryDateMonth,
        // 入职日期 日
        entryDateDay: this.entryDateDay,
        currentTheme: this.currentTheme,
        accumulationFundRate: this.accumulationFundRate
      }
      localStorage.setItem('setting', JSON.stringify(setting))
    },
    //每次页面发生变化调用
    resizeTo(){
      const container=document.querySelector('.max-container')
      console.log("页面宽高",container.clientWidth,container.clientHeight);
      this.rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      console.log("根字体大小",this.rootFontSize);
      
      this.pageWidth=container.clientWidth
      this.pageHeight=container.clientHeight
    }
    
  },
 
})
