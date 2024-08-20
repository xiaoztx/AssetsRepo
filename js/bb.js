function goComment(e) {
    var n = document.querySelector(".el-textarea__inner")
    n.value = `> ${e}\n\n`;
    n.focus();
    btf.snackbarShow("无需删除空行，直接输入评论即可", !1, 2e3);
}
// 页面内容格式化
function Format(item) {
    let date = getTime(new Date(item.createdTs * 1000).toString()),
        content = item.content,
        name = item.creatorName,
        imgs = content.match(/!\[.*\]\((.*?)\)/g),
        musics = content.match(/{\s*music\s*(.*)\s*}/g),
        videos = content.match(/{\s*bilibili\s*(.*)\s*}/g),

        from = content.match(/\{\@([^}]+)\}/g),
        address = content.match(/\{\^([^}]+)\}/),
        // link = content.match(/{\s*link\s*(.*)\s*}/g);
        link = content.match(/\{.*link([^}]+)\}/);

    display = "";

    if (from !== null) {
        from = from[0].match(/\{\@([^}]+)\}/)[1];
        display += `
                <div class="bber-info-from">
                    <i class="anzhiyufont anzhiyu-icon-fw-fire" ></i>
                    <span>${from}</span>
                </div>
            `

    }
    if (link !== null) {
        link = link[1];
        // console.log(link)

        display += `
                <a class="bber-content-link" title="跳转到短文指引的链接" target="_blank" href="${link}" rel="external nofollow noopener" draggable="false">
                    <i class="anzhiyufont anzhiyu-icon-link"></i>
                    链接
                </a>
            `
    }


    if (address !== null) {
        address = address[0].match(/\{\^([^}]+)\}/)[1];
        display += `
                <div class="bber-info-from">
                    <i class="anzhiyufont anzhiyu-icon-location-dot"></i>
                    <span>${address}</span>
                </div>
            `
    }
    if (imgs) imgs = imgs.map(item => { return item.replace(/!\[.*\]\((.*?)\)/, '$1') })
    if (item.resourceList.length) {
        if (!item.resourceList[0].externalLink) {
            imgs.push(`${url}/o/r/${item.resourceList[0].id}/${item.resourceList[0].publicId}/${item.resourceList[0].filename}`)
        } else {
            imgs.push(item.resourceList[0].externalLink)
        }
    }

    content = content.replace(/#(.*?)\s/g, '').replace(/{.*}/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '').replace(/```/g, '')
    content = content.replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2">@$1</a>`);
    let text = content.replace(/\[(.*?)\]\((.*?)\)/g, '').trim();



    if (imgs) {
        content += `<div class="bber-container-img">`
        imgs.forEach(e => content += `
        <img src="${e}" alt="image">
    `)
        // content += '<div class="bber-content-noimg"></div><div class="bber-content-noimg"></div><div class="bber-content-noimg"></div></div>'
    }

    if (musics) musics.forEach(item => {
        server = "";
        musicID = "";
        musicLinks = item.match(/https:\/\/[^\s]*\.com/g);
        if (musicLinks == "https://i.y.qq.com") {
            server = "tencent";
            match = item.match(/songmid=(\w+)/);
        } else if (musicLinks == "https://music.163.com" || musicLinks == "https://y.music.163.com") {
            server = "netease";
            match = item.match(/id=(\w+)/);
        }
        content += `
        <div class="bber-music">
            <meting-js id="${match[1]}" server="${server}" type="song" mutex="true" preload="none" theme="var(--anzhiyu-main)" data-lrctype="0" order="list"></meting-js>
        </div>
        `
    })

    if (videos) videos.forEach(item => {
        content += `
    <div class="bber-video">
        <iframe src="//player.bilibili.com/player.html?autoplay=0&bvid=${item.replace(/{\s*bilibili\s*(.*)\s*}/, '$1').replace(/.*video\/([^\/]*).*/, '$1')}" 
                scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true">
        </iframe>
    </div>`

        // console.log(item.replace(/{\s*bilibili\s*(.*)\s*}/, '$1'))

    })
    return { content, date, text, name, from, address, display }
}

// 页面时间格式化
function getTime(time) {
    var nol = function (h) { return h > 9 ? h : '0' + h }
    var now = new Date()
    var yesterday = new Date(now.getTime() - (1000 * 60 * 60 * 24)).toLocaleDateString()
    var twoDaysAgo = new Date(now.getTime() - 2 * (1000 * 60 * 60 * 24)).toLocaleDateString()
    let d = new Date(time),
        ls = [d.getFullYear(), nol(d.getMonth() + 1), nol(d.getDate()), nol(d.getHours()), nol(d.getMinutes()), nol(d.getSeconds())],
        day = d.toLocaleDateString()
    if (day === now.toLocaleDateString()) {
        return '今天 ' + ls[3] + ':' + ls[4]
    } else if (day === yesterday) {
        return '昨天 ' + ls[3] + ':' + ls[4]
    } else if (day === twoDaysAgo) {
        return '前天 ' + ls[3] + ':' + ls[4]
    } else {
        if (now.getFullYear() == ls[0]) return ls[1] + '月' + ls[2] + '日 ' + ls[3] + ':' + ls[4]
        else return ls[0] + '年' + ls[1] + '月' + ls[2] + '日 ' + ls[3] + ':' + ls[4]
    }
}
if (1) {
    let url = 'https://memos.xiaoztx.top'
    fetch(url + '/api/v1/memo?creatorId=1&tag=说说&limit=30').then(res => res.json()).then(data => {
        let items = [], html = ''
        data.forEach(item => { items.push(Format(item)) })
        if (items.length == 30) document.querySelector('.limit').style.display = 'block'
        items.forEach(item => {
            html += `
                <li class="item">
                    <div class="talk_meta">
                        <img class="no-lightbox no-lazyload avatar" src="https://q1.qlogo.cn/g?b=qq&nk=2867153000&s=5">
                        <div class="info">
                            <span class="talk_nick">${item.name}</span>
                            <span class="talk_date">${item.date}</span>
                        </div>
                    </div>
                    <div class="bber-content">
                        <p class="datacont">${item.content}</p>
                    </div>
                    <hr>

                    <div class="bber-bottom">
                        <div class="bber-info">${item.display}</div>

                        <div class="bber-reply" onclick="goComment('${item.text}')">
                            <i class="solitude fa-solid fa-comment"></i>
                        </div>
                        
                    </div>
                </li>`
        })
        document.getElementById('waterfall').innerHTML = html
    })
}


// 存数据
function saveData(name, data) { localStorage.setItem(name, JSON.stringify({ 'time': Date.now(), 'data': data })) };
// 取数据
function loadData(name, time) {
    let d = JSON.parse(localStorage.getItem(name));
    // 过期或有错误返回 0 否则返回数据
    if (d) {
        let t = Date.now() - d.time
        if (-1 < t && t < (time * 60000)) return d.data;
    }
    return 0;
};

let talkTimer = null;
function indexTalk() {
    if (talkTimer) {
        clearInterval(talkTimer)
        talkTimer = null;
    }
    if (!document.getElementById('bber-talk')) return

    function toText(ls) {
        let text = []
        ls.forEach(item => {
            text.push(item.content.replace(/#(.*?)\s/g, '').replace(/\{(.*?)\}/g, '').replace(/\!\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-image"></i>').replace(/\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-link"></i>'))
        });
        return text
    }

    function talk(ls) {
        let html = ''
        ls.forEach((item, i) => { html += `<li class="item item-${i + 1}">${item}</li>` });
        let box = document.querySelector("#bber-talk .talk-list")
        box.innerHTML = html;
        talkTimer = setInterval(() => {
            box.appendChild(box.children[0]);
        }, 3000);
    }

    let d = loadData('talk', 10);
    if (d) talk(d);
    else {
        fetch('https://memos.xiaoztx.top/api/v1/memo?creatorId=1&tag=说说&limit=10').then(res => res.json()).then(data => { // 更改地址和ID
            data = toText(data)
            talk(data);
            saveData('talk', data);
        })
    }
}
indexTalk();