/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ActionSheetController, NavController } from 'ionic-angular';
import { HttpService } from '../../../providers/HttpService';
import { NativeService } from '../../../providers/NativeService';
import { Config } from '../../../providers/Config';
import { Observable } from 'rxjs';
import { AddressPage } from '../address/address';



@Component({
  selector: 'page-shops-add',
  templateUrl: 'shops-add.html'
})
export class ShopsAddPage {

   public local = Config.app_upload_serve_url; // 服务器url
   public cities = []; // 城市JSON数据
   public shop_name: string = ''; // 店铺名称
   public type_id: any = []; // 店铺类型id
   public type_rid: any = []; //菜系
   public shop_address: string = ''; // 店铺地址
   public address: string = ''; // 店铺地址
   public detail_address: string = ''; // 店铺详细地址
   public codeList = []; // 商圈列表
   public startTime:string = '08:00'; // 开始营业时间
   public endTime:string = '22:00'; // 结束营业时间
   public is_takeout: number = 0; // 是否开启配送
   public is_reserve: number = 0; // 是否开启预定
   public is_list: number = 0; // 是否开户排队
   public shopsType: any = []; // 店铺所有分类
   public reserveType: any = []; // 预定分类
   public minimum; // 最低消费
   public spend_distance; // 配送范围
   public spend; // 配送费
   public min_spend; // 起送价
   public spendtime; // 配送时间
   public is_wifi: number = 0; // 是否有wifi

   public name: string = ''; // 店主姓名
   public shop_phone: string = ''; // 联系电话
   public note: string = ''; // 店铺介绍
   public license_pic: string = ''; // 营业执照
   public shop_avatar: string = ''; // 店铺头像
   public shop_pic: string = ''; // 店铺门面
   public business_code: number = 0; // 商圈

  constructor(
    public http: HttpService,
    public httpService: Http,
    public native: NativeService,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController
  ) {

  }
  // 页面初始化完成
  ionViewDidLoad() {
    // 初始化省份城市区域
    this.getCitiesData().subscribe(data => {
      console.log("data", data.json());
      this.cities = data.json();

    });

    // 获取店铺分类
    this.getShopType();
    this.getReserveType();
  }

  // 获取店铺分类
  getShopType () {
    this.http.get("/api/typeData").subscribe(res => {
      console.log("res", res);
      if (res.code == 200) {
        this.shopsType = res.data;
      }
    });
  }

  // 获取预定分类
  getReserveType () {
    this.http.get("/api/typeReserveData").subscribe(res => {
      console.log("res", res);
      if (res.code == 200) {
        this.reserveType = res.data;
      }
    });
  }

  // getAddress
  getAddress () {
    this.navCtrl.push(AddressPage, {"page": this});
  }
  // 获得省份城市区域数据
  getCitiesData() {
    return Observable.create(observer => {
      this.httpService.get('assets/chinese-cities.json').subscribe(data => {
        observer.next(data);
      });
    });
  }

  // 选择省份城市区域回调
  changeCitiesDate(event) {
    console.log("6666", event);

    // 拼接地址
    this.shop_address = event[0]['text'] + " " +  event[1]['text'] + " " + event[2]['text'];

    // 拿到区（县的code）去获取商圈
    let lastCode = event[2]['value'];

    this.getCodeList(lastCode);
  }

  // 获取商圈列表
  getCodeList (code) {
    this.http.post("/api/app/cityget", {id: code}).subscribe(res => {
      console.log("res", res);
      if (res.code == 200 && res.data.city && res.data.city.length > 0) {
        // this.native.showToast("您有商圈可以选择哦~");
        // 如果有商圈，列出商圈
        this.codeList = res.data.city;
      } else {
        // 如果没有商圈，就把code 给到
        this.business_code = code;
      }
    });
  }

  // 从图库获取图片
  getPictureByLibrary ():Observable<string> {
    return Observable.create(observer => {
      // 以拿到图片原始url 方式拿图片 destinationType 1 ， 0 为base64
      this.native.getPictureByLibrary({destinationType: 1}).subscribe(res => {
        // 上传图片，拿到图片在服务器的url
        this.native.uploadImages(res, 'api/app/shopUpload').subscribe(s => {
          observer.next(s);
        });
      }, err => {
        console.log("err1", err);
      });
    });

  }

  // 拍照获取图片
  getPictureByCamera ():Observable<string> {
    return Observable.create(observer => {
      // 以拿到图片原始url 方式拿图片 destinationType 1 ， 0 为base64
      this.native.getPictureByCamera({destinationType: 1}).subscribe(res => {
        console.log("拍照图片res", res);
        //  // 上传图片，拿到图片在服务器的url
        this.native.uploadImages(res, 'api/app/shopUpload').subscribe(s => {
          observer.next(s);
        });
      }, err => {
        console.log("err", err);
      });
    });
  }

  // 点击选择图片
  getImage (img) {
    const actionSheet = this.actionSheetCtrl.create({
      title: "获取图片",
      buttons: [
        {
          text: "从相册中获取",
          handler: () => {
            this.getPictureByLibrary().subscribe(url => {
              // 拿到图片的url，显示在页面上
              this[`${img}`] = url;
            });
          }
        },
        {
          text: "拍照",
          handler: () => {
            this.getPictureByCamera().subscribe(url => {
              // 拿到图片的url，显示在页面上
              console.log("拍照图片url", url);
              this[`${img}`] = url;
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }


  // 是否配送
  isTakeout () {

    this.is_takeout ? this.is_takeout = 0 : this.is_takeout = 1;
  }

  // 是否预定
  isReserve () {

    this.is_reserve ? this.is_reserve = 0 : this.is_reserve = 1;
  }

  // 是否排队
  isList () {

    this.is_list ? this.is_list = 0 : this.is_list = 1;
  }

  // 添加店铺
  savaData() {
    let data = {};
    data['shop_name'] = this.shop_name; // 店铺名称
    data['shop_address'] = this.address; // 店铺地址
    data['detail_address'] = this.detail_address; // 店铺详细地址
    // data['startTime'] = this.startTime; // 开始营业时间
    // data['endTime'] = this.endTime; // 结束营业时间
    data['opentime'] = this.startTime + '--' + this.endTime;
    data['is_takeout'] = this.is_takeout; // 是否开启配送
    data['is_reserve'] = this.is_reserve; // 是否开启预定
    data['is_list'] = this.is_list; // 是否开户排队
    data['type_id'] = this.type_id.join(","); // 店铺类型id
    data['type_rid'] = this.type_rid.join(","); // 菜系
    data['name'] = this.name; // 店主姓名
    data['shop_phone'] = this.shop_phone; // 联系电话
    data['note'] = this.note; // 店铺介绍
    data['lience_pic'] = this.license_pic; // 营业执照
    data['shop_avatar'] = this.shop_avatar; // 店铺头像
    data['shop_pic'] = this.shop_pic; // 店铺门面
    data['business_code'] = this.business_code; // 商圈
    data['is_wifi'] = this.is_wifi; // 是否有wifi
    if (this.minimum) {
      data['minimum'] = this.minimum; // 最低消费
    }
    if (this.spend_distance) {
      data['spend_distance'] = this.spend_distance; // 配送范围
    }
    if (this.spend) {
      data['spend'] = this.spend; // 配送费
    }

    if (this.min_spend) {
      data['min_spend'] = this.min_spend; // 起送价
    }

    if (this.spendtime) {
      data['spendtime'] = this.spendtime; // 配送时间
    }

    data['token'] = Config.token;
    data['device_id'] = Config.device_id;

    console.log("data", data);

    // 简单的验证
    if (!data['shop_name']) {
      return this.native.showToast("店铺名称不能为空");
    }
    if (!data['type_id']) {
      return this.native.showToast("请选择店铺分类");
    }
    if (!data['is_takeout'] && !data['is_reserve'] && !data['is_list']) {
      return this.native.showToast("请选择经营模块");
    }
    if (!data['shop_address']) {
      return this.native.showToast("请选择店铺地址");
    }
    if (!data['detail_address']) {
      return this.native.showToast("请输入店铺详细地址");
    }
    if (!data['lience_pic']) {
      return this.native.showToast("请上传营业执照");
    }
    if (!data['shop_avatar']) {
      return this.native.showToast("请上传店铺头像");
    }
    if (!data['shop_pic']) {
      return this.native.showToast("请上传店铺门面");
    }
    if (!data['name']) {
      return this.native.showToast("请输入店主姓名");
    }
    if (!data['shop_phone']) {
      return this.native.showToast("请输入联系电话");
    }
    if (!data['shop_phone']) {
      return this.native.showToast("请输入联系电话");
    }
    if (!data['note']) {
      return this.native.showToast("店铺介绍不能少于5个字");
    }
    // 拼接地址
    data['shop_address'] = data['shop_address'] + " " +  data['detail_address'];
    console.log("data", JSON.stringify(data));
    console.log("data", data);

    this.http.post("/api/app/shopAdd", data).subscribe(res => {
      console.log("添加商铺res", JSON.stringify(res));
      this.native.alert(res.info, '', '', () => {
        if (res.code == 200) {
          this.navCtrl.pop();
        }
      });
    });
  }
}
