import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../../../providers/Config';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';

@Component({
    selector: 'forward-page',
    templateUrl: 'forward.html'
})

export class forwardPage {
    public userInfo = Config.userInfo;
    public token = Config.token;
    public deviceId = Config.device_id;
    public cardsList:any=[];
    public cardId = 0;
    public money;
    constructor(
        public navCtrl: NavController,
        public http: HttpService,
        public native: NativeService
    ) {
        console.log(Config.userInfo);
        this.getCardList()
    }

    getCardList() {
        this.http.post("/api/app/showCards", {'token':this.token,'device_id': this.deviceId}).subscribe(res => {
            console.log("res", res);
            if(res.code == 200){
             this.cardsList = res.data;
            }else {
              this.native.alert('提示','',res.info)
            }
        })
    }

    forward() {
        if(this.money<10 && this.money>10000){
            this.native.alert('提示','','请输入提现金额10~10000元！')
        }else{
            this.http.post("/api/app/withdraw", {'token':this.token,'device_id': this.deviceId,'id':this.cardId,'money':this.money}).subscribe(res => {
                console.log("res", res);
                if(res.code == 200){
                 //this.cardsList = res.data
                 this.native.alert('提示','',res.info)
                 this.navCtrl.pop()
                }else {
                  this.native.alert('提示','',res.info)
                }
            })
        }

    }

    return() {
        this.navCtrl.pop()
    }

}
