/**
 * Created by HIAPAD on 2018/7/26.
 */
import { Injectable } from '@angular/core';
import { NativeService } from './NativeService';
import { Storage } from '@ionic/storage';
import { Config } from './Config';
import { Utils } from './Utils';
import {
  Headers,
  Http,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  URLSearchParams
} from '@angular/http';
import { Observable, TimeoutError } from 'rxjs';

@Injectable()
export class HttpService {

  constructor(
    public native: NativeService,
    public http: Http,
    public storage: Storage
  ) {

  }

  /*
  *
  * get请求
  * @param url 路径
  * @param data 发送的数据
  * @param local 如果 = local 就获取本地数据
  *
  * */
  public get (url: string, data: any = null, local: string = ""): Observable<any> {
    const options = new RequestOptions({
      method: RequestMethod.Get,
      search: HttpService.buildUrlSearchParams(data)
    });

    return this.request(url, options, local);
  }


  /*
  *
  * post请求
  * @param url 路径
  * @param body 请求的数据
  *
  * */
  public post (url: string, body: any = {}): Observable<any> {
    console.log("body", body);
    const options = new RequestOptions({
      method: RequestMethod.Post,
      body,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
        // 'Access-Control-Allow-Origin': '*'
      })
    });

    return this.request(url, options);
  }

  /*
  *
  * 表单提交
  * @param url 路径
  * @param data 数据
  *
  * */

  public postFormData(url: string, data: any = null): Observable<any> {
    const options = new RequestOptions({
      method: RequestMethod.Post,
      body: HttpService.buildUrlSearchParams(data).toString(),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        // 'Access-Control-Allow-Origin': '*'
      })
    });

    return this.request(url, options);
  }

  /*
  *
  * 发起请求
  * @param url 路径
  * @param options 数据
  * @local 如果 == local 就请求本地
  *
  * */
  public request(url: string, options: RequestOptionsArgs, local:string = ''): Observable<any> {
    if (local !== 'local') {
      url = Utils.formatUrl(url.startsWith('http') ? url : Config.app_serve_url + url);
    }

    console.log('%c 请求发送前 %c', 'color:blue', '', 'url', url, 'options', options);
      // 发送请求前,打开loading
    this.native.showLoading();
    console.log("123");
    return Observable.create(observer => {
      //20s 断开请求

      this.http.request(url, options).timeout(20000).subscribe(res => {
        try{
          observer.next(res.json());
        } catch(e) {
          observer.next(res);
        }

        console.log("%c 请求发送成功 %c");
        // 关闭loading
        this.native.hideLoading();
      }, err => {
        this.native.hideLoading();
        observer.error(this.requestFailedHandle(url, err));
      });
    });
  }


  /*
  *
  * 请求失败处理
  *
  * */

  public requestFailedHandle (url: string, err: Response) {
    if (!this.native.isConnecting()) {
      this.native.alert('网络连接失败~');
    } else if (err instanceof TimeoutError) {
      this.native.alert('请求超时，请稍后再试~');
    } else {
      const status = err.status;
      let msg = '请求异常~';

      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500){
        msg = '请求失败，服务器出错';
      }
      this.native.alert(msg);
    }

    return err;
  }

  /*
  *
  * 格式化请求参数(对象转接字符串)?
  *
  * */
  private static buildUrlSearchParams (data): URLSearchParams {
    const params = new URLSearchParams();

    if (!data) {
      return params;
    }
    console.log("data", data);
    Object.keys(data).forEach(key => {
      let val = data[key];
      console.log("val", val);
      if (val instanceof Date) {
        val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
      }

      params.set(key, val);
    });
    return params;
  }
}
