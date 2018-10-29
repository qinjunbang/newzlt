import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Config } from '../../../providers/Config';
import { NativeService } from '../../../providers/NativeService';
import { HttpService } from '../../../providers/HttpService';
import { ShopsManagePage } from '../../shops/shops-manage/shops-manage';
import { TabsPage } from '../../tabs/tabs';
import { JPushService } from '../../../providers/JPushService';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public name:string = ''; // 用户名
  public password:string = ''; // 密码
  public code: string = ''; // 验证码
  public login_type: string = 'userName'; // 默认账号密码登录
  public timer; // 计时器
  public btnText: string = '获取验证码'; // 发送验证码文案
  public role: number = 0; // 我是商家

  constructor(
    public navCtrl: NavController,
    public native: NativeService,
    public http: HttpService,
    public storage: Storage,
    private jPush: JPushService

  ) {

  }



  // 点击登录
  login () {
    let data = {};
    data['mobile'] = this.name;

    if (!data['mobile']) {
      return this.native.showToast("用户名不能为空~");
    }
    // 密码登录
    if (this.login_type === 'userName') {
      data['password'] = this.password;
      if (!data['password']) {
        return this.native.showToast("密码不能为空~");
      }
    } else {
      // 验证码登录
      data['code'] = this.code;
      if (!data['code']) {
        return this.native.showToast("验证码不能为空~");
      }
    }

    data['device_id'] = this.getMyUid() || 'b24c3f95b198268';
    data['role'] = this.role;
    // 缓存设备id
    this.storage.set("device_id", data['device_id']);

    this.http.post('/api/app/login', data).subscribe(res => {
     console.log("res", res);
     console.log("res", JSON.stringify(res));
     if (res.code == 200) {
       this.native.showToast(res.info);
       // 缓存token
       res.data.token && this.storage.set("token", res.data.token);
       // 缓存用户信息
       res.data.shopclerk && this.storage.set("userInfo", res.data.shopclerk);
       Config.token = res.data.token;
       Config.userInfo = res.data.shopclerk;
       Config.device_id = res.data.shopclerk.device_id;
       this.jPush.setAlias();
       // 跳转到我的页面
       this.navCtrl.setRoot(TabsPage);

     } else {
       // 显示提示框
       this.native.alert(res.info);
     }

    });
  }

  // 获取设备UUID
  getMyUid () {
    let uuid = this.native.getUid();

    return uuid;
  }

  // 页面跳转
  goToPage () {
    this.navCtrl.push(ShopsManagePage, {});
  }

  // 获取验证码
  getAuthCode () {
    // 如果正在倒计时，不允许再点击
   if (this.timer) {
    return;
   }

   let mobile = this.name;

   if (!mobile) {
     return this.native.showToast("请输入手机号");
   }

   this.http.post("/api/app/sendsms", {mobile: mobile}).subscribe(res => {
     this.native.showToast(res.info);
     if (res.code == 200) {
       // 获取成功，开始倒计时
       this.countdown(60);
     }
   });
  }

  // 倒计时60秒
  countdown (num) {
    num--;
    console.log(num);
    this.timer = setTimeout(() => {
      // 倒计时到 0 结束
      if (num > 0) {
        this.countdown(num);
        this.btnText = "重新发送(" + num + "s)";
      } else {
        // 结束之后，清空timer
        clearTimeout(this.timer);
        // 设置为 0，为了重新点可以重新倒计时
        this.timer = 0;
        this.btnText = "发送验证码"
      }

    },1000);
  }

  // 选择角色（我是商家）
  changeRole () {

    if (!this.role) {
      this.role = 1;
    } else {
      this.role = 0;
    }

  }


}
