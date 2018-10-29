import { Component } from '@angular/core';
import { NavController , ActionSheetController} from 'ionic-angular';
import { NativeService } from '../../../../../providers/NativeService';
import { HttpService } from '../../../../../providers/HttpService';
import { Config } from '../../../../../providers/Config';
import { Utils } from '../../../../../providers/Utils';

@Component({
    selector: 'add-new-card',
    templateUrl: 'addNewCard.html'
})

export class addNewCardPage {
    public name = '';
    public card:any = Number;
    public cardType = 1;
    public token = Config.token;
    public deviceId = Config.device_id;
    constructor(
        public navCtrl: NavController,
        public native: NativeService,
        public http: HttpService
    ) {

    }

    addCard() {
        //console.log(Utils.isBank(this.card));
        if(Utils.isBank(this.card) == 'true'){
            this.http.post("/api/app/addCard", {'token':this.token,'device_id': this.deviceId,'account_user':this.name,'account_number':this.card,'bank_type':this.cardType}).subscribe(res => {
                console.log("res", res);
                if(res.code == 200){
                 //this.cardsList = res.data
                 this.native.alert('提示','',res.info)
                 this.navCtrl.pop();
                }else {
                  this.native.alert('提示','',res.info)
                }
            })
        }else{
            this.native.showToast(Utils.isBank(this.card))
        }
        
    }

    
}