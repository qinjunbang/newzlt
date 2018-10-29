import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Config } from '../../../../providers/Config';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';

@Component({
    selector: 'details-page',
    templateUrl: 'details.html'
})

export class DetailsPage {
    public token = Config.token;
    public deviceId = Config.device_id;
    public detailsList:any = [];
    public defaultType = '';
    public menuType = [
        {id: '',title:'全部'},
        {id: 0,title:'支出'},
        {id: 1,title:'收入'}
    ]
    constructor(
        public navCtrl: NavController,
        public http: HttpService,
        public native: NativeService
    ) {
        this.details()
    }
    details() {   //未完成
        this.http.post("/api/app/funds", {'token':this.token,'device_id': this.deviceId}).subscribe(res => {
            console.log("res", res);
            if(res.code == 200){
             this.detailsList = res.data.data
            }else {
              this.native.alert('提示','',res.info)
            }
        })
    }
    tabClick() {
        if(this.defaultType == ''){
            this.http.post("/api/app/funds", {'token':this.token,'device_id': this.deviceId}).subscribe(res => {
                console.log("res", res);
                if(res.code == 200){
                 this.detailsList = res.data.data
                }else {
                  this.native.alert('提示','',res.info)
                }
            })
        }else{
            this.http.post("/api/app/funds", {'token':this.token,'device_id': this.deviceId,'type':this.defaultType}).subscribe(res => {
                console.log("res", res);
                if(res.code == 200){
                 this.detailsList = res.data.data
                }else {
                  this.native.alert('提示','',res.info)
                }
            })
        }   
    }
}