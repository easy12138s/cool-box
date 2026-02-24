#!/bin/bash

# Cool Box 部署脚本
# 适用于 Ubuntu/CentOS 服务器

set -e

echo "=== Cool Box 部署脚本 ==="

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo "请使用 sudo 运行此脚本"
  exit 1
fi

# 安装 Docker（如果未安装）
if ! command -v docker &> /dev/null; then
  echo "安装 Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# 安装 Docker Compose（如果未安装）
if ! command -v docker-compose &> /dev/null; then
  echo "安装 Docker Compose..."
  curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# 获取当前目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 构建并启动
echo "构建 Docker 镜像..."
docker-compose build

echo "启动容器..."
docker-compose up -d

echo "=== 部署完成 ==="
echo "访问 http://你的服务器IP:3000"
echo ""
echo "常用命令："
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
