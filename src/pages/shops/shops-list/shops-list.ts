/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../providers/HttpService';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../providers/NativeService';
import { Config } from '../../../providers/Config';

import { ShopsAddPage } from '../shops-add/shops-add';
import { ShopsManagePage } from '../shops-manage/shops-manage';

@Component({
  selector: 'page-shops-list',
  templateUrl: 'shops-list.html'
})
export class ShopsListPage {
  public shopsList = []; // 店铺列表
  public serverUrl = 'https://www.zltgs.com';
  public ShopsAddPage = ShopsAddPage; // 添加店铺页面
  public ShopsManagePage = ShopsManagePage; // 店铺管理页面
  public role = Config.userInfo['role']; // 角色信息

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public storage: Storage,
    public native: NativeService
  ) {

  }

  // 将进入页面时触发
  ionViewWillEnter () {
    this.getShopsList();
  }

  // 页面加载的时候触发
  ionViewDidLoad() {

  }



  // 获取店铺列表
  public getShopsList () {
    this.http.post("/api/app/shopAll", {token: Config.token, device_id: Config.device_id}).subscribe(res => {
      console.log("res", res);
      if(res.code == 200){
        this.shopsList = res.data;
      } else {
        this.native.alert(res.info);
      }
    })
  }

  //删除店铺
  public deleteShop(sid) {
    this.http.post("/api/app/shopDel", {token: Config.token, device_id: Config.device_id, shop_id: sid}).subscribe(res => {
      console.log("res", res);
      this.native.alert(res.info, '', '', () => {
        // 删除成功，重新获取店铺列表
        if (res.code == 200) {
          this.getShopsList();
        }

      });
    })
  }

  // 页面跳转
  public goToPage (page, sid= '') {
    console.log('6666');
    this.navCtrl.push(page, {sid: sid});
  }

  // 店铺营业
  shopOpen(id, status) {
    console.log("我要惊变", status);
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['id'] = id;
    if (status) {
      data['is_open'] = 1;
    } else {
      data['is_open'] = 0;
    }
    this.http.post("/api/app/shopOpen", data).subscribe(res => {
      console.log("res", res);
      this.native.showToast(res.info);
    });
  }

}
