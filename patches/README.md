# Lokale Paketkorrekturen

## qr-code-styling 1.9.2

`qr-code-styling@1.9.2.patch` korrigiert die private, eingebettete QR-Bytefunktion. Die ursprüngliche Funktion reduziert jedes UTF-16-Codeelement auf acht Bits und verändert dadurch Umlaute, asiatische Schriftzeichen und Emojis. Die Korrektur verwendet `TextEncoder` für UTF-8.

Bun wendet den Patch über `patchedDependencies` aus `package.json` und `bun.lock` an, auch bei `bun install --frozen-lockfile`. Die direkte Kapazitätsanalyse in `qrModel.js` verwendet denselben Encoder. Ein globales Umschalten der separaten `qrcode-generator`-Abhängigkeit würde die eingebettete Kopie nicht korrigieren.

Die Änderung betrifft ausschliesslich die Bytekodierung. Die ursprüngliche MIT-Lizenz bleibt erhalten. Die Browserregression liest PNG sowie gerastertes SVG mit dem unabhängigen Decoder `jsQR` und prüft die exakte Rückgabe von `Grüsse für Jörg`, `漢字 😀` und gemischtem Text.

Bei einem Versionswechsel muss der Patch erneut geprüft werden. Er darf erst entfallen, wenn diese Regressionen gegen den unveränderten Nachfolger bestehen.
