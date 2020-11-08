---
layout: post
title: "cgproxy配合qv2ray实现全局透明代理"
categories: [cgroups, v2ray, Qv2ray, Linux]
---

# Qv2ray

之前在 macOS 下用的是 ClashX 连的机场，但是 Linux 没这东西，而且我希望多个平台都能用同一套工具，
包含我的 Windows。于是有朋友给我推荐了[Qv2ray](https://qv2ray.net/)。

它是基于 Qt 的跨平台的工具，基于 v2ray，虽然名字叫 Qv2ray，但是它能够通过
[各种插件](https://qv2ray.net/plugins/)，支持「已经被淘汰的」SS 加密算法、SSR 订阅、Trojan 等等。
由于我用的中转机场恰巧就用了某种「臭名昭著」的加密算法，所以我需要 SS 插件了；
而我通过 SSR 订阅的方式获得节点，所以我也需要 SSR 插件。目前我就只需要这两个。

因为协议的关系，Qv2ray 不自带 v2ray，所以两个需要独立安装，并在 Qv2ray 里指定 v2ray 的路径。

从 ArchLinux 和 ArchLinuxCN 的库中，安装二者

```bash
sudo pacman -S v2ray
sudo pacman -S qv2ray
```

具体配置可以参考 Qv2ray 的官网 <https://qv2ray.net/>。

# cgproxy

[cgproxy](https://github.com/springzfx/cgproxy)通过劫持系统所有的网络流量，
根据配置文件，让某些程序的网络流量直连，剩下的流量送入某一端口。
然后我们可以让 Qv2ray 监听这个端口，将这些流量送入高级路由设置，根据规则选择直连或走代理，
从而实现全局透明代理。

在 ArchLinux 上，可以直接通过 ArchLinuxCN 的仓库下载大佬们打包好的 cgproxy

```bash
sudo pacman -S cgproxy-git
```

然后编辑 cgproxy 的配置文件`/etc/cgproxy/config.json`，下面是我的配置文件

```json
{
    "comment": "For usage, see https://github.com/springzfx/cgproxy",

    "port": 12345, // 这个端口是qv2ray透明代理设置监听的端口
    "program_noproxy": ["v2ray", "qv2ray"], // 注意这里不能写路径，只写程序名
    "program_proxy": [],
    "cgroup_noproxy": ["/system.slice/v2ray.service"],
    "cgroup_proxy": ["/"], // 注意这里需要添加 "/" 否则全局流量仍旧为直连
    "enable_gateway": false,
    "enable_dns": true,
    "enable_udp": true,
    "enable_tcp": true,
    "enable_ipv4": true,
    "enable_ipv6": true,
    "table": 10007,
    "fwmark": 39283
}
```

因为我开启了 udp 代理，所以需要给`v2ray`一些特殊权限

```bash
sudo setcap "cap_net_admin,cap_net_bind_service=ep" $(which v2ray)
```

（这个权限在 v2ray 更新时会失效，所以每次更新要重新跑一次。为了避免忘记或者嫌麻烦，
可以从 AUR 安装`v2ray-cap-git`这个包，就不用每次都跑一遍上面这个命令了。
为了确保第一次有效，还是至少跑一次吧。）

然后开启 systemd service 并立即启动

```bash
sudo systemctl enable --now cgproxy.service
```

然后在 Qv2ray 里的透明代理设置中，确定端口是否设置为上面配置文件中的端口，
以及 TCP 和 UDP 流量是否与配置文件中的开关设置一致。

完成这些步骤之后，应该就 ok 了，程序的所有流量自动走 Qv2ray，按其中的规则走直连还是代理，
即全局透明代理。

还有一些其他更详细的配置，可以参考网友整理的教程<https://zhangjk98.xyz/qv2ray-transparent-proxy>。

# 参考资料

-   <https://qv2ray.net/>
-   <https://qv2ray.net/plugins>
-   <https://github.com/springzfx/cgproxy>
-   <https://zhangjk98.xyz/qv2ray-transparent-proxy>
