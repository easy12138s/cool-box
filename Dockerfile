# 精简版 Dockerfile - 只使用 Nginx
# 适合本地构建后推送 dist 目录的场景

FROM nginx:alpine

# 复制构建产物
COPY dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
