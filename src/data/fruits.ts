import { Fruit } from '@/types';

export const specs = ['1斤', '2斤', '3斤', '5斤'];

export const fruitsData: Fruit[] = [
  { id: 1, category: '常见水果', name: '香蕉', desc: '香甜软糯，营养丰富', price: 3.5, image: 'https://picsum.photos/id/292/300/300' },
  { id: 2, category: '常见水果', name: '红富士苹果', desc: '脆甜多汁，新鲜美味', price: 6.5, image: 'https://picsum.photos/id/312/300/300' },
  { id: 3, category: '常见水果', name: '香梨', desc: '皮薄肉细，香甜可口', price: 5.5, image: 'https://picsum.photos/id/326/300/300' },
  { id: 4, category: '常见水果', name: '脐橙/沃柑', desc: '鲜甜多汁，维C满满', price: 4.5, image: 'https://picsum.photos/id/401/300/300' },
  { id: 5, category: '常见水果', name: '蜜桔', desc: '酸甜适中，果肉饱满', price: 3.5, image: 'https://picsum.photos/id/431/300/300' },
  { id: 6, category: '瓜类', name: '麒麟西瓜', desc: '皮薄肉甜，汁水充沛', price: 3.5, image: 'https://picsum.photos/id/570/300/300' },
  { id: 7, category: '瓜类', name: '哈密瓜', desc: '香甜脆爽，果肉细腻', price: 5.5, image: 'https://picsum.photos/id/580/300/300' },
  { id: 8, category: '瓜类', name: '甜瓜', desc: '清香甜蜜，口感清爽', price: 4.5, image: 'https://picsum.photos/id/625/300/300' },
  { id: 9, category: '热带水果', name: '台农芒果', desc: '香气浓郁，甜蜜多汁', price: 6.5, image: 'https://picsum.photos/id/835/300/300' },
  { id: 10, category: '热带水果', name: '白心火龙果', desc: '清甜可口，营养丰富', price: 5.5, image: 'https://picsum.photos/id/1080/300/300' },
  { id: 11, category: '热带水果', name: '红心火龙果', desc: '色泽鲜艳，甜蜜多汁', price: 7.5, image: 'https://picsum.photos/id/1015/300/300' },
  { id: 12, category: '热带水果', name: '金枕榴莲', desc: '香气独特，果肉细腻', price: 29.9, image: 'https://picsum.photos/id/1018/300/300' },
  { id: 13, category: '热带水果', name: '山竹', desc: '酸甜适中，果肉白嫩', price: 18.9, image: 'https://picsum.photos/id/1036/300/300' },
  { id: 14, category: '热带水果', name: '红肉菠萝蜜', desc: '香甜可口，风味独特', price: 3.5, image: 'https://picsum.photos/id/1039/300/300' },
  { id: 15, category: '葡萄提子类', name: '阳光玫瑰', desc: '香甜多汁，粒粒饱满', price: 16.9, image: 'https://picsum.photos/id/1044/300/300' },
  { id: 16, category: '葡萄提子类', name: '无籽红提', desc: '脆甜爽口，无籽方便', price: 7.9, image: 'https://picsum.photos/id/292/300/300' },
  { id: 17, category: '葡萄提子类', name: '巨峰葡萄', desc: '酸甜适中，果肉饱满', price: 6.5, image: 'https://picsum.photos/id/312/300/300' },
  { id: 18, category: '小果/盒装', name: '蓝莓', desc: '护眼好物，酸甜可口', price: 9.9, image: 'https://picsum.photos/id/326/300/300' },
  { id: 19, category: '小果/盒装', name: '草莓', desc: '鲜甜多汁，红颜草莓', price: 12.9, image: 'https://picsum.photos/id/401/300/300' },
  { id: 20, category: '小果/盒装', name: '圣女果', desc: '酸甜可口，小巧便携', price: 4.5, image: 'https://picsum.photos/id/431/300/300' },
  { id: 21, category: '其他', name: '凤梨', desc: '香甜可口，果香浓郁', price: 5.5, image: 'https://picsum.photos/id/570/300/300' },
  { id: 22, category: '其他', name: '进口橙', desc: '鲜甜多汁，维C满满', price: 6.5, image: 'https://picsum.photos/id/580/300/300' },
  { id: 23, category: '其他', name: '牛油果', desc: '营养丰富，口感细腻', price: 6.9, image: 'https://picsum.photos/id/625/300/300' }
];

export const categories = [...new Set(fruitsData.map(f => f.category))];
