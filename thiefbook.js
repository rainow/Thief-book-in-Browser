(function() {
    let text = '按，。键翻页\nF1键退出/恢复显示\n回车开关自动滚屏\nGood Luck!'
    let lines = [];
    let lineLength = 20;
    let pointer = 0;
    let keyNextLine = 'Period';
    let keyPreLine = 'Comma';
    let keyHide = 'F1';//'Minus'; 减号在网页中还是要经常使用的，换F1键控制开关
    let keyTimer = 'Enter';//定时滚屏还是需要的，加个快捷键
    let hide = false;
    let progress = 0;
    let timer = null;
    let timerInterval = 3000;
    let posBeforeSearch = 0;
    let bookmode = false;

    if(!localStorage){
        text = "您的浏览器不支持保存进度！"+text;
    }

    document.head.innerHTML +=
        '<style>\n' +
        '        .thief-book-line-box {\n' +
        '            position: fixed;\n' +
        '            left: 0;\n' +
        '            bottom: 0;\n' +
        '        }\n' +
        '        .thief-book-line {\n' +
        '            font-size: 10px;\n' +
        '            text-align:left;\n' +
        '            background-color: rgb(222,225,230);\n' +
        '            height: 23px;\n' +
        '            line-height: 23px;\n' +
        '            border-radius: 4px;\n' +
        '            padding-left: 5px;\n' +
        '            padding-right: 5px;\n' +
        '        }\n' +
        '        .thief-book-mouse-area {\n' +
        '            position: fixed;\n' +
        '            left: 0;\n' +
        '            bottom: 0;\n' +
        '            z-index: 99999;\n' +
        '            height: 70px;\n' +
        '            width:500px;\n' +
        '            margin: 1px;\n' +
        '        }\n' +
        '        .thief-book-mouse-area:hover .thief-book-settings-area {\n' +
        '            opacity: 1 !important;\n' +
        '        }\n' +
        '        .thief-book-settings-area {\n' +
        '            position: fixed;\n' +
        '            left: 60px;\n' +
        '            bottom: 30px;\n' +
        '            display: flex;\n' +
        '            transition: 0.3s;\n' +
        '        }\n' +
        '        .thief-book-semi-hide {\n' +
        '            opacity: 0;\n' +
        '        }\n' +
        '        .thief-book-icon {\n' +
        '            cursor: default;\n' +
        '            font-size: 30px; width:30px; height:30px;\n' +
        '            transition: 0.3s;\n' +
        '        }\n' +
        '        .thief-book-slider {\n' +
        '            height: 13px;\n' +
        '            width: 100px;\n' +
        '            margin-top: 12px;\n'+
        '        }\n' +
        '        #thief-book-searchbox{\n' +
        '			border: 1px solid black;\n' +
        '			display: block;\n'+
        '			width: 300px;\n' +
        '			height: 150px;\n' +
        '			position: absolute;\n' +
        '			margin:auto;\n' +
        '			top: 0px;left: 0px;bottom: 0px;right: 0px;\n' +
        '			background-color: #eee;\n' +
        '			font-size: 15px;\n' +
        '			z-index: 999;\n' +
        '		}\n' +
        '		#thief-book-searchbox-title{\n' +
        '			width: 100%;\n' +
        '			height: 20px;\n' +
        '			margin: 0px;\n' +
        '			top: 0px;left: 0px;\n' +
        '			background-color: #666;\n' +
        '		}\n' +
        '		.thief-book-search-lines{\n' +
        '			margin:10px;\n' +
        '			display: flex;\n' +
        '			justify-content: space-between;\n' +
        '		}\n' +
        '		.thief-book-search-buttons{\n' +
        '			margin:2px;\n' +
        '			border: 1px solid black;\n' +
        '			height:20px;\n' +
        '			width: 80px;\n' +
        '			background-color: #ccc;\n' +
        '			text-align: center;\n' +
        '			font-size: 12px;\n' +
        '			cursor: pointer;\n' +
        '		}\n' +
        '    </style>';

    document.body.innerHTML +=
        '<div id="thief-book-leftCorner" class="thief-book-mouse-area">\n' +
        '    <div id="thief-book-settings" class="thief-book-settings-area">\n' +
        '        <label class="thief-book-icon">&#128193;\n' +
        '            <input type="file" id="thief-book-selectFile" style="display:none">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            <input id="thief-book-progressSlider" class="thief-book-slider" style="width:500px" type="range" min="0" max="2" value="0">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            <input id="thief-book-lineLengthSlider" class="thief-book-slider" type="range" min="5" max="70" title="行宽【20】" value="20">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            <div id="thief-book-timer" class="thief-book-icon" title="开关定时滚屏">&#9200;</div>' +
        '        </label>\n' +
        '        <label>\n' +
        '            <input id="thief-book-timerIntervalSlider" class="thief-book-slider" type="range" min="1" max="10" title="每【3】秒定时滚屏" value="3">\n' +
        '        </label>\n' +
        '        <label>\n' +
        '            <div id="thief-book-search" class="thief-book-icon" title="搜索指定文字">&#128269;</div>' +
        '        </label>\n' +
        '    </div>\n' +
        '    <div id="thief-book-lineBox" class="thief-book-line-box"></div>\n' +
        '</div>\n' +
        '<div id="thief-book-searchbox">\n' +
        '	<div id="thief-book-searchbox-title">搜索</div>\n' +
        '	<div class="thief-book-search-lines">\n' +
        '		<label for="thief-book-search-text">搜索文字：</label>\n' +
        '		<input type="text" id="thief-book-search-text">\n' +
        '	</div>\n' +
        '	<div class="thief-book-search-lines">\n' +
        '		<div id="thief-book-search-next" class="thief-book-search-buttons">下一个</div>\n' +
        '		<div id="thief-book-search-prev" class="thief-book-search-buttons">上一个</div>\n' +
        '		<div id="thief-book-search-fromstart" class="thief-book-search-buttons">从头搜</div>\n' +
        '	</div>\n' +
        '	<div class="thief-book-search-lines">\n' +
        '		<div id="thief-book-search-close" class="thief-book-search-buttons">关闭</div>\n' +
        '		<div id="thief-book-search-closestay" class="thief-book-search-buttons">留在当前位置</div>\n' +
        '		<div id="thief-book-search-closereturn" class="thief-book-search-buttons">返回原位置</div>\n' +
        '	</div>\n' +
        '</div>';

    parseText(false);

    document.getElementById('thief-book-selectFile')
        .addEventListener('change', function(){
        let fr=new FileReader();
        fr.onload=function(){
            text = fr.result;
            initBook();
        }
        fr.readAsText(this.files[0]);
        document.getElementById('thief-book-settings').classList.add('thief-book-semi-hide');
    })
    document.getElementById('thief-book-progressSlider')
        .addEventListener('input', function(){
        pointer = parseInt(this.value);
        printLine(true);
        saveProgress();
    })
    document.getElementById('thief-book-progressSlider')
        .addEventListener('mouseup', function(){
        pointer = parseInt(this.value);
        printLine(true);
        saveProgress();
    })
    document.getElementById('thief-book-lineLengthSlider')
        .addEventListener('input', function(){
        lineLength = parseInt(this.value);
        this.title = "行宽【" + lineLength + "】";
        if(bookmode)GM_setValue("thief-book-linelength", lineLength);
        parseText(true);
    })
    document.getElementById('thief-book-timerIntervalSlider')
        .addEventListener('input', function(){
        clearTimer();
        this.title = "每【" + this.value + "】秒定时滚屏";
        timerInterval = parseInt(this.value)*1000;
        if(bookmode)GM_setValue("thief-book-timerInterval", timerInterval);
    })
    document.getElementById('thief-book-timer')
        .addEventListener('click', function(){
        if(timer){clearTimer();}
        else{startTimer();}
    })
    document.getElementById('thief-book-search')
        .addEventListener('click', function(){
        document.getElementById('thief-book-searchbox').style.display = "block";
        posBeforeSearch = pointer;
    })
    document.getElementById('thief-book-search-next')
        .addEventListener('click', function(){
        t_search(document.getElementById('thief-book-search-text').value, "next", pointer);
    })
    document.getElementById('thief-book-search-prev')
        .addEventListener('click', function(){
        t_search(document.getElementById('thief-book-search-text').value, "prev", pointer);
    })
    document.getElementById('thief-book-search-fromstart')
        .addEventListener('click', function(){
        t_search(document.getElementById('thief-book-search-text').value, "next", 0);
    })
    document.getElementById('thief-book-search-close')
        .addEventListener('click', function(){
        document.getElementById('thief-book-searchbox').style.display = "none";
        saveProgress();
    })
    document.getElementById('thief-book-search-closestay')
        .addEventListener('click', function(){
        document.getElementById('thief-book-searchbox').style.display = "none";
        saveProgress();
    })
    document.getElementById('thief-book-search-closereturn')
        .addEventListener('click', function(){
        gotoLine(posBeforeSearch);
    })
    window.addEventListener('keydown', function(e) {
        if (e.code === keyNextLine) {
            if(!hide)nextLine();
        } else if (e.code === keyPreLine) {
            if(!hide)preLine();
        } else if (e.code === keyHide) {
            onOff();
        } else if (e.code === keyTimer) {
            if(!hide){
                if(timer){clearTimer();}
                else{startTimer();}
            }
        }
    });


    function parseText(keepProgress) {
        lines = parseLines(text);
        if (keepProgress) {
            pointer = Math.round(progress * (lines.length - 1));
        } else {
            pointer = 0;
            progress = 0;
        }
        let slider = document.getElementById('thief-book-progressSlider')
        slider.min = 0;
        slider.max = lines.length - 1;
        printLine();
    }

    function parseLines(text) {
        let i = 0,j = 0;
        let lines = [];
        let tmpline = "";
        while (j < text.length) {
            if (j - i > lineLength || text[j] === '\n') {
                tmpline = text.slice(i, j+1);
                if(tmpline.length<=3){
                    lines[lines.length - 1] = lines[lines.length - 1] + tmpline;
                    // 如果下一行太短了就合到上一行去
                }else{
                    lines.push(tmpline);
                }
                i = ++j;
                continue;
            }
            j++;
        }
        if (j > i) {
            lines.push(text.slice(i, j))
        }
        return lines;
    }

    function nextLine() {
        if (pointer < lines.length - 1) {
            pointer++;
        }else{
            clearTimer();
        }
        printLine();
        saveProgress();
    }
    function preLine() {
        if (pointer > 0) {
            pointer--;
        }
        printLine();
        saveProgress();
    }
    function onOff() {
        hide = !hide;
        printLine();
        clearTimer();
    }
    function startTimer(){
        if(timer){clearInterval(timer)};
        timer = setInterval(nextLine, timerInterval);
        document.getElementById('thief-book-timer').innerHTML = "&#128683;";
    }
    function clearTimer(){
        if(timer){
            clearInterval(timer);
            timer=null;
        }
        document.getElementById('thief-book-timer').innerHTML = "&#9200;";
    }

    function printLine(multiLine) {
        if (hide) {
            document.getElementById('thief-book-searchbox').style.display = "none";
            document.getElementById('thief-book-leftCorner').style.display = "none";
        } else {
            document.getElementById('thief-book-leftCorner').style.display = "block";
        }

        document.getElementById('thief-book-lineBox').innerHTML = ''

        if (multiLine) {
            let i = pointer - 20;
            while (i < pointer) {
                if (i < 0) {
                    i++;
                    continue;
                }
                createLine(i);
                i++;
            }
        }
        createLine(pointer);

        document.getElementById('thief-book-progressSlider').value = pointer;

        function createLine(i) {
            let newLine = document.createElement('div');
            newLine.classList.add('thief-book-line');
            let line = lines[i];
            if (line.length < lineLength) {
                line += '　'.repeat(lineLength - line.length);
            }
            newLine.innerText = calProgress() + '  ' + line;
            document.getElementById('thief-book-lineBox').append(newLine);
        }
    }

    function calProgress() {
        progress = pointer / (lines.length - 1);
        return pointer === lines.length - 1 ? '100.00%' :
        ('000' + ((100 * progress).toFixed(2))).slice(-5) + '%';
    }

    function saveProgress(){
        if(!bookmode)return;
        let iProgress = pointer / (lines.length - 1);
        if(iProgress>0 && iProgress<=1){
            GM_setValue("thief-book-progress", iProgress);
        }
    }

    function initBook(){
        let keepProgress = false;
        let oSelect=document.getElementById('thief-book-selectFile');
        let old_bookname = GM_getValue("thief-book-bookname", "");
        let old_progress = parseFloat(GM_getValue("thief-book-progress", 0));
        let timerInterval = parseInt(GM_getValue("thief-book-timerInterval", 3000));
        document.getElementById('thief-book-timerIntervalSlider').value = parseInt(timerInterval/1000);
        document.getElementById('thief-book-timerIntervalSlider').title = "每【" + parseInt(timerInterval/1000) + "】秒定时滚屏";
        lineLength = parseInt(GM_getValue("thief-book-linelength", lineLength));
        document.getElementById('thief-book-lineLengthSlider').value = lineLength;
        document.getElementById('thief-book-lineLengthSlider').title = "行宽【" + lineLength + "】";

        if(oSelect.files[0].name != ""){
            bookmode = true;
            if(old_bookname == oSelect.files[0].name){
                progress = old_progress;
                keepProgress = true;
            }
            else{
                GM_setValue("thief-book-bookname", oSelect.files[0].name);
                GM_setValue("thief-book-progress", 0);
                progress = 0;
                keepProgress = false;
            }
        }

        parseText(keepProgress);
    }

    function t_search(stext, direction, from){
        let tmpSearchPos = -1;
        let i = 0;
        if(direction == "prev"){
            for(i=from-1;i>=0;i--){
            	if(lines[i].lastIndexOf(stext)>0){
            		tmpSearchPos = i;
            		gotoLine(tmpSearchPos);
            		return;
            	}
            }
        }
        if(direction == "next"){
            for(i=from?from+1:0;i<lines.length;i++){
            	if(lines[i].lastIndexOf(stext)>0){
            		tmpSearchPos = i;
            		gotoLine(tmpSearchPos);
            		return;
            	}
            }
        }
        if(tmpSearchPos == -1){
            alert("没找到结果");
            return;
        }
    }

    function gotoLine(intLine){
        pointer = intLine;
        printLine();
    }

    function GM_setValue(key, value){
        localStorage.setItem(key, value);
    }
    function GM_getValue(key, defaultValue){
        let value = "";
        try{
            value = localStorage.getItem(key);
            if(!value)value = defaultValue;
        }
        catch(e){
            value = defaultValue;
        }
        return value;
    }

})();
