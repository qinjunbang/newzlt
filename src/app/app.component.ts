import { Component, ViewChild } from '@angular/core';
import { Platform, Events, IonicApp, Keyboard, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Config } from '../providers/Config';
import { NativeService } from '../providers/NativeService';
import { HttpService } from '../providers/HttpService';
import { JPushService } from '../providers/JPushService';
import { SpeakingService } from '../providers/SpeakingService';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/me/login/login';
import { OrderDetailPage } from '../pages/shops/orders/orderDetail/orderDetail';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;

  rootPage:any = LoginPage;
  //rootPage:any = OrdersListPage;

  private backButtonPressed: boolean = false; // 是否连续两次按返回按钮

  constructor(
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private platform: Platform,
    private events: Events,
    private keyboard: Keyboard,
    private ionicApp: IonicApp,
    private native: NativeService,
    private http: HttpService,
    private storage: Storage,
    private jPush: JPushService,
    private speaking: SpeakingService
  ) {
    // 检查登录状态
    this.refreshToken();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // 设置状态栏颜色
      statusBar.styleDefault();
      // 隐藏启动页面
      splashScreen.hide();
      // 检查网络
      this.assertNetwork();
      // 检查版本更新

      // 初始化极光推送事件
      this.jPush.initJpush();

      // 处理点击消息推送事件
      this.jPushOpenNotification();

      // 注册android返回按钮事件
      this.registerBackButtonAction();

    });
  }


  // 检查网络
  assertNetwork () {
    if (!this.native.isConnecting()) {
      this.native.alert("未检查到网络连接");
    }
  }
  // 处理android按钮返回事件
  registerBackButtonAction () {
    // 如果不是安卓手机，return
    if (!this.native.isAndroid()) {
      return;
    }

    this.platform.registerBackButtonAction(() => {
      console.log('点击到了');
      this.events.publish('android:backButtonAction');

      // 如果键盘是打开的，先关闭键盘
      if (this.keyboard.isOpen()) {
        this.keyboard.close();
        return;
      }

      // 如果页面有 loading, toast, alert,先关闭
      const activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._overlayPortal.getActive();

      if (activePortal) {
        activePortal.dismiss();
        return;
      }
      const childNav = this.nav.getActiveChildNav(); // 获取tabs导航,this.nav是总导航,tabs是子导航
      if (!childNav) {
        this.showExit();
        return;
      }
      const tab = childNav.getSelected(); // 获取选中的tab
      const activeVC = tab.getActive(); // 通过当前选中的tab获取ViewController
      const activeNav = activeVC.getNav(); // 通过当前视图的ViewController获取的NavController
      // 如果不是首页，就返回上一页，如果是首页，显示关闭 App 提示框
      return activeNav.canGoBack() ? activeNav.pop() : this.showExit();

    }, 1);
  }

  // 显示关闭 App 提示框
  showExit () {
    console.log("6666");
    if (this.backButtonPressed) {
      // 退出 App
      //this.platform.exitApp();
      // 最小化app
      this.native.minimize();
      // 关闭播放的声音
      this.speaking.stopSpeak();
    } else {
      // 提示用户是否要关闭 app
      this.native.showToast("再按一次退出APP");
      this.backButtonPressed = true;

      // 两秒内没有再按第二次，则将状态变为 false
      setTimeout( () => {
        this.backButtonPressed = false;
      }, 2000)
    }
  }

  // 刷新token
  refreshToken () {
    this.storage.get("token").then(token => {
      // 如果没有 token 说明没登录
      if (!token) {
        this.nav.setRoot(LoginPage);
      } else {
        console.log("token", token);
        // 如果有token，用旧token获取新的token,重新缓存，并设置我的页面为根页面
        this.http.post("/api/app/refreshtoken", {token: token, device_id: this.native.getUid() ||'b24c3f95b198268' }).subscribe(res => {
          console.log("res", res);
          if (res.code == 200) {
            this.storage.set("token", res.data.token);
            Config.token = res.data.token;
            Config.userInfo = res.data.shopclerk;
            Config.device_id = res.data.shopclerk.device_id;
            // 设置别名
            this.jPush.setAlias();
            this.nav.setRoot(TabsPage);
          } else {
            this.nav.setRoot(LoginPage);
          }
        });
      }
    });
  }

  // 点击推送的消息，跳到指定的页面
  jPushOpenNotification () {
   // 监听用户点击推送进来的事件
    this.events.subscribe("jpush.openNotification", (event) => {
      let order_id = event['extras']['order_id']
      if (order_id) {
        this.nav.push(OrderDetailPage, {'order_id': order_id});
      }
    });
  }
}
