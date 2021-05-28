import { JSON_DRAWER } from './JSON_DRAWER/JSON_DRAWER.js';
import { HandleController } from './Controller/HandleController.js';
import { moveController } from './Controller/moveController.js';

//初期JSON　無しでもいい
const json_data = [
    {
        "id": 0,
        "PosX": 50,
        "PosY": 100,
        "title": "このラベル以外の場所で右クリックしてメニューを表示",
        "target": [1]
    }, {
        "id": 1,
        "PosX": 200,
        "PosY": 200,
        "title": "使い方は右クリック→使い方",
        "target": []
    },
]

//グローバル変数
window.g = {
    //外部クラス
    jd: new JSON_DRAWER(json_data),
    hc: new HandleController(),
    mc: new moveController(),
    //ファイル読み込み用
    FileRead: document.querySelector('#FileRead'),
    //テキストボックス
    queryUIv1: document.querySelector('#UIv1'),
    //右クリックメニュー
    contextmenu0: document.querySelector('#contextmenu0'),
    //リストの上の表示するコンテキストメニュー
    list_contextmenu: document.querySelector('#list_contextmenu'),
    //リスト
    ul0: document.querySelector('#ul0'),
    //JSONの表示
    show_JSON: function () {
        const bom = new Uint8Array([0xFF, 0xFE])
        const array = Uint16Array.from(JSON.stringify(g.jd._data, null, 4), c => c.charCodeAt(0))
        const blob = new Blob([bom, array], {
            type: "text/plain"
        })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.target = "_blank"
        link.click()
    },
    //JSONのダウンロード
    download_JSON: function () {

        if (g.jd._data.length > 0) {
            const bom = new Uint8Array([0xFF, 0xFE])
            const array = Uint16Array.from(JSON.stringify(g.jd._data, null, 4), c => c.charCodeAt(0))
            const blob = new Blob([bom, array], {
                type: "text/plain"
            })
            const link = document.createElement('a')
            let titleText = ""
            if (window.confirm("ダウンロードしますか？") === false) {
                return false
            }
            if (window.confirm("タイトルを付けて保存しますか?")) {
                titleText = window.prompt("タイトルを入力")
                if (titleText === null || titleText === "") {
                    titleText = `GraphApp-${Date.now()}-${g.jd._data[0].title}`
                }
            } else {
                titleText = `GraphApp-${Date.now()}-${g.jd._data[0].title}`
            }
            link.download = `${titleText}.txt`
            link.href = URL.createObjectURL(blob)
            link.click()
            link.remove()
            URL.revokeObjectURL(link)
        } else {
            alert("新しいラベルを追加してください")
        }

    },
    removeAll: function () {
        const result = window.confirm('すべて消去しますがよろしいですか？')
        if (result) {
            g.jd.__resetData()
        }
    },
    expands: false,
    switch_expands: function () {
        if (g.expands) {
            document.body.style.overflow = 'hidden'
            g.expands = false
        } else {
            document.body.style.overflow = 'scroll'
            g.expands = true
        }
    },
    openManual: function () {
        window.open('./manual')
    },
    openAbout: function () {
        window.open('./about')
    }
}

//JSONファイルの読み込み
window.g.FileRead.addEventListener('change', (event) => {
    const reader = new FileReader()
    reader.onload = () => {
        let obj = JSON.parse(reader.result)
        g.jd.__resetData()
        obj.forEach((v) => {
            g.jd.add(v, {
                skip: true
            })
        })
        const mX = obj.reduce((acc, cur) => {
            return Math.max(acc, cur.PosX)
        }, 0)
        const mY = obj.reduce((acc, cur) => {
            return Math.max(acc, cur.PosY)
        }, 0)

        g.jd.cc.canvasSizingAll(mX + window.innerWidth / 2, mY + window.innerHeight / 2)

        g.jd.drawEdge()

    }
    reader.readAsText(event.target.files[0])
})

//Enterでノードの追加処理を行う
window.g.queryUIv1.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.keyCode === 13) {
        g.hc.NodeAdd()
    }
})