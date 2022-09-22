import { GroupNode } from '@logicflow/extension';

const offsetY = 10

class MyGroup extends GroupNode.view {

  // 缩放的调整点
  getResizeShape() {
    const { model } = this.props;
    model.text.x = model.x
    model.isFolded ? model.text.y = model.y : model.text.y = model.y + (model._height / 2) + offsetY
    return super.getResizeShape()
  }

}
class MyGroupModel extends GroupNode.model {
  initNodeData(data) {
    super.initNodeData(data);
    // 是否限制分组子节点拖出分组，默认false
    this.isRestrict = false;
    // 分组是否支持手动调整大小，默认false
    this.resizable = true;
    // 分组是否显示展开收起按钮
    this.foldable = true;
    this.width = 500;
    this.height = 300;
    // 分组折叠后的宽度
    // this.foldedWidth = 50;
    // 分组折叠后的高度
    // this.foldedHeight = 50;
    // 不允许文本被拖动
    this.text.draggable = true;
    // 不允许文本被编辑
    this.text.editable = true;
    // 设置文本的位置
    this.text.y = this.y + (this._height / 2) + offsetY
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = '#AEAFAE';
    style.strokeDasharray = '3 3';
    style.strokeWidth = 1;
    if (this.isSelected) {
      style.stroke = "rgb(124, 15, 255)";
    }
    if (this.isFolded) {
      style.fill = "skyblue";
    }
    return style;
  }

}


export default {
  type: 'custom-group',
  model: MyGroupModel,
  view: MyGroup
};
