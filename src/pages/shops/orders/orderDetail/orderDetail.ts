/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , ActionSheetController , NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';
import { SpeakingService } from '../../../../providers/SpeakingService';
import { Config } from '../../../../providers/Config';
import { OrderAddDishesPage } from '../order-add-dishes/order-add-dishes';

@Component({
  selector: 'order-detail',
  templateUrl: 'orderDetail.html'
})
export class OrderDetailPage {
  public defaultList = '0';
  public defaultType= '0';
  public shopId = '';
  public ordersList:any = {};
  public order_id = '';
  public order_type = '';
  public token = Config.token;
  public device_id = Config.device_id;

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public native: NativeService,
    public params: NavParams,
    public speaking: SpeakingService
  ) {
    this.shopId = this.params.get('shopId');
    this.order_id = this.params.get('order_id');
    this.getOrders()
  }
  ionViewDidLoad() {
    // this.getShopsList();
  }


  //获取订单数据
  public getOrders() {
    let data ={
      'token': this.token,
      'device_id': this.device_id,
      'order_id': this.order_id
    };
    this.http.post("/api/app/shopOneOrder", data).subscribe(res => {
      console.log("res", JSON.stringify(res));
      if(res.code == 200){
        this.ordersList = res.data;
        console.log(this.ordersList)
      }else {
        this.native.alert('提示','',res.info)
      }
    })
  }


  //配送部分：
  //接单
  receipt() {
    // 关闭播放的声音
    if (this.native.isMobile()) {
      this.speaking.stopSpeak();
    }

    this.http.post("/api/app/sureOrder", {'token':this.token,'device_id': this.device_id,'order_id':this.order_id}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert('提示','',res.info);
          this.getOrders();
        }else {
          this.native.alert('提示','',res.info)
        }
    })
  }
  //拒单
  reject() {
    // 关闭播放的声音
    this.speaking.stopSpeak();
    this.http.post("/api/app/rejectOrder", {'token':this.token,'device_id': this.device_id,'order_id':this.order_id}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert('提示','',res.info);
          this.getOrders();
        }else {
          this.native.alert('提示','',res.info)
        }
    })
  }


  //预定到店
  arrive() {
    this.http.post("/api/app/arriveShop", {'token':this.token,'device_id': this.device_id,'order_id':this.order_id}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert('提示','',res.info);
          this.getOrders();
        }else {
          this.native.alert('提示','',res.info)
        }
    })
  }
  //预定加菜
  addDishes() {
    this.navCtrl.push(OrderAddDishesPage,{'order_id':this.order_id,'shop_id':this.shopId})
  }
  //现金结账
  balance() {
    this.http.post("/api/app/reserveCashBalance", {'token':this.token,'device_id': this.device_id,'order_id':this.order_id,}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert(res.info, "", "", () => {
            this.getOrders();
          });
        }else {
          this.native.alert('提示','',res.info)
        }
    })
  }
  //修改价格
  editPrice() {
    this.http.post("/api/app/reserveEditMenu", {'token':this.token,'device_id': this.device_id,'order_id':this.order_id}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert(res.info, "", "", () => {
            this.getOrders();
          });
        }else {
          this.native.alert('提示','',res.info)
        }
    })
  }
  //同意退款
  refund() {
    this.http.post("/api/app/sureForRefund", {'token':this.token,'device_id': this.device_id,'order_id':this.order_id}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert(res.info, "", "", () => {
            this.getOrders();
          });
        }else {
          this.native.alert('提示','',res.info)
        }
    })
  }

  // 拨打电话
  callNumber (e, num) {
    e.stopPropagation();
    this.native.callNumber(num);
  }
}
