import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , NavParams , AlertController , ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';


@Component({
  selector: 'equipments-details',
  templateUrl: 'equipments-details.html'
})
export class EquipmentsDetailsPage {
    public shopId = '';
    public equip: Object = {};
    public eqName = '';
    public useAll = 0;
    public dishesSelect = [];
    public priterNum = 1;
    public id = 0;
    public dishesList = []
    constructor(
      public http: HttpService,
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public params: NavParams,
      public storage: Storage,
      public native: NativeService,
      public actionSheetCtrl: ActionSheetController
    ) {

      this.shopId = this.params.get('shopId');

      const equip = this.params.get('equip');
      console.log("equip", equip);

      if(equip != '' || equip != undefined){
        this.eqName = equip.department;
        this.id = equip.id;
        this.useAll = equip.is_useall;
        this.dishesSelect = equip.cuisine ? equip.cuisine.split(',') : [];
        this.priterNum = equip.priter_number;
      }
      console.log(" this.dishesSelect",  this.dishesSelect);
      this.getDishesList()
    }


    // 菜品分类默认值
    public compareFn (e1, e2) {
      return e1 && e2 ? e1 === e2 : e1.id === e2.id;
    }

    //获取本地设备id和token
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
    public changeEquip() {
      let that = this
      async function addEquip(){
        let token = await that.getToken();
        let deviceId = await that.getDeviceId();

        let data = {
          'token': token,
          'device_id': deviceId,
          'shop_id': that.shopId,
          'id': that.id,
          'department': that.eqName,
          'priter_number': that.priterNum,
          'is_useall': that.useAll,
        };

        data['cuisine'] = data['is_useall'] == 0 ? '' : that.dishesSelect.join(',');

        that.http.post("/api/app/printerEdit", data ).subscribe(res => {
            console.log("res", res);
            if(res.code == 200){
              that.native.alert('提示','',res.info)
              that.navCtrl.pop()
            }else {
              that.native.alert('提示','',res.info)
            }
        })
      }
      addEquip()
    }

    // 获取菜式分类
    public getDishesList () {
      let that = this;
      async function getDishes(){
      let token = await that.getToken();
      let deviceId = await that.getDeviceId();
      that.http.post("/api/app/menuAll", {'token':token,'device_id': deviceId,'shop_id':that.shopId}).subscribe(res => {
          console.log("res", res);
          if(res.code == 200){
              that.dishesList = res.data;
          }else {
              that.native.alert('提示','',res.info);
          }
      })
      }
      getDishes()
  }

    //删除设备
  deleteEquip() {
    let that = this;
    console.log(that.equip)
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "删除设备",
          handler: () => {
            async function delEquip(){
                let token = await that.getToken();
                let deviceId = await that.getDeviceId();
                that.http.post("/api/app/printerDel", {'token':token,'device_id': deviceId,'shop_id':that.shopId,'id':that.id}).subscribe(res => {
                    console.log("res", res);
                    if(res.code == 200){
                      that.navCtrl.pop()
                    }else {
                      that.native.alert('提示','',res.info)
                    }
                })
              }
              delEquip()
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

  //是否全部打印
  getSelect(e) {
    this.dishesSelect = e;
  }
}
