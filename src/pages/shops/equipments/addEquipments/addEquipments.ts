import { Component , NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , NavParams , AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule  // <--- import into the NgModule
  ],
  /* Other module metadata */
})
@Component({
  selector: 'add-equipments',
  templateUrl: 'addEquipments.html'
})
export class addEquipmentsPage {
    public shopId = '';
    public eqName = '';
    public machinecode = '';
    public machinekey = '';
    constructor(
      public http: HttpService,
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public params: NavParams,
      public storage: Storage,
      public native: NativeService
    ) {
      this.shopId = this.params.get('shopId')
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
    public add() {
      let data = {
        'token': Config.token,
        'device_id': Config.device_id,
        'shop_id': this.shopId,
        'machinecode': this.machinecode,
        'machinekey': this.machinekey,
        'department': this.eqName
      };
      if (!data['department']) {
        return this.native.showToast("请输入设备名称~");
      } else if (!data['machinecode']) {
        return this.native.showToast("请输入设备终端号~");
      } else if (!data['machinekey']) {
        return this.native.showToast("请输入设备密钥~");
      }
      this.http.post("/api/app/printerAdd", data).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.native.alert('提示','',res.info)
          this.navCtrl.pop()
        }else {
          this.native.alert('提示','',res.info)
        }
      });
    }

    getNum() {
      console.log("this.eqName", this.eqName);
    }
}
