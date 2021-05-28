/**
 * html要素とJSON_DRAWERを繋ぐクラス
 */
export class HandleController {
    constructor() {
        this.connects = []
        this.clickX = 0
        this.clickY = 0
        this.selectElement = null
    }

    updateTarget() {
        g.jd.updateData_target(this.Connects[0], this.Connects[1]);
        this.Connects = []
        g.jd.drawEdge()
    }

    drawEdge() {
        g.jd.drawEdge()
    }

    updatePos(num_id, x, y) {
        g.jd.updateData_pos(num_id, x, y);
    }

    NodeAdd() {
        if (g.queryUIv1.value === "") {
            if (window.confirm("新しいラベル名を付けてください")) {
                g.queryUIv1.focus()
            }
        } else {
            g.jd.add(g.jd.createNode(g.queryUIv1.value, this.clickX, this.clickY))
            g.queryUIv1.value = ""
            g.contextmenu0.style.display = "none"
        }
    }

    editTitle() {
        if (this.selectElement !== null) {
            const _id = Number(this.selectElement.parentNode.id.replace("l", ""))
            let newTitle = window.prompt("タイトルの編集", g.jd._data[_id].title)
            if (newTitle === null || newTitle === "") {
                //No operation.

                // null または　"" でなければ新しい値を入れる
            } else {
                g.jd._data[_id].title = newTitle
                this.selectElement.innerHTML = newTitle
                g.jd.drawEdge()
            }
            this.close()
            this.selectElement = null
        }
    }

    NodeDelete() {
        if (this.selectElement !== null) {
            const result = window.confirm("このラベルを消しますか？")
            if (result) {
                g.jd.deleteNode(this.selectElement)
            }
            this.close()
            this.selectElement = null
        }
    }

    close() {
        g.contextmenu0.style.display = "none"
        g.list_contextmenu.style.display = "none"
        g.hc.connects = []
        g.jd.cc.is_drawSingleArrow = true
    }

}