@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 阿里云容器镜像服务部署脚本 (Windows版)
REM 使用方法: deploy-aliyun.bat 1

set REGISTRY=crpi-8ucw6aeyy72a7z1p.cn-shanghai.personal.cr.aliyuncs.com
set NAMESPACE=easy-box
set IMAGE_NAME=box1
set VERSION=%~1
set TAG=v%VERSION%

set FULL_IMAGE=%REGISTRY%/%NAMESPACE%/%IMAGE_NAME%:%TAG%

echo === 阿里云镜像部署脚本 ===
echo 镜像地址: %FULL_IMAGE%
echo.

REM 登录阿里云镜像仓库
echo 检查登录状态...
docker login --username=黄河边上的dj之王 %REGISTRY% 2>nul
if errorlevel 1 (
    echo 请先登录阿里云镜像仓库：
    echo docker login --username=你的用户名 %REGISTRY%
    exit /b 1
)

REM 构建镜像
echo 构建 Docker 镜像...
docker build -t %FULL_IMAGE% .

REM 推送镜像
echo 推送镜像到阿里云...
docker push %FULL_IMAGE%

echo.
echo === 部署完成 ===
echo 镜像已推送到: %FULL_IMAGE%
echo.
echo 在服务器上运行：
echo docker pull %FULL_IMAGE%
echo docker run -d --name cool-box -p 3000:80 %FULL_IMAGE%
