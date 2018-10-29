/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController, NavParams } from 'ionic-angular';




@Component({
  selector: 'page-financials-list',
  templateUrl: 'financials-list.html'
})
export class FinancialsListPage {
  public sid; // 店铺id
  public title: string = ''; // 类型标题
  public typeNum: string = ''; // 类型标题
  public listType: string = 'all'; // 列表类型，默认为‘全部’
  public listData: any = []; // 数据列表
  public sum: number = 0; // 合计
  public startTime: string = ""; // 开始时间
  public endTime: string = ""; // 结束时间
  public total: number = 0; // 总记录条数
  public page: number = 1;  // 页数
  public statusText = '加载中';
  public mType: number;
  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParams: NavParams,

  ) {
    // 获取店铺ID
    this.sid = navParams.get("sid");
    this.title = navParams.get("title");
    this.typeNum = navParams.get("typeNum");
    this.startTime = navParams.get("startTime");
    this.endTime = navParams.get("endTime");

  }
  ionViewDidLoad() {
    this.getData(this.page, this.mType);
  }

  // 获取数据列表
  getData (page, mType, resolve = null) {
    let data = {};
    data['shop_id'] = this.sid;
    data['page'] = page;
    if (mType) {
      data['money_type'] = mType;
    }
    if (this.typeNum) {
      data['type'] = this.typeNum;
    }
    if (this.startTime) {
      data['startTime'] = this.startTime;
    }
    if (this.endTime) {
      data['endTime'] = this.endTime;
    }
    this.http.post("/api/app/showFinance", data).subscribe(res => {
      console.log("res", res);
      if (resolve !== null) {
        resolve();
      }
      this.total = res.data.orders.total;
      this.sum = res.data.sum;
      // this.listData = [];

      let lists = res.data.orders.data;
      for (let key in lists) {
        this.listData.push(lists[key]);
      }
      console.log("this.listData", this.listData);
    });
  }

  // 菜单选择
  selectedSegment (num) {
    console.log("this.listType", this.listType);
    this.listData = [];
    this.page = 1;
    this.getData(this.page, num);
  }

  // 上拉加载
  doInfinite(event): Promise<any> {
    //判断是否全部加载完成
    let flag = this.check(this.total, this.listData);
    //请求数据
    return new Promise((resolve) => {
      if(flag == true) {
        event && event.complete();
        resolve()
      } else {
        this.page++;
        this.getData(this.page, this.mType, resolve);

      }
    })
  }

  //检查是否全部加载完成
  check(total, data) {
    let len = data.length;
    if(len >= total && total !== 0) {
      this.statusText = '';//加载完成
      return true;
    }
    return false;
  }

  // 页面跳转
  goToPage (event) {
    console.log("event", event);
    this.navCtrl.push(event, {'sid': this.sid});
  }

}
