const {ccclass, property} = cc._decorator;

export enum BGScaleType {
    FULL_SCREEN,                    
    SCALE_BY_WIDTH,                 
    SCALE_BY_HEIGHT,
    SCALE_ONLY_WIDTH,  
    SCALE_ONLY_HEIGHT,                     
}

export enum BGAlignmentType {
    TOP,                    
    BOTTOM,                 
    CENTER,
    LEFT,  
    RIGHT,                     
}

@ccclass
export default class BgScale extends cc.Component {
    @property({type: cc.Enum(BGAlignmentType)})
    alignmentType:BGAlignmentType = BGAlignmentType.CENTER;
    @property({type: cc.Enum(BGScaleType)})
    scaleType:BGScaleType = BGScaleType.FULL_SCREEN;

    private realW:number = 0;
    private realH:number = 0;
    private _resizeCallback:any = null;

    protected onLoad ():void {
        this.realW = this.node.width;
        this.realH = this.node.height;
        this.setMyFrameSize();
        if (cc.sys.isBrowser) {
            this._resizeCallback = this.setMyFrameSizeAgain.bind(this);
            window.addEventListener('resize', this._resizeCallback);
            window.addEventListener('orientationchange', this._resizeCallback);
            document.addEventListener('rotateScreen', this._resizeCallback);
            document.addEventListener('resetScreen', this._resizeCallback);
        }
    }

    protected onDestroy():void {
        if (cc.sys.isBrowser) {
            window.removeEventListener('resize', this._resizeCallback);
            window.removeEventListener('orientationchange', this._resizeCallback);
            document.removeEventListener('rotateScreen', this._resizeCallback);
            document.removeEventListener('resetScreen', this._resizeCallback);
            this._resizeCallback = null;
        }
    }

    protected setMyFrameSize():void {
        if (!this.node) {
            return;
        }
        var wsize = null;
        if (cc.sys.isBrowser) {
            wsize = cc.visibleRect;
        } else {
            wsize = cc.director.getWinSize();
        }
        var scale1 = wsize.width / this.realW;
        var scale2 = wsize.height / this.realH;
        var max_scale = Math.max(scale1, scale2);
        var scaleX, scaleY;
        if (this.scaleType == BGScaleType.SCALE_BY_WIDTH) {
            scaleX = scaleY = scale1;
        } else if (this.scaleType == BGScaleType.SCALE_BY_HEIGHT) {
            scaleX = scaleY = scale2;
        } else if (this.scaleType == BGScaleType.SCALE_ONLY_WIDTH) {
            scaleX = scale1;
            scaleY = 1;
        } else if (this.scaleType == BGScaleType.SCALE_ONLY_HEIGHT) {
            scaleX = 1;
            scaleY = scale2;
        } else if (cc.sys.isBrowser) {
            //横向浏览器 只缩放宽度
            scaleX = scaleY = max_scale;
            // scaleY = 1;
        } else {
            scaleX = scaleY = max_scale;
        }

        this.node.width = this.realW * scaleX;
        this.node.height = this.realH * scaleY;

        var widget = this.node.getComponent(cc.Widget);
        if (widget == null) {
            widget = this.node.addComponent(cc.Widget);
        }
        var canvas = cc.director.getScene().getChildByName('Canvas');
        widget.target = canvas;
        if (this.alignmentType == BGAlignmentType.BOTTOM) {
            widget.isAlignHorizontalCenter = true;
            widget.isAlignBottom = true;
            widget.bottom = 0;
        } else if (this.alignmentType == BGAlignmentType.TOP) {
            widget.isAlignHorizontalCenter = true;
            widget.isAlignTop = true;
            widget.top = 0;
        } else if (this.alignmentType == BGAlignmentType.LEFT) {
            widget.isAlignVerticalCenter = true;
            widget.isAlignLeft = true;
            widget.left = 0;
        } else if (this.alignmentType == BGAlignmentType.RIGHT) {
            widget.isAlignVerticalCenter = true;
            widget.isAlignRight = true;
            widget.right = 0;
        } else if (this.alignmentType == BGAlignmentType.CENTER) {
            widget.isAlignHorizontalCenter = true;
            widget.isAlignVerticalCenter = true;
        }
    }

    protected setMyFrameSizeAgain():void {
        this.scheduleOnce(function () {
            this.setMyFrameSize();
        }.bind(this), 0.05);
    }

    protected changeOrientation(flag:boolean):void {
        this.setMyFrameSize();
    }
}
