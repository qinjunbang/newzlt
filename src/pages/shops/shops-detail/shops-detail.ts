/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../providers/HttpService';
import { NativeService } from '../../../providers/NativeService';
import { Config } from '../../../providers/Config';
import { Observable } from 'rxjs';
import { AddressPage } from '../address/address';



@Component({
  selector: 'page-shops-detail',
  templateUrl: 'shops-detail.html'
})
export class ShopsDetailPage {

   public local = Config.app_upload_serve_url; // 图片服务器url
   public shop_id:string = ''; // 店铺id
   public cities: any = []; // 城市JSON数据
   public codeList: any = []; // 商圈
   public shopsType: any = [];
   public reserveType: any = [];
   public address: string = '';


   public shopInfo = {
    id: '', // 店铺id
    shop_name: '', // 店铺名称
    type_id: [], // 店铺类型id
    type_rid: [],
    shop_address: '', // 店铺地址
    detail_address: '', // 店铺详细地址
    startTime: '', // 开始营业时间
    endTime: '', // 结束营业时间
    is_takeout: 1, // 是否开启配送
    is_reserve: 0, // 是否开启预定
    is_list: 0, // 是否开户排队
    name: '', // 店主姓名
    shop_phone: '', // 联系电话
    note: '', // 店铺介绍
    lience_pic: '', // 营业执照
    shop_avatar: '', // 店铺头像
    shop_pic: '', // 店铺门面
    business_code: '', // 商圈
   };


  constructor(
    public http: HttpService,
    public httpService: Http,
    public native: NativeService,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParam: NavParams
  ) {
    this.shop_id = this.navParam.get('sid');
  }
  // 页面初始化完成
  ionViewDidLoad() {
    // 获取店铺信息
    this.getShopOne();

    // 初始化省份城市区域
    this.getCitiesData().subscribe(data => {
      console.log("data", data.json());
      this.cities = data.json();

    });

    // 获取店铺分类
    this.getShopType();
    this.getReserveType();
  }

  // getAddress
  getAddress () {
    this.navCtrl.push(AddressPage, {"page": this});
  }
  // 默认值
  compareFn(option1: any, option2: any) {
    console.log("option1", option1);
    console.log("option2", option2);
    return option1 == option2;
  }
  // 获取店铺信息
  getShopOne() {
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['shop_id'] = this.shop_id;
    this.http.post("/api/app/shopShow", data).subscribe(res => {
      console.log("res", res);
      let addressArr = res.data.shop_address.split(" ");
      console.log("addressArr", addressArr);

      res.data['detail_address'] = addressArr[3];

      let openTimeArr = res.data.opentime.split("--");
      console.log("openTimeArr", openTimeArr);



      this.shopInfo['shop_id'] = res.data.id; // 店铺id
      this.shopInfo['shop_name'] = res.data.shop_name; // 店铺名称
      this.shopInfo['type_id'] = res.data.type_id.split(","); // 店铺类型id
      this.shopInfo['type_rid'] = res.data.type_rid.split(",");
      this.address = addressArr[0]; // 店铺地址
      this.shopInfo['detail_address'] =  addressArr[1]; // 店铺详细地址
      this.shopInfo['startTime'] = openTimeArr[0]; // 开始营业时间
      this.shopInfo['endTime'] = openTimeArr[1]; // 结束营业时间
      this.shopInfo['is_takeout'] = res.data.is_takeout; // 是否开启配送
      this.shopInfo['is_reserve'] = res.data.is_reserve; // 是否开启预定
      this.shopInfo['is_list'] = res.data.is_list; // 是否开户排队
      this.shopInfo['name'] = res.data.name; // 店主姓名
      this.shopInfo['shop_phone'] = res.data.shop_phone; // 联系电话
      this.shopInfo['note'] = res.data.note; // 店铺介绍
      this.shopInfo['lience_pic'] = res.data.lience_pic; // 营业执照
      this.shopInfo['shop_avatar'] = res.data.shop_avatar; // 店铺头像
      this.shopInfo['shop_pic'] = res.data.shop_pic; // 店铺门面
      this.shopInfo['business_code'] = res.data.business_code; // 商圈
      this.shopInfo['minimum'] = res.data.minimum; // 最低消费
      this.shopInfo['spend_distance'] = res.data.spend_distance; //  配送范围
      this.shopInfo['spend'] = res.data.spend; //  配送费
      this.shopInfo['min_spend'] = res.data.min_spend; //  起送价
      this.shopInfo['spendtime'] = res.data.spendtime; //  配送时间

      console.log(" this.shopInfo",  this.shopInfo);
      this.getCodeList(this.shopInfo['business_code']);
    });
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
    this.address = event[0]['text'] + " " +  event[1]['text'] + " " + event[2]['text'];
    console.log("address", this.address);

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
        this.shopInfo.business_code = code;
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
              this.shopInfo[`${img}`] = url
            });
          }
        },
        {
          text: "拍照",
          handler: () => {
            this.getPictureByCamera().subscribe(url => {
              // 拿到图片的url，显示在页面上
              console.log("拍照图片url", url);
              this.shopInfo[`${img}`] = url
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

    this.shopInfo.is_takeout ? this.shopInfo.is_takeout = 0 : this.shopInfo.is_takeout = 1;
  }

  // 是否预定
  isReserve () {

    this.shopInfo.is_reserve ? this.shopInfo.is_reserve = 0 : this.shopInfo.is_reserve = 1;
  }

  // 是否排队
  isList () {

    this.shopInfo.is_list ? this.shopInfo.is_list = 0 : this.shopInfo.is_list = 1;
  }

  // 添加店铺
  savaData() {
    let data = {};
    data['shop_id'] = this.shopInfo['shop_id']; // 店铺id
    data['shop_name'] = this.shopInfo['shop_name']; // 店铺名称
    data['type_id'] = this.shopInfo['type_id'].join(','); // 店铺类型id
    data['type_rid'] = this.shopInfo['type_rid'].join(',');
    data['is_takeout'] = this.shopInfo['is_takeout']; // 是否开启配送
    data['is_reserve'] = this.shopInfo['is_reserve']; // 是否开启预定
    data['is_list'] = this.shopInfo['is_list']; // 是否开户排队
    data['name'] = this.shopInfo['name']; // 店主姓名
    data['shop_phone'] = this.shopInfo['shop_phone']; // 联系电话
    data['note'] = this.shopInfo['note']; // 店铺介绍
    data['lience_pic'] = this.shopInfo['lience_pic']; // 营业执照
    data['shop_avatar'] = this.shopInfo['shop_avatar']; // 店铺头像
    data['shop_pic'] = this.shopInfo['shop_pic']; // 店铺门面
    data['business_code'] = this.shopInfo['business_code']; // 商圈
    data['minimum'] = this.shopInfo['minimum']; // 最低消费
    data['spend_distance'] = this.shopInfo['spend_distance']; //  配送范围
    data['spend'] = this.shopInfo['spend']; //  配送费
    data['min_spend'] = this.shopInfo['min_spend']; //  起送价
    data['spendtime'] = this.shopInfo['spendtime']; //  配送时间
    data['detail_address'] = this.shopInfo['detail_address'];
    data['opentime'] = this.shopInfo['startTime'] + "--" + this.shopInfo['endTime'];
    data['shop_address'] = this.address + " " + this.shopInfo['detail_address'];
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;

    // 简单的验证
    if (!data['shop_name']) {
      return this.native.showToast("店铺名称不能为空");
    }
    if (!data['type_id']) {
      return this.native.showToast("请选择店铺分类");
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
    console.log("data", data);

    this.http.post("/api/app/shopEdit", data).subscribe(res => {
      console.log("修改商铺res", JSON.stringify(res));
      this.native.alert(res.info, '', '', () => {
        if (res.code == 200) {
          this.navCtrl.pop();
        }
      });
    });
  }
}
