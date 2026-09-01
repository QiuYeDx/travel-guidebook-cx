import type { SourceRef } from "../../../lib/trip/types";

export const sourceIds = {
  referenceGuide: "SRC-REFERENCE-GUIDE-V2",
  holiday2026: "SRC-HOLIDAY-2026",
  highwayFree2026: "SRC-HIGHWAY-FREE-2026",
  yadingFree2026: "SRC-YADING-FREE-2026",
  yadingService2026: "SRC-YADING-SERVICE-2026",
  sichuanTrafficSafety: "SRC-SICHUAN-TRAFFIC-SAFETY",
  sichuanYalaViews: "SRC-SICHUAN-YALA-VIEWS",
} as const;

export const chuanxiSources = [
  {
    id: sourceIds.referenceGuide,
    title: "川西大环线 · 7 天定稿 v2 参考攻略",
    url: "https://4kytg1s6e676a.aiforce.cloud/app/app_17d99u5hxh3",
    publisher: "AIForce 页面（豆包 AI 生成）",
    freshness: "seasonal",
    verifiedAt: "2026-09-02",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.holiday2026,
    title: "国务院办公厅关于 2026 年部分节假日安排的通知",
    url: "https://www.beijing.gov.cn/cs/gncs/zcwj/202603/t20260327_4568275.html",
    publisher: "国务院办公厅",
    freshness: "stable",
    verifiedAt: "2026-09-02",
  },
  {
    id: sourceIds.highwayFree2026,
    title: "2026 年重大节假日小型客车高速免费时段",
    url: "https://www.beijing.gov.cn/ywdt/gzdt/202511/t20251107_4265508.html",
    publisher: "北京市人民政府门户网站",
    freshness: "stable",
    verifiedAt: "2026-09-02",
  },
  {
    id: sourceIds.yadingFree2026,
    title: "稻城亚丁 2026 年 8 月起限时免票惠民政策",
    url: "https://www.daocheng.gov.cn/fmxw/article/726022",
    publisher: "稻城县人民政府",
    freshness: "live",
    verifiedAt: "2026-09-02",
    reviewAt: "2026-09-22",
  },
  {
    id: sourceIds.yadingService2026,
    title: "稻城亚丁 2026 年旺季预约与服务保障",
    url: "https://www.daocheng.gov.cn/dcyw/article/727365",
    publisher: "稻城县人民政府",
    freshness: "live",
    verifiedAt: "2026-09-02",
    reviewAt: "2026-09-22",
  },
  {
    id: sourceIds.sichuanTrafficSafety,
    title: "四川公安交警假期交通安全提示",
    url: "https://gat.sc.gov.cn/scgat/c103388/2024/9/14/989b5a1dc4cf4acd934c96999bb23ee0.shtml",
    publisher: "四川省公安厅",
    freshness: "seasonal",
    verifiedAt: "2026-09-02",
    reviewAt: "2026-09-26",
  },
  {
    id: sourceIds.sichuanYalaViews,
    title: "塔公至新都桥方向的雅拉雪山观景关系",
    url: "https://sichuan.scol.com.cn/ggxw/202507/83086779.html",
    publisher: "四川在线",
    freshness: "stable",
    verifiedAt: "2026-09-02",
  },
] satisfies SourceRef[];
