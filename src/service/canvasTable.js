const maxFieldLen = 8

const Fields = [
  { defKey: "COLLEGE_ID", type: "VARCHAR(32)", primaryKey: true, defName: "所在学院ID" },
  { defKey: "CLASS_ID", type: "VARCHAR(32)", primaryKey: false, defName: "学生ID" },
  { defKey: "STUDENT_ID", type: "VARCHAR(32)", primaryKey: false, defName: "学生姓名" },
  { defKey: "STUDENT_NAME", type: "VARCHAR(32)", primaryKey: false, defName: "英文名" },
  { defKey: "ENG_NAME", type: "VARCHAR(32)", primaryKey: false, defName: "所在学院ID" },
  { defKey: "ID_CARD_NO", type: "VARCHAR(32)", primaryKey: false, defName: "身份证号" },
  { defKey: "GENDER", type: "VARCHAR(32)", primaryKey: false, defName: "手机号" },
  { defKey: "MOBILE_PHONE", type: "VARCHAR(32)", primaryKey: false, defName: "月薪" },
]

// const title = "SIMS_COLLEGE[学院]"
export const drawFields = function (ctx, params) {
  const { table } = params || {}
  const fields = table ? (table.fields ? table.fields : []) : []

  ctx.save();
  ctx.font = "12px sans-serif";
  for (let i = 0; i < maxFieldLen; i++) {
    ctx.save();
    if (Fields[i].primaryKey) {
      ctx.fillStyle = "red";
    }
    ctx.fillText(Fields[i].defKey + `\t\t${Fields[i].primaryKey ? '<PK>' : ''}`, 30, 85 + i * 30);
    ctx.restore();
    ctx.fillText(Fields[i].type, 180, 85 + i * 30);
    ctx.fillText(Fields[i].defName, 300, 85 + i * 30);
  }
  ctx.fillText("...", 180, 85 + Fields.length * 30);
  ctx.restore();
}

export const drawFieldsLine = function (ctx, params) {
  ctx.save();
  const offsetY = 30
  ctx.beginPath(); //新建一条path
  for (let i = 0; i < maxFieldLen; i++) {
    ctx.moveTo(20, 95 + i * offsetY); //把画笔移动到指定的坐标
    ctx.lineTo(380, 95 + i * offsetY); //把画笔移动到指定的坐标
  }
  ctx.stroke(); //绘制路径。
  ctx.closePath();
  ctx.restore();
}

export const drawReactRadius = function (ctx, params) {
  const radius = 20
  ctx.save();
  ctx.strokeStyle = 'skyblue'
  ctx.fillStyle = "skyblue";
  ctx.beginPath(); //新建一条path

  ctx.moveTo(40, 20); //把画笔移动到指定的坐标
  ctx.lineTo(360, 20); //绘制一条从当前位置到指定坐标(200, 50)的直线.
  ctx.arc(360, 40, radius, -Math.PI / 2, 0, false);
  ctx.lineTo(380, 60); //把画笔移动到指定的坐标
  ctx.lineTo(20, 60); //把画笔移动到指定的坐标
  ctx.lineTo(20, 40); //把画笔移动到指定的坐标
  ctx.arc(40, 40, radius, -Math.PI, -Math.PI / 2, false);
  ctx.fill()
  ctx.stroke(); //绘制路径。
  ctx.closePath();
  ctx.restore();

  ctx.save();
  ctx.beginPath(); //新建一条path
  ctx.strokeStyle = 'skyblue'
  ctx.fillStyle = "#fff";
  ctx.moveTo(380, 60); //把画笔移动到指定的坐标
  ctx.arc(360, 320, radius, 0, Math.PI / 2, false);
  ctx.lineTo(40, 340); //把画笔移动到指定的坐标
  ctx.arc(40, 320, radius, Math.PI / 2, -Math.PI, false);
  ctx.lineTo(20, 60); //把画笔移动到指定的坐标
  ctx.stroke(); //绘制路径。
  ctx.closePath();
  ctx.fill()
  ctx.restore();
}

export const drawSetTitle = function (ctx, params) {
  const { table } = params || {}
  const title = table ? `${table.title}[${table.chnname}]` : "tableName"
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText(
    title,
    getPosX(getTextWidth(title)),
    45
  );
  ctx.restore();
}

function getPosX(len) {
  return -0.5 * len + 204;
}

function getTextWidth(text, fontSize = 14) {
  // 创建临时元素
  const _span = document.createElement("span");
  // 放入文本
  _span.innerText = text;
  // 设置文字大小
  _span.style.fontSize = fontSize + "px";
  // span元素转块级
  _span.style.position = "absolute";
  // span放入body中
  document.body.appendChild(_span);
  // 获取span的宽度
  let width = _span.offsetWidth;
  // 从body中删除该span
  document.body.removeChild(_span);
  // 返回span宽度
  return width;
}