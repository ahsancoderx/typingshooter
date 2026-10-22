const split = (s) => s.split(' ');
export const WORD_POOLS = {
  easy: split(
    'cat dog sun map cup hat red box pen sky run jump milk book tree fish blue home rain star moon road bird cake lamp door ship wind snow farm gold ball bear leaf lake king hand foot fire duck corn coat clap city boat bell bake zoo yes web van toy tea sit rug pig oak nut mud ice hen fox egg dig cow bus bed',
  ),
  medium: split(
    'planet window garden bridge pocket silver market travel button winter forest finger rocket island coffee basket morning picture kitchen journey teacher monitor machine pattern balance network library custom desert engine father guitar hammer insect jacket kettle ladder magnet needle orange pencil quiet ribbon spirit tunnel valley wallet yellow zipper breeze castle dinner effort flower golden harbor ideal jungle',
  ),
  hard: split(
    'keyboard algorithm difficulty challenge perspective synchronize collaborate architecture vocabulary framework broadcast mysterious adventure geography hypothesis javascript precision resilience structure telescope abundance community discovery elaborate frequency generation heritage imagination knowledge laboratory mechanism navigation occasion paragraph quotation reasonable satellite tradition universe velocity wilderness exception fluctuate guarantee hierarchy',
  ),
};
