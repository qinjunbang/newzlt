import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , AlertController , ActionSheetController , NavParams} from 'ionic-angular';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'edit-dishes',
  templateUrl: 'editDishes.html'
})
export class editDishesPage {
    public serverUrl = Config.app_upload_serve_url;
    public testRadioOpen = false;
    public dishName = '';
    public dishPrice = '';
    public shopId = '';
    public dishesList = '';
    public dishesListSelect = 0;
    public discount = 0.9;
    public text = '';
    public id = 0;
    public dishesMess = '';
    public img = '';
    public imgArr = [];
    public recommend = 0;
    constructor(
        public http: HttpService,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public native: NativeService,
        public actionSheetCtrl: ActionSheetController,
        public params: NavParams,
        public storage: Storage
    ){
        this.shopId = this.params.get('shopId');
        this.id = this.params.get('id');
        this.getDishesList();
        this.getDishesMess();
    }


    // 获取菜式列表
    public getDishesList () {
      this.http.post("/api/app/menuAll", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.dishesList = res.data;
        }else {
          this.native.alert('提示','',res.info);
        }
      });
    }

    // 获取菜式信息
    public getDishesMess () {
      this.http.post("/api/app/dishOne", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId,'id': this.id}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.dishesMess = res.data;
          this.dishName = res.data.dishes_name;
          this.dishPrice = res.data.price;
          this.dishesListSelect = res.data.menu_id;
          this.discount = res.data.discount;
          this.text = res.data.description;
          this.recommend = res.data.recommend;
          this.imgArr = res.data.thumb.split(";");
        }else {
          this.native.alert('提示','',res.info);
        }
      })
    }
  addDishes() {

    if(this.dishName== '' || this.dishPrice=='' || !this.dishesListSelect || this.text==""){
      this.native.alert('提示','','请把信息补充完整')
    } else if(this.discount<0 || this.discount>1){
      this.native.alert('提示','','折扣请填写0~1范围数字')
    }
    let data={
      'token': Config.token,
      'device_id': Config.device_id,
      'shop_id':this.shopId,
      'dishes_name':this.dishName,
      'menu_id': this.dishesListSelect,
      'price': this.dishPrice,
      'discount': this.discount,
      'is_attr':0,
      'description':this.text,
      'id':this.id,
      'recommend' : this.recommend
    };
    data['thumb'] = this.getStringImg(this.imgArr);
    this.http.post("/api/app/dishEdit", data).subscribe(res => {
      console.log("res", res);
      if(res.code == 200){
        this.dishesList = res.data;
        this.navCtrl.pop();
      }else {
        this.native.alert('提示','',res.info);
      }
    })

  }

// 点击上传图片
  chooseImg (text, index) {
    const actionSheet = this.actionSheetCtrl.create({
      title: "获取图片",
      buttons: [{
        text: "从相册中获取",
        handler: () => {
          this.getPictureByLibrary().subscribe(res => {
            if (text === 'add') {
              // 如果是新增，插入一张图片
              this.imgArr.push(res);
            } else {
              // 如果是原图更新，则更换当前图片的src
              this.imgArr[index] = res;
            }
          });
        }
      },
        {
          text: "拍照",
          handler: () => {
            this.getPictureByCamera().subscribe(res => {
              if (text === 'add') {
                // 如果是新增,插入一张图片
                this.imgArr.push(res);
              } else {
                // 如果是原图更新，则更换当前的图片src
                this.imgArr[index] = res;
              }
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }]
    });

    actionSheet.present();
  }
  // 获取图片字条串拼接
  getStringImg (arr: any) {
    let len = arr.length,
      str: string = "";

    for (let i = 0; i < len; i++) {
      if (i < len -1) {
        str += arr[i] + ';';
      } else {
        str += arr[i];
      }
    }

    return str;
  }
  // 从图库获取图片
  getPictureByLibrary ():Observable<string> {
    return Observable.create(observer => {
      // 以拿到图片原始url 方式拿图片 destinationType 1 ， 0 为base64
      this.native.getPictureByLibrary({destinationType: 1}).subscribe(res => {
        // 上传图片，拿到图片在服务器的url
        this.native.uploadImages(res, 'api/app/shopUpload').subscribe(s => {
          observer.next(s);
        });
      }, err => {
        console.log("err1", err);
      });
    });

  }

  // 拍照获取图片
  getPictureByCamera ():Observable<string> {
    return Observable.create(observer => {
      // 以拿到图片原始url 方式拿图片 destinationType 1 ， 0 为base64
      this.native.getPictureByCamera({destinationType: 1}).subscribe(res => {
        console.log("拍照图片res", res);
        //  // 上传图片，拿到图片在服务器的url
        this.native.uploadImages(res, 'api/app/shopUpload').subscribe(s => {
          observer.next(s);
        });
      }, err => {
        console.log("err", err);
      });
    });
  }


}
