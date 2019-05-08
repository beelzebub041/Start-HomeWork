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
        
        // 跳躍高度
        jumpHeight: 0,
        // 跳躍持續時間
        jumpDuration: 0,
        // 最大移動速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,

        // 跳躍音效
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },

        // 宣告game 其type為cc.Node, 表示game為某一節點
        game: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    start ()
    {

    },

    // 場景讀取後及讀取
    onLoad: function () {

        // 初始化跳躍動作
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // 方向開關
        this.accLeft = false;
        this.accRight = false;
        
        // 水平移動速度
        this.xSpeed = 0;

        // 初始化監聽鍵盤
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this); 

        // 監聽滑鼠
        this.game.on('mousedown', this.onMouseDown, this);
        this.game.on('mouseup', this.onMouseUp, this);
        
    },

    // 取消監聽鍵盤
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    // 按鍵動作(按住)
    onKeyDown (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },

    // 按鍵動作(放開)
    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },

    // 滑鼠動作(點擊)
    onMouseDown (event) {

        let touchX = event.getLocationX();

        if (touchX > this.game.width/2) {
            this.accRight = true;
        }
        else {
            this.accLeft = true;
        }

    },

    // 滑鼠動作(放開)
    onMouseUp (event) {
        this.accRight = false;
        this.accLeft = false;
    },

    // 設定跳躍動作
    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    // 每個Frame的更新內容
    update: function (dt) {
        
        // 根據方向決定水平移動速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 判斷是否超過速度最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        let newPosition = this.node.x + this.xSpeed * dt;

        if ((this.game.width/2)*-1 < newPosition && newPosition < this.game.width/2) {
            // 更新角色位置
            this.node.x += this.xSpeed * dt;
        }


    },

});
