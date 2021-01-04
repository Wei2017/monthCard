// 引入请求的配置文件
import { reqMethod } from './request'

/*
 * * Home页面接口
 */
// * Home初始化接口



export const removeMyCars = params => { return reqMethod('/api/product/weChat/deleteCar', params)};//解绑车牌

export const changeMyCars = params => { return reqMethod('/api/product/weChat/updateCar', params)};//更正车牌

export const bindMyCars = params => { return reqMethod('/api/product/weChat/addCar', params)};//绑定车牌

export const getMyMonthCard = params => { return reqMethod('/api/product/weChat/saveMonthToProduct', params)};//立即领取月卡

export const getProduct = params => { return reqMethod('/api/product/weChat/queryAllProductByParkinglotId', params)};//产品列表

export const getAuthor = params => { return reqMethod('/api/product/User/Login', params)};//登录授权
//杜晓伟
export const retCard = params => { return reqMethod('/api/product/weChat/queryOldMonthCards', params)};//找回月卡
export const getMyCards = params => { return reqMethod('/api/product/weChat/queryMyProducts', params)};//我的月卡列表
export const queryAllParkinglot = params => { return reqMethod('/api/product/weChat/queryAllParkinglot', params)};//查询车场列表
export const myOldProductDetails = params => { return reqMethod('/api/product/weChat/queryMyOldProductDetails', params)};//我的老月卡详情
export const myNewProductDetails = params => { return reqMethod('/api/product/weChat/queryMyNewProductDetails', params)};//获取新月卡详情
export const chooseCard = params => { return reqMethod('/api/product/weChat/queryProductDetails', params)};//选购月卡类型及购买信息
export const selectCard = params => { return reqMethod('/api/product/weChat/qureySelectCarsByUserId', params)};//该用户下可添加的车牌
export const renewProduct = params => { return reqMethod('/api/product/productpurchase/renewProduct', params)};//移动端续费产品
export const buyProduct = params => { return reqMethod('/api/product/productpurchase/buyProduct', params)};//移动端购买产品
export const unbindProductMonthly = params => { return reqMethod('/api/product/productpurchase/unbindProductMonthly', params)};//解绑月卡
export const addCarLicenseInProduct = params => { return reqMethod('/api/product/weChat/addCarLicenseInProduct', params)};//给新月卡产品绑定车牌
export const unbindCarLicenseInProduct = params => { return reqMethod('/api/product/weChat/unbindCarLicenseInProduct', params)};//给新月卡产品解绑车牌
export const userPay = params => { return reqMethod('/api/xp/monthly/pay', params)};//支付  2020.09.03 废弃 与支付和续费二合一

export const queryOldMonthCardsToShow = params => { return reqMethod('/api/product/weChat/queryOldMonthCardsToShow', params)};//绑定车辆之前查询月卡
export const saveMonthToProductAddCar = params => { return reqMethod('/api/product/weChat/saveMonthToProductAddCar', params)};//绑定车辆之前立即领取


// 发票相关

export const invoiceUserCarLicense = params => { return reqMethod('/api/fce/queryUserCarLicense', params)};//用户车牌列表
export const invoiceSelectList = params => { return reqMethod('/api/fce/listParkIncomeOfficialAccount', params)};//选择开票列表
export const invoiceTitleSave = params => { return reqMethod('/api/fce/saveInvoiceTitle', params)};//新增发票抬头
export const invoiceTitleList = params => { return reqMethod('/api/fce/listInvoiceTitle', params)};//用户的所有发票抬头列表
export const invoiceNewOpen = params => { return reqMethod('/api/fce/applyInvoiceOfficialAccount', params)};//公众号开票
export const invoicePreview = params => { return reqMethod('/api/fce/pdfPreview', params)};//发票预览
export const invoiceDelTitle = params => { return reqMethod('/api/fce/deletInvoiceTitle', params)};//删除发票抬头
//开票历史
export const invoiceHisInvoiceList = params => { return reqMethod('/api/fce/queryInvoiceHistory', params)};//选择开票列表
export const invoiceDetails = params => { return reqMethod('/api/fce/querInvoiceHistoryDetail', params)};//开票详情
export const invoiceReopen = params => { return reqMethod('/api/fce/redoInvoice', params)};//重推 || 重开发票
export const invoiceOpenCar = params => { return reqMethod('/api/fce/queryUserInvoiceCarLicense', params)};//已开票的车牌列表









export const getTime = params => { return reqMethod('/api/product/Home/Index/dateTime', params)};//登录



//zhouhang
export const getMineCar = params => { return reqMethod('/api/product/weChat/myCars', params)};//登录
export const getCerTify = params => { return reqMethod('/api/product/weChat/queryVehicleCertificationStatus', params)};//请求车辆验证状态的接口
export const getCertifiedFun = params => { return reqMethod('/api/product/weChat/qureyNotCertifiedCarsByUserId', params)};//获取认证列表
export const handleCertifyFun = params => { return reqMethod('/api/product/weChat/uploadAttestationFile', params)};//提交认证信息；
export const uploadFileFun = params => { return reqMethod('/api/product/weChat/uploadFile', params)};//提交认证信息；



//lh  智谷汇相关接口
export const getzghUserInfo = params => { return reqMethod('/php/api/ext/zgh/getUserInfo', params)};//获取用户信息
export const getxPay = params => { return reqMethod('/php/api/xp/xPay', params)};//获取支付参数
export const getPayList = params => { return reqMethod('/php/api/xp/getPayList', params)};//获取支付参数
export const getClientIp = params => { return reqMethod('/php/api/getClientIp.php', params, 'GET')};//获取用户ip

