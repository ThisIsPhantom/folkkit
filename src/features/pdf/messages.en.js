export default {

  "resize": "Resize {corner}",
  "corner": {
    "nw": "top left",
    "ne": "top right",
    "sw": "bottom left",
    "se": "bottom right"
  },
  "properties": "Properties",
  "allPages": "Select all",
  "clearPages": "Clear selection",
  "selectedPages": "{count} selected",
  "selectPage": "Select page {number}",
  "viewing": "Viewing",
  "pageSelectionHint": "Tick pages for a joint action. Drag selected pages to reorder them.",
  "rotateSelected": "Rotate selected pages",
  "deleteSelected": "Delete selected pages",
  "extractSelected": "Download selected pages",
  "actions": {
    "edit": {
      "title": "Edit PDF",
      "before": "Choose a PDF to edit text, images and pages.",
      "after": "Drag supported objects or resize them with the corner handles. Double-click text to edit it."
    },
    "merge": {
      "title": "Merge PDFs",
      "before": "Choose the first PDF. Then append further PDFs in the desired order.",
      "after": "Use “Append another PDF” for each additional file. Download the merged PDF when ready."
    },
    "extract": {
      "title": "Extract PDF pages",
      "before": "Choose a PDF, then tick the pages you want to download.",
      "after": "Tick one or more pages, including separate pages. The download follows the document order."
    },
    "rotate": {
      "title": "Rotate PDF pages",
      "before": "Choose a PDF, then select the pages to rotate.",
      "after": "Tick the pages to rotate. Each action turns all selected pages 90 degrees clockwise."
    },
    "count": {
      "title": "Count PDF pages",
      "before": "Choose a PDF to see its page count.",
      "after": "This PDF contains {count} pages."
    },
    "organize": {
      "title": "Organize PDF pages",
      "before": "Choose a PDF to select, reorder or remove pages.",
      "after": "Tick pages for joint actions. Drag them into order or use the move buttons."
    }
  }
,
  recover: 'Restore the last editing state',
  title: 'Edit PDF', intro: 'Change text, arrange pages and add content.',
  choose: 'Choose PDF', drop: 'Drop a PDF here', limits: 'Up to 32 MiB and 200 pages. Your file stays in this browser.',
  working: 'Processing PDF …', cancel: 'Cancel', download: 'Download PDF', original: 'Download original',
  undo: 'Undo', redo: 'Redo', saved: 'Changes downloaded', unsaved: 'Unsaved changes',
  discard: 'Discard unsaved changes?', page: 'Page {number}', pages: 'Pages',
  select: 'Select', text: 'Text', image: 'Image', highlight: 'Highlight', underline: 'Underline',
  draw: 'Draw', note: 'Note', rectangle: 'Rectangle', ellipse: 'Ellipse', line: 'Line', signature: 'Draw signature', signatureImage: 'Signature image',
  tools: 'Tools', content: 'Text content', apply: 'Apply', insert: 'Insert', fontSize: 'Font size',
  color: 'Colour', stroke: 'Line width', x: 'X position', y: 'Y position', width: 'Width', height: 'Height',
  placement: 'Position from the bottom left of the page in PDF points. You can also place or draw directly on the page.',
  selectHint: 'Select a text or image object on the page.', textHint: 'Supported text objects are replaced in the PDF. Paragraphs do not wrap automatically.',
  unsupportedText: 'This text object cannot be replaced reliably here. You can add new text in an empty area.',
  scan: 'No editable text was found on this page. Text recognition for scans is not included.',
  fontHint: 'Latin characters including accents. Standard and complete embedded fonts are supported; subsets and rotated text objects may be excluded.',
  signatureHint: 'A visible signature as an image or drawing, without a cryptographic signature.',
  selectedObject: '{type} {number}', objectText: 'Text object', objectImage: 'Image object', removeObject: 'Delete object',
  moveLeft: 'Move left', moveRight: 'Move right', moveUp: 'Move up', moveDown: 'Move down', grow: 'Make larger', shrink: 'Make smaller',
  rotate: 'Rotate page', duplicate: 'Duplicate page', deletePage: 'Delete page', previous: 'Move page earlier', next: 'Move page later',
  blank: 'Blank page', merge: 'Append another PDF', extract: 'Download page', zoom: 'Zoom',
  search: 'Search text', searchAction: 'Search', noResults: 'No text found.', matches: '{count} matches',
  preview: 'PDF page preview', document: 'PDF document', close: 'Close document', addHint: 'Choose a tool. Click to place text and notes; drag to create shapes and drawings.',
  errors: { unsupported_structure: 'Existing form structures cannot be preserved reliably for this operation. The PDF was not changed.', invalid_file: 'The PDF could not be processed. Choose a valid, unencrypted file.', resource_limit: 'The file or operation exceeds the local limit. Use a smaller file or lower zoom.', unsupported_text: 'This font, character or text orientation is unsupported. The change was discarded.', last_page: 'The last page cannot be deleted.', cancelled: 'Processing cancelled.', unsupported_browser: 'This browser does not support the PDF workspace.' },
}
