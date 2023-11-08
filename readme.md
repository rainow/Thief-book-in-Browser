# Thief book in Browser
摸鱼神器Thief-Book的浏览器脚本版。可以在网页里面隐蔽地看书（在状态栏看书）,在老板眼皮子底下看小说的感觉。支持键盘控制，查找文字以准确定位进度，自动保存进度，自动滚屏等，有问题或者需求可以提issue，有空了我会更一下。
Fork自[chocovon](https://github.com/chocovon/thiefbook-js)，感谢大大。修复了部分Bug，增加了自动滚屏（支持键盘操作），查找文字（不然定位到手机上的进度太难了），自动保存阅读进度和上次的设置。Slacking off in browser, reading novels in status bar, support auto scrolling, searching text, auto saving current position.
<br><br><br>

## 1. 安装方式(Install)

### 1.1 浏览器Console运行 (Run script in console model)
打开浏览器的控制台（Console），复制下面的代码并在控制台执行，成功后，当前页面左下角会出现操作界面和提示。<br>
某些页面会因为安全策略禁止运行外部脚本，请直接复制完整 js 文件内容并执行。<br>
浏览器版本就是这个项目的代码，用的localStorage存储，所以不支持跨域（只能在同一个域名下共享阅读进度）。

```javascript
fetch("https://raw.githubusercontent.com/rainow/Thief-book-in-Browser/master/thiefbook.js").then(response => response.text()).then(text => eval(text))
```

### 2.2 添加到收藏夹
复制下面的代码，打开收藏夹，新建一个收藏，名字随便起，url填刚才你复制的代码。使用的时候打开网页以后，点一下这个收藏夹就可以了。<br>
```javascript
javascript:fetch("https://raw.githubusercontent.com/rainow/Thief-book-in-Browser/master/thiefbook.js").then(response => response.text()).then(text => eval(text))
```

### 2.3 油猴脚本 (Tampermonkey)
油猴脚本用的是油猴的存储方法，随便打开哪个网页都可以恢复阅读进度。条件允许的话还是建议用油猴吧。<br>
Greasy Fork地址：[Greasy Fork](https://greasyfork.org/zh-CN/scripts/479230-%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%E7%BD%91%E9%A1%B5%E7%89%88-thief-book-in-browser)

<br><br>
## 2. 更新说明

### 20231108
- 修复了部分Bug。
- 增加了自动滚屏（支持键盘操作）。
- 增加查找文字功能（不然定位到手机上的进度太难了）。
- 增加自动保存阅读进度和上次的设置。
- 更换了显示/隐藏的按键，从-变成F1，减号太常用了，容易误按。
