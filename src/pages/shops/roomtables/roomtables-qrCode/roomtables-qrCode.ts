/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , AlertController , NavParams} from 'ionic-angular';
import { Config } from '../../../../providers/Config';
import { NativeService } from '../../../../providers/NativeService';

@Component({
  selector: 'page-roomtables-qrCode',
  templateUrl: 'roomtables-qrCode.html'
})
export class RoomTablesQrCodePage {
  public shopId = '';
  public codeList = []; // 二维码数据
  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public params: NavParams,
    public native: NativeService
  ) {
    this.shopId = this.params.get('sid');
  }
  ionViewWillEnter() {
    this.getRoomTableList();
  }

  // 获取房桌列表
  getRoomTableList () {
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['shop_id'] = this.shopId;

    this.http.post("/api/shop/showRoomTable", data).subscribe(res => {
      console.log("res", res);
      let data = res.data;

      if (res.code == 200 && data.length > 0 ) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].lock_qrcode == 1) {
            let value = '';
            if (data[i].is_reserve == true) {
              value = Config.app_serve_url + "s2?id=" + data[i].encrypted_id;
            } else {
              value = Config.app_serve_url + "s?id=" + data[i].id;
            }
            console.log("value", value);
            let obj = {title: data[i].name, value: value};
            this.codeList.push(obj);
          }
        }
      } else {
        this.native.alert(res.info);
      }
    });
  }

  // 点击图片下载
  downCodeImg (event, title) {
    console.log("我要下载", event);
    console.log("title", title);
    let alert = this.alertCtrl.create({
      title: "提示",
      message: "是否下载该图片？",
      buttons: [{
        text: '取消'
      },{
        text: '确定',
        handler: () => {
          let base64 = event.target.currentSrc;
          this.native.downloadBase64Img(base64, title);
        }
      }]

    }).present();

  }

  // 批量下载
  downAll() {
    console.log("我要批量下载");
    let alert = this.alertCtrl.create({
      title: "提示",
      message: "批量下载所有图片",
      buttons: [
        {
          text: '取消'
        },
        {
         text: "确定",
          handler: () => {
            let imgBox = document.getElementById("img-box"),
                imgs = imgBox.querySelectorAll("img"),
                ps = imgBox.querySelectorAll("p.room-title");
            console.log("imgBox", imgs);
            console.log("ps", ps);
            if (imgs.length > 0) {
              for (let i = 0; i < imgs.length; i++) {
                let base64 = imgs[i].currentSrc,
                    title = ps[i].textContent;
                this.native.downloadBase64Img(base64, title)
              }
            }
          }
        }]
    }).present();

  }

}
