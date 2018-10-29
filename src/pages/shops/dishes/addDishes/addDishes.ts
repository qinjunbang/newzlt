import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , AlertController , ActionSheetController , NavParams} from 'ionic-angular';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'add-dishes',
  templateUrl: 'addDishes.html'
})
export class addDishesPage {
    public testRadioOpen = false;
    public dishName = '';
    public dishPrice = '';
    public shopId = '';
    public dishesList = '';
    public dishesListSelect = 0;
    public recommend = 0;
    public discount = 1;
    public text = '';
    public regularList = [];
    public imgArr = [];
    public serveUrl = Config.app_upload_serve_url;
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
        console.log(this.params.get('shopId'))
        this.getDishesList();
    }



    // 获取菜式分类
    public getDishesList () {
      this.http.post("/api/app/menuAll", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId}).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.dishesList = res.data;
        }else {
          this.native.alert('提示','',res.info);
        }
      })
    }

    getSelect(e) {
        console.log(e)
    }

    //选择菜式规格
    addRegular(){
        let that = this;
        console.log(that.shopId)
        let alert = this.alertCtrl.create({
          title: '添加菜式规格名称',
          inputs: [
            {
              name: 'name',
              placeholder: '菜式规格名称'
            }
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
                  that.regularList.push(data)
                  console.log(that.regularList);
              }
            }
          ]
        });
        alert.present();
      }

    //选择菜式详细规格
    addRegularDetail(name){
        let that = this;
        console.log(that.shopId)
        let alert = this.alertCtrl.create({
            title: '添加菜式详细规格',
            inputs: [
            {
                name: 'spec',
                placeholder: '份量/口味'
            },
            {
                name: 'price',
                type: 'number',
                placeholder: '价格'
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
                    let specDetail = data.spec+' | '+data.price;
                    that.regularList.forEach( res => {
                        if(res.name == name){
                            if(typeof(res['regu']) == 'undefined' ){
                                res['regu'] = [];
                           }
                           res['regu'].push(specDetail);
                        }
                    })
                    console.log(that.regularList);
                }
            }
            ]
        });
        alert.present();
    }

    //删除多规格详细
    deleteRegularDetail(name) {
        this.regularList.forEach( res => {
            res.regu.forEach( (val,i) => {
                if(val == name){
                    res.regu.splice(i,1)
                }
            });
            console.log(this.regularList)
        })
    }
    //删除多规格
    deleteRegular(name) {
        this.regularList.forEach( (res,i) => {
            if(res.name == name){
                this.regularList.splice(i,1)
            }
        })
        console.log(this.regularList)
    }



  // 点击上传图片
  chooseImg (text, index) {
    const actionSheet = this.actionSheetCtrl.create({
      title: "获取图片",
      buttons: [{
        text: "从相册中获取",
        handler: () => {
          this.getPictureByLibrary().subscribe(res => {
            if (text == 'add') {
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
              if (text == 'add') {
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
          text: '取消',
          role: 'cancel'
        }]
    });

    actionSheet.present();
  }

    addDishes() {

      if(this.dishName== '' || this.dishPrice=='' || !this.dishesListSelect || this.text==""){
        return this.native.alert('提示','','请把信息补充完整')
      } else if(this.discount<0 || this.discount>1){
        return this.native.alert('提示','','折扣请填写0~1范围数字')
      }

      let data={
        'token': Config.token,
        'device_id': Config.device_id,
        'shop_id': this.shopId,
        'dishes_name': this.dishName,
        'menu_id': this.dishesListSelect,
        'price': this.dishPrice,
        'discount': this.discount,
        'is_attr':0,
        'description': this.text
      };
      data['thumb'] = this.getStringImg(this.imgArr);
      //简单验证
      if (!data['dishes_name']) {
        return this.native.showToast("请输入菜名！");
      }
      if (!data['price']) {
        return this.native.showToast("请输入单价！");
      }
      this.http.post("/api/app/dishAdd", data).subscribe(res => {
        console.log("res", res);
        if(res.code == 200){
          this.dishesList = res.data;
          this.navCtrl.pop();
        }else {
          this.native.alert('提示','',res.info);
        }
      })
    }
  // 获取图片字条串拼接
  getStringImg (arr: any) {
    let len = arr.length,
      str: string = "";

    for (let i = 0; i < len; i++) {
      arr[i] = arr[i].replace(Config.app_upload_serve_url, "");
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
        this.native.uploadImages(res, '/api/app/shopUpload').subscribe(s => {
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
        this.native.uploadImages(res, '/api/app/shopUpload').subscribe(s => {
          observer.next(s);
        });
      }, err => {
        console.log("err", err);
      });
    });
  }
}
