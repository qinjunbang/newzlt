import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeService } from '../../../providers/NativeService';

declare var qq: any;
@Component({
    selector: 'address-page',
    templateUrl: 'address.html'
})

export class AddressPage {
  public map: any;
  public parent: any;
  public currentCity: string = '';
  public markers = [];
  public address: string = '';
  public keyword: string = '';
  public timer = null;
  public list = [];
  constructor (
    public native: NativeService,
    public navCtrl: NavController,
    public navParam: NavParams
  ) {
    this.parent = navParam.get("page");
    console.log("this.parent", this.parent);
  }

  ionViewDidEnter () {
    this.getCityInfo();

  }

  // 输入框输入提示
  onkenUp () {
    console.log("this.keyword", this.keyword);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (!this.keyword) {
      this.list = [];
      return;
    }
    this.timer = setTimeout(() => {
      this.searchAddress(this.keyword);
    }, 100);

  }

  // 创建一个地图
  getCityInfo () {
    let _that = this;

    //获取城市列表接口设置中心点
    let citylocation = new qq.maps.CityService({
      complete : function(result){
        console.log("city", result);
        _that.currentCity = result.detail.name;
      }
    });

    //调用searchLocalCity();方法    根据用户IP查询城市信息。
    citylocation.searchLocalCity();



  }

  searchAddress (key) {
    let _that = this;
    //调用Poi检索类。用于进行本地检索、周边检索等服务。
    let searchService = new qq.maps.SearchService({
      // 获得信息回调
      complete: function (results) {
        //设置回调函数参数
        let pois = results.detail.pois;
        console.log("pois", pois);
        _that.list = pois;
      }
    });

    searchService.setLocation(this.currentCity);
    searchService.search(key);
  }

  // 选择完成
  checkSelect (address, name) {

    this.address = address ? address : name;

    if (!this.address) {
      return this.native.showToast("地址不能为空");
    }

    this.parent.address = this.address;
    this.navCtrl.pop();
  }

  // 清除文本框
  clearKeyword () {
    this.keyword = '';
    this.list = [];
  }
}
