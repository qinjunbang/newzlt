/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , ActionSheetController , NavParams} from 'ionic-angular';
import { OrderDetailPage } from '../orderDetail/orderDetail';
import { OrderAddDishesPage } from '../order-add-dishes/order-add-dishes';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';

@Component({
  selector: 'page-orders-list',
  templateUrl: 'orders-list.html'
})
export class OrdersListPage {
  public menuList = [
    {id: 0,title:'配送'},
    {id: 1,title:'预定'},
    {id: 2,title:'排队'},
    {id: 3,title:'扫码'}
  ]; // 订单列表
  public menuType = [
    {id: 9,title:'全部'},
    {id: 2,title:'支付成功'},
    {id: 3,title:'进行中'},
    {id: 4,title:'完成'},
    {id: 6,title:'退款'}
  ]; // 订单列表
  public defaultList = '0';
  public defaultType= '9';
  public shopId = '';
  public ordersList:any = [];
  public total: number = 0;
  public page: number = 1;

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public native: NativeService,
    public params: NavParams
  ) {
    this.shopId = this.params.get('sid');
    this.getOrders(1)
  }
  ionViewDidLoad() {
    // this.getShopsList();
  }

  //获取订单数据
  public getOrders(page, resolve: any = null) {
    let data = {
      'token': Config.token,
      'device_id': Config.device_id,
      'shop_id': this.shopId,
      'type': this.defaultList,
      'status': this.defaultType,
      'page': page
    };
    this.http.post("/api/app/shopAllOrders", data).subscribe(res => {
      console.log("res", res);

      if(res.code == 200){
        if (resolve !== null) {
          resolve();
        }
        this.total = res.data.total;

        // this.ordersList = [];

        let lists = res.data.data;
        for (let key in lists) {
          this.ordersList.push(lists[key]);
        }

      }else if(res.code == 201){
        this.ordersList = []
      }else {
        this.native.alert('提示','',res.info)
      }
    })
  }

  seeOrders() {
    this.page = 1;
    this.ordersList = [];
    this.getOrders(this.page);
  }

  //点击列表
  listDetail(id,type) {
    this.navCtrl.push(OrderDetailPage,{'order_id':id,'shopId':this.shopId,'order_type':type})
  }

  //点击订单出现删除
  deleteList() {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "删除订单",
          handler: () => {
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


  //下拉刷新
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  //检查是否全部加载完成
    check(total, data) {
      let len = data.length;
      if(len >= total && total !== 0) {
        return true;
      }
      return false;
    }
  // 上拉加载
  doInfinite(event): Promise<any> {
    //判断是否全部加载完成
    let flag = this.check(this.total, this.ordersList);
    //请求数据
    return new Promise((resolve) => {
      if(flag == true) {
        event && event.complete();
        resolve()
      } else {
        this.page++;
        this.getOrders(this.page, resolve);

      }
    })
  }

  // 拨打电话
  callNumber (e, num) {
    e.stopPropagation();
    this.native.callNumber(num);
  }

}
