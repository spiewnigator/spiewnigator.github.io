mkdir -p docs
ng build
(cd docs ; rm -rf assets *.html *.js *.json *.css *.ico *.webmanifest)
cp -r dist/spiewnigator-angular/* docs
cp docs/index.html docs/404.html
