/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController, ActionSheetController , NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';

import { addEquipmentsPage } from '../addEquipments/addEquipments';
import { EquipmentsDetailsPage } from '../equipments-details/equipments-details';


@Component({
  selector: 'page-equipments-list',
  templateUrl: 'equipments-list.html'
})
export class EquipmentsListPage {
  public equipmentList: Object;
  public shopId = ''

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public native: NativeService,
    public params: NavParams
  ) {
    this.shopId = this.params.get('sid');
    console.log(this.shopId)
  }
  ionViewDidLoad() {
    // this.getShopsList();
  }
  ionViewWillEnter() {
    this.getEquipList()
  }

  public getToken(){
    return new Promise((resolve) => {
      this.storage.get('token').then((val) => {
          resolve(val)
      });
    })
  }
  public getDeviceId(){
    return new Promise((resolve) => {
      this.storage.get('device_id').then((val) => {
          resolve(val)
      });
    })
  }

  // 获取打印机列表
  public getEquipList () {
    let that = this;
    async function getList(){
      let token = await that.getToken();
      let deviceId = await that.getDeviceId();
      that.http.post("/api/app/printerAll", {'token':token,'device_id': deviceId,'shop_id':that.shopId}).subscribe(res => {
          console.log("res", res);
          if(res.code == 200){
            that.equipmentList = res.data;
          }else if(res.code == 201){
            that.equipmentList = [];
            that.native.alert('提示','',res.info);
          }else{
            that.native.alert('提示','',res.info);
          }
      })
    }
    getList()
  }

  // 页面跳转
  public addEquipments () {
    this.navCtrl.push(addEquipmentsPage,{'shopId':this.shopId});
  }

  

  //查看设备详情
  seeDeatils(equip) {
    this.navCtrl.push(EquipmentsDetailsPage,{'shopId':this.shopId,'equip':equip})
  }

}
