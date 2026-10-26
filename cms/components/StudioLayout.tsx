import type {LayoutProps} from 'sanity'
import {createGlobalStyle} from 'styled-components'

const MediaActionStyles = createGlobalStyle`
  /* The media plugin has no selection-toolbar slot. Scope this override to its
     action row: a selection-count label followed by action buttons. */
  [data-testid='media-browser']
    [data-ui='Flex']:has(> [data-ui='Box'] > [data-ui='Label']):has(> button[data-ui='Button']) {
    [data-ui='Label'] {
      font-size: 0.6875rem;
      line-height: 1rem;
    }

    > button[data-ui='Button']:enabled:not([data-disabled='true']):not([aria-disabled='true']) {
      cursor: pointer;
    }
  }
`

export function StudioLayout(props: LayoutProps) {
  return (
    <>
      <MediaActionStyles />
      {props.renderDefault(props)}
    </>
  )
}
