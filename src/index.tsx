import { ComponentProps, createEffect, For, Show } from 'solid-js'
import { ContentEditable } from '@bigmistqke/solid-contenteditable'

export type TriggerConfig = {
  /**
   * The character(s) that trigger mention suggestions
   * (e.g. '@', '#', or ':')
   */
  trigger: string
  name?: string
  // TODO: add more properties
}

export type MentionsInputProps = {
  value: string
  onChange: (value: string) => void
  triggers: Array<TriggerConfig>
  autoFocus?: boolean
  disabled?: boolean
  multiline?: boolean
} & Pick<ComponentProps<'div'>, 'class'>

export function MentionsInput(props: MentionsInputProps) {
  let editorRef: HTMLDivElement | undefined

  createEffect(() => {
    if (props.autoFocus && editorRef) {
      editorRef.focus()
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editorRef)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  })

  return (
    <ContentEditable
      ref={editorRef}
      textContent={props.value}
      onTextContent={value => {
        props.onChange(value)
        // eslint-disable-next-line no-console
        console.log('triggered change', { value })
      }}
      class={props.class}
      role="textbox"
      aria-multiline={props.multiline}
      // spellCheck="true"
      // autoCorrect="off"
      aria-haspopup="listbox"
      aria-invalid="false"
      aria-autocomplete="list"
      // aria-label={"ariaLabel" || placeholder}
      contentEditable={!props.disabled}
      singleline={!props.multiline}
      onClick={event => {
        if (!event.target.matches('span[role="button"]')) {
          return
        }

        // eslint-disable-next-line no-console
        console.log('clicked mention', event.target)
        event.preventDefault()
      }}
      render={textContent => (
        <For each={textContent().split('\n')}>
          {(line, lineIndex) => {
            const isLastLine = () => textContent().split('\n').length - 1 === lineIndex()
            return (
              <>
                <For each={line.split(' ')}>
                  {(word, wordIndex) => {
                    const isLastWord = () => line.split(' ').length - 1 === wordIndex()
                    return (
                      <>
                        <Show
                          when={props.triggers.some(t => word.startsWith(t.trigger))}
                          fallback={word}
                        >
                          <span
                            role="button"
                            style={{
                              cursor: 'pointer',
                              'border-radius': '2px',
                              'background-color': 'blue',
                              color: 'white',
                            }}
                          >
                            {word}
                          </span>
                        </Show>
                        <Show when={!isLastWord()}> </Show>
                      </>
                    )
                  }}
                </For>
                <Show when={!isLastLine()}>{'\n'}</Show>
              </>
            )
          }}
        </For>
      )}
    />
  )
}
