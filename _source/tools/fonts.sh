#!/bin/zsh
# Télécharge les woff2 (subset latin) depuis Google Fonts
set -e
OUT=../../fonts
mkdir -p $OUT
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
get() { # family weight name
  css=$(curl -s -A "$UA" "https://fonts.googleapis.com/css2?family=$1:wght@$2&display=swap")
  url=$(echo "$css" | awk '/\/\* latin \*\//{f=1} f&&/src:/{print; exit}' | sed -E 's/.*url\(([^)]+)\).*/\1/')
  curl -s -o $OUT/$3.woff2 "$url"
  echo "$3 $(wc -c < $OUT/$3.woff2)"
}
get Montserrat 400 montserrat-400
get Montserrat 500 montserrat-500
get Montserrat 600 montserrat-600
get Montserrat 700 montserrat-700
get Lexend+Giga 600 lexend-giga-600
get Lexend+Giga 800 lexend-giga-800
get Caveat 600 caveat-600
