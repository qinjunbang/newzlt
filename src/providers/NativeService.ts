/**
 * Created by HIAPAD on 2018/7/25.
 */

import { Injectable } from '@angular/core';
import { AlertController, Loading, LoadingController, Platform, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Toast } from '@ionic-native/toast';
import { File, FileEntry } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { AppVersion } from '@ionic-native/app-version';
import { NativeAudio } from '@ionic-native/native-audio';
import { Observable } from 'rxjs/Rx';
import { Device } from '@ionic-native/device';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { ThemeableBrowser, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
import { Config } from './Config';
import { Utils } from './Utils';
import { PhotoLibrary } from '@ionic-native/photo-library';


@Injectable()

export class NativeService {
  private loading: Loading; // loading 组件

  constructor(
    private toastCtrl: ToastController, // 消息提示组件
    private alertCtrl: AlertController, // 弹框提示组件
    private loadingCtrl: LoadingController, // 加载提示组件
    private platform: Platform, // 设备信息组件
    private camera: Camera,  // 拍照，图片库组件
    private splashScreen: SplashScreen,  // 启动画面组件
    private network: Network, // 网络信息组件
    private appMinimize: AppMinimize, // 最小化App组件
    private toast: Toast, // 真机下的提示框
    private file: File, // 文件管理模块
    private imagePicker: ImagePicker, // 多图选择
    private appVersion: AppVersion, // 获取App版本号
    private cn: CallNumber,  // 拨打电话
    private nativeAudio: NativeAudio, // 语音播放
    private device: Device, // 设备UUID组件
    private androidPermissions: AndroidPermissions, // 安卓手机权限获取，主要针对 26以上的版本
    private transfer: FileTransfer, // 文件上传
    private fileOpener: FileOpener, // 文件打开
    private themeableBrowser: ThemeableBrowser, // 浏览器
    private photoLibrary: PhotoLibrary // 图库管理

  ) {

  }


  /*
  *
  * 隐藏启动画面
  *
  * */
  splashScreenHide(): void {
    this.isMobile() && this.splashScreen.hide();
  }

  /*
  *
  * 获取网络类型 如'unknown','ethernet','wifi','2g','3g','4g','cellular','none'
  *
  * */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }

  /*
  *
  * 判断是否有网络
  *
  * */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /*
  *
  * 最小化APP
  *
  * */
  minimize(): void {
    this.appMinimize.minimize();
  }

  /*
  *
  * 是否真机环境
  *
  * */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /*
  *
  * 是否安卓真机环境
  *
  * */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /*
  *
  * 是否ios真机环境
  *
  * */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /*
  *
  * 消息提示框1
  * @param title  标题
  * @param subTitle  小标题
  * @param message  提示信息
  * @param callBack  回调方法
  *
  * */
  alert = (() => {
    let isExist = false;
    return (title: string, subTitle = '', message = '', callBack = null): void => {
      // 判断是否有打开的弹框，如果有，就不再打开新的
      if (!isExist) {
         isExist = true; // 设置为打开状态，不能再打开新的
         this.alertCtrl.create({
           title,
           subTitle,
           message,
           cssClass: 'alert-zIndex-highest',
           buttons: [
             {
               text: '确定',
               handler: () => {
                 isExist = false;
                 typeof callBack === `function` && callBack();
               }
             }
           ],
           enableBackdropDismiss: false, // 点击背景不关闭弹框
         }).present();
      }
    };

  })();

  /*
  *
  * 消息提示框2
  * @param title  标题
  * @param message  提示信息
  * @param callBack  回调方法
  * 有取消和确定按钮
  *
  * */
 confirm = (() => {
  let isExist = false;
  return (title: string,  message = '', callBack = null): void => {
    // 判断是否有打开的弹框，如果有，就不再打开新的
    if (!isExist) {
       isExist = true; // 设置为打开状态，不能再打开新的
       this.alertCtrl.create({
         title,
         message,
         cssClass: 'alert-zIndex-highest',
         buttons: [
          {
            text: '取消',
            handler: () => {
              isExist = false;
            }
          },
           {
             text: '确定',
             handler: () => {
               isExist = false;
               typeof callBack === `function` && callBack();
             }
           }
         ],
         enableBackdropDismiss: false, // 点击背景不关闭弹框
       }).present();
    }
  };

})();

  /*
  *
  * 消息提示
  * @param message 信息内容
  * @param duration 显示时长
  *
  * */
  showToast(message = '操作完成', duration = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message,
        duration,
        position: 'middle',
        showCloseButton: false
      }).present();
    }
  }

  /*
  *
  * 显示loading
  * @param content 显示的内容
  *
  * */
  showLoading(content = ''): void {
    // 如果页面没有其它loading
    if (!this.loading) {
      const loading = this.loadingCtrl.create({
        content
      });

      loading.present();
      this.loading = loading;
    }
  }

  /*
  *
  * 关闭loading
  *
  * */
  hideLoading(): void {
    this.loading && this.loading.dismiss();
    this.loading = null;
  }

  /*
  *
  * 使用 cordova-plugin-camera 获取照片
  *
  * */
  getPicture(options: CameraOptions = {}): Observable<string> {
    const ops: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源，CAMERA: 拍照，PHOTOLIBRARY: 相册
      destinationType: this.camera.DestinationType.FILE_URI, // 默认返回图片路径 FILE_URL: 图片路径，DATA_URL: base64字符串
      quality: 60, // 图像质量  范围 0 - 100
      allowEdit: false, // 选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1024, // 缩放图像的宽度（像素）
      targetHeight: 1024, // 缩放图像的高度（像素）
      saveToPhotoAlbum: true, //是否保存到相册
      correctOrientation: true, // 设置摄像机拍摄的图像是否为正确的方向
      ...options
    };

    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {
        console.log("我到这里了");
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          // 返回 base64 字符
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          // 返回图片原始路径
          observer.next(imgData);
        }
      }).catch(err => {
        console.log("获取照片失败，", err);
        if (err == 20) {
          this.alert("没有权限，请在设置中打开");
        } else if (String(err).indexOf('cancel') != -1) {
          console.log("用户取消了");
        } else {
          this.alert("获取照片失败！");
        }
        observer.error(false);
      });
    });
  }

  /*
  *
  * 通过拍照获取图片
  *
  * */
  getPictureByCamera(options = {}): Observable<string> {

    return Observable.create(observer => {
      this.getPicture({
        sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源，CAMERA: 拍照，PHOTOLIBRARY: 相册
        destinationType: this.camera.DestinationType.DATA_URL, // 默认返回图片路径 FILE_URL: 图片路径，DATA_URL: base64字符串
        ...options
      }).subscribe(imgData => {

        observer.next(imgData);

      });
    });
  }

  /*
  *
  * 通过图库获取图片
  *
  * */
  getPictureByLibrary(options = {}): Observable<string> {
    return Observable.create(observer => {
      this.getPicture({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, // 图片来源，CAMERA: 拍照，PHOTOLIBRARY: 相册
        destinationType: this.camera.DestinationType.DATA_URL, // 默认返回图片路径 FILE_URL: 图片路径，DATA_URL: base64字符串
        ...options
      }).subscribe(imgData => {

          observer.next(imgData);

      });
    });
  }


  /*
  *
  * 通过图片库获取多图
  *
  * */
  getMultiplePicture (options = {}): Observable<any> {
    const _that = this;
    const ops = {
      maximumImagesCount: 6,
      width: 1024, // 缩放图像的宽度（像素）
      height: 1024, // 缩放图像的高度（像素）
      quality: 60,
      ...options
    };

    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then( files => {
        const destinationType = options['destinationType'] || 0 // 0:base64字符串，1：图片url

        if (destinationType === 1) {
          observer.next(files);
        } else {
          const imgBase64s = []; // base64字符串数组
          for (const fileUrl of files) {
            _that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            })
          }
        }
      }).catch(err => {
        this.alert('获取图片失败！');
        observer.error(false);
      });
    });
  }

  /*
  *
  * 根据图片路径转化为base64字符串
  * @param path 绝对路径
  *
  * */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          const reader = new FileReader();

          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        console.log("图片转base64失败！");
        observer.error(false);
      });
    });
  }

  /*
  *
  * 获得app版本号，如0.01
  * @description 获得对应/config.xml中version的值
  *
  * */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then(value => {
        observer.next(value);
      }).catch(err => {
        console.log("获取App版本失败！");
        observer.error(false);
      });
    });
  }

  /*
  *
  * 获取App 名称，如 掌里通商家版
  * @description 获得对应 /config.xml中的 name
  *
  * */
  getAppName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getAppName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        console.log("获取App name 失败！");
        observer.error(false);
      });
    });
  }

  /*
  *
  * 获取app 包名/id 如 com.zlt.shops
  * @description 获得对应 /config.xml中的 id
  *
  * */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
        this.appVersion.getPackageName().then((value: string) => {
          observer.next(value);
        }).catch(err => {
          console.log("获取App包名失败！");
          observer.error(false);
        });
      });
  }

  /*
  *
  * 拨打电话
  * @param number 电话号码
  * */
  callNumber(number: string): void {
    let alert = this.alertCtrl.create({
      title: "是否拨打这个电话:",
      subTitle: number,
      buttons: [{
        text: "取消",
        handler: () => {
          console.log("取消了");
        }
      },{
        text: "确定",
        handler: () => {
          this.cn.callNumber(number, true).then(() => {
            console.log("成功拨打电话：" + number);
          }).catch(err => {
            console.log("拨打电话失败：" + number);
          });
        }
      }]
    }).present();

  }

  /*
  *
  * 播放声音
  * @param str 字符串
  * @param site 播放起始位置
  *
  * */
  playAudio (str = '', site = 0) {
    let arr = str.split(',');

    if (arr.length < 0 || arr.length <= site) {
      return;
    }

    this.nativeAudio.play(arr[site], () => {});

    let delayLimit = 300,
      len = arr[site].length;

    setTimeout(()=>{this.playAudio(str,++site)},delayLimit * len);
  }

  /*
  *
  * 获取设备UUID
  *
  * */
  getUid () {
    // 拿之前先看看有没有权限，没有就动态获取
    if (this.checkedAndroidPermissions()) {
      return this.device.uuid;
    } else {
      return ''
    }
  }

  /*
  *
  * 检查获取 UUID、IMEI、IMSI、ICCID、MAC 权限（只针对安卓设备）
  *
  * */
  checkedAndroidPermissions (): Observable<any> {
    // 如果不是安卓设备不用这一套来检测
    if (!this.isAndroid()) {
      return;
    }
    let myPer = this.androidPermissions.PERMISSION.READ_PHONE_STATE; // 要检测的权限

    return Observable.create(observer => {
      this.androidPermissions.checkPermission(myPer).then(hasPermission => {
        // 如果没有，动态请求
        if (!hasPermission) {
          this.androidPermissions.requestPermission(myPer).then(getPer => {
            if (getPer) {
              observer.next(true);
            }
          }).catch(err => {
            observer.next(false);
          });
        }
      });


    });
  }

  /*
   *
   * 上传图片到服务器
   * @param fileUrl 图片原始路径
   * @param serverUrl 上传到服务器的路径
   *
   * */

  uploadImages (fileUrl, serverUrl) :Observable <any> {

    serverUrl = Utils.formatUrl(serverUrl.startsWith('http') ? serverUrl : Config.app_upload_serve_url + serverUrl);

    return Observable.create(observer => {
      console.log("fileUrl", fileUrl);
      const fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        chunkedMode: false,  //是否是在流模式下传送数据 default true
        fileKey: 'thumb',  //接收图片时的key
        params: {  //自己可另外加的参数
          device_id: Config.device_id,
          token: Config.token,

        },
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' //不加入 发生错误！！
        }
      };

      fileTransfer.upload(fileUrl, serverUrl, options).then(res => {
        if (res.response) {
          res = JSON.parse(res.response);
        }
        if (res['code'] == 200) {
          console.log("上传图片成功:", JSON.stringify(res));
          this.showToast("上传图片成功");
          observer.next(res['data']);
        }
      }).catch(err => {
        this.showToast("上传图片失败！");
        console.log("上传图片err", JSON.stringify(err));
      });

    });
  }

  /*
  *
  * 检查app版本
  * @param newVarsion 新版本号
  *
  * */

  checkAppVersion (newVersion: string) {
    this.getVersionNumber().subscribe((value: string) => {
      let curVersion = value.replace(/\./g, ""),
          curNewVersion = newVersion; // 用于显示

      newVersion = newVersion.replace(/\./g, "");

      console.log("newVersion", newVersion);
      console.log("curVersion", curVersion);

      if (newVersion > curVersion && curVersion != undefined) {
        this.confirm("提示", "发现新版本[" + curNewVersion + "]，是否立即升级？", () => {
          this.downloadApp();
        });
      } else {
        this.showToast("没有发现新版本");
      }
    });
  }

  /*
  *
  * 下载App
  * 使用config里面设置的url进行下载
  *
  * */
  downloadApp () {
    // 安卓直接下载安装
    if (this.isAndroid()) {
      // 显示一个下载进度条框
      let alert = this.alertCtrl.create({
        title: "下载进度： 0%",
        buttons: ['后台下载']
      });
      alert.present();

      const fileTransfer: FileTransferObject = this.transfer.create(),
        apkFileUrl = this.file.externalRootDirectory + 'zltshops.apk'; // apk保存目录

      // 下载路径 保存路径
      fileTransfer.download(Config.apkDownloadUrl, apkFileUrl).then(() => {
        // 下载完成，安装 （文件路径，文件格式）
        this.fileOpener.open(apkFileUrl.replace('file://', ''), "application/vnd.android.package-archive");
      });

      // 监听下载进度
      fileTransfer.onProgress((event: ProgressEvent) => {
        let num = Math.floor(event.loaded / event.total * 100);
        // 下载完成关闭进度提示框
        if (num === 100)　{
          alert.dismiss();
        } else {
          let title = document.getElementsByClassName("alert-title")[0];
          title && (title.innerHTML = "下载进度：" + num + "%");
        }
      });
    } else if (this.isIos()) {
      // 苹果安装

      this.themeableBrowser.create(Config.ipaDownLoadUrl, '_blank', Config.options);
    }

  }

  /*
   *
   * 下载 base64 图片
   * @param title 图片保存的名称
   *
   * */
  downloadBase64Img(base64Url, title) {
    const fileTransfer: FileTransferObject = this.transfer.create(),
          imgFileUrl = this.file.externalRootDirectory  + title + '.jpg';
    fileTransfer.download(base64Url, imgFileUrl).then((success) => {
      this.showLoading("正在保存图片");
      this.saveToAlbum(imgFileUrl, title);
    }, (err) => {
      console.log("下载图片err：" + JSON.stringify(err));
    });
  }

  /*
   *
   * 保存图片到相册
   * @param title 图片保存的名称
   *
   * */
  saveToAlbum(imgUrl, title, albumName="zlt") {
    this.photoLibrary.requestAuthorization({read: true, write: true}).then(() => {
      this.photoLibrary.getLibrary().subscribe({
        error: () => {
          this.hideLoading();
          this.showToast("无法读取相册，请授权“掌里通”使用您的相册功能。");
        },
        complete: () => {
          this.photoLibrary.saveImage(imgUrl, albumName).then(() => {
            this.hideLoading();
            this.alert("成功保存图片到相册");
            this.file.removeFile(this.file.externalRootDirectory, title + '.jpg');
          }, err => {
            console.log("保存图片到相册err：", JSON.stringify(err));
          }).catch(() => {
            this.hideLoading();
            if (this.isIos()) {
              this.showToast("成功保存图片到相册");
            } else {
              this.showToast("无法读取相册，请授权“掌里通”使用您的相册功能。");
            }
          });

        }
      });
    });
  }
}
