/**
 * Created by HIAPAD on 2018/8/9.
 */
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
import { NativeService } from './NativeService';
import { SpeakingService } from './SpeakingService';
import { Config } from './Config';

@Injectable()

export class JPushService {
  constructor (
    private jPush: JPush,
    private events: Events,
    private native: NativeService,
    private speaking: SpeakingService
  ) {

  }

  // 初始化极光推送插件
  initJpush () {
    // 如果不是真机，return
    if (!this.native.isMobile()) {
      return;
    }
    // 初始化
    this.jPush.init();

    // 监听推送事件
    this.jPushAddEventListener();
  }

  // 监听推送事件 api文档 -> https://github.com/jpush/jpush-phonegap-plugin/blob/master/doc/Common_detail_api.md
  private jPushAddEventListener () {
    // 查看app系统设置中是否关闭的推送
    this.jPush.getUserNotificationSettings().then(result => {
      if (result == 0) {
        console.log("系统设置中已经关闭应用推送");
      } else if (result > 0) {
        console.log("系统设置中允许推送");
      }
    });

    // 点击通知进入应用
    document.addEventListener('jpush.openNotification', event => {
      // 进入应用，停止播放话音
      this.speaking.stopSpeak();
      // 把应用提示角标清0
      this.setIosIconBadgeNumber(0);

      // 发布订阅消息，内容
      this.events.publish('jpush.openNotification', event);

    }, false);

    // 收到通知时触发
    document.addEventListener('jpush.receiveNotification', event => {
      // 收到通知，停止播放
      this.speaking.stopSpeak();
      const content = event['extras']['sound'];
      let loop = event['extras']['frequency'];
      console.log("jpush收到内容", JSON.stringify(event));
      console.log("jpush收到内容", content);
      if (content) {
        this.speaking.startSpeak(content, loop);
      }
    }, false);

    // 收到自定义消息
    document.addEventListener('jpush.receiveMessage', event => {
      const content = this.native.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush收到自定义消息", content);
    }, false);
  }

  // 设置别名
  setAlias () {
    if (!this.native.isMobile()) {
      return;
    }
    let role = 0;
    if (Config.userInfo['role'] != -1) {
      role = 1;
    }

    this.jPush.setAlias({sequence: 1, alias:  role + "_" + Config.userInfo['id']}).then(result => {
      console.log("jpush-设置别名成功");
      console.log(JSON.stringify(result));
    }, error => {
      console.log("jpush-设置别名失败->",  error);
    });
  }

  // 删除别名
  deleteAlias () {
    if (!this.native.isMobile()) {
      return;
    }

    this.jPush.setAlias({sequence: 2}).then(result => {
      console.log("jpush-删除别名成功");
      console.log(result);
    }, error => {
      console.log("jpush-删除别名失败", error);
    });
  }

  // 设置标签
  setTags (tags: Array<string> = []) {
    if (!this.native.isMobile()) {
      return;
    }
    if (this.native.isAndroid()) {
      tags.push('android');
    }
    if (this.native.isIos()) {
      tags.push('ios');
    }

    this.jPush.setTags({sequence: 3, tags}).then(result => {
      console.log("jpush-设置标签成功");
      console.log(result);
    }, error => {
      console.log("jupsh-设置标签失败", error);
    });
  }

  // 删除标签
  deleteTags (tags: Array<string> = []) {
    if (!this.native.isMobile()) {
      return;
    }

    this.jPush.deleteTags({sequence: 4, tags}).then(result => {
      console.log("jpush-删除标签成功");
      console.log(result);
    }, error => {
      console.log("jpush-删除标签失败", error);
    });
  }

  // 获取设备注册的ID（设备ID）
  getRegistrationID(): Promise<any> {
    return this.jPush.getRegistrationID();
  }

  // 设置ios应用角标数量
  setIosIconBadgeNumber (badgeNumber) {
    if (this.native.isIos()) {
      this.jPush.setBadge(badgeNumber); // 上传badge值到服务器
      this.jPush.setApplicationIconBadgeNumber(badgeNumber); // 设置应用badge值
    }
  }
}
