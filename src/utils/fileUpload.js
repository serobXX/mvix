import {
  BMP,
  CSV,
  DOC,
  DOCX,
  FALLBACK_EXTENSION,
  GIF,
  ICS,
  JPEG,
  JPG,
  JSON,
  MOV,
  MP3,
  MP4,
  OGG,
  PDF,
  PNG,
  PPT,
  PPTX,
  SVG,
  TEXT_XML,
  WAV,
  WEBM,
  XML
} from 'constants/mimeTypes'

export const getFileExtensionFromUrl = url => {
  if (url) {
    const urlParts = url.split('.')
    if (urlParts.length > 1) {
      return `.${urlParts[urlParts.length - 1].split('?')[0]}`.toLowerCase()
    }
  }
  return FALLBACK_EXTENSION
}

export const extensionToMimeMap = ext => {
  switch (ext) {
    case CSV.ext:
      return CSV.mime
    case JSON.ext:
      return JSON.mime
    case XML.ext:
      return XML.mime
    case TEXT_XML.ext:
      return TEXT_XML.mime
    case ICS.ext:
      return ICS.mime
    case BMP.ext:
      return BMP.mime
    case GIF.ext:
      return GIF.mime
    case JPEG.ext:
      return JPEG.mime
    case JPG.ext:
      return JPG.mime
    case MP3.ext:
      return MP3.mime
    case MP4.ext:
      return MP4.mime
    case OGG.ext:
      return OGG.mime
    case PDF.ext:
      return PDF.mime
    case PNG.ext:
      return PNG.mime
    case SVG.ext:
      return SVG.mime
    case WAV.ext:
      return WAV.mime
    case WEBM.ext:
      return WEBM.mime
    case PPTX.ext:
      return PPTX.mime
    case PPT.ext:
      return PPT.mime
    case MOV.ext:
      return MOV.mime
    default:
      return undefined
  }
}

export const validateFileExtension = (url, allowedDataMimeTypes) => {
  if (!url) {
    return true
  }

  const type = extensionToMimeMap(getFileExtensionFromUrl(url))
  if (type) {
    if (allowedDataMimeTypes.some(mime => type.includes(mime))) {
      return true
    } else {
      return false
    }
  } else return true
}

export const fileToColor = file => {
  const ext = getFileExtensionFromUrl(file)
  switch (ext) {
    case JPEG.ext:
    case JPG.ext:
    case PNG.ext:
    case GIF.ext:
    case BMP.ext:
    case SVG.ext:
      return '#1565C0'
    case MP4.ext:
    case MOV.ext:
    case WEBM.ext:
      return '#19af67'
    case PDF.ext:
    case DOC.ext:
    case DOCX.ext:
    case PPT.ext:
    case PPTX.ext:
    case XML.ext:
    case TEXT_XML.ext:
      return '#ff0000'
    default:
      return '#74809A'
  }
}
