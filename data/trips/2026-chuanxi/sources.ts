import type { SourceRef } from "../../../lib/trip/types";

export const sourceIds = {
  holiday2026: "SRC-HOLIDAY-2026",
  nioPowerJourney: "SRC-NIO-POWER-JOURNEY",
  abaTourismPlan2026: "SRC-ABA-TOURISM-PLAN-2026",
  bipenggou2026: "SRC-BIPENGGOU-2026",
  daguOfficial: "SRC-DAGU-OFFICIAL",
  sichuanTrafficSafety: "SRC-SICHUAN-TRAFFIC-SAFETY",
  sichuanYalaViews: "SRC-SICHUAN-YALA-VIEWS",
} as const;

export const chuanxiSources = [
  {
    id: sourceIds.holiday2026,
    title: "国务院办公厅关于 2026 年部分节假日安排的通知",
    url: "https://www.gov.cn/gongbao/2025/issue_12406/202511/content_7048922.html",
    publisher: "中国政府网",
    freshness: "stable",
    verifiedAt: "2026-08-31",
  },
  {
    id: sourceIds.nioPowerJourney,
    title: "蔚来 Power Journey：川西大环线",
    url: "https://app.nio.com/arouse/public/page/9eea05047ef1ac709b1827d6e59f9926?pageSource=https%3A%2F%2Fapp.nio.com%2Fpe%2Fh5pages-nio%2Fmodule_10094%2Fjourney%2Froute%2Fdetail%3Fwv%3Dlg%26is_nav_show%3Dfalse%26id%3DCT2_AYWqqVHs9ppn6gQWH_A0&resourceType=power-journey&wv=lg",
    publisher: "蔚来",
    freshness: "seasonal",
    verifiedAt: "2026-08-31",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.abaTourismPlan2026,
    title: "阿坝州文化和旅游发展规划（含毕棚沟、达古冰川与奶子沟）",
    url: "https://abazhou.gov.cn/abazhou/fzghg/202605/601053db2c6543dd8b4798b052285401.shtml",
    publisher: "阿坝藏族羌族自治州人民政府",
    freshness: "stable",
    verifiedAt: "2026-08-31",
  },
  {
    id: sourceIds.bipenggou2026,
    title: "理县毕棚沟 2026 年景区服务与游览信息",
    url: "https://abazhou.gov.cn/abazhou/c101955/202607/251a4ae179d846569fcab2dd067c5902.shtml",
    publisher: "阿坝藏族羌族自治州人民政府",
    freshness: "seasonal",
    verifiedAt: "2026-08-31",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.daguOfficial,
    title: "达古冰川景区官方网站",
    url: "https://dgbc.cn/",
    publisher: "达古冰川风景名胜区管理局",
    freshness: "seasonal",
    verifiedAt: "2026-08-31",
    reviewAt: "2026-09-20",
  },
  {
    id: sourceIds.sichuanTrafficSafety,
    title: "四川公安交警假期交通安全提示",
    url: "https://gat.sc.gov.cn/scgat/c103388/2024/9/14/989b5a1dc4cf4acd934c96999bb23ee0.shtml",
    publisher: "四川省公安厅",
    freshness: "seasonal",
    verifiedAt: "2026-08-31",
    reviewAt: "2026-09-24",
  },
  {
    id: sourceIds.sichuanYalaViews,
    title: "塔公至新都桥方向的雅拉雪山观景关系",
    url: "https://sichuan.scol.com.cn/ggxw/202507/83086779.html",
    publisher: "四川在线",
    freshness: "stable",
    verifiedAt: "2026-08-31",
  },
] satisfies SourceRef[];
