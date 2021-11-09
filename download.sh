
function download {
  URL_BASE=$1
  URL_PATH=$2

  OUTPUT_PATH="./html/${URL_PATH}"

  if [ ! -f "$OUTPUT_PATH" ]; then
    OUTPUT_DIR=$(dirname "$OUTPUT_PATH")
    mkdir -p $OUTPUT_DIR
    pushd $OUTPUT_DIR
      echo "DOWNLOAD: ${URL_BASE}/${URL_PATH}"
      URL="${URL_BASE}/${URL_PATH}"
      ESCAPED_URL=$( echo "$URL" | sed 's/ /%20/g' )
      curl -LO "$ESCAPED_URL"
    popd
  fi
}

download "https://www.bolagsplatsen.se" "fonts/icomoon.ttf"
download "https://www.bolagsplatsen.se" "fonts/icomoon.woff"
download "https://www.bolagsplatsen.se" "js/vendor/chosen/chosen-sprite.png"
download "https://www.bolagsplatsen.se" "images/bolagsplatsense_logo.png"
download "https://www.bolagsplatsen.se" "images/header_logo_sfr_dark.png"
download "https://www.bolagsplatsen.se" "images/header_logo_dbt_dark.png"