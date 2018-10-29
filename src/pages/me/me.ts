import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeService } from '../../providers/NativeService';
import { HttpService } from '../../providers/HttpService';
import { Config } from '../../providers/Config';
import { PrivacyPage } from './privacy/privacy';
import { WePage } from './we/we';
import { WalletPage } from './wallet/wallet';
import { LoginPage } from './login/login';
import { ContactPage } from './contact/contact';
import { JPushService } from '../../providers/JPushService';
import { SpeakingService } from '../../providers/SpeakingService';

@Component({
    selector: 'page-me',
    templateUrl: 'me.html'
})

export class MePage {
    public user = {};
    public serverUrl = 'https://www.zltgs.com'
    constructor(
        public native: NativeService,
        public navCtrl: NavController,
        public storage: Storage,
        public http: HttpService,
        public Jpush: JPushService,
        public speaking: SpeakingService
    ) {
        this.storage.get('userInfo').then((val) => {
            console.log(val)
            this.user = val
        });
    }
    wallet() {
        this.navCtrl.push(WalletPage);
    }
    privacy() {
        this.navCtrl.push(PrivacyPage);
    }
    we() {
        this.navCtrl.push(WePage);
    }
    contact () {
        this.navCtrl.push(ContactPage);
    }
    logout() {
        let data = {};
        let that = this;
        this.storage.get('token').then((val) => {
            data['token'] = val
        });
        return that.native.confirm("提示","确定要退出登录吗？",function() {
            console.log("我要退出!")
            that.http.post('/api/app/logout',data).subscribe(res => {
                console.log(res)
                if(res.code == 200){
                    that.native.showToast(res.info);
                    that.storage.remove('token');
                    that.storage.remove('userInfo');
                    that.Jpush.deleteAlias();
                    that.speaking.stopSpeak();
                    Config.token = '';
                    Config.userInfo = [];
                    Config.device_id = '';
                    that.navCtrl.push(LoginPage);
                }else{
                    that.native.alert('提示',' ',res.info)
                }
            })
        });
    }

    // 检查app新版本
  checkAppVersion  () {
      let data = {};
      data['device_id'] = Config.device_id;
      data['token'] = Config.token;
      if (this.native.isAndroid()) {
        data['type'] = 'android';
      } else if (this.native.isIos()) {
        data['type'] = 'ios'
      }
      this.native.getVersionNumber().subscribe(val => {
        data['version'] = val;
        console.log("data", JSON.stringify(data));

        this.http.post("/api/app/init", data).subscribe(res => {
          console.log("res", JSON.stringify(res));
          if (res.code == 200) {
            Config.apkDownloadUrl = res.data.apk_url;
            this.native.checkAppVersion(res.data.version_code);
          }
        });
      });

  }
}
