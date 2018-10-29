/**
 * Created by HIAPAD on 2018/7/27.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../providers/HttpService';
import { NavController, NavParams } from 'ionic-angular';
import { ShopsDetailPage } from '../shops-detail/shops-detail';
import { EmployeesListPage } from '../employees/employees-list/employees-list';
import { DishesListPage } from '../dishes/dishes-list/dishes-list';
import { RoomTablesListPage } from '../roomtables/roomtables-list/roomtables-list';
import { EquipmentsListPage } from '../equipments/equipments-list/equipments-list';
import { OrdersListPage } from '../orders/orders-list/orders-list';
import { FinancialsCategoryPage } from '../financials/financials-category/financials-category';
import { Config } from '../../../providers/Config';
import { OrderAddDishesPage } from '../orders/order-add-dishes/order-add-dishes';



@Component({
  selector: 'page-shops-manage',
  templateUrl: 'shops-manage.html'
})
export class ShopsManagePage {
  public menuList = [];
  public sid; // 店铺id
  public ShopsDetailPage: any = ShopsDetailPage; // 修改店铺资料页面
  public role = Config.userInfo['role']; // 角色信息
  constructor(
    public http: HttpService,
    public navCtrl: NavController,
    public navParams: NavParams,

  ) {
    // 获取店铺ID
    this.sid = navParams.get("sid");
    console.log(this.sid);
    this.setManageMenu();
  }
  ionViewDidLoad() {

  }

  // 设置菜单
  setManageMenu () {
    // console.log("666");
    let data = [{
      id: 0,
      name: '员工管理',
      comment: EmployeesListPage,
      display: 'block'
    },{
      id: 1,
      name: '菜单管理',
      comment: DishesListPage,
      display: 'block'
    },{
      id: 2,
      name: '房桌管理',
      comment: RoomTablesListPage,
      display: 'block'
    },{
      id: 3,
      name: '设备管理',
      comment: EquipmentsListPage,
      display: 'block'
    },{
      id: 4,
      name: '订单管理',
      comment: OrdersListPage,
      display: 'block'
    },{
      id: 5,
      name: '财务管理',
      comment: FinancialsCategoryPage,
      display: 'block'
    }];



    // 权限分配
    switch(this.role) {
      case 0:
        // 财务
        data[0]['display'] = 'none';
        data[1]['display'] = 'none';
        data[2]['display'] = 'none';
        data[3]['display'] = 'none';
        data[4]['display'] = 'none';
        break;
      case 1:
        // 服务员
        data[0]['display'] = 'none';
        data[3]['display'] = 'none';
        data[5]['display'] = 'none';
        break;
      case 2:
        // 经理
        break;
      case 3:
        // 主管
        data[5]['display'] = 'none';
        break;
      default:
    }

    this.menuList = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i]['display'] === 'block') {
        this.menuList.push(data[i]);
      }
    }
  }

  // 页面跳转
  goToPage (event) {
    console.log("event", event);
    this.navCtrl.push(event, {'sid': this.sid});
  }

  //服务员点菜
  addDishes() {
    this.navCtrl.push(OrderAddDishesPage,{'shop_id': this.sid})
  }

}
