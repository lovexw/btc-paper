#!/bin/bash

# 比特币白皮书网站预览脚本

echo "=========================================="
echo "比特币白皮书 - 中文详解版"
echo "=========================================="
echo ""
echo "启动本地服务器..."
echo ""

# 检查是否有Python
if command -v python3 &> /dev/null; then
    echo "使用 Python HTTP 服务器"
    echo "访问地址: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "使用 Python HTTP 服务器"
    echo "访问地址: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "错误: 未找到 Python"
    echo "请安装 Python 或使用其他 Web 服务器"
    exit 1
fi
