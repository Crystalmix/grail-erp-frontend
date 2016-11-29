import 'pdfmake/build/pdfmake'
import 'pdfmake/build/vfs_fonts'

export default () => (
  {
    create(content) {
      if (content) { return pdfMake.createPdf(content) }
    },

    open(doc_instance) {
      if (doc_instance) { return doc_instance.open() }
    },

    download(doc_instance) {
      if (doc_instance) { return doc_instance.download() }
    },
  }
)
