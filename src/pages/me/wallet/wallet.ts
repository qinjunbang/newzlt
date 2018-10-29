import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailsPage } from './details/details';
import { addCardPage } from './addCard/addCard';
import { forwardPage } from './forward/forward';
import { readyNamePage } from './readyName/readyName';
import { Storage } from '@ionic/storage';
import { Config } from '../../../providers/Config';
import { HttpService } from '../../../providers/HttpService';
import { NativeService } from '../../../providers/NativeService';

@Component({
    selector: 'wallet-page',
    templateUrl: 'wallet.html'
})

export class WalletPage {
    public user = '';
    public token = Config.token;
    public deviceId = Config.device_id;
    public money = '';
    constructor(
        public navCtrl: NavController,
        public storage: Storage,
        public http: HttpService,
        public native: NativeService
    ) {
        console.log(Config)
        this.storage.get('userInfo').then((val) => {
            console.log(val)
            this.user = val
        });
    }

    // 将进入页面时触发
    ionViewWillEnter () {
        this.showMoney();
    }
    forward() {
        this.navCtrl.push(forwardPage)
    }
    details() {
        this.navCtrl.push(DetailsPage)
    }
    addCard() {
        this.navCtrl.push(addCardPage)
    }

    showMoney() {
        this.http.post("/api/app/showMoney", {'token':this.token,'device_id': this.deviceId}).subscribe(res => {
            console.log("res", res);
            if(res.code == 200){
             this.money = res.data.money
            }else {
              this.native.alert('提示','',res.info)
            }
        })
    }

    readyName(){
        this.navCtrl.push(readyNamePage)
    }
}