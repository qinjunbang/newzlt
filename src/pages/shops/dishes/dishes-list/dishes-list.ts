/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NavController , NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';

import { addDishesPage } from '../addDishes/addDishes';
import { editDishesPage } from '../editDishes/editDishes';
import { dishesClassPage } from '../dishesClass/dishesClass';


@Component({
  selector: 'page-dishes-list',
  templateUrl: 'dishes-list.html'
})
export class DishesListPage {
  public dishesList = [];
  public menuList = [];
  public shopId = '';
  public menuSelect = 0;
  public serverUrl = Config.app_upload_serve_url;
  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public storage: Storage,
    public native: NativeService,
    public params: NavParams
  ) {
    this.shopId = this.params.get('sid');
  }
  ionViewWillEnter() {
    this.getDishesClass();
  }


  // 点击菜单
  changeMenu (id) {
    this.menuSelect = id;
    this.getDishesList(id);
  }

  // 获取菜的分类
  getDishesClass() {
    this.http.post("/api/app/menuAll", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId}).subscribe(res => {
      console.log("res", res);
      if(res.code == 200){
        this.menuList = res.data;
        this.menuSelect = res.data[0].id;
        this.getDishesList(res.data[0].id);
      }
    })
  }

  // 获取菜式列表
  public getDishesList (id) {
    this.http.post("/api/app/dishAllDesign", {'token': Config.token,'device_id': Config.device_id,'shop_id': this.shopId, id: id}).subscribe(res => {
      console.log("res", res);
      if(res.code == 200){
        let ldata = res.data;
        for (let i = 0; i < ldata.length; i++) {
          if (ldata[i].shopdish) {
            for (let j = 0; j < ldata[i].shopdish.length; j++) {
              let imgArr = ldata[i].shopdish[j].thumb.split(";");
              ldata[i].shopdish[j].thumb = imgArr[0];
            }
          }
        }
        this.dishesList = ldata;
        console.log("this.dishesList", this.dishesList);
      }else {
        this.native.alert('提示','',res.info);
      }
    })
  }

  // 增加菜式
  addDishes () {
     this.navCtrl.push(addDishesPage,{'shopId':this.shopId});
  }
  // 编辑菜式
  editDishes (id) {
    this.navCtrl.push(editDishesPage,{'shopId':this.shopId,'id':id});
 }

  //删除菜式
  deleteDishes(e, id) {
    e.stopPropagation(); // 阻止冒泡
    console.log("我要删除", id);
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['id'] = id;
    this.http.post("/api/app/dishDel", data).subscribe(res => {
      console.log("res", res);
      this.native.showToast(res.info);
      if (res.code == 200) {
        this.getDishesList(this.menuSelect);
      }
    });

  }

  // 下架
  soldOut(e, id, status) {
    e.stopPropagation(); // 阻止冒泡
    console.log("我要下架", id);
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['id'] = id;
    if (status) {
      data['status'] = 0;
    } else {
      data['status'] = 1;
    }

    this.http.post("/api/app/dishStatus", data).subscribe(res => {
      console.log("res", res);
      this.native.showToast(res.info);
      if (res.code == 200) {
        this.getDishesList(this.menuSelect);
      }
    });
  }

  dishesClass() {
    this.navCtrl.push(dishesClassPage,{'shopId':this.shopId});
  }

  public toggleFun(e) {
    console.log(e._value);
  }

}
