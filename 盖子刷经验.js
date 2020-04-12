/**
 * TODO
 * 增加悬浮窗用于控制脚本开始，显示。
 * 重构代码，函数结构化
 */
/**
 * 初始化，申请权限
 */
function init() {
  //开启无障碍
  auto.waitFor();
  //设置分辨率
  setScreenMetrics(1080, 2280);
  //申请截屏权限(横屏)
  if (!requestScreenCapture(true)) {
    log("请求截屏权限失败!需要通过找图定位");
  }
}

/**
 * 经典场中点击右侧开战按钮
 */

function 开战() {
  log("开战");
  click(1800, 500);
}

/**
 * 死亡后退出,先判断是否死亡
 */
function 死亡退出() {
  log("死亡退出");
  if (has再来一局()) {
    log("再来一局");
    sleep(1000);
    click(1148, 979);
    return;
  }
  //右上角加号键
  click(2140, 95);
  sleep(1000);
  //退出游戏键(未死亡时是投降)
  click(1360, 87);
  sleep(800);
  click(1340, 630);
  sleep(1000);
}
/**
 * 找图判断死亡
 */
function isDead() {
  var result = images.findImage(captureScreen(), images.read("./dead.jpg"), {
    region: [1939, 730],
    threshold: 0.5,
  });
  return result != null;
}

function isAt经典场() {
  // 333 160
  //   602 269
  var result = images.findImage(captureScreen(), images.read("./经典场.jpg"), {
    region: [1896, 148],
    threshold: 0.9,
  });
  result = result != null;
  if (result) {
    log("现在位于经典场");
    status = "经典场";
  }
  return result;
}

function isAt大厅() {
  var result = images.findImage(captureScreen(), images.read("./大厅.jpg"), {
    region: [235, 913],
    threshold: 0.8,
  });
  result = result != null;
  if (result) {
    log("现在位于大厅");
    status = "大厅";
  }
  return result;
}
function is你的身份是主公() {
  var result = images.findImage(
    captureScreen(),
    images.read("./你的身份是主公.jpg"),
    {
      region: [842, 969],
      threshold: 0.8,
    }
  );
  result = result != null;
  if (result) {
    log("你的身份是主公");
  }
  return result;
}
function is主公已选将() {
  var result = images.findImage(
    captureScreen(),
    images.read("./主公已选将.jpg"),
    {
      region: [920, 30],
      threshold: 0.8,
    }
  );
  result = result != null;
  if (result) {
    log("主公已经选将");
  }
  return result;
}

function to经典场from大厅() {
  if (hasBackButton()) {
    click(2144, 82);
    sleep(500);
  }
  click(500, 500);
  log("已经从大厅跳转到经典场");
  status = "经典场";
}

function hasBackButton() {
  var result = images.findImage(captureScreen(), images.read("./back.jpg"), {
    region: [2062, 0],
    threshold: 0.4,
  });
  return result != null;
}

function has取消() {
  var result = images.findImage(captureScreen(), images.read("./取消.jpg"), {
    region: [1374, 669],
    threshold: 0.7,
  });
  return result != null;
}

function has托管中() {
  var result = images.findImage(captureScreen(), images.read("./托管中.jpg"), {
    region: [1230, 980],
    threshold: 0.8,
  });
  return result != null;
}

function has傲视群雄() {
  var result = images.findImage(
    captureScreen(),
    images.read("./傲视群雄.jpg"),
    {
      region: [2060, 920],
      threshold: 0.9,
    }
  );
  return result != null;
}

function has再来一局() {
  var result = images.findImage(
    captureScreen(),
    images.read("./再来一局.jpg"),
    {
      region: [928, 870],
      threshold: 0.8,
    }
  );
  return result != null;
}

function 截图(x1, y1, x2, y2) {
  return images.clip(captureScreen(), x1, y1, x2 - x1, y2 - y1);
}

function 截图保存(x1, y1, x2, y2, name) {
  images.save(截图(x1, y1, x2, y2), "./" + name + ".jpg", "jpg", 50);
}

function 苦肉可发动() {
  var result = images.findImage(captureScreen(), images.read("./苦肉.jpg"), {
    region: [1715, 899],
    threshold: 0.9,
  });
  return result != null;
}

function 选将() {
  //点击选择武将
  click(277, 831);
  sleep(1500);
  click(1022, 529);
  sleep(100);
  click(1022, 529);
}

/**
 * 判断当前位置
 */
function judgeTheState() {
  while (!isAt经典场()) {
    to经典场();
  }
}

function 开始挂机() {
  switch (mode) {
    case 1: {
      while (true) {
        while (true) {
          //判断是否进入选将环节
          log("判断是否进入选将环节");
          if (is你的身份是主公() || is主公已选将()) {
            status = "对局中";
            matchesNumber++;
            break;
          }

          if (isAt经典场() || isAt大厅()) {
            to经典场();
            log("匹配失败，重新开战");
            开战();
          }
          sleep(1000);
        }
        选将();
        /**
         * 进行死亡判断、防托管判断、发动自杀技能判断
         */
        while (true) {
          sleep(1000);
          if (isDead()) {
            log("**********死亡退出**********");
            log(
              "战绩:" +
                "苦肉总次数:" +
                skillNumber +
                ",匹配总场次:" +
                matchesNumber
            );
            log("**********再接再厉**********");
            死亡退出();
            break;
          }
          if (has取消()) {
            //log("取消");
            click(1475, 706);
          } else if (has托管中()) {
            log("取消了托管");
            click(1400, 950);
            continue;
          } else if (苦肉可发动()) {
            log("苦肉了1次");
            skillNumber++;
            click(1842, 960);
          } else {
            /**
             * 自己没死，主公先死了
             * 注意有两种情况，第一种是直接出来再来一局(自己失败了),第二种是出来"傲视群雄"(胜利)，此时需要点击屏幕才可继续再来一局
             */
            if (has再来一局()) {
              log("再来一局");
              matchesNumber++;
              click(1148, 979);
              break;
            }
            //所有可执行操作都不匹配，用于排除“傲视群雄”的页面可能
            if (has傲视群雄()) {
              log("傲视群雄");
              click(1148, 979);
              sleep(1500);
              死亡退出();
              break;
            }
          }
        }
      }
    }
  }
}
/**
 * 从大厅或者经典场，跳转到经典场
 */
function to经典场() {
  //更新界面状态
  isAt大厅();
  isAt经典场();

  if (status == "大厅") {
    to经典场from大厅();
    sleep(1000);
    //点击8人军争模式
    click(481, 589);
  } else if (status == "经典场") {
    //点击8人军争模式
    click(481, 589);
  } else {
  }
  sleep(2000);
}
//记录匹配过的场次
var matchesNumber = 0;
//记录苦肉过的次数
var skillNumber = 0;
var status = "未知位置";
var MODES = {
  0: "未设置",
  1: "黄盖挂机自杀刷经验",
};
var mode = 1;
init();
开始挂机();
