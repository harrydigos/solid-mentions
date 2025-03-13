import { createSignal, type Component } from 'solid-js'
import styles from './App.module.css'
import { MentionsInput } from 'src'

const App: Component = () => {
  const [value, setValue] = createSignal('Hello @user and #team!')

  return (
    <div class={styles.content}>
      <MentionsInput
        value={value()}
        onChange={value => setValue(value)}
        triggers={[
          { trigger: '@', name: 'at-mention' },
          { trigger: '#', name: 'hash-mention' },
        ]}
        autoFocus
        class={styles.mentionsInput}
        multiline // ={false}
      />
    </div>
  )
}

export default App
