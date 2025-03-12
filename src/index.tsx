import { createSignal, createEffect, For, Show } from 'solid-js'
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
  triggers: Array<TriggerConfig>
  autoFocus?: boolean
  disabled?: boolean
}

export function MentionsInput(props: MentionsInputProps) {
  // const placeholder = 'Type something...';
  // const maxLength = 500;

  // const [isFocused, setIsFocused] = createSignal(false);
  const [mentionInputValue, setMentionInputValue] = createSignal('Hello @user and #team!')

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
      value={mentionInputValue()}
      onValue={value => {
        if (value !== mentionInputValue()) {
          setMentionInputValue(value)
        }
        // eslint-disable-next-line no-console
        console.log('triggered change', { value, myControlleValue: mentionInputValue() })
      }}
      // multiline={false}
      class="h-fit min-h-8 w-[400px] rounded-md border border-gray-500 bg-neutral-900 px-2 py-1 text-base text-white shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      role="textbox"
      aria-multiline="false"
      // spellCheck="true"
      // autoCorrect="off"
      aria-haspopup="listbox"
      aria-invalid="false"
      aria-autocomplete="list"
      // aria-label={"ariaLabel" || placeholder}
      contentEditable={!props.disabled}
      onClick={event => {
        if (!event.target.matches('span[role="button"]')) {
          return
        }

        // eslint-disable-next-line no-console
        console.log('clicked mention', event.target)
        event.preventDefault()
      }}
    >
      {/* <Show when={!isFocused() && (!editorRef || !editorRef?.textContent)}> */}
      {/*   <div aria-hidden="true">{placeholder}</div> */}
      {/* </Show> */}
      {value => (
        <For each={value.split('\n')}>
          {(line, lineIndex) => {
            const isLastLine = () => value.split('\n').length - 1 === lineIndex()
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
    </ContentEditable>
  )
}
