# Flutter 音乐播放器设计文档

## 项目概述

开发一个好看流畅的 Flutter 音乐播放器，支持移动端和 PC 端，扫描播放本地音频文件，提供完整的播放控制、歌词显示、后台播放等功能。

## 核心功能

1. **音频扫描与播放**
   - 扫描手机本地 MP3、AAC、FLAC、WAV、OGG、WMA 等格式音频文件
   - 支持用户自定义扫描目录（通过文件夹选择器，默认扫描 Music 目录）
   - 缓存扫描结果到本地数据库（使用 sqflite 存储歌曲元数据）

2. **播放控制**
   - 播放/暂停、上一曲、下一曲
   - 播放模式：单曲循环、列表循环、随机播放
   - 播放进度条：支持拖动调整，显示总时长和当前时长

3. **音乐列表**
   - 展示歌曲名、歌手、时长
   - 点击列表歌曲切换播放
   - 支持搜索功能

4. **后台播放**
   - 切到后台继续播放
   - 状态栏播放控制（完整控制：播放/暂停、上一曲、下一曲、进度条、收藏、播放模式）

5. **歌词显示**
   - 支持 LRC 格式歌词文件
   - 逐行同步滚动显示
   - 自动匹配同名歌词文件

6. **动画效果**
   - 封面旋转动画（播放时旋转，暂停时停止）
   - 页面切换动画（共享元素过渡）
   - 按钮点击波纹效果
   - 进度条拖动动画

## 技术方案

### 技术栈

- **音频播放**: just_audio（功能强大，支持多种格式，跨平台）
- **后台播放**: audio_service（支持通知栏控制，跨平台）
- **音频扫描**: on_audio_query（本地音乐扫描）+ file_picker（PC端文件选择）
- **状态管理**: Provider
- **权限管理**: permission_handler（移动端）+ 无权限要求（PC端）
- **UI框架**: Material Design 3（响应式布局）

### 平台支持

- **移动端**: Android、iOS
- **PC端**: Windows、macOS、Linux（使用 Flutter 桌面支持）

### 目录结构

```
lib/
├── models/
│   ├── song.dart
│   ├── playlist.dart
│   └── lyrics.dart
├── providers/
│   ├── audio_player_provider.dart
│   ├── playlist_provider.dart
│   └── theme_provider.dart
├── screens/
│   ├── home/
│   │   ├── home_screen.dart
│   │   └── widgets/
│   └── player/
│       ├── player_screen.dart
│       └── widgets/
├── services/
│   ├── audio_service.dart
│   ├── scan_service.dart
│   ├── lyrics_service.dart
│   ├── platform_service.dart  # 平台检测和适配
│   └── playlist_service.dart  # 播放列表管理
├── widgets/
│   ├── custom_button.dart
│   ├── progress_bar.dart
│   ├── song_list_item.dart
│   ├── lyrics_widget.dart
│   └── responsive_layout.dart  # 响应式布局
└── utils/
    ├── time_formatter.dart
    ├── file_helper.dart
    ├── constants.dart
    ├── permission_helper.dart
    └── platform_utils.dart  # 平台工具类
```

## 核心功能实现

### 1. 音频扫描服务 (scan_service.dart)

- 使用 on_audio_query 库扫描本地音频（移动端）
- 使用 file_picker 选择音频文件（PC端）
- PC端支持拖拽音频文件到窗口直接播放
- 支持自定义扫描目录
- 缓存扫描结果到本地数据库
- 支持 MP3/AAC/FLAC/WAV/OGG/WMA 等格式
- PC端集成 FFmpeg 作为后备方案，确保格式兼容性

### 2. 音频播放服务 (audio_service.dart)

- 基于 just_audio 实现播放控制
- 集成 audio_service 实现后台播放
- 支持播放模式：单曲循环、列表循环、随机播放
- 进度监听和状态同步
- 统一异常处理：扫描失败、文件不存在、播放错误、权限拒绝

### 3. 歌词服务 (lyrics_service.dart)

- 解析 LRC 格式歌词文件
- 支持逐行同步滚动
- 自动匹配同名歌词文件

### 4. 平台适配服务 (platform_service.dart)

- 检测当前运行平台（移动端/PC端）
- 根据平台选择不同的文件扫描方式
- 适配不同的权限申请流程
- 处理平台特定的UI差异

### 5. 播放列表管理 (playlist_service.dart)

- 创建、编辑、删除播放列表
- 播放列表持久化存储（sqflite）
- 移动端和PC端统一实现
- 支持播放列表导入/导出

## UI 设计

### 主题系统

- Material Design 3
- 支持深色/浅色模式切换
- 动态主题色（使用 palette_generator 实时提取封面主色调，缓存到本地避免重复计算）

### 响应式布局

- **移动端**: 单列布局，底部导航栏
- **PC端**: 侧边栏 + 主内容区布局，支持窗口缩放
- 使用 MediaQuery 和 LayoutBuilder 检测屏幕尺寸
- 断点：600px（移动端/PC端分界）
- PC端窗口约束：最小宽度 800px，最小高度 600px
- 大屏显示优化：列表项高度适配，控件大小自适应

### 主页设计

- **移动端**:
  - 顶部：搜索栏 + 主题切换按钮
  - 中部：音乐列表（歌曲名、歌手、时长）
  - 底部：迷你播放栏（封面缩略图、歌曲名、播放/暂停）

- **PC端**:
  - 左侧：侧边栏（播放列表、设置）
  - 右侧：音乐列表（歌曲名、歌手、时长）
  - 底部：迷你播放栏（封面缩略图、歌曲名、播放/暂停）

### 播放页设计

- 沉浸式动态背景（根据封面主色调渐变）
- 大尺寸专辑封面（带旋转动画）
- 歌曲信息（歌名、歌手）
- 歌词显示区域（同步滚动）
- 播放进度条（可拖动）
- 播放控制按钮（上一曲、播放/暂停、下一曲）
- 播放模式、收藏、播放列表按钮

### 动画效果

- 封面旋转动画（播放时旋转，暂停时停止）
- 页面切换动画（共享元素过渡）
- 按钮点击波纹效果
- 进度条拖动动画

## 权限和平台配置

### Android 配置

AndroidManifest.xml 添加权限：
```xml
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

配置 audio_service 前台服务。

### iOS 配置

Info.plist 添加：
```xml
<key>NSAppleMusicUsageDescription</key>
<string>此应用需要访问您的音乐库以播放本地音乐</string>
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

配置后台音频会话。

### PC端配置

- Windows: 无需特殊权限配置
- macOS: 需要在 Info.plist 中添加音频权限描述
- Linux: 无需特殊权限配置
- 系统托盘功能：
  - 托盘菜单：打开播放器窗口、播放列表切换、退出
  - 托盘图标显示当前歌曲名或封面小图标
  - 支持托盘图标点击显示/隐藏窗口

### 权限申请

- **移动端**: 使用 permission_handler 统一管理，首次启动时申请存储权限，运行时动态申请
- **PC端**: 无需权限申请，直接访问文件系统

### 异常处理

- 统一异常处理机制：
  - 扫描失败：提示用户检查文件路径和权限
  - 文件不存在：提示用户文件可能已移动或删除
  - 播放错误：提示用户文件可能已损坏或格式不支持
  - 权限拒绝：引导用户到设置页面开启权限
  - PC端拖拽非法文件：提示用户文件格式不支持

## 依赖配置

### pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  just_audio: ^0.9.36
  audio_service: ^0.18.12
  on_audio_query: ^2.9.0
  permission_handler: ^11.3.0
  provider: ^6.1.2
  path_provider: ^2.1.2
  sqflite: ^2.3.3
  palette_generator: ^0.3.3+4
  file_picker: ^6.1.1  # PC端文件选择
  window_manager: ^0.3.7  # PC端窗口管理
  system_tray: ^2.0.3  # PC端系统托盘
  ffmpeg_kit_flutter: ^6.0.3  # FFmpeg支持，确保格式兼容性
```

## 运行教程

### 环境要求

- Flutter SDK: 3.19.0 或更高版本
- Dart SDK: 3.3.0 或更高版本
- Android Studio / VS Code
- Android SDK / Xcode（移动端）
- Visual Studio 2022（Windows 桌面开发）
- Xcode 14+（macOS 桌面开发）

### 安装步骤

#### 移动端

1. 克隆项目
2. 运行 `flutter pub get` 安装依赖
3. 配置 Android 和 iOS 权限
4. 运行 `flutter run` 启动应用

#### PC端

1. 克隆项目
2. 运行 `flutter pub get` 安装依赖
3. 运行 `flutter run -d windows`（Windows）
4. 运行 `flutter run -d macos`（macOS）
5. 运行 `flutter run -d linux`（Linux）

### 注意事项

- Android 13+ 需要申请 READ_MEDIA_AUDIO 权限
- iOS 需要在 Info.plist 中配置后台音频模式
- 首次启动需要授予存储权限（移动端）
- PC端无需权限申请，直接运行

## 设计决策

1. **选择 just_audio 而非 audioplayers**: just_audio 功能更强大，支持更多音频格式，后台播放更稳定，且跨平台支持良好
2. **选择 Provider 而非 GetX/Riverpod**: Provider 简单易用，适合中小型项目，学习曲线平缓
3. **选择 on_audio_query + file_picker**: on_audio_query 专门用于扫描本地音频文件（移动端），file_picker 用于 PC 端文件选择
4. **沉浸式动态背景**: 使用 palette_generator 提取封面主色调，创建渐变背景效果
5. **歌词同步滚动**: 使用 CustomScrollView 和 AnimationController 实现平滑滚动
6. **响应式布局**: 使用 MediaQuery 和 LayoutBuilder 实现移动端和 PC 端自适应布局
7. **平台适配**: 通过 platform_service 检测平台，选择不同的文件扫描和权限申请方式
