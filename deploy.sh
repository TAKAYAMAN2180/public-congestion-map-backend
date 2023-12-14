#!/bin/bash

# TypeScriptの型チェックを行う
tsc --noEmit

arg1=${1:-"dev"}

echo "Deploying to $arg1 stage..."

# $? は直前のコマンドの終了ステータスを取得する変数です。
# 0は成功を意味し、それ以外はエラーを意味します。
if [ $? -eq 0 ]; then
    # 型チェックが成功したらsls deployを実行
    sls deploy --stage $arg1
else
    # エラーメッセージを表示
    echo "TypeScript type checking failed. Deployment was not performed."
fi
