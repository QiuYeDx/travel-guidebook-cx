export const siteConfig = {
  name: "川西同行路书",
  shortName: "川西路书",
  description: "2026 中秋国庆川西大环线的路线讨论、行前准备与旅途中执行手册。",
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
