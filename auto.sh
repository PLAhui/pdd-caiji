
###
 # @Author: your name
 # @Date: 2022-02-25 21:16:31
 # @LastEditTime: 2022-03-08 00:47:48
 # @LastEditors: your name
 # @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 # @FilePath: /undefined/Users/huiziqin/project/my_project/wxapp_20220218/jeecg-boot/auto.sh
###

echo '------------开始编译....------------'
echo 'Hui19961229.'
ssh root@8.140.130.92 "[ -d /www/wwwroot/pdd.yusouu.com ] && echo ok || mkdir -p /www/wwwroot/pdd.yusouu.com"
scp ./build/极简电商采集器 Setup 1.1.0.exe root@8.140.130.92:/www/wwwroot/pdd.yusouu.com/极简电商采集器 Setup 1.1.0.exe
scp ./build/latest.yml root@8.140.130.92:/www/wwwroot/pdd.yusouu.com/latest.yml


