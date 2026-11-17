/** EduNova 2.0 — gerbang ciri Android. Data kekal dalam storan aplikasi. */
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition';

const isNative = Capacitor.isNativePlatform();
let speechListener = null;
const cleanFileName = filename => String(filename).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);

window.EduNovaNative = {
  isNative,
  async read() {
    if (!isNative) return null;
    try {
      const result = await Filesystem.readFile({
        path: 'EduNova/data.json', directory: Directory.Data, encoding: Encoding.UTF8
      });
      return JSON.parse(result.data);
    } catch (error) {
      // ENOENT pada pelancaran pertama adalah normal.
      console.info('EduNova: tiada data Android terdahulu', error?.message || '');
      return null;
    }
  },
  async write(value) {
    if (!isNative) return;
    await Filesystem.writeFile({
      path: 'EduNova/data.json', data: JSON.stringify(value),
      directory: Directory.Data, encoding: Encoding.UTF8, recursive: true
    });
  },
  async shareFile(filename, content, mime = 'text/plain') {
    if (!isNative) return false;
    const path = 'exports/' + cleanFileName(filename);
    await Filesystem.writeFile({
      path, data: String(content), directory: Directory.Cache,
      encoding: Encoding.UTF8, recursive: true
    });
    const { uri } = await Filesystem.getUri({path, directory: Directory.Cache});
    await Share.share({title: 'EduNova', url: uri, dialogTitle: 'Kongsi daripada EduNova'});
    return true;
  },
  async notify(id, title, body, when) {
    if (!isNative) return false;
    let {display} = await LocalNotifications.checkPermissions();
    if (display !== 'granted') ({display} = await LocalNotifications.requestPermissions());
    if (display !== 'granted') return false;
    const at = new Date(when);
    if (isNaN(at.getTime()) || at <= new Date()) return false;
    // Tanpa akses exact alarm, gunakan peringatan tidak tepat daripada tiada peringatan.
    let exactGranted = false;
    try {
      const setting = await LocalNotifications.checkExactNotificationSetting();
      exactGranted = setting.exact_alarm === 'granted';
    } catch (error) { console.info('Semakan exact alarm tidak tersedia:', error?.message); }
    const item = {
      id, title, body, schedule: {at, allowWhileIdle: true},
      isExactNotification: exactGranted,
      channelId: 'edunova-tugasan'
    };
    try {
      await LocalNotifications.createChannel({id: 'edunova-tugasan', name: 'Peringatan Tugasan',
        description: 'Peringatan tarikh assignment EduNova', importance: 4, visibility: 1});
    } catch (error) {console.info('Saluran notifikasi sudah ada:', error?.message);}
    await LocalNotifications.schedule({notifications: [item]});
    return true;
  },
  async cancelNotify(id) {
    if (isNative) await LocalNotifications.cancel({notifications: [{id}]});
  },
  async enableExactAlarms() {
    if (!isNative) return false;
    const state = await LocalNotifications.checkExactNotificationSetting();
    if (state.exact_alarm === 'granted') return true;
    await LocalNotifications.changeExactNotificationSetting();
    return false;
  },
  async startSpeech(lang, onPartial) {
    if (!isNative) return false;
    const permission = await SpeechRecognition.requestPermissions();
    if (permission.speechRecognition !== 'granted')
      throw new Error('Akses pengecaman suara tidak dibenarkan. Sila benarkan mikrofon dalam tetapan Android.');
    const result = await SpeechRecognition.available();
    if (!result.available) throw new Error('Pengecaman suara belum tersedia pada peranti. Cuba Fail Audio + AI.');
    if (speechListener) await speechListener.remove();
    speechListener = await SpeechRecognition.addListener('partialResults', ({matches}) => {
      if (matches?.[0]) onPartial(matches[0]);
    });
    try {
      const options = {partialResults:true, popup:false, maxResults:1};
      if (lang && lang !== 'auto') options.language = lang;
      const final = await SpeechRecognition.start(options);
      if (final?.matches?.[0]) onPartial(final.matches[0]);
      return true;
    } catch (error) {
      await speechListener?.remove(); speechListener = null;
      throw error;
    }
  },
  async stopSpeech() {
    if (!isNative) return;
    try {await SpeechRecognition.stop();} catch(error) {console.warn('stopSpeech',error);}
    if (speechListener) {await speechListener.remove();speechListener = null;}
  }
};
// UI yang sama digunakan oleh aplikasi web dan Android.
const script = document.createElement('script');
script.src = './app.js';
script.defer = true;
document.body.appendChild(script);
