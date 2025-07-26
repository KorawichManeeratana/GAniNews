'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'
const FroalaEditorComponent = dynamic(
  () => import('react-froala-wysiwyg'),
  { ssr: false }
)
export default function Editors() {
  useEffect(() => {
    require('froala-editor/js/froala_editor.pkgd.min.js')
  }, [])
  return (
    <FroalaEditorComponent
      tag="textarea"
      config={{
        placeholderText: 'Write something...',
        charCounterCount: true,
        toolbarButtons: ['bold', 'italic', 'underline', 'insertImage'],
      }}
    />
  )
}
