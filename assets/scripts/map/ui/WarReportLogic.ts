// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, ScrollView, Prefab, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import MapUICommand from "./MapUICommand";
import { WarReport } from "./MapUIProxy";
import WarReportDesLogic from './WarReportDesLogic';
import { EventMgr } from '../../utils/EventMgr';
import ListLogic from '../../utils/ListLogic';
import { AudioManager } from '../../common/AudioManager';

@ccclass('WarReportLogic')
export default class WarReportLogic extends Component {

    @property(ScrollView)
    scrollView:ScrollView = null;

    @property(Prefab)
    warPortDesPrefab: Prefab = null;
    private _warPortDesNode:Node = null;

    protected onEnable():void{
        EventMgr.on("upate_war_report", this.initView, this);
        EventMgr.on("click_war_report", this.openWarPortDes, this);
        EventMgr.on("close_report", this.close, this);
    }

    
    protected onDisable():void{
        EventMgr.targetOff(this);
    }

    private close() {
        this.node.active = false;
    }

    protected onClickClose(): void {
        AudioManager.instance.playClick();
        this.close();
    }


    protected initView():void{
        var report:WarReport[] = MapUICommand.getInstance().proxy.getWarReport();
        
        var comp = this.scrollView.node.getComponent(ListLogic);
        comp.setData(report);
    }

    public updateView():void{
        this.initView();
        MapUICommand.getInstance().qryWarReport();
    }

    protected openWarPortDes(data:WarReport):void{
        console.log("openWarPortDes");
        if (this._warPortDesNode == null) {
            this._warPortDesNode = instantiate(this.warPortDesPrefab);
            this._warPortDesNode.parent = this.node;
        } else {
            this._warPortDesNode.active = true;
        }

        this._warPortDesNode.getComponent(WarReportDesLogic).setData(data);
    }

    protected allRead():void{
        AudioManager.instance.playClick();
        MapUICommand.getInstance().warRead(0);
    }
}
