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
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.ani = this.getComponent(cc.Animation);

        let aniState = this.ani.play('shine');

        this.duration = aniState.duration;

        this.timer = 0;
    },

    onPlayShine () {
        animate.play('shine');
    },

    start () {

    },

    update (dt) {

        if (this.timer >= this.duration) {
            this.timer = 0;
            this.node.destroy();
        }
        else
        {
            this.timer += dt;
        }

    },
});
