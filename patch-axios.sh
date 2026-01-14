#!/bin/bash

echo "=== BSKM Axios Auto-Patch ==="

# Folder sumber: resources/js
TARGET_DIR="resources/js"

# 1. Ganti import axios → api instance
echo "> Mengganti 'import axios from ...' menjadi 'import api ...'"
grep -rl "import axios from" $TARGET_DIR | while read -r file ; do
  sed -i 's|import axios from "axios"|import api from "@/utils/axios"|g' "$file"
  sed -i "s|import axios from 'axios'|import api from '@/utils/axios'|g" "$file"
done

# 2. Ganti semua pemanggilan axios → api
echo "> Mengganti pemanggilan axios.* menjadi api.*"
grep -rl "axios." $TARGET_DIR | while read -r file ; do
  sed -i 's|axios\.get|api.get|g' "$file"
  sed -i 's|axios\.post|api.post|g' "$file"
  sed -i 's|axios\.put|api.put|g' "$file"
  sed -i 's|axios\.patch|api.patch|g' "$file"
  sed -i 's|axios\.delete|api.delete|g' "$file"
done

echo "=== PATCH SELESAI ==="
echo "Semua axios telah diganti menjadi api instance!"
