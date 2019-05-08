// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       // 这个属性引用了星星预制资源
       starPrefab: {
        default: null,
        type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // score Node 的引用
        scoreNode: {
            default: null,
            type: cc.Node
        },
        
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },

        maxHeartCount:0,

        // 愛心Prefab
        heartPrefab: {
            default: null,
            type: cc.Prefab
            },

         // 加分Prefab
        addScorePrefab: {
            default: null,
            type: cc.Prefab
            },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化计分
        this.score = 0;

        this.heartCount = 0;

        this.arrHeart = new Array(this.maxHeartCount);

        // 建立愛心
        for (let idx = 0; idx < this.maxHeartCount; idx++){
            this.spawnNewHear(idx);
        }

    },

    // 建立星星節點
    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        
        
        // 設定星星的位置
        let StarPosition = this.getNewStarPosition();
        newStar.setPosition(StarPosition);

        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 30;

        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;

        randX = (Math.random() - 0.5) * 2 * maxX;

        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    // 建立愛心
    spawnNewHear: function(count) {

        // 使用愛心預製在場景中建立愛心
        let newHeart = cc.instantiate(this.heartPrefab);
        
        // 將新建的愛心加入至Canvas
        this.node.addChild(newHeart);

        this.arrHeart[count] = newHeart;

        this.heartCount++;

        for (let index = 0; index < this.arrHeart.length; index++) {
            let element = this.arrHeart[index];
        }

        // 設定位置
        newHeart.setPosition(this.getNewHeartPosition(count));
    },

    // 取得愛心位置
    getNewHeartPosition: function (Count) {
        
        console.log('x:'+this.node.y+' y:'+this.scoreNode.height);
        
        let positionX = (this.node.x * -1 + 42) + (Count * 50);
        let positionY = this.node.y - this.scoreNode.height -50;

        // 回傳愛心座標
        return cc.v2(positionX, positionY);
    },

    // 減少愛心
    cutHeart: function() {
        
        this.arrHeart[this.heartCount-1].getComponent('Heart').showLoseHeart();

        this.heartCount--;
    },

    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            
            this.timer = 0;
            
            if (this.heartCount <= 1) {
                this.gameOver();
                return;
            }
            else {
                this.cutHeart();
            }
            
        }
        this.timer += dt;
    },

    // 更新分數
    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    showAddScore: function(x,y) {
         // 建立加分prefab
         var newAddScore = cc.instantiate(this.addScorePrefab);
         // 新增到Cancas節點下
         this.node.addChild(newAddScore);
         newAddScore.setPosition(cc.v2(x,y));
    },

    // 遊戲結束
    gameOver: function () {
        
        console.log('heartCount: '+this.heartCount);
        
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('restart');
        
    }
});
