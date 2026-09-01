function freezeIds(value) {
  return Object.freeze(value.trim().split(/\s+/))
}

// This manifest contains identifiers only. Converter implementations are loaded by
// loadConverter after the released catalog has accepted a stable ID.
export const converterModuleIds = Object.freeze({
  text: freezeIds(`
    base64-encode base64-decode base32-encode base32-decode url-encode url-decode html-encode html-decode hex-encode hex-decode binary-encode binary-decode unicode-escape unicode-unescape rot13 morse-encode morse-decode html-to-text text-to-nato hash-identify atbash encoding-detect caesar-cipher hex-to-rgb-batch text-to-phonetic vigenere ascii-table text-dedupe text-sort-lines number-lines unicode-styled soundex word-wrap-smart nato-alphabet pig-latin readability-score text-diff-inline acronym-gen text-sentence-ops text-center markdown-toc text-extract-quotes text-summarize text-char-frequency text-find-replace lorem-words haiku-checker spongecase text-anagram-finder text-password-phrase word-cloud-text morse-advanced text-braille phonetic-alphabet text-reverse-cipher
  `),
  qr: freezeIds(`text-to-qr qr-to-text`),
  image: freezeIds(`image-to-base64 base64-to-image file-to-base64`),
  hash: freezeIds(`sha1 sha256 sha384 sha512 sha224 all-hashes`),
  crypto: freezeIds(`file-sha256 file-sha512 random-password random-hex random-base64 random-uuid-bulk text-hash-all checksum-all hash-compare hmac-gen xor-cipher crc32-calc adler32-calc`),
  data: freezeIds(`
    json-prettify json-minify json-escape json-unescape csv-to-json tsv-to-json json-to-tsv env-to-json json-to-markdown-table markdown-table-to-json ini-to-json json-to-ini ndjson-to-json json-to-ndjson properties-to-json json-to-properties json-merge csv-stats json-pick csv-transpose jsonl-to-json csv-sort json-group-by json-count tsv-csv-convert json-to-sql csv-to-html json-to-csv-advanced csv-filter data-url-converter yaml-to-env csv-stats-summary json-to-zod msgpack-preview graphql-schema json-to-prisma protobuf-gen markdown-to-json json-normalize avro-schema har-to-curl openapi-gen
  `),
  web: freezeIds(`
    text-diff xml-to-json regex-tester css-minify html-minify js-minify js-prettify url-parser cron-parser json-to-querystring querystring-to-json json-to-yaml yaml-to-json json-to-xml html-prettify css-prettify toml-to-json json-validate html-to-jsx json-to-toml svg-optimize css-vars-extract tailwind-to-css json-sort-keys htaccess-gen markdown-table-format word-frequency reading-time user-agent-parse json-to-csv csv-to-json-array markdown-link-extract html-entity-ref json-to-env endian-swap json-to-graphql unicode-lookup text-encoding-view json-to-python json-to-php json-to-typescript sql-format sql-minify json-path csv-to-html-table html-to-markdown base64url-encode base64url-decode backslash-escape backslash-unescape punycode-encode punycode-decode number-words markdown-to-html json-schema-validate epoch-batch semver-compare url-parse url-builder data-uri ipv6-expand ipv6-compress md-table-to-csv csv-to-md-table curl-builder curl-to-fetch text-dedup line-sort line-number xml-format xml-minify column-align text-wrap placeholder-image css-unit slug-gen case-detect json-diff css-gradient css-shadow dotenv-validate emoji-lookup text-to-emoji regex-escape regex-unescape timezone-convert unix-perm docker-run-gen gitignore-gen json-to-go json-to-rust md-link-check text-pad html-table-to-csv json-to-kotlin json-to-java json-schema-gen duration-format sql-insert-to-json text-reverse-words string-multiply anagram-check json-to-csharp json-to-swift bit-calculator css-specificity uuid-validate css-animation-gen openapi-summary har-parse matrix-ops text-normalize unit-prefix http-headers-parse semver-parse json-pointer color-contrast-ratio text-inflect yaml-to-toml json-to-table git-log-parse sql-to-json-schema markdown-escape ip-range json-to-form-data css-to-js-obj ts-type-gen mime-lookup open-graph-meta http-status-lookup cors-headers cookie-parser csp-generator nginx-location-gen fetch-to-axios webpack-import-gen dockerfile-gen api-mock-gen regex-to-code env-validator http-header-gen sql-schema-gen json-diff-compare github-actions-gen robots-txt-gen schema-org-gen docker-compose-gen package-json-gen git-commit-lint
  `),
  number: freezeIds(`
    dec-to-hex hex-to-dec dec-to-bin bin-to-dec dec-to-oct oct-to-dec dec-to-roman roman-to-dec number-base bytes-format scientific-notation fraction-decimal prime-check fibonacci gcd-lcm collatz integer-overflow number-sequence modular-arithmetic prime-factorization digit-ops fibonacci-gen ieee754 pascal-triangle binary-arithmetic statistics-calc roman-numeral-convert bitwise-ops matrix-2x2 unit-fraction quadratic-solver complex-number trig-calc log-calc prime-sieve mod-arith-advanced sequence-gen percentage-solver combinatorics number-properties base-arithmetic continued-fraction interest-calc number-curiosities
  `),
  color: freezeIds(`
    color-convert color-palette color-contrast color-blindness color-shades color-gradient oklch-convert color-mix css-custom-props color-temperature color-tints-shades color-harmonies color-lighten-darken color-random color-extract css-to-color-vars color-wcag-audit color-to-tailwind color-from-image color-css-variables color-mix-calculator color-luminance
  `),
  utility: freezeIds(`
    timestamp-to-date date-to-timestamp uuid-generate jwt-decode lorem-ipsum char-count case-convert reverse-text sort-lines dedupe-lines line-numbers shuffle-lines trim-lines remove-empty-lines wrap-lines extract-emails extract-urls extract-numbers slugify string-escape string-unescape number-format csv-to-markdown markdown-to-csv epoch-now list-to-json json-to-list ip-to-decimal decimal-to-ip markdown-preview epoch-convert placeholder-img css-units aspect-ratio docker-run-to-compose regex-replace base-convert jwt-create number-to-words date-diff text-frequency json-path-extract text-to-nato-table cidr-calc named-colors rot-n number-base-table lorem-sentences fake-data ip-info crontab-gen chmod-calc text-stats string-reverse nato-converter wcag-contrast json-flatten json-unflatten color-scheme unicode-inspector ascii-art typescript-gen http-status password-strength luhn-check num-stats morse-code css-clamp percentage-calc loan-calc bmi-calc password-entropy tls-cert-info xpath-tester color-mix-ratio timezone-list email-address-parse text-columns compound-interest isbn-validate age-calc tip-calc aspect-ratio-exact pace-calc ppi-calc levenshtein discount-calc grade-calc fuel-cost recipe-scale paint-calc mortgage-calc time-between loan-amortization calories-burned screen-size-calc water-intake wind-chill retirement-calc tax-bracket speed-distance-time ohms-law number-system-table body-fat-calc electricity-cost ideal-weight blood-pressure unit-price-compare inflation-calc heart-rate-zones running-pace savings-goal timezone-offset recipe-nutrition fuel-calc sleep-cycle dna-calc date-calculator event-countdown
  `),
  imageFormat: freezeIds(`
    png-to-jpg jpg-to-png png-to-webp jpg-to-webp webp-to-png webp-to-jpg bmp-to-png any-to-png any-to-jpg any-to-webp image-resize image-compress svg-to-png image-rotate image-flip-h image-flip-v image-grayscale image-invert image-crop-square image-sepia image-brightness image-contrast
  `),
  media: freezeIds(`
    video-to-audio video-to-wav audio-to-mp3 audio-to-wav audio-to-ogg video-to-mp4 video-to-webm video-to-gif audio-to-aac audio-to-flac video-to-audio-ogg audio-to-m4a video-trim audio-trim
  `),
  pdf: freezeIds(`
    images-to-pdf merge-pdf pdf-page-count pdf-split pdf-extract-range text-to-pdf pdf-metadata pdf-rotate
  `),
})

export const categories = Object.freeze([
  Object.freeze({ id: 'all', name: 'All' }),
  Object.freeze({ id: 'encode', name: 'Encode / Decode' }),
  Object.freeze({ id: 'hash', name: 'Hash' }),
  Object.freeze({ id: 'data', name: 'Data' }),
  Object.freeze({ id: 'web', name: 'Web' }),
  Object.freeze({ id: 'number', name: 'Number' }),
  Object.freeze({ id: 'color', name: 'Color' }),
  Object.freeze({ id: 'utility', name: 'Utility' }),
  Object.freeze({ id: 'image', name: 'Image' }),
  Object.freeze({ id: 'media', name: 'Media' }),
  Object.freeze({ id: 'document', name: 'Document' }),
])
