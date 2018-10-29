/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../../providers/HttpService';
import { NativeService } from '../../../../providers/NativeService';
import { Config } from '../../../../providers/Config';
import { NavController, NavParams } from 'ionic-angular';
import { EmployeesAddPage } from '../employees-add/employees-add';
import { EmployeesDetailPage } from '../employees-detail/employees-detail';


@Component({
  selector: 'page-employees-list',
  templateUrl: 'employees-list.html'
})
export class EmployeesListPage {
  public shop_id: string = ''; // 店铺ID
  public employees_list: any = []; // 员工列表
  public EmployeesAddPage = EmployeesAddPage; // 员工添加页面
  public EmployeesDetailPage = EmployeesDetailPage; // 员工添加页面

  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParam: NavParams,
    public native: NativeService
  ) {
    this.shop_id = this.navParam.get("sid");
  }
  ionViewWillEnter() {
     this.getEmployeesList();
  }

  // 获取店铺列表
  public getEmployeesList () {
    console.log("我要获取数据");
    this.http.post("/api/app/clerkAll", {token: Config.token, device_id: Config.device_id, shop_id: this.shop_id}).subscribe(res => {
      console.log("res", res);
      if (res.code == 200) {
        this.employees_list = res.data;
      } else {
        this.native.alert(res.info);
      }
    });
  }

  // 删除员工
  public deleteEmployees (eid) {
    let data = {};
    data['token'] = Config.token;
    data['device_id'] = Config.device_id;
    data['id'] = eid;
    data['shop_id'] = this.shop_id;

    this.native.alert("确定删除该员工？", "", "", () => {
      this.http.post("/api/app/clerkDel", data).subscribe(res => {
        this.native.showToast(res.info);
        if (res.code == 200) {
          this.getEmployeesList();
        }
      });
    });
  }

  // 页面跳转
  public goToPage (page, eid = '') {
    this.navCtrl.push(page, {"sid": this.shop_id, "eid": eid});
  }

}
