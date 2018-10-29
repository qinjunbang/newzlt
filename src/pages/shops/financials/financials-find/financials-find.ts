/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController, NavParams } from 'ionic-angular';
import { NativeService } from '../../../../providers/NativeService';
import { Utils } from '../../../../providers/Utils';
import { FinancialsListPage } from '../financials-list/financials-list';



@Component({
  selector: 'page-financials-find',
  templateUrl: 'financials-find.html'
})
export class FinancialsFindPage {
  public sid; // 店铺id
  public title: string = ''; // 标题类型
  public typeNum: string = ''; // 标题类型
  public startTime: string = ''; // 开始时间
  public endTime: string = ''; // 结束时间


  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public native: NativeService

  ) {
    // 获取店铺ID
    this.sid = navParams.get("sid");
    this.title = navParams.get("title");
    this.typeNum = navParams.get("typeNum");
    console.log(this.sid);
    console.log(this.title );
  }
  ionViewDidLoad() {

  }



  // 页面跳转
  goToPage (event) {
    console.log("event", event);
    console.log("this.startTime", this.startTime);
    console.log("this.startTime", this.endTime);
    if (this.checkedTime(this.startTime, this.endTime)) {
      return this.native.showToast("开始时间不能大于结束时间");
    }
    let data = {};
    data['title'] = this.title;
    data['sid'] = this.sid;
    data['typeNum'] = this.typeNum;
    data['startTime'] = this.startTime;
    data['endTime'] = this.endTime;

    this.navCtrl.push(FinancialsListPage, data);
  }

  // 比较时间大小
  checkedTime (t1, t2) {
    return ((new Date(t1.replace(/-/g,"\/")))>(new Date(t2.replace(/-/g,"\/"))));
  }

  // 获取指定年份
  getMyDate (num) {
    let d = Utils.getMonthDate(num);
    console.log("d", d);
    this.startTime = Utils.dateFormat(new Date(d), "YYYY-MM-DD");
    this.endTime = Utils.dateFormat(new Date(), "YYYY-MM-DD");
  }

}
