import type { SourceRef } from "../../../lib/trip/types";

export const sourceIds = {
  holiday2026: "SRC-HOLIDAY-2026",
  yadingPolicy2026: "SRC-YADING-POLICY-2026",
  siguniangOfficial: "SRC-SIGUNIANG-OFFICIAL",
  siguniangGeopark: "SRC-SIGUNIANG-GEOPARK",
  ganziXinduqiaoDaocheng: "SRC-GANZI-XINDUQIAO-DAOCHENG",
  ganziLitangDaocheng: "SRC-GANZI-LITANG-DAOCHENG",
  sichuanYalaViews: "SRC-SICHUAN-YALA-VIEWS",
} as const;

export const chuanxiSources = [
  {
    id: sourceIds.holiday2026,
    title: "国务院办公厅关于 2026 年部分节假日安排的通知",
    url: "https://www.gov.cn/gongbao/2025/issue_12406/202511/content_7048922.html",
    publisher: "中国政府网",
    freshness: "stable",
    verifiedAt: "2026-08-25",
  },
  {
    id: sourceIds.yadingPolicy2026,
    title: "稻城亚丁 8 月起实施惠民政策",
    url: "https://www.daocheng.gov.cn/fmxw/article/726022",
    publisher: "稻城县人民政府",
    freshness: "seasonal",
    verifiedAt: "2026-08-25",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.siguniangOfficial,
    title: "四姑娘山景区官方网站",
    url: "https://www.sgns.cn/",
    publisher: "四姑娘山景区",
    freshness: "seasonal",
    verifiedAt: "2026-08-25",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.siguniangGeopark,
    title: "双桥沟游览方式说明",
    url: "https://www.sgnsgeopark.cn/guideline/methods",
    publisher: "四姑娘山地质公园",
    freshness: "seasonal",
    verifiedAt: "2026-08-25",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.ganziXinduqiaoDaocheng,
    title: "新都桥至稻城沿线景观节点",
    url: "https://www.ganzitv.com/cms/a/165991588/content",
    publisher: "圣洁甘孜",
    freshness: "stable",
    verifiedAt: "2026-08-25",
  },
  {
    id: sourceIds.ganziLitangDaocheng,
    title: "理塘至稻城道路与兔儿山观景平台提升信息",
    url: "https://www.ganzitv.com/cms/a/181826975/content",
    publisher: "圣洁甘孜",
    freshness: "stable",
    verifiedAt: "2026-08-25",
  },
  {
    id: sourceIds.sichuanYalaViews,
    title: "塔公至新都桥等方向的雅拉雪山观景关系",
    url: "https://sichuan.scol.com.cn/ggxw/202507/83086779.html",
    publisher: "四川新闻",
    freshness: "stable",
    verifiedAt: "2026-08-25",
  },
] satisfies SourceRef[];
