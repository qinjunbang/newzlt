import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , AlertController , ActionSheetController , NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';



@Component({
  selector: 'dishes-class',
  templateUrl: 'dishesClass.html'
})
export class dishesClassPage {
  public testRadioOpen: false;
  public shopId = '';
  public dishesList = '';
  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public params: NavParams,
    public storage: Storage,
    public native: NativeService
  ) {
    this.shopId = this.params.get('shopId');
    this.getDishesClass()
  }

  getDishesClass() {
    this.http.post("/api/app/menuAll", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId}).subscribe(res => {
      console.log("res", res);
      if(res.code == 200){
        this.dishesList = res.data
      }else {
        this.native.alert('提示','',res.info)
      }
    })
  }


  edit(id,name,sort){
    let alert = this.alertCtrl.create({
      title: '修改分类',
      inputs: [
        {
          name: 'name',
          value:name,
          placeholder: '分类名称'
        },
        {
          name: 'sort',
          value:sort,
          placeholder: '排序'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: (data) => {
            this.http.post("/api/app/menuEdit", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId,'menu_name': data.name,'id': id}).subscribe(res => {
              console.log("res", res);
              if(res.code == 200){
                this.getDishesClass();
                this.native.alert('提示','',res.info);
              }else {
                this.native.alert('提示','',res.info)
              }
            })
          }
        }
      ]
    });
    alert.present();
  }

  add(){

    let alert = this.alertCtrl.create({
      title: '添加分类',
      inputs: [
        {
          name: 'name',
          placeholder: '分类名称'
        },
        {
          name: 'sort',
          placeholder: '排序'
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: (data) => {
            this.http.post("/api/app/menuAdd", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId,'menu_name': data.name,'menu_sort': data.sort}).subscribe(res => {
              console.log("res", res);
              if(res.code == 200){
                alert.dismiss();
                this.getDishesClass();
                this.native.alert('提示','',res.info);
              }else {

                this.native.showToast(res.info);

              }
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  delete(id){
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
          {
            text: "确定删除",
            handler: () => {
              this.http.post("/api/app/menuDel", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId,'id': id}).subscribe(res => {
                console.log("res", res);
                if(res.code == 200){
                  this.getDishesClass();
                  this.native.alert('提示','',res.info);
                }else {
                  this.native.alert('提示','',res.info)
                }
              })
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
}
