/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';



@Component({
  selector: 'page-employees-add',
  templateUrl: 'employees-add.html'
})
export class EmployeesAddPage {

  public shop_id: string = '';	//	商家ID
  public role: number = 1;	// 角色id (0财务，1服务员，2经理，3主管)
  public mobile: string = '';	// 手机号
  public name: string = '';	// 名称
  public sex: number = 1;	// 性别
  public password: string = ''; 	// 密码

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParam: NavParams,
    public native: NativeService
  ) {
    this.shop_id = this.navParam.get('sid');
  }
  // 页面初始化完成
  ionViewDidLoad() {

  }

  // 添加员工
  saveData () {
    let data = {};
    data['shop_id'] = this.shop_id;
    data['role'] = this.role;
    data['mobile'] = this.mobile;
    data['name'] = this.name;
    data['sex'] = this.sex;
    data['password'] = this.password;
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;

    if (!data['name']) {
      return this.native.showToast("请输入员工姓名");
    }
    if (!data['role']) {
      return this.native.showToast("请选择职务");
    }
    if (!data['mobile']) {
      return this.native.showToast("请输入手机号");
    }
    if (!data['password']) {
      return this.native.showToast("请输入员工密码");
    }

    this.http.post("/api/app/clerkAdd", data).subscribe(res => {
      this.native.alert(res.info, "", "", () => {
        if (res.code == 200) {
          this.navCtrl.pop();
        }
      })
    });
  }
}
