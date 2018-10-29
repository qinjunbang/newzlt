import { Component } from '@angular/core';
import { NavController , ActionSheetController } from 'ionic-angular';
import { addNewCardPage } from './addNewCard/addNewCard';
import { Config } from '../../../../providers/Config';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';

@Component({
    selector: 'add-card',
    templateUrl: 'addCard.html'
})

export class addCardPage {
    public userInfo = Config.userInfo;
    public token = Config.token;
    public deviceId = Config.device_id;
    public cardsList:any=[]
    constructor(
        public navCtrl: NavController,
        public http: HttpService,
        public native: NativeService,
        public actionSheetCtrl: ActionSheetController
    ) {
        console.log(Config.userInfo)
    }
    ionViewWillEnter() {
        this.getCardList()
    }

    getCardList() {
        this.http.post("/api/app/showCards", {'token':this.token,'device_id': this.deviceId}).subscribe(res => {
            console.log("res", res);
            if(res.code == 200){
             this.cardsList = res.data
            }else {
              this.native.alert('提示','',res.info)
            }
        })
    }
    addCard() {
        this.navCtrl.push(addNewCardPage)
    }

      //删除银行卡
      delCards(id) {
        let that = this;
        const actionSheet = this.actionSheetCtrl.create({
        buttons: [
            {
            text: "删除银行卡",
            handler: () => {
                this.http.post("/api/app/delCard", {'token':this.token,'device_id': this.deviceId,'id':id}).subscribe(res => {
                    console.log("res", res);
                    if(res.code == 200){
                        this.native.alert('提示','',res.info);
                        this.cardsList.forEach((res,index) => {
                            if(res.id == id){
                                this.cardsList.splice(index,1)
                            }
                        });
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