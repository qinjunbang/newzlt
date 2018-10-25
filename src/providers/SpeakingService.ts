/**
 * Created by HIAPAD on 2018/8/11.
 */
import { Injectable } from '@angular/core';

declare var xunfeiListenSpeaking: any;

@Injectable()

export class SpeakingService {
  public number = 0;
  constructor () {

  }

  /*
  *
  * 播放语音
  * @param str 需要播放的文字
  *
  * */

  startSpeak(str: string = '', loop: string = '') {
    xunfeiListenSpeaking.startSpeak(success => {
      console.log("xunfeiListenSpeaking success");
      switch (loop) {
        case 'on':
          this.startSpeak(str, loop);
          break;
        case 'off':
          break;
        default:
          this.number++;
          if (this.number < parseInt(loop)) {
            this.startSpeak(str, loop);
          } else {
            this.number = 0;
          }

      }
    }, err => {
      console.log("err");
    }, str);


  }

  /*
  *
  * 停止播放,本次播放结束
  *
  * */
  stopSpeak () {
    xunfeiListenSpeaking.stopSpeak();
  }

  /*
  *
  * 暂停播放
  *
  * */
  pauseSpeaking () {
    xunfeiListenSpeaking.pauseSpeaking();
  }

  /*
   *
   * 恢复播放
   *
   * */
  resumeSpeaking () {
    xunfeiListenSpeaking.resumeSpeaking();
  }
}
