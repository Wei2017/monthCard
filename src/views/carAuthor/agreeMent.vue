<template>
  <div class="agreeMent">
      <img :src="sfzzm" style="width:100%">
        <!-- <p class="title">【保定市路侧停车】<br/>车位租赁协议</p>
        <div class="detailList">
            <p class="twoLevelTitle">1.车位租赁内容</p>
            <div class="detail">
                <p>
                    <span>1.1</span>
                    <span>甲方为停车场的管理方，以停车场的停车位为乙方提供停车租赁服务。乙方依据本协议，租赁该停车场相对应停车位，用作停放乙方备案汽车牌照的车
辆。《备案汽车牌照信息表》见附件。</span>
                </p>
                <p>
                    <span>1.2</span>
                    <span>乙方如需变更备案汽车牌照信息，最迟于当日17点前书面通知甲方。非备案车辆停泊于该停车场，将按照临停收费标准计时收费。</span>
                </p>
                <p>
                    <span>1.3</span>
                    <span>租赁期限、收费标准、付款方式、付款周期、开票信息以首页《车位信息表》（“信息表”）为准。</span>
                </p>
                <p>
                    <span>1.4</span>
                    <span>车位租赁采取先缴费后使用的原则，乙方应当在信息表中的租赁开始时间前支付首期车位租赁费及押金（如有），并在付款周期对应的期限结束前2日内，支付下一期的车位租赁费。如乙方未按期支付，甲方按照临停收费标准计时收费；如果乙方逾期7日未支付车位租赁费，甲方有权解除本协议。租赁期届满后30日内，甲方扣除相应费用后（如有）无息退还剩余押金。</span>
                </p>
                <p>
                    <span>1.5</span>
                    <span>乙方如申请退费，需携带本协议、车位租赁费发票（电子发票或未开发票的则无需携带发票）和其他费用收据原件(如有），办理退费手续，退款将按乙方原支付方式退回。甲方仅受理未开始计费月份的车位租赁费退费申请，已开始计费的当月退费申请将不予以受理，</span>
                </p>
                <p>
                    <span>1.6</span>
                    <span>乙方如欲更换发票抬头，或对开具发票有其他特殊要求，则需于下一付款周期开始前向甲方提出申请，并提供与更换后的发票抬头一致的加盖公章的营业执照副本复印件或身份证明复印件。</span>
                </p>
            </div>
        </div>
        <div class="detailList">
            <p class="twoLevelTitle">2.双方权利义务</p>
            <div class="detail">
                <p>
                    <span>2.1</span>
                    <span>甲方向乙方收取的车位租赁费仅为甲方在停车场内提供疏导、保洁、停车设备维护的服务费用，不包含车辆保管费用。即双方只构成车位场地租赁关系，不构成保管关系。乙方在此意识到并认可，甲方对于约定车辆不承担保管义务。乙方的车辆及车辆内的贵重物品由乙方自行妥善保管，若有丢失、损伤、剐蹭等，甲方不予赔偿，乙方对此不得主张和提出异议。</span>
                </p>
            </div>
        </div>
        <div class="footer">
            <button>我已确认并接受以上协议</button>
        </div> -->
  </div>
</template>

<script>
export default {
    data(){
        return {
            sfzzm:require('assets/img/agree.png'),
        }
    }
}
</script>

<style>
    /* .agreeMent{
        padding-top: 40px;
        margin-bottom: 208px;
    }
    .detailList{
        padding:0 48px;
    }
    .title{
        font-size:48px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:66px; 
        text-align: center;
    }
    .detailList{
        margin-top: 40px;
    }
    .twoLevelTitle{
        font-size:36px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:50px;
        margin-bottom: 24px;
    }
    .detail{
        font-size:28px;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:40px;
    }
    .detail p{
        margin-bottom: 16px;
    }
    .detail p span{
        display: inline-block;
        vertical-align: top;
    }
    .detail p span:nth-of-type(2){
        width: 90%;
    }
    .footer{
        margin-top: 40px;
        border-top: 2px solid rgba(225,225,225,0.45);
        padding: 40px 0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
    }
    .footer button{
        width:654px;
        height:88px;
        background:rgba(0,140,255,1);
        border-radius:44px;
        margin: 0 auto;
        color: #fff;
        text-align: center;
        line-height: 88px;
        border: none;
        outline: none;
        display: block;
    } */
</style>