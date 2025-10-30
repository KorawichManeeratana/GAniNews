'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

const FroalaEditorComponent = dynamic(
  () => import('react-froala-wysiwyg'),
  { ssr: false }
)

export default function Editors({ value, onChange }) {
  useEffect(() => {
    require('froala-editor/js/froala_editor.pkgd.min.js')
    require('froala-editor/js/plugins/paragraph_format.min.js')
    require('froala-editor/js/plugins/lists.min.js')
    require('froala-editor/js/plugins/link.min.js')
    require('froala-editor/js/plugins/colors.min.js')
    require('froala-editor/js/plugins/align.min.js')
    require('froala-editor/js/plugins/quote.min.js')
    require('froala-editor/js/plugins/line_height.min.js')
  }, [])

  return (
    <div className="relative">
      <style jsx global>{`
        /* 🔒 ซ่อนข้อความ Powered by Froala */
        a.froala-brand {
          display: none !important;
        }
        /* ปรับขนาด editor ให้ดูสวยขึ้น */
        .fr-wrapper {
          min-height: 250px !important;
        }
      `}</style>

      <FroalaEditorComponent
        tag="textarea"
        model={value}
        onModelChange={onChange}
        config={{
          placeholderText: 'Write something amazing...',
          charCounterCount: true,
          attribution: false,
          toolbarSticky: true,
          heightMin: 300,
          quickInsertEnabled: false,
          toolbarButtons: {
            moreText: {
              buttons: [
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                'subscript',
                'superscript',
                'fontSize',
                'textColor',
                'backgroundColor',
                'clearFormatting',
              ],
              align: 'left',
            },
            moreParagraph: {
              buttons: [
                'alignLeft',
                'alignCenter',
                'alignRight',
                'alignJustify',
                'formatOL',
                'formatUL',
                'paragraphFormat',
                'lineHeight',
                'quote',
              ],
              align: 'left',
            },
            moreRich: {
              buttons: ['insertLink', 'undo', 'redo', 'html'],
              align: 'left',
            },
          },
          paragraphFormat: {
            N: 'Normal',
            H1: 'Heading 1',
            H2: 'Heading 2',
            H3: 'Heading 3',
          },
          events: {
          },
        }}
      />
    </div>
  )
}