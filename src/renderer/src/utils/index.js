import dayjs from 'dayjs'
import {getWorkdaysInRange,getDayDetail,getHolidaysInRange,isHoliday } from 'chinese-days';
// 转换px到rem的函数
export const pxToRem =(pxValue, rootValue = 192)=> {
    return pxValue / rootValue + 'rem';
}
export const setupCanvas = (canvas, width, height) => {
    const dpr =Math.ceil(window.devicePixelRatio || 1);
    const ctx = canvas.getContext('2d')
    // 获取屏幕的宽度和高度

    if (!ctx) {
        throw new Error('Unable to get 2D context for canvas')
    }
    console.log(dpr);

    
    // 设置canvas的实际大小
    canvas.width = width * dpr
    canvas.height = height * dpr

    // 设置canvas的CSS大小
    canvas.style.width = width+'px'
    canvas.style.height =height+'px'

    // 缩放上下文
    ctx.scale(dpr, dpr)

    // 设置抗锯齿
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // 微调以避免半像素渲染
    ctx.translate(0.5, 0.5)
    ctx.moveTo(0, 0)

    return ctx
}

// 获取当前时间 - 指定时间
// 返回分钟
export const getSunAngle = (startTime) => {
    // 获取当前时间 如果晚于结束时间就直接是结束时间
    const now = dayjs();
    // 如果当前时间大于 结束时间
    // 计算时间差（以分钟为单位）
    const duration = now.diff(startTime, 'second');
    if (duration < 0) {
        return 0;  // 如果当前时间早于开始点，则返回0
    }
    return  duration ;
}
// 计算两个时间的差值 分钟级
export const getDuration = (startTime, endTime, format = 'totalMinutes') => {
  // 计算时间差（以分钟为单位）
  const durationInMinutes = dayjs(endTime, "HH:mm").diff(dayjs(startTime, "HH:mm"), 'minute');
console.log(durationInMinutes,8888);

  if (durationInMinutes < 0) {
      return 0; // 如果当前时间早于开始点，则返回 0
  }

  // 根据 format 参数决定返回内容
  switch (format) {
      case 'HH:mm:ss': { // 返回时分秒格式
          const hours = Math.floor(durationInMinutes / 60).toString().padStart(2, '0');
          const minutes = (durationInMinutes % 60).toString().padStart(2, '0');
          const seconds = '00'; // 无秒数，默认为 00
          return `${hours}:${minutes}:${seconds}`;
      }
      case 'totalSeconds': { // 返回总秒数
          return durationInMinutes * 60;
      }
      case 'totalMinutes': { // 返回总分钟数
          return durationInMinutes;
      }
      case 'totalHours': { // 返回总小时数（浮点数）
          return (durationInMinutes / 60).toFixed(2);
      }
      default: {
          throw new Error(`Invalid format: ${format}`);
      }
  }
};

// 秒级 相差返回
export const getTimeDifference = (startTime, endTime) => {
  // 解析时间并计算差值（以秒为单位）
  const durationInSeconds = dayjs(endTime, "HH:mm:ss").diff(dayjs(startTime, "HH:mm:ss"), 'second');
  console.log(durationInSeconds, 'seconds');

  if (durationInSeconds < 0) {
    return '00:00:00'; // 如果结束时间小于当前时间
  }

  // 计算时分秒
  const hours = Math.floor(durationInSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((durationInSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (durationInSeconds % 60).toString().padStart(2, '0');

  // 返回格式化的时分秒
  return `${hours}:${minutes}:${seconds}`;
};
// 获取本月的考勤日
export const getAttendanceDays = () => {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');  // 本月第一天
    const end = dayjs().endOf('month').format('YYYY-MM-DD');      // 本月最后一天
    // 包括周末
    const workdaysExcludingWeekends = getWorkdaysInRange(start, end, true);
    console.log('Workdays excluding weekends:', workdaysExcludingWeekends);
    return workdaysExcludingWeekends.length
};
// 获取法定节假日
const getHolidays = (start = '2025-1-01', end = '2025-1-31') => {
    const holidays = getHolidaysInRange(start, end, true);
    console.log('Holidays:', holidays);
};

  
  // 获取离当前日期最近的节假日
export const getNearestHoliday = () => {
    const start = dayjs().startOf('year').format('YYYY-MM-DD');  // 本年第一天
    const end = dayjs().endOf('year').format('YYYY-MM-DD');      // 本年最后一天
    const today = dayjs(); // 当前日期
    const holidays = getHolidaysInRange(start, end,false); // 获取法定节假日 不包含周末
    console.log('Holidays:', holidays);
    // 筛选出距离当前日期最近的节假日
    let nearestHoliday = null;
    let nearestHolidayDiff = Infinity;
  
    holidays.forEach(holiday => {
      const holidayDate = dayjs(holiday);
      const diffInDays = holidayDate.diff(today, 'day'); // 计算与今天的天数差
  
      // 如果节假日距离今天更近，更新最近的节假日
      if (diffInDays >= 0 && diffInDays < nearestHolidayDiff) {
        nearestHolidayDiff = diffInDays;
        nearestHoliday = holiday;
      }
    });
    // console.log(getDayDetail(nearestHoliday),nearestHoliday);
    
    // 获取最近节假日的详细信息
    const holidayDetail = nearestHoliday ? getDayDetail(nearestHoliday) : null;
    let holidayName = '';
    if (holidayDetail) {
      console.log(`节假日名称：${holidayDetail.name}`);
      holidayName = holidayDetail.name.split(',')[1];
    } else {
      console.log('无节假日');
    }
    console.log(`最近的节假日是：${nearestHoliday}`);
    console.log(`距离今天还有：${nearestHolidayDiff} 天`);
    console.log(`节假日名称：${holidayName}\n`);
    return {nearestHolidayDiff,holidayName};
  };

export const getSalaryDayDifference = (salaryDay = 20) => {
    const today = dayjs();  // 当前日期
    const currentMonthSalary = dayjs().date(salaryDay);  // 本月发薪日
    const nextMonthSalary = dayjs().add(1, 'month').date(salaryDay);  // 下月发薪日
  
    // 如果当前时间大于本月发薪日，则使用下个月发薪日
    const salaryDate = today.isAfter(currentMonthSalary) ? nextMonthSalary : currentMonthSalary;
  
    // 计算距离发薪日的天数差
    const diffInDays = salaryDate.diff(today, 'day');
    
    // console.log(`距离下次发薪日还有 ${diffInDays} 天`);
    // console.log(`下次发薪日是：${salaryDate.format('YYYY-MM-DD')}`);
    return diffInDays;
  };
// 计算入职天数
export const getWorkingDays = (startDate) => {
    const start = dayjs(startDate); // 入职日期
    const today = dayjs(); // 当前日期

    // 判断入职日期是否在当前日期之前，如果不是，则返回 0
    if (start.isAfter(today)) {
        return 0; // 入职日期不能晚于今天
    }

    // 计算天数差
    const daysWorked = today.diff(start, 'day'); // 返回天数差
    return daysWorked;
    
};
const start = '2025-01-01';
const end = '2025-12-31';
const holidaysIncludingWeekends = getHolidaysInRange(start, end, true);
console.log('Holidays including 9999999:', holidaysIncludingWeekends.map(d => getDayDetail(d)));

/**
 * 计算北京税后工资
 * @param {number} preTaxSalary - 税前工资（元）
 * @param {number} [housingFundRatio=0.05] - 公积金缴纳比例（0-1之间）
 * @returns {number} 税后工资（保留两位小数）
 */
export function calculateBeijingAfterTaxSalary(preTaxSalary, housingFundRatio = 0.05) {
  console.log('税前工资',preTaxSalary,housingFundRatio);
  
  // 社保个人缴纳比例（北京2023年标准）
  const SOCIAL_SECURITY_PERSONAL = {
    养老保险: 0.08,
    医疗保险: 0.02,
    失业保险: 0.005,
    工伤保险: 0.0,
    生育保险: 0.0
  };

  // 计算社保个人部分总扣除
  const socialSecurityDeduction = preTaxSalary * sumObjectValues(SOCIAL_SECURITY_PERSONAL);

  // 计算公积金扣除
  const housingFundDeduction = preTaxSalary * housingFundRatio;

  // 总扣除项
  const totalDeductions = socialSecurityDeduction + housingFundDeduction;

  // 计算应纳税所得额
  const taxableIncome = preTaxSalary - totalDeductions - 5000;

  // 个人所得税计算（含速算扣除数）
  let tax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 3000) {
      tax = taxableIncome * 0.03;
    } else if (taxableIncome <= 12000) {
      tax = taxableIncome * 0.1 - 210;
    } else if (taxableIncome <= 25000) {
      tax = taxableIncome * 0.2 - 1410;
    } else if (taxableIncome <= 35000) {
      tax = taxableIncome * 0.25 - 2660;
    } else if (taxableIncome <= 55000) {
      tax = taxableIncome * 0.3 - 4410;
    } else if (taxableIncome <= 80000) {
      tax = taxableIncome * 0.35 - 7160;
    } else {
      tax = taxableIncome * 0.45 - 15160;
    }
  }

  // 计算税后工资并保留两位小数
  return parseFloat((preTaxSalary - totalDeductions - tax).toFixed(2));
}

// 辅助函数：计算对象属性值总和
function sumObjectValues(obj) {
  return Object.values(obj).reduce((sum, value) => sum + value, 0);
}

// 计算本年
export const getYearSalary = (salary,workDays) => {
    return (salary / 12 * workDays).toFixed(2);
};
/**
 * 计算本年度累计已挣收入
 * @param {number} monthlySalary - 月工资总额（固定薪资）
 * @param {number} daySalary - 本月工作日薪资 
 * @param {number} dailyEarnings - 当日额外收入（非工资部分）
 * @returns {number} 包含两位小数的累计收入
 */
export function calculateCumulativeEarnings(monthlySalary,daySalary,dailyEarnings) {
   const month=dayjs().month()+1
  // 计算年薪
  const yearSalary = parseFloat(month*monthlySalary)+parseFloat(getWorkDays()*daySalary)+ parseFloat(dailyEarnings);
  console.log('年薪',yearSalary);
  
  return yearSalary.toFixed(2);
}
// 获取本月已工作日天数
export const getWorkDays = () => {
   const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const workdays = getWorkdaysInRange(start);
    // 包括今天的 所以需要-1
    return workdays.length-1;
}