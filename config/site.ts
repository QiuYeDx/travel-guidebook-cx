export const siteConfig = {
  name: "川西同行路书",
  shortName: "川西路书",
  description: "2026 年 3 人驾驶蔚来 EC6，从深圳往返川西短环线的行前与行中执行手册。",
  author: {
    name: "QiuYeDx",
    url: "https://qiuvision.com",
  },
  links: {
    github: "https://github.com/QiuYeDx/travel-guidebook-cx",
  },
  navItems: [
    { label: "总览", href: "/" },
    { label: "行程", href: "/itinerary" },
    { label: "观景", href: "/scenic" },
    { label: "文档", href: "/guidebook" },
  ],
} as const;
