#!/bin/bash

echo "🚀 准备推送更新到GitHub..."
echo

echo "📋 添加所有更改的文件..."
git add .

echo
echo "📝 请输入提交信息 (或按回车使用默认信息):"
read -p "提交信息: " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="更新博客功能：优化个人信息栏布局，修复Live2D重复加载问题"
fi

echo
echo "💾 提交更改: $commit_msg"
git commit -m "$commit_msg"

echo
echo "📤 推送到GitHub..."
git push origin main

echo
if [ $? -eq 0 ]; then
    echo "✅ 成功推送到GitHub！"
else
    echo "❌ 推送失败，请检查网络连接和GitHub权限"
fi
echo 