/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';



@Component({
  selector: 'page-employees-detail',
  templateUrl: 'employees-detail.html'
})
export class EmployeesDetailPage {

  public shop_id: string = '';	//	商家ID
  public e_id: string = '';	//	员工ID

  public employeesInfo = {
    shop_id: '',
    id: '',
    avatar: '', // 头像
    name: '', // 名称
    sex: 1, // 性别
    role: 1, // 角色id (0财务，1服务员，2经理，3主管)
    mobile: '', // 手机号
    password: '' // 密码
  };

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParam: NavParams,
    public native: NativeService
  ) {
    this.shop_id = this.navParam.get('sid');
    this.e_id = this.navParam.get('eid');
  }
  // 页面初始化完成
  ionViewDidLoad() {

    this.getEmployeesOne(this.shop_id, this.e_id);
  }

  // 获取一个员工信息
  getEmployeesOne (sid, eid) {
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['shop_id'] = sid;
    data['id'] = eid;
    this.http.post("/api/app/clerkOne", data).subscribe(res => {
      console.log("res", res);
      if (res.code == 200) {
        this.employeesInfo = res.data;
      }
    });

  }

  // 添加员工
  saveData () {
    let data =  this.employeesInfo;

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


    this.http.post("/api/app/clerkEdit", data).subscribe(res => {
      this.native.alert(res.info, "", "", () => {
        if (res.code == 200) {
          this.navCtrl.pop();
        }
      })
    });
  }
}
