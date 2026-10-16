const split = (s) => s.split(' ');
export const WORD_POOLS = {
  easy: split(
    'cat dog sun map cup hat red box pen sky run jump milk book tree fish blue home rain star moon road bird cake lamp door ship wind snow farm gold',
  ),
  medium: split(
    'planet window garden bridge pocket silver market travel button winter forest finger rocket island coffee basket morning picture kitchen journey teacher monitor machine pattern balance network library',
  ),
  hard: split(
    'keyboard algorithm difficulty challenge perspective synchronize collaborate architecture vocabulary framework broadcast mysterious adventure geography hypothesis javascript precision resilience structure telescope',
  ),
};
