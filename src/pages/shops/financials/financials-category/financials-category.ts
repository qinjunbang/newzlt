/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController, NavParams } from 'ionic-angular';
import { ShopsDetailPage } from '../../shops-detail/shops-detail';
import { FinancialsFindPage } from '../financials-find/financials-find';



@Component({
  selector: 'page-financials-category',
  templateUrl: 'financials-category.html'
})
export class FinancialsCategoryPage {
  public sid; // 店铺id
  public items = ["预定", "扫码", "排队", "配送"];

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParams: NavParams,

  ) {
    // 获取店铺ID
    this.sid = navParams.get("sid");
    console.log(this.sid);
  }
  ionViewDidLoad() {

  }


  // 页面跳转
  goToPage (text) {
    console.log("text", text);
    let type = "";
    switch (text) {
      case "全部收入":
        type = "";
        break;
      case "预定":
        type = "1";
        break;
      case "扫码":
        type = "3";
        break;
      case "排队":
        type = "2";
        break;
      case "配送":
        type = "0";
        break;
    }
    this.navCtrl.push(FinancialsFindPage, {'title': text, 'sid': this.sid, typeNum: type});
  }

}
