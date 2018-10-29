import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../../../providers/Config';
import { Utils } from '../../../../providers/Utils';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';

@Component({
    selector: 'ready-name',
    templateUrl: 'readyName.html'
})

export class readyNamePage {
    public userInfo = Config.userInfo;
    public token = Config.token;
    public deviceId = Config.device_id;
    public cardsList:any=[];
    public name = '';
    public card = '';
    public realName = '';
    public cardNo = '';
    constructor(
        public navCtrl: NavController,
        public http: HttpService,
        public native: NativeService
    ) {
        console.log(Config.userInfo)
        this.checkIdentify()
    }

    readyName() {   //实名认证
        if(Utils.isUserName(this.name) == 'true'){
            if(Utils.isCardNo(this.card) == 'true'){
                this.http.post("/api/app/identify", {'token':this.token,'device_id': this.deviceId,'realname':this.name,'cardno':this.card}).subscribe(res => {
                    console.log("res", res);
                    if(res.code == 200){
                        this.native.alert('提示','',res.info)
                        this.navCtrl.pop()
                    }else {
                      this.native.alert('提示','',res.info)
                    }
                })
            }else{
                this.native.showToast(Utils.isCardNo(this.card))
            }
        }else{
            this.native.showToast(Utils.isCardNo(this.name))
        }
        
    }

    checkIdentify() {   //已经实名认证
        this.http.post("/api/app/checkIdentify", {'token':this.token,'device_id': this.deviceId}).subscribe(res => {
            console.log("res", res);
            if(res.code == 200){
                this.realName = res.data.realName;
                this.cardNo = res.data.cardNo;
            }else {
              //this.native.alert('提示','',res.info)
            }
        })
    }

}