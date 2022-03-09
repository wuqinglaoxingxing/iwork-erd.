import { HtmlNode, HtmlNodeModel, h } from "@logicflow/core";

class SqlNode extends HtmlNode {
    /**
     * 1.1.7版本后支持在view中重写锚点形状。
     * 重写锚点新增
     */
    getAnchorShape(anchorData) {
        const { x, y, type } = anchorData;
        return h("rect", {
            x: x - 5,
            y: y - 5,
            width: 10,
            height: 10,
            className: `custom-anchor ${type === "left" ? "incomming-anchor" : "outgoing-anchor"
                }`
        });
    }
    setHtml(rootEl) {
        rootEl.innerHTML = "";
        const {
            properties: { fields, tableName }
        } = this.props.model;
        rootEl.setAttribute("class", "table-container");
        const container = document.createElement("div");
        container.className = `table-node table-color-${Math.ceil(
            Math.random() * 18
        )}`;
        const tableNameElement = document.createElement("div");
        tableNameElement.innerText = tableName;
        tableNameElement.className = "table-name";
        container.appendChild(tableNameElement);
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < fields.length; i++) {
            const item = fields[i];
            const itemElement = document.createElement("div");
            itemElement.className = "table-feild";
            const itemKey = document.createElement("span");
            itemKey.innerText = item.key;
            const itemType = document.createElement("span");
            itemType.innerText = item.type;
            itemType.className = "feild-type";
            itemElement.appendChild(itemKey);
            itemElement.appendChild(itemType);
            fragment.appendChild(itemElement);
        }
        container.appendChild(fragment);
        rootEl.appendChild(container);
    }
}

class SqlNodeModel extends HtmlNodeModel {
    initNodeData(data) {
        // 支持重写，初始化节点数据，将传入的图数据（data）转换为节点属性, 所以需要调用super.initNodeData触发转换方法。
        // 在super.initNodeData之前，对图数据进行处理。
        // 在super.initNodeData之后，对节点属性进行初始化
        super.initNodeData(data);
        this.text.draggable = false; // 不允许文本被拖动
        this.text.editable = false; // 不允许文本被编辑
    }
    
    /**
     * 给model自定义添加字段方法
     */
    addField(item) {
        this.properties.fields.push(item);
        this.setAttributes();
        // 为了保持节点顶部位置不变，在节点变化后，对节点进行一个位移,位移距离为添加高度的一半。
        this.move(0, 24 / 2);
    }
    getOutlineStyle() {
        const style = super.getOutlineStyle();
        style.stroke = "none";
        style.hover.stroke = "none";
        return style;
    }
    // 如果不用修改锚地形状，可以重写颜色相关样式
    getAnchorStyle(anchorInfo) {
        const style = super.getAnchorStyle();
        if (anchorInfo.type === "left") {
            style.fill = "#ccc";
            style.stroke = "red";
            style.hover.fill = "transparent";
            style.hover.stroke = "transpanrent";
            style.className = "lf-hide-default";
        } else {
            style.fill = "#CCC";
            style.stroke = "green";
        }
        return style;
    }
    setAttributes() {
        this.width = 200;
        const {
            properties: { fields }
        } = this;
        this.height = 60 + fields.length * 24;
        const circleOnlyAsTarget = {
            message: "只允许从右边的锚点连出",
            validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
                return sourceAnchor.type === "right";
            }
        };
        this.sourceRules.push(circleOnlyAsTarget);
        this.targetRules.push({
            message: "只允许连接左边的锚点",
            validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
                return targetAnchor.type === "left";
            }
        });
    }
    getDefaultAnchor() {
        const {
            id,
            x,
            y,
            width,
            height,
            properties: { fields }
        } = this;
        const anchors = [];
        fields.forEach((feild, index) => {
            anchors.push({
                x: x - width / 2 + 10,
                y: y - height / 2 + 60 + index * 24,
                id: `${id}_${index}_left`,
                edgeAddable: false,
                type: "left"
            });
            anchors.push({
                x: x + width / 2 - 10,
                y: y - height / 2 + 60 + index * 24,
                id: `${id}_${index}_right`,
                type: "right"
            });
        });
        return anchors;
    }
}

export default {
    type: "sql-node",
    model: SqlNodeModel,
    view: SqlNode
};
