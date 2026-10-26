import {Stack, Text} from '@sanity/ui'
import {useToast} from '@sanity/ui/toast'
import {createContext, useCallback, useContext, useEffect, useState} from 'react'
import {
  isObjectInputProps,
  PatchEvent,
  useClient,
  type InputProps,
  type ObjectInputProps,
} from 'sanity'
import {
  assignImageToMediaFolder,
  getDocumentMediaFolder,
  getSelectedImageAssetId,
  MEDIA_API_VERSION,
} from '../lib/mediaFolders'

const MediaFolderContext = createContext<string | undefined>(undefined)

function FolderImageInput(props: ObjectInputProps) {
  const folderPath = useContext(MediaFolderContext)
  const client = useClient({apiVersion: MEDIA_API_VERSION})
  const toast = useToast()
  const [pendingAssetId, setPendingAssetId] = useState<string>()
  const {onChange, readOnly} = props

  const handleChange = useCallback<ObjectInputProps['onChange']>(
    (change) => {
      onChange(change)
      const assetId = getSelectedImageAssetId(PatchEvent.from(change).patches)
      if (assetId) setPendingAssetId(assetId)
    },
    [onChange],
  )

  useEffect(() => {
    if (!folderPath || !pendingAssetId || readOnly) return
    let active = true

    assignImageToMediaFolder(client, pendingAssetId, folderPath)
      .catch((error: unknown) => {
        if (!active) return
        toast.push({
          status: 'error',
          title: 'Image saved, but its media folder could not be assigned',
          description: error instanceof Error ? error.message : 'Try selecting the image again.',
          closable: true,
        })
      })
      .finally(() => {
        if (active) setPendingAssetId(undefined)
      })

    return () => {
      active = false
    }
  }, [client, folderPath, pendingAssetId, readOnly, toast])

  return (
    <Stack gap={3}>
      {props.renderDefault({...props, onChange: handleChange})}
      {folderPath && (
        <Text size={1} muted>
          Media folder: {folderPath}. Shared images keep their existing folder.
        </Text>
      )}
    </Stack>
  )
}

export function MediaFolderInput(props: InputProps) {
  if (isObjectInputProps(props)) {
    if (props.id === 'root' && props.schemaType.type?.name === 'document') {
      return (
        <MediaFolderContext.Provider value={getDocumentMediaFolder(props.value)}>
          {props.renderDefault(props)}
        </MediaFolderContext.Provider>
      )
    }

    if (props.schemaType.name === 'image') return <FolderImageInput {...props} />
  }

  return props.renderDefault(props)
}
