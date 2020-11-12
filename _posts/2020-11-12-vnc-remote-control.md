---
layout: post
title: "通过tigervnc实现远程桌面控制"
categories: [tigervnc, ssh, Linux]
---

# 远程控制远端 Ubuntu 20.04 物理图形界面

teamviewer 实在是太挫了，非常不稳定，经常莫名其妙就断了，而且很卡。为了提高远程控制的体验，我找到了 tigervnc，通过它可以实现跨平台的基于 ssh 的远程桌面控制。

## 在远端 Ubuntu 20.04 桌面搭建 vncserver

先安装 tigervnc：

```bash
sudo apt-get install tigervnc-scraping-server
```

然后创建保存用户级 vnc 配置的目录：

```bash
mkdir -p ~/.vnc
```

设置 vnc 的访问密码（一般直接设置为用户的密码）：

```bash
$ vncpasswd
Password:
Verify:
Would you like to enter a view-only password (y/n)? n
```

上面这条命令会创建一个路径为`~/.vnc/passwd`的文件。

然后我们可以尝试直接启动 vncserver：

```bash
$ x0vncserver -rfbauth ~/.vnc/passwd -localhost -display :0 &
...
...
Main: Listening on port 5900
```

看到这一行，并且没出现错误，就表示已经在当前电脑成功开启了 vncserver 会话。

值得说明的是其中的`-localhost`参数和`-display :0`参数：

1. `-localhost`参数貌似是出于安全考虑，但我也不清楚里面的具体细节。总之有了这个参数之后，我们在下面需要先通过 ssh，把本地端口映射到 vncserver 的会话端口，然后让 vncviewer 访问本地的那个端口才能够实现 vnc 远程控制。
2. `-display :0`参数指的是在本地的`:0`显示端口开启 vnc 会话。而`:0`表示第一个开启的显示会话（xsession），这指的就是远端 Ubuntu 物理显示器显示的那个会话。因为我们需要直接控制远端 Ubuntu 的图形界面，所以需要连接的就是这个会话。如果这个数字设置成比如`:1`则意味着开启一个虚拟 vnc 会话，虚拟 vnc 会话跑不了 OpenGL 程序，需要配合 virtualgl 才能够跑 OpenGL 程序。

这个命令是直接启动的，我们希望开机就打开 vncserver。然而 vncserver 的开启要求在一个已经登陆的用户下，所以我们需要打开用户的自动登录，这个在 Ubuntu 的系统设置下就可以完成。

然后我们希望一进入 xsession 就打开 vncserver，这个更简单，只需要在`~/.xprofile`文件里把上面那条命令即可。

```bash
$ cat ~/.xprofile
x0vncserver -rfbauth ~/.vnc/passwd -localhost -display :0 &
```

至此，服务端就配置好了。

# 从客户端连接到远端 vncserver

上面说过了，我们需要在客户端本地，通过 ssh 连接到远端服务器，并且把本地的一个端口，映射到远端 Ubuntu 服务器的对应端口。然后通过 vnc 客户端，连接本地这个端口，即可控制远程桌面。

远端服务器在 display`:0`建立了 vncserver 会话实例，这对应于远端服务器的`5900+0`端口，于是

```bash
ssh 12.345.678.90 -L 9900:localhost:5900
```

即把本地电脑的`9900`端口映射到远端服务器的`localhost:5900`上。

## 从 Arch Linux 连接

在 Arch Linux 上，可以通过`gtk-vnc`来作为 GUI 客户端连接 vnc 会话：

```bash
sudo pacman -S gtk-vnc
```

安装好之后，通过命令打开客户端：

```bash
vncviewer
```

在弹窗里输入`localhost:9900`，并输入 vnc 密码即可。

也可以直接在命令行里指定地址：

```bash
vncviewer localhost:9900
```

## 从 macOS 连接

在 macOS 下，可以用`brew cask`安装 tigervnc 的客户端：

```bash
brew cask install tigervnc-viewer
```

然后同样地，打开客户端，输入`localhost:9900`，并输入 vnc 密码即可。

## 从 Windows 连接

Windows 我没试过，但是具体操作应该是差不多的。

# 参考资料

1. <https://wiki.archlinux.org/index.php/TigerVNC>
2. <https://www.howtoforge.com/tutorial/how-to-start-a-vnc-server-for-the-actual-display-scraping-with-tigervnc>
3. <https://superuser.com/questions/715604/vncserver-localhost-and-ssh-tunneling>
