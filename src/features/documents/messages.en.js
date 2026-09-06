export default {
  layoutHint: 'Content, lists and tables are preserved. Page layout and formatting may change.',
  limits: 'DOCX up to 20 MiB · Markdown and HTML up to 2 MiB',
  errors: {
    invalid_document: 'The document is damaged or does not match its file type.',
    document_too_large: 'The document exceeds the local processing limit.',
    document_timeout: 'Processing took too long. Try a smaller document.',
    unsafe_document: 'The document contains an unsupported or unsafe structure.',
    document_runtime_unavailable: 'The document module is unavailable. Connect once to load it, then retry.',
  },
  warnings: {
    external_resources_omitted: 'Externally linked or missing images were omitted.',
    unsupported_images_omitted: 'Unsupported images were omitted. PNG, JPEG and WebP are supported.',
    layout_changed: 'Page layout and formatting may differ from the original.',
  },
}
