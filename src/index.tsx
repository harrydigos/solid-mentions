import { Accessor, ComponentProps, createEffect, For, JSX, Show } from 'solid-js'
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

function Split(props: {
  value: string
  delimiter: string
  children: (value: string, index: Accessor<number>) => JSX.Element
}) {
  return (
    <For each={props.value.split(props.delimiter)}>
      {(value, index) => {
        const isLast = () => index() === props.value.split(props.delimiter).length - 1
        return (
          <>
            {props.children(value, index)}
            <Show when={!isLast()}>{props.delimiter}</Show>
          </>
        )
      }}
    </For>
  )
}

function Mention(props: { word: string }) {
  return (
    <span
      role="button"
      style={{
        cursor: 'pointer',
        'border-radius': '2px',
        'background-color': 'blue',
        color: 'white',
      }}
    >
      {props.word}
    </span>
  )
}

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
        <Split value={textContent()} delimiter={'\n'}>
          {line => (
            <Split value={line} delimiter={' '}>
              {word => (
                <Show when={props.triggers.some(t => word.startsWith(t.trigger))} fallback={word}>
                  <Mention word={word} />
                </Show>
              )}
            </Split>
          )}
        </Split>
      )}
    />
  )
}
