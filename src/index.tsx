import {
  Accessor,
  Component,
  createComputed,
  createSignal,
  createEffect,
  For,
  Show,
} from 'solid-js'
import { ContentEditable } from '@bigmistqke/solid-contenteditable'

export function createHello(): [Accessor<string>, (to: string) => void] {
  const [hello, setHello] = createSignal('Hello World!')

  return [hello, (to: string) => setHello(`Hello ${to}!`)]
}

export const Hello: Component<{ to?: string }> = props => {
  const [hello, setHello] = createHello()

  // Console calls will be removed in production if `dropConsole` is enabled

  // eslint-disable-next-line no-console
  console.log('Hello World!')

  createComputed(() => {
    if (typeof props.to === 'string') setHello(props.to)
  })

  return (
    <>
      <div>{hello()}</div>
    </>
  )
}

export function ContentEditableInput() {
  // const placeholder = 'Type something...';
  const autoFocus = false
  const triggers = ['@', '#']
  // const disabled = false;
  // const maxLength = 500;

  // const [isFocused, setIsFocused] = createSignal(false);
  const [mentionInputValue, setMentionInputValue] = createSignal('Hello @user and #team!')

  let editorRef: HTMLDivElement | undefined

  createEffect(() => {
    if (autoFocus && editorRef) {
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
      // contentEditable={!disabled}
      onClick={event => {
        if (!event.target.matches('span[role="button"]')) {
          return
        }

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
                        <Show when={triggers.some(t => word.startsWith(t))} fallback={word}>
                          <span role="button" class="cursor-pointer rounded-xs bg-sky-700">
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
