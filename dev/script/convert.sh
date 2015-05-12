echo 'convert start'
cd `dirname $0`
cd ../
coffee -c -o output coffee/yogurt.coffee
cat output/lib.js output/yogurt.js > output/yogurt.jsx
