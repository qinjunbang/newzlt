/**
 * Created by HIAPAD on 2018/7/26.
 * Utils 存放与业务无关的公共方法
 */
import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    const time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? '0' + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? '0' + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond));
  }
  /**
   * 获取当前日期的前几个月,后几个月分
   * 如: 获取当前日期的前三个月
   * @param num
   * @returns {string}
   */
  static getMonthDate(num: number) {
    let date = new Date(); // 当前日期
    date.setMonth(date.getMonth() + num); // 把时间设置为对应的月份日期
    let year = date.getFullYear(), // 获得设置对应月份后的年份
        month = (date.getMonth() + 1).toString(),  // 因为 getMonth() 返回 0-11 对应 1-12 月份,所以 +1
        day = date.getDate().toString();

    if (month < '10') {
      month = '0' + month;
    }

    if (day < '10') {
      day = '0' + day;
    }
    return year + '-' + month + '-' + day;
  }
  /**
   * 把url中的双斜杠替换为单斜杠
   * 如:http://localhost:8080//api//demo.替换后http://localhost:8080/api/demo
   * @param url
   * @returns {string}
   */
  static formatUrl(url = ''): string {
    let index = 0;
    if (url.startsWith('http')) {
      index = 7;
    }
    return url.substring(0, index) + url.substring(index).replace(/\/\/*/g, '/');
  }

  /**
   * 验证数字
   * @param val 需要验证的字符串
   * @returns {string}
   */
  static isNumber(val = ''): string {
    return /^[0-9]+(\.[0-9]+)?$/.test(val) ? '' : '请输入数字';
  }

  /**
   * 验证手机号
   * @param val 需要验证的字符串
   * @returns {string}
   */
  static isMobile(val = ''): string {
    return  /^0?(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8}$/.test(val) ? '' : '手机号格式不正确';
  }

  /**
   * 验证是否是本地电话
   * @param val 需要验证的字符串
   * @returns {string}
   */
  static isPhone (val = ''): string {
    return /^\d{3}\-\d{8}$|^\d{4}\-\d{7}$/.test(val) ? '' : '请输入正确的电话号码,如010-12345678';
  }


  /**
   * 验证是否是银行卡号
   * @param val 需要验证的字符串
   * @returns {string}
   */
  static isBank (val = ''): string {
    return /^([1-9]{1})(\d{15}|\d{18})$/.test(val) ? 'true' : '请输入正确的银行卡号';
  }


  /**
   * 验证名字
   * @param val 需要验证的字符串
   * @returns {string}
   */
  static isUserName (val = ''): string {
    return /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(val) ? 'true' : '请输入正确名字';
  }

  /**
   * 验证身份证号
   * @param val 需要验证的字符串
   * @returns {string}
   */
  static isCardNo (val = ''): string {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val) ? 'true' : '请输入正确的身份证号';
  }

}


