import { ServerConfig } from "../config/ServerConfig";
import { NetManager } from "../network/socket/NetManager";
import GeneralProxy from "./GeneralProxy";

export default class GeneralCommand {
    //单例
    protected static _instance: GeneralCommand;
    public static getInstance(): GeneralCommand {
        if (this._instance == null) {
            this._instance = new GeneralCommand();
        }
        return this._instance;
    }

    public static destory(): boolean {
        if (this._instance) {
            this._instance.onDestory();
            this._instance = null;
            return true;
        }
        return false;
    }

    //数据model
    protected _proxy: GeneralProxy = new GeneralProxy();

    constructor() {
        cc.systemEvent.on(ServerConfig.general_myGenerals, this.onMyGenerals, this);
        cc.systemEvent.on(ServerConfig.general_push, this.onGeneralPush, this);
        cc.systemEvent.on(ServerConfig.general_drawGeneral, this.onDrawGenerals, this);
        cc.systemEvent.on(ServerConfig.general_composeGeneral, this.onComposeGeneral, this);
        cc.systemEvent.on(ServerConfig.general_addPrGeneral, this.onAddPrGeneral, this);
        cc.systemEvent.on(ServerConfig.general_convert, this.onGeneralConvert , this);
        

    }

    public onDestory(): void {
        cc.systemEvent.targetOff(this);
    }

    public clearData(): void {
        this._proxy.clearData();
    }

    public get proxy(): GeneralProxy {
        return this._proxy;
    }

    /**我的将领列表*/
    protected onMyGenerals(data: any): void {
        console.log("onMyGeneralsonMyGenerals ", data);
        if (data.code == 0) {
            this._proxy.updateMyGenerals(data.msg.generals);
            cc.systemEvent.emit("update_my_generals");
        }
    }

    protected onGeneralPush(data: any): void {
        console.log("onGeneralPush ", data);
        if (data.code == 0) {
            let ids: number[] = this._proxy.updateGenerals(data.msg);
            cc.systemEvent.emit("update_generals", ids);
        }
    }

    protected onDrawGenerals(data: any): void {
        console.log("onDrawGenerals ", data);
        if (data.code == 0) {
            this._proxy.updateMyGenerals(data.msg.generals);
            cc.systemEvent.emit("update_my_generals");
            cc.systemEvent.emit("open_draw_result",data.msg.generals);
        }
    }

    protected onComposeGeneral(data:any):void{
        console.log("onComposeGeneral ", data);
        if (data.code == 0) {
            this._proxy.updateMyGenerals(data.msg.generals);
            cc.systemEvent.emit("update_my_generals");

            cc.systemEvent.emit("update_one_generals",data.msg.generals[data.msg.generals.length - 1]);
        }
    }



    protected onAddPrGeneral(data:any):void{
        console.log("onAddPrGeneral ", data);
        if (data.code == 0) {
            this._proxy.updateGenerals(data.msg.general);
            cc.systemEvent.emit("update_one_generals",data.msg.general);
        }
    }

    protected onGeneralConvert(data:any):void{
        console.log("onGeneralConvert ", data);
        if (data.code == 0) {
           
        }
    }
    
    

    /**我的角色属性*/
    public updateMyProperty(datas: any[]): void {
        this._proxy.updateMyGenerals(datas);
        cc.systemEvent.emit("update_my_generals");
    }

    public qryMyGenerals(): void {
        let sendData: any = {
            name: ServerConfig.general_myGenerals,
            msg: {
            }
        };
        NetManager.getInstance().send(sendData);
    }


    /**
     * 抽卡
     * @param drawTimes 
     */
    public drawGenerals(drawTimes:number = 1): void {
        let sendData: any = {
            name: ServerConfig.general_drawGeneral,
            msg: {
                drawTimes:drawTimes
            }
        };
        NetManager.getInstance().send(sendData);
    }



    /**
     * 
     * @param compId 
     * @param gIds 
     */
    public composeGeneral(compId:number = 1,gIds:number[] = []): void {
        let sendData: any = {
            name: ServerConfig.general_composeGeneral,
            msg: {
                compId:compId,
                gIds:gIds
            }
        };
        NetManager.getInstance().send(sendData);
    }


    public addPrGeneral(compId:number = 1,force_add:number,strategy_add:number,defense_add:number,speed_add:number,destroy_add:number): void {
        let sendData: any = {
            name: ServerConfig.general_addPrGeneral,
            msg: {
                compId:compId,
                forceAdd:force_add,
                strategyAdd:strategy_add,
                defenseAdd:defense_add,
                speedAdd:speed_add,
                destroyAdd:destroy_add
            }
        };
        NetManager.getInstance().send(sendData);
    }

    public convert(gIds:number[]): void {
        let sendData: any = {
            name: ServerConfig.general_convert,
            msg: {
                gIds:gIds
            }
        };
        NetManager.getInstance().send(sendData);
    }
}