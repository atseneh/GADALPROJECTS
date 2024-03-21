const RecordStatusEnum = Object.freeze({
    ACTIVE: 1,
    INACTIVE: 2,
    DELETED: 3
  });
const PrevilageEnums = Object.freeze({
    SUPER_ADMIN:0,
    PROPERTY_ADMIN:1,
    MACHINERY_ADMIN:2,
    VEICHEL_ADMIN:3
})
const EstimationStateEnums = Object.freeze({
    REQUESTED:1,
    ESTIMATED:2,
})
const TransactionTypeEnums = Object.freeze({
    RENT:1,
    SALE:2
})
const DerivedProductStateEnums = Object.freeze({
    DISCOUNTED:1,
    PROMOTED:2,
    RATED:3,
    RENTED:4,
    SOLD:5,
})
const GadalServicesEnums = Object.freeze({
    MACHINERY:1,
    PROPERTY:2,
    VEICHEL:3,
    OTHER:4,
    
})
const ProductStateEnums = Object.freeze({
    ACTIVE:1,
    DRAFTED:2,
    PENDING:3,
    BLOCKED:4,
    
})
const ProductPostTypeEnums = Object.freeze({
    PREMIUM:1,
    GOLD:2,
    FREE:3,
})
const PackageTypeEnums = Object.freeze({
    PREMIUM:1,
    GOLD:2,
    FREE:3,
})
const PaymentMethodEnums = Object.freeze({
    BANK:1,
    MOBILE_MONEY:2
})
const OrderStateEnums = Object.freeze({
    PAYMENT_PENDING:1,
    PAYED:2,
    DECLINED:3,
    APPROVED:4,
})
const AssetEnums = Object.freeze({
    LOGO:1,
    BANNER:2,
    ICON:3,
    BACKGROUND:4,
})
const UserStatusEnums = Object.freeze({
    ACTIVE:1,
    INACTIVE:2,
    BLOCKED:3
})
const ReviewStateEnum = Object.freeze({
    PENDING:1,
    APPROVED:2,
    DECLINED:3
})
module.exports = {
    RecordStatusEnum,
    PrevilageEnums,
    EstimationStateEnums,
    TransactionTypeEnums,
    DerivedProductStateEnums,
    ProductStateEnums,
    AssetEnums,
    OrderStateEnums,
    PaymentMethodEnums,
    UserStatusEnums,
    ReviewStateEnum,
    ProductPostTypeEnums,
    GadalServicesEnums,
    PackageTypeEnums
}